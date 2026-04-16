"use client";

import {
  startTransition,
  type WheelEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { MedscapeCurrentAdBlock } from "@/components/medscape/ai-current/ad-block";
import { MedscapeCurrentTopRailActions } from "@/components/medscape/ai-current/current-top-rail-actions";
import { CurrentScrollDownIcon, CurrentSparkIcon } from "@/components/medscape/ai-current/current-icons";
import { MedscapeCurrentHeader } from "@/components/medscape/ai-current/global-header";
import { AiResponseAnswerActions } from "@/components/medscape/ai-response/answer-actions";
import {
  AiResponseAnswerContent,
  getLeadingKeyPointsLength,
  splitLeadingKeyPoints,
} from "@/components/medscape/ai-response/answer-content";
import { AiResponseAnswerSupportingContent } from "@/components/medscape/ai-response/answer-supporting-content";
import { AiResponseChatComposer } from "@/components/medscape/ai-response/chat-composer";
import {
  AiResponseKeyPoints,
  type AiResponseKeyPointsVariant,
} from "@/components/medscape/ai-response/key-points";
import { AiMobileTopRail } from "@/components/medscape/ai-response/mobile-top-rail";
import { AiPreparingAnswerNotice } from "@/components/medscape/ai-response/preparing-answer-notice";
import {
  type AiAnswerSupportingContent,
  buildMockAnswer,
  buildMockAnswerSupportingContent,
  defaultInitialQuestion,
} from "@/data/ai-response";
import { getCurrentProgressText } from "@/data/medscape-ai-current";

const PRE_STREAM_DELAY_MS = 5000;
const STREAM_TICK_MS = 18;
const STREAM_CHUNK_SIZE = 4;
const CHAT_BOTTOM_CONTENT_PADDING_PX = 112;
const SCROLL_DOWN_VISIBILITY_THRESHOLD_PX = 8;

type ChatTurnStatus = "preparing" | "streaming" | "complete";

type ChatTurn = {
  answer: string;
  fullAnswer: string;
  id: number;
  question: string;
  status: ChatTurnStatus;
  supportingContent: AiAnswerSupportingContent;
};

type MedscapeAiCurrentScreenAdPlacement =
  | "after-progress"
  | "above-question"
  | "after-keypoints";

type MedscapeAiCurrentScreenProps = {
  adPlacement?: MedscapeAiCurrentScreenAdPlacement;
  initialConversationMode?: "complete" | "stream";
  initialQuestion?: string;
  keyPointsDefaultExpanded?: boolean;
  keyPointsVariant?: AiResponseKeyPointsVariant;
  prototypeRoute?: string;
};

export function MedscapeAiCurrentScreen({
  adPlacement = "after-progress",
  initialConversationMode = "stream",
  initialQuestion = defaultInitialQuestion,
  keyPointsDefaultExpanded = true,
  keyPointsVariant = "default",
  prototypeRoute = "/medscape-ai-current",
}: MedscapeAiCurrentScreenProps) {
  const router = useRouter();
  const responseScrollRef = useRef<HTMLDivElement>(null);
  const turnArticleRefs = useRef(new Map<number, HTMLElement>());
  const composerInputRef = useRef<HTMLInputElement>(null);
  const responseDelayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const responseStreamIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeTurnIdRef = useRef<number | null>(null);
  const nextTurnIdRef = useRef(1);
  const startedInitialConversationRef = useRef<string | null>(null);

  const [composerDraft, setComposerDraft] = useState("");
  const [chatTurns, setChatTurns] = useState<ChatTurn[]>([]);
  const [bottomSpacerHeight, setBottomSpacerHeight] = useState(0);
  const [showScrollToBottomButton, setShowScrollToBottomButton] = useState(false);
  const isGenerationInProgress = chatTurns.some(
    (turn) => turn.status === "preparing" || turn.status === "streaming",
  );

  const navigate = useCallback(
    (href: string) => {
      startTransition(() => {
        router.push(href);
      });
    },
    [router],
  );

  const clearResponseTimers = useCallback(() => {
    if (responseDelayTimeoutRef.current) {
      clearTimeout(responseDelayTimeoutRef.current);
      responseDelayTimeoutRef.current = null;
    }

    if (responseStreamIntervalRef.current) {
      clearInterval(responseStreamIntervalRef.current);
      responseStreamIntervalRef.current = null;
    }
  }, []);

  const scrollResponseToBottom = useCallback((behavior: ScrollBehavior) => {
    const responseScroll = responseScrollRef.current;
    if (!responseScroll) return;

    responseScroll.scrollTo({
      behavior,
      top: responseScroll.scrollHeight,
    });
  }, []);

  const scrollTurnQuestionToTop = useCallback(
    (turnId: number, behavior: ScrollBehavior) => {
      const responseScroll = responseScrollRef.current;
      const turnArticle = turnArticleRefs.current.get(turnId);
      if (!responseScroll || !turnArticle) {
        scrollResponseToBottom(behavior);
        return;
      }

      const responseRect = responseScroll.getBoundingClientRect();
      const turnRect = turnArticle.getBoundingClientRect();
      const turnTop = turnRect.top - responseRect.top + responseScroll.scrollTop;

      responseScroll.scrollTo({
        behavior,
        top: Math.max(turnTop - 10, 0),
      });
    },
    [scrollResponseToBottom],
  );

  const reserveBottomSpaceForTurnTop = useCallback((turnId: number) => {
    const responseScroll = responseScrollRef.current;
    const turnArticle = turnArticleRefs.current.get(turnId);
    if (!responseScroll || !turnArticle) return 0;

    const responseRect = responseScroll.getBoundingClientRect();
    const turnRect = turnArticle.getBoundingClientRect();
    const turnTop = turnRect.top - responseRect.top + responseScroll.scrollTop;
    const targetTop = Math.max(turnTop - 10, 0);
    const maxScrollTop = Math.max(responseScroll.scrollHeight - responseScroll.clientHeight, 0);

    return Math.max(targetTop - maxScrollTop + 16, 0);
  }, []);

  const registerTurnArticle = (turnId: number, node: HTMLElement | null) => {
    if (node) {
      turnArticleRefs.current.set(turnId, node);
      return;
    }

    turnArticleRefs.current.delete(turnId);
  };

  const startStreamingTurn = useCallback(
    (question: string, options: { focusComposer?: boolean } = {}) => {
      const trimmedQuestion = question.trim();
      if (!trimmedQuestion) return;

      clearResponseTimers();
      setBottomSpacerHeight(0);

      const newTurnId = nextTurnIdRef.current;
      const answerText = buildMockAnswer(trimmedQuestion);
      nextTurnIdRef.current += 1;
      activeTurnIdRef.current = newTurnId;

      const nextTurn: ChatTurn = {
        answer: "",
        fullAnswer: answerText,
        id: newTurnId,
        question: trimmedQuestion,
        status: "preparing",
        supportingContent: buildMockAnswerSupportingContent(trimmedQuestion),
      };

      setChatTurns((currentTurns): ChatTurn[] => [
        ...currentTurns.map((turn): ChatTurn =>
          turn.status === "complete" ? turn : { ...turn, status: "complete" },
        ),
        nextTurn,
      ]);

      setComposerDraft("");

      if (options.focusComposer !== false) {
        composerInputRef.current?.focus();
      }

      requestAnimationFrame(() => {
        const neededBottomSpace = reserveBottomSpaceForTurnTop(newTurnId);
        if (neededBottomSpace > 0) {
          setBottomSpacerHeight((current) => Math.max(current, neededBottomSpace));
          requestAnimationFrame(() => {
            scrollTurnQuestionToTop(newTurnId, "auto");
          });
          return;
        }

        scrollTurnQuestionToTop(newTurnId, "auto");
      });

      responseDelayTimeoutRef.current = setTimeout(() => {
        if (activeTurnIdRef.current !== newTurnId) return;

        const initialAnswerLength = getLeadingKeyPointsLength(answerText);

        setChatTurns((currentTurns): ChatTurn[] =>
          currentTurns.map((turn): ChatTurn =>
            turn.id === newTurnId
              ? {
                  ...turn,
                  answer: answerText.slice(0, initialAnswerLength),
                  status: "streaming",
                }
              : turn,
          ),
        );

        let nextLength = initialAnswerLength;
        responseStreamIntervalRef.current = setInterval(() => {
          if (activeTurnIdRef.current !== newTurnId) {
            clearResponseTimers();
            return;
          }

          nextLength = Math.min(nextLength + STREAM_CHUNK_SIZE, answerText.length);
          const nextAnswer = answerText.slice(0, nextLength);

          setChatTurns((currentTurns): ChatTurn[] =>
            currentTurns.map((turn): ChatTurn =>
              turn.id === newTurnId ? { ...turn, answer: nextAnswer } : turn,
            ),
          );

          if (nextLength >= answerText.length) {
            if (responseStreamIntervalRef.current) {
              clearInterval(responseStreamIntervalRef.current);
              responseStreamIntervalRef.current = null;
            }

            setChatTurns((currentTurns): ChatTurn[] =>
              currentTurns.map((turn): ChatTurn =>
                turn.id === newTurnId ? { ...turn, status: "complete" } : turn,
              ),
            );
            setBottomSpacerHeight(0);
            activeTurnIdRef.current = null;
          }
        }, STREAM_TICK_MS);
      }, PRE_STREAM_DELAY_MS);
    },
    [clearResponseTimers, reserveBottomSpaceForTurnTop, scrollTurnQuestionToTop],
  );

  const showCompletedTurn = useCallback(
    (question: string) => {
      const trimmedQuestion = question.trim();
      if (!trimmedQuestion) return;

      clearResponseTimers();
      activeTurnIdRef.current = null;
      setBottomSpacerHeight(0);
      setComposerDraft("");

      const nextTurnId = nextTurnIdRef.current;
      nextTurnIdRef.current += 1;

      setChatTurns([
        {
          answer: buildMockAnswer(trimmedQuestion),
          fullAnswer: buildMockAnswer(trimmedQuestion),
          id: nextTurnId,
          question: trimmedQuestion,
          status: "complete",
          supportingContent: buildMockAnswerSupportingContent(trimmedQuestion),
        },
      ]);
    },
    [clearResponseTimers],
  );

  const submitQuestion = useCallback(
    (question: string, options?: { focusComposer?: boolean }) => {
      startStreamingTurn(question, options);
    },
    [startStreamingTurn],
  );

  useEffect(() => {
    return () => {
      clearResponseTimers();
    };
  }, [clearResponseTimers]);

  useEffect(() => {
    const responseScroll = responseScrollRef.current;
    if (!responseScroll) return;

    const syncScrollToBottomVisibility = () => {
      const rawHiddenBottom =
        responseScroll.scrollHeight - responseScroll.clientHeight - responseScroll.scrollTop;
      const effectiveHiddenBottom =
        rawHiddenBottom - CHAT_BOTTOM_CONTENT_PADDING_PX - bottomSpacerHeight;
      setShowScrollToBottomButton(
        effectiveHiddenBottom > SCROLL_DOWN_VISIBILITY_THRESHOLD_PX,
      );
    };

    syncScrollToBottomVisibility();
    responseScroll.addEventListener("scroll", syncScrollToBottomVisibility, { passive: true });

    const resizeObserver = new ResizeObserver(syncScrollToBottomVisibility);
    resizeObserver.observe(responseScroll);

    const scrollContent = responseScroll.firstElementChild;
    if (scrollContent instanceof HTMLElement) {
      resizeObserver.observe(scrollContent);
    }

    return () => {
      responseScroll.removeEventListener("scroll", syncScrollToBottomVisibility);
      resizeObserver.disconnect();
    };
  }, [bottomSpacerHeight]);

  useEffect(() => {
    const trimmedInitialQuestion = initialQuestion.trim();
    if (!trimmedInitialQuestion) return;

    const initialConversationKey = `${initialConversationMode}:${trimmedInitialQuestion}`;
    if (startedInitialConversationRef.current === initialConversationKey) return;

    const frameId = requestAnimationFrame(() => {
      if (startedInitialConversationRef.current === initialConversationKey) return;

      startedInitialConversationRef.current = initialConversationKey;

      if (initialConversationMode === "complete") {
        showCompletedTurn(trimmedInitialQuestion);
        return;
      }

      submitQuestion(trimmedInitialQuestion, { focusComposer: false });
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [initialConversationMode, initialQuestion, showCompletedTurn, submitQuestion]);

  const handleWheelCapture = (event: WheelEvent<HTMLElement>) => {
    if (event.ctrlKey) return;

    const responseScroll = responseScrollRef.current;
    if (!responseScroll) return;

    const target = event.target;
    if (target instanceof HTMLElement && responseScroll.contains(target)) {
      return;
    }

    if (event.deltaX === 0 && event.deltaY === 0) return;

    const deltaUnit =
      event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? responseScroll.clientHeight : 1;

    event.preventDefault();
    responseScroll.scrollBy({
      behavior: "auto",
      left: event.deltaX * deltaUnit,
      top: event.deltaY * deltaUnit,
    });
  };

  const handleStopGeneration = () => {
    const activeTurnId = activeTurnIdRef.current;
    if (activeTurnId === null) return;

    clearResponseTimers();
    activeTurnIdRef.current = null;
    setBottomSpacerHeight(0);
    setChatTurns((currentTurns) =>
      currentTurns.map((turn) =>
        turn.id === activeTurnId && turn.status !== "complete"
          ? { ...turn, status: "complete" }
          : turn,
      ),
    );
  };

  const handleSubmitQuestion = () => {
    if (!composerDraft.trim()) return;
    submitQuestion(composerDraft);
  };

  return (
    <main
      className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[#e8f0fb] text-[#161b1d]"
      onWheelCapture={handleWheelCapture}
    >
      <MedscapeCurrentHeader />

      <section className="relative min-h-0 flex-1 p-0 md:p-3">
        <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-white md:rounded-[12px]">
          <div className="absolute right-4 top-5 z-30 hidden md:left-8 md:right-auto md:top-4 md:block">
            <MedscapeCurrentTopRailActions
              onHistoryClick={() =>
                navigate(
                  `${prototypeRoute}/chat?q=${encodeURIComponent(defaultInitialQuestion)}&mode=complete`,
                )
              }
              onNewChatClick={() => navigate(prototypeRoute)}
            />
          </div>

          <AiMobileTopRail
            railClassName="bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.94)_48%,rgba(255,255,255,0)_100%)] px-5 pb-2 pt-2"
            contentClassName="relative flex min-h-[32px] items-center justify-between gap-3"
            left={
              <div className="flex items-center gap-2 text-[16px] leading-none font-bold text-[#252c31]">
                <CurrentSparkIcon className="h-4 w-4" />
                <span>Medscape AI</span>
              </div>
            }
            right={
              <MedscapeCurrentTopRailActions
                onHistoryClick={() =>
                  navigate(
                    `${prototypeRoute}/chat?q=${encodeURIComponent(defaultInitialQuestion)}&mode=complete`,
                  )
                }
                onNewChatClick={() => navigate(prototypeRoute)}
              />
            }
            rightClassName="relative z-10 ml-auto flex items-center gap-4"
          />

          <div ref={responseScrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div className="mx-auto w-full max-w-[980px] px-5 pb-[124px] pt-4 md:px-7 md:pb-[136px] md:pt-4">
              <div className="mb-5 hidden items-center justify-center gap-2 text-[15px] font-semibold text-[#2c353a] md:flex">
                <CurrentSparkIcon className="h-4 w-4" />
                <span>Medscape AI</span>
              </div>

              {chatTurns.map((turn) => (
                (() => {
                  const keyPoints = turn.answer ? splitLeadingKeyPoints(turn.answer).keyPoints : [];
                  const showAfterKeypointsAd =
                    adPlacement === "after-keypoints" && keyPoints.length > 0;

                  return (
                    <article
                      key={turn.id}
                      ref={(node) => registerTurnArticle(turn.id, node)}
                      className="mx-auto mb-10 max-w-[900px] last:mb-0"
                    >
                      {adPlacement === "above-question" ? (
                        <MedscapeCurrentAdBlock className="mb-5 md:mb-4" />
                      ) : null}

                      <h1 className="mb-7 text-[19px] leading-[1.25] font-extrabold tracking-[0] text-[#11181d] md:mb-5 md:mt-5 md:text-[24px] md:leading-[1.25]">
                        {turn.question}
                      </h1>

                      {turn.status === "preparing" ? (
                        <>
                          <AiPreparingAnswerNotice
                            className={`flex max-w-[520px] items-start gap-4 text-[16px] leading-[1.45] text-[#5f6972] md:items-center md:gap-3 md:text-[14px] ${
                              adPlacement === "above-question" ? "mb-6 md:mb-6" : "mb-6 md:mb-0"
                            }`}
                            iconClassName="h-[18px] w-[18px]"
                            text={getCurrentProgressText(turn.question)}
                            textClassName=""
                          />
                          {adPlacement === "after-progress" ? (
                            <MedscapeCurrentAdBlock className="mt-5 md:mt-4" />
                          ) : null}
                        </>
                      ) : null}

                      {turn.answer ? (
                        <AiResponseKeyPoints
                          className="mb-6"
                          defaultExpanded={keyPointsDefaultExpanded}
                          keyPoints={keyPoints}
                          variant={keyPointsVariant}
                        />
                      ) : null}

                      {showAfterKeypointsAd ? (
                        <MedscapeCurrentAdBlock className="mb-6" />
                      ) : null}

                      {turn.answer ? (
                        <AiResponseAnswerContent
                          answer={turn.answer}
                          fullAnswer={turn.fullAnswer}
                          references={turn.supportingContent.references}
                        />
                      ) : null}

                      {turn.status === "complete" && turn.answer ? (
                        <>
                          <AiResponseAnswerActions answer={turn.answer} />
                          <AiResponseAnswerSupportingContent
                            className="mt-5"
                            followUpQuestions={turn.supportingContent.followUpQuestions}
                            onFollowUpQuestionSelect={submitQuestion}
                            references={turn.supportingContent.references}
                          />
                        </>
                      ) : null}
                    </article>
                  );
                })()
              ))}

              {bottomSpacerHeight > 0 ? (
                <div aria-hidden="true" style={{ height: `${bottomSpacerHeight}px` }} />
              ) : null}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-[76px] z-10">
            <div className="mx-auto flex w-full max-w-[980px] justify-center px-5 md:px-7">
              <button
                type="button"
                aria-label="Scroll to latest"
                aria-hidden={!showScrollToBottomButton}
                tabIndex={showScrollToBottomButton ? 0 : -1}
                disabled={!showScrollToBottomButton}
                onClick={() => scrollResponseToBottom("smooth")}
                className={`inline-flex h-8 w-8 items-center justify-center transition-all duration-200 ease-out ${
                  showScrollToBottomButton
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-1 opacity-0"
                }`}
              >
                <CurrentScrollDownIcon />
              </button>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
            <div className="mx-auto w-full max-w-[980px] px-4 pb-0 md:px-6">
              <div className="rounded-t-[28px] bg-gradient-to-b from-transparent via-white/82 to-white px-2 pb-[max(env(safe-area-inset-bottom),6px)] pt-3 md:pt-4">
                <AiResponseChatComposer
                  formClassName="pointer-events-auto flex min-h-[48px] items-center gap-2 rounded-[999px] border border-[rgba(109,153,206,0.45)] bg-white px-4 py-1 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_22px_rgba(16,24,40,0.06)]"
                  iconClassName="h-8 w-8"
                  inputClassName="h-8 flex-1 border-0 bg-transparent text-[16px] leading-[20px] text-[#1b2b3a] outline-none placeholder:text-[#93a2ae]"
                  inputRef={composerInputRef}
                  isGenerating={isGenerationInProgress}
                  onStopGeneration={handleStopGeneration}
                  onSubmit={handleSubmitQuestion}
                  onValueChange={setComposerDraft}
                  submitButtonClassName="inline-flex h-8 w-8 shrink-0 items-center justify-center"
                  value={composerDraft}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
