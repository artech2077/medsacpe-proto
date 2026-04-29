/* eslint-disable @next/next/no-img-element */
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
import { AiResponseAnswerActions } from "@/components/medscape/ai-response/answer-actions";
import {
  AiResponseAnswerContent,
  getLeadingKeyPointsLength,
  splitLeadingKeyPoints,
} from "@/components/medscape/ai-response/answer-content";
import { AiResponseAnswerSupportingContent } from "@/components/medscape/ai-response/answer-supporting-content";
import { AiResponseChatComposer } from "@/components/medscape/ai-response/chat-composer";
import { AiMenuIcon } from "@/components/medscape/ai-response/iconography";
import { AiResponseKeyPoints } from "@/components/medscape/ai-response/key-points";
import { AiMobileTopRail } from "@/components/medscape/ai-response/mobile-top-rail";
import { AiPreparingAnswerNotice } from "@/components/medscape/ai-response/preparing-answer-notice";
import { AiResponseSidebar } from "@/components/medscape/ai-response/sidebar";
import { AiTopRailAction } from "@/components/medscape/ai-response/top-rail-action";
import { MedscapeCurrentAdBlock } from "@/components/medscape/ai-current/ad-block";
import {
  type AiAnswerSupportingContent,
  aiResponseAssets,
  buildMockAnswer,
  buildMockAnswerSupportingContent,
  defaultInitialQuestion,
} from "@/data/ai-response";
import { createAnalyticsId } from "@/lib/analytics/events";
import {
  captureAnalyticsEvent,
  getPostHogSessionId,
} from "@/lib/analytics/posthog";

const PRE_STREAM_DELAY_MS = 1200;
const STREAM_TICK_MS = 18;
const STREAM_CHUNK_SIZE = 4;
const CHAT_BOTTOM_CONTENT_PADDING_PX = 116;
const SCROLL_DOWN_VISIBILITY_THRESHOLD_PX = 8;
const AI_RESPONSE_PROTOTYPE_ANALYTICS = {
  prototype_family: "ai-response",
  prototype_route: "/ai-response",
  prototype_slug: "ai-response",
  screen_type: "prototype_chat",
} as const;

type ChatTurnStatus = "preparing" | "streaming" | "complete";

type ChatTurn = {
  answer: string;
  fullAnswer: string;
  id: number;
  question: string;
  status: ChatTurnStatus;
  supportingContent: AiAnswerSupportingContent;
};

type AiResponseScreenProps = {
  initialConversationMode?: "complete" | "stream";
  initialQuestion?: string;
  initialQuestionSource?: string;
};

export function AiResponseScreen({
  initialConversationMode = "stream",
  initialQuestion = defaultInitialQuestion,
  initialQuestionSource = "direct_url",
}: AiResponseScreenProps) {
  const router = useRouter();
  const responseScrollRef = useRef<HTMLDivElement>(null);
  const turnArticleRefs = useRef(new Map<number, HTMLElement>());
  const composerInputRef = useRef<HTMLInputElement>(null);
  const responseDelayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const responseStreamIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeTurnIdRef = useRef<number | null>(null);
  const generationStartedAtRef = useRef(new Map<number, number>());
  const nextTurnIdRef = useRef(1);
  const startedInitialConversationRef = useRef<string | null>(null);

  const [conversationId] = useState(() => createAnalyticsId("conversation"));
  const [composerDraft, setComposerDraft] = useState("");
  const [chatTurns, setChatTurns] = useState<ChatTurn[]>([]);
  const [bottomSpacerHeight, setBottomSpacerHeight] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showScrollToBottomButton, setShowScrollToBottomButton] = useState(false);
  const isGenerationInProgress = chatTurns.some(
    (turn) => turn.status === "preparing" || turn.status === "streaming",
  );
  const prototypeAnalytics = AI_RESPONSE_PROTOTYPE_ANALYTICS;

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
        top: Math.max(turnTop - 12, 0),
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
    const targetTop = Math.max(turnTop - 12, 0);
    const maxScrollTop = Math.max(responseScroll.scrollHeight - responseScroll.clientHeight, 0);

    return Math.max(targetTop - maxScrollTop + 16, 0);
  }, []);

  const registerTurnArticle = useCallback((turnId: number, node: HTMLElement | null) => {
    if (node) {
      turnArticleRefs.current.set(turnId, node);
      return;
    }

    turnArticleRefs.current.delete(turnId);
  }, []);

  const startStreamingTurn = useCallback(
    (
      question: string,
      options: { focusComposer?: boolean; questionSource?: string } = {},
    ) => {
      const trimmedQuestion = question.trim();
      if (!trimmedQuestion) return;

      clearResponseTimers();
      setBottomSpacerHeight(0);

      const newTurnId = nextTurnIdRef.current;
      const answerText = buildMockAnswer(trimmedQuestion);
      const supportingContent = buildMockAnswerSupportingContent(trimmedQuestion);
      const startedAt = performance.now();
      nextTurnIdRef.current += 1;
      activeTurnIdRef.current = newTurnId;
      generationStartedAtRef.current.set(newTurnId, startedAt);

      const nextTurn: ChatTurn = {
        answer: "",
        fullAnswer: answerText,
        id: newTurnId,
        question: trimmedQuestion,
        status: "preparing",
        supportingContent,
      };

      const questionSource = options.questionSource ?? "composer";

      captureAnalyticsEvent("question_submitted", {
        ...prototypeAnalytics,
        conversation_id: conversationId,
        entry_surface: questionSource,
        question_length: trimmedQuestion.length,
        question_source: questionSource,
        question_text: trimmedQuestion,
        session_id: getPostHogSessionId(),
        turn_id: newTurnId,
      });

      captureAnalyticsEvent("generation_started", {
        ...prototypeAnalytics,
        conversation_id: conversationId,
        generation_mode: "stream",
        mock_generation: true,
        question_text: trimmedQuestion,
        session_id: getPostHogSessionId(),
        turn_id: newTurnId,
      });

      captureAnalyticsEvent("generation_preparing_viewed", {
        ...prototypeAnalytics,
        ad_placement: "after-progress",
        conversation_id: conversationId,
        progress_text: "Preparing answer",
        turn_id: newTurnId,
      });

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
        const leadingKeyPointsCount = splitLeadingKeyPoints(answerText).keyPoints.length;

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

        captureAnalyticsEvent("generation_first_content", {
          ...prototypeAnalytics,
          conversation_id: conversationId,
          leading_key_points_count: leadingKeyPointsCount,
          time_to_first_content_ms: Math.round(performance.now() - startedAt),
          turn_id: newTurnId,
        });

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
            captureAnalyticsEvent("generation_completed", {
              ...prototypeAnalytics,
              answer_length: answerText.length,
              conversation_id: conversationId,
              follow_up_count: supportingContent.followUpQuestions.length,
              reference_count: supportingContent.references.length,
              time_to_complete_ms: Math.round(performance.now() - startedAt),
              turn_id: newTurnId,
            });
            generationStartedAtRef.current.delete(newTurnId);
            setBottomSpacerHeight(0);
            activeTurnIdRef.current = null;
          }
        }, STREAM_TICK_MS);
      }, PRE_STREAM_DELAY_MS);
    },
    [
      clearResponseTimers,
      conversationId,
      prototypeAnalytics,
      reserveBottomSpaceForTurnTop,
      scrollTurnQuestionToTop,
    ],
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

      requestAnimationFrame(() => {
        scrollTurnQuestionToTop(nextTurnId, "auto");
      });
    },
    [clearResponseTimers, scrollTurnQuestionToTop],
  );

  const submitQuestion = useCallback(
    (
      question: string,
      options?: { focusComposer?: boolean; questionSource?: string },
    ) => {
      setIsSidebarOpen(false);
      startStreamingTurn(question, options);
    },
    [startStreamingTurn],
  );

  useEffect(() => {
    captureAnalyticsEvent("prototype_viewed", {
      ...prototypeAnalytics,
      initial_mode: initialConversationMode,
    });
  }, [initialConversationMode, prototypeAnalytics]);

  useEffect(() => {
    return () => {
      clearResponseTimers();
    };
  }, [clearResponseTimers]);

  useEffect(() => {
    if (!isSidebarOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isSidebarOpen]);

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
    if (!showScrollToBottomButton) return;

    captureAnalyticsEvent("scroll_to_latest_shown", {
      ...prototypeAnalytics,
      conversation_id: conversationId,
    });
  }, [conversationId, prototypeAnalytics, showScrollToBottomButton]);

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

      submitQuestion(trimmedInitialQuestion, {
        focusComposer: false,
        questionSource: initialQuestionSource,
      });
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [
    initialConversationMode,
    initialQuestion,
    initialQuestionSource,
    showCompletedTurn,
    submitQuestion,
  ]);

  const handleWheelCapture = (event: WheelEvent<HTMLElement>) => {
    if (event.ctrlKey) return;

    const responseScroll = responseScrollRef.current;
    if (!responseScroll) return;

    const target = event.target;
    if (
      target instanceof HTMLElement &&
      (responseScroll.contains(target) || target.closest('[data-ai-response-sidebar="true"]'))
    ) {
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
    const activeTurn = chatTurns.find((turn) => turn.id === activeTurnId);
    const startedAt = generationStartedAtRef.current.get(activeTurnId);
    captureAnalyticsEvent("generation_stopped", {
      ...prototypeAnalytics,
      answer_length_at_stop: activeTurn?.answer.length ?? 0,
      conversation_id: conversationId,
      elapsed_ms: startedAt ? Math.round(performance.now() - startedAt) : undefined,
      had_key_points: Boolean(
        activeTurn?.answer && splitLeadingKeyPoints(activeTurn.answer).keyPoints.length > 0,
      ),
      turn_id: activeTurnId,
    });
    generationStartedAtRef.current.delete(activeTurnId);
    setChatTurns((currentTurns) =>
      currentTurns.map((turn) =>
        turn.id === activeTurnId && turn.status !== "complete"
          ? { ...turn, status: "complete" }
          : turn,
      ),
    );
  };

  const handleScrollToBottomClick = () => {
    captureAnalyticsEvent("scroll_to_latest_clicked", {
      ...prototypeAnalytics,
      conversation_id: conversationId,
    });
    scrollResponseToBottom("smooth");
  };

  const handleLandingClick = () => {
    setIsSidebarOpen(false);
    captureAnalyticsEvent("new_chat_clicked", {
      ...prototypeAnalytics,
      conversation_id: conversationId,
    });
    navigate("/ai-response");
  };

  const handleHomeClick = () => {
    setIsSidebarOpen(false);
    captureAnalyticsEvent("home_clicked", {
      ...prototypeAnalytics,
      conversation_id: conversationId,
    });
    navigate("/");
  };

  const handleHistoryConversationClick = (question: string) => {
    setIsSidebarOpen(false);
    captureAnalyticsEvent("history_conversation_clicked", {
      ...prototypeAnalytics,
      conversation_id: conversationId,
      question_text: question,
    });
    navigate(
      `/ai-response/chat?q=${encodeURIComponent(question)}&mode=complete&source=${encodeURIComponent(
        "history",
      )}`,
    );
  };

  const handleSubmitQuestion = () => {
    if (!composerDraft.trim()) return;
    submitQuestion(composerDraft);
  };

  return (
    <main
      className="relative flex h-dvh min-h-0 overflow-hidden bg-[#dce8fb] text-[var(--mscp-color-text-primary)]"
      onWheelCapture={handleWheelCapture}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#d7e6fd_0%,#e9f2ff_34%,#d5e5ff_100%)]" />
        <div className="absolute inset-x-0 top-0 h-[220px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0)_72%)]" />
        <div className="absolute -left-20 top-24 h-64 w-64 rounded-full bg-[rgba(114,166,255,0.14)] blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[rgba(6,74,167,0.10)] blur-3xl" />
      </div>

      <section className="relative flex min-h-0 flex-1 p-2 md:p-3">
        <div className="relative flex min-h-0 flex-1 overflow-hidden rounded-[22px] border border-[rgba(109,153,206,0.42)] bg-white shadow-[0_18px_44px_rgba(6,74,167,0.12)]">
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => {
              setIsSidebarOpen(false);
              captureAnalyticsEvent("sidebar_closed", {
                ...prototypeAnalytics,
                conversation_id: conversationId,
              });
            }}
            className={`absolute inset-0 z-30 bg-[rgba(217,230,249,0.66)] transition md:hidden ${
              isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          />

          <div
            className={`hidden shrink-0 transition-[width] duration-300 ease-out md:block ${
              isSidebarOpen ? "w-[272px]" : "w-0"
            }`}
          />

          <AiResponseSidebar
            isOpen={isSidebarOpen}
            onClose={() => {
              setIsSidebarOpen(false);
              captureAnalyticsEvent("sidebar_closed", {
                ...prototypeAnalytics,
                conversation_id: conversationId,
              });
            }}
            onHistoryConversationClick={handleHistoryConversationClick}
            onHomeClick={handleHomeClick}
            onNewChatClick={handleLandingClick}
          />

          <section className="relative flex min-h-0 flex-1 flex-col">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[72px] bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_68%,rgba(255,255,255,0)_100%)]"
            />

            <div className="relative z-20 flex min-h-0 flex-1 flex-col">
              <div className="sticky top-0 z-30">
                <AiMobileTopRail
                  railClassName="bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_72%,rgba(255,255,255,0)_100%)] px-3 pb-3 pt-2"
                  contentClassName="relative flex min-h-[48px] items-start justify-between gap-2"
                  left={
                    <button
                      type="button"
                      aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
                      aria-expanded={isSidebarOpen}
                      onClick={() => {
                        setIsSidebarOpen((current) => {
                          const nextOpen = !current;
                          captureAnalyticsEvent(
                            nextOpen ? "sidebar_opened" : "sidebar_closed",
                            {
                              ...prototypeAnalytics,
                              conversation_id: conversationId,
                            },
                          );
                          return nextOpen;
                        });
                      }}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#687680] transition hover:bg-white/70"
                    >
                      <AiMenuIcon />
                    </button>
                  }
                  center={
                    <button
                      type="button"
                      onClick={handleLandingClick}
                      className="rounded-full px-3 py-1.5 transition"
                      aria-label="Go to new chat"
                    >
                      <img
                        src={aiResponseAssets.logoAssets.medscapeAi}
                        alt="Medscape AI"
                        className="h-[22px] w-auto object-contain"
                      />
                    </button>
                  }
                  right={
                    <>
                      <AiTopRailAction iconSrc={aiResponseAssets.uiIcons.share} label="Share" />
                      <AiTopRailAction
                        iconSrc={aiResponseAssets.uiIcons.download}
                        label="Download"
                      />
                    </>
                  }
                  rightClassName="relative z-10 ml-auto flex items-center gap-0.5"
                />

                <div className="hidden md:block">
                  <div className="absolute inset-x-0 top-0 h-[68px] bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_72%,rgba(255,255,255,0)_100%)]" />
                  <div className="relative flex min-h-[52px] items-start justify-between gap-2 px-5 pt-2">
                    <button
                      type="button"
                      aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
                      aria-expanded={isSidebarOpen}
                      onClick={() => {
                        setIsSidebarOpen((current) => {
                          const nextOpen = !current;
                          captureAnalyticsEvent(
                            nextOpen ? "sidebar_opened" : "sidebar_closed",
                            {
                              ...prototypeAnalytics,
                              conversation_id: conversationId,
                            },
                          );
                          return nextOpen;
                        });
                      }}
                      className="relative z-10 inline-flex h-9 w-9 items-center justify-center rounded-full text-[#687680] transition hover:bg-white/70"
                    >
                      <AiMenuIcon />
                    </button>

                    <button
                      type="button"
                      onClick={handleLandingClick}
                      className="absolute left-1/2 top-1.5 -translate-x-1/2 rounded-full px-3 py-1.5 transition"
                      aria-label="Go to new chat"
                    >
                      <img
                        src={aiResponseAssets.logoAssets.medscapeAi}
                        alt="Medscape AI"
                        className="h-[24px] w-auto object-contain"
                      />
                    </button>

                    <div className="relative z-10 ml-auto flex items-center gap-1">
                      <AiTopRailAction iconSrc={aiResponseAssets.uiIcons.share} label="Share" />
                      <AiTopRailAction
                        iconSrc={aiResponseAssets.uiIcons.download}
                        label="Download"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div ref={responseScrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                <div className="mx-auto w-full max-w-[980px] px-5 pb-[124px] pt-3 md:px-7 md:pb-[136px] md:pt-6">
                  {chatTurns.map((turn) => (
                    <article
                      key={turn.id}
                      ref={(node) => registerTurnArticle(turn.id, node)}
                      className="mx-auto mb-10 max-w-[900px] last:mb-0"
                    >
                      <h1 className="mb-6 text-[24px] leading-[1.24] font-extrabold tracking-[-0.02em] text-[#22282d] md:text-[30px]">
                        {turn.question}
                      </h1>

                      {turn.status === "preparing" ? (
                        <>
                          <AiPreparingAnswerNotice question={turn.question} />
                          <MedscapeCurrentAdBlock
                            adPlacement="after-progress"
                            adSlot="preparing"
                            className="mt-5 md:mt-4"
                            conversationId={conversationId}
                            prototypeFamily="ai-response"
                            prototypeRoute="/ai-response"
                            prototypeSlug="ai-response"
                            screenType="prototype_chat"
                            turnId={turn.id}
                          />
                        </>
                      ) : null}

                      {turn.answer ? (
                        <AiResponseKeyPoints
                          analyticsContext={{
                            conversationId,
                            prototypeFamily: "ai-response",
                            prototypeRoute: "/ai-response",
                            prototypeSlug: "ai-response",
                            question: turn.question,
                            screenType: "prototype_chat",
                            turnId: turn.id,
                          }}
                          className="mb-6"
                          keyPoints={splitLeadingKeyPoints(turn.answer).keyPoints}
                        />
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
                          <AiResponseAnswerActions
                            analyticsContext={{
                              conversationId,
                              prototypeFamily: "ai-response",
                              prototypeRoute: "/ai-response",
                              prototypeSlug: "ai-response",
                              question: turn.question,
                              screenType: "prototype_chat",
                              turnId: turn.id,
                            }}
                            answer={turn.answer}
                            copyText={turn.fullAnswer}
                          />
                          <AiResponseAnswerSupportingContent
                            adPlacement="answer-footer"
                            analyticsContext={{
                              conversationId,
                              prototypeFamily: "ai-response",
                              prototypeRoute: "/ai-response",
                              prototypeSlug: "ai-response",
                              screenType: "prototype_chat",
                              turnId: turn.id,
                            }}
                            className="mt-5"
                            followUpQuestions={turn.supportingContent.followUpQuestions}
                            onFollowUpQuestionSelect={(question) => {
                              captureAnalyticsEvent("follow_up_question_clicked", {
                                ...prototypeAnalytics,
                                conversation_id: conversationId,
                                follow_up_index: turn.supportingContent.followUpQuestions.indexOf(question),
                                follow_up_text: question,
                                parent_turn_id: turn.id,
                              });
                              submitQuestion(question, {
                                questionSource: "follow_up_question",
                              });
                            }}
                            references={turn.supportingContent.references}
                          />
                        </>
                      ) : null}
                    </article>
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
                    onClick={handleScrollToBottomClick}
                    className={`inline-flex h-8 w-8 items-center justify-center transition-all duration-200 ease-out ${
                      showScrollToBottomButton
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none translate-y-1 opacity-0"
                    }`}
                  >
                    <img
                      src={aiResponseAssets.composerIcons.scrollDown}
                      alt=""
                      aria-hidden="true"
                      className="h-8 w-8 object-contain"
                    />
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
                      analyticsSourceSurface="ai_response_chat"
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
        </div>
      </section>
    </main>
  );
}
