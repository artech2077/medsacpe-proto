"use client";

import {
  startTransition,
  type WheelEvent,
  useCallback,
  useEffect,
  useMemo,
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
  buildAnswerBlocks,
  getLeadingKeyPointsLength,
  renderInlineText,
  splitLeadingKeyPoints,
} from "@/components/medscape/ai-response/answer-content";
import { AiResponseAnswerSupportingContent } from "@/components/medscape/ai-response/answer-supporting-content";
import { AiChevronIcon } from "@/components/medscape/ai-response/answer-section-icons";
import { AiResponseChatComposer } from "@/components/medscape/ai-response/chat-composer";
import {
  AiResponseFollowUpQuestions,
  type AiResponseFollowUpQuestionsVariant,
} from "@/components/medscape/ai-response/follow-up-questions";
import {
  AiResponseKeyPoints,
  type AiResponseKeyPointsVariant,
} from "@/components/medscape/ai-response/key-points";
import { AiMobileTopRail } from "@/components/medscape/ai-response/mobile-top-rail";
import { AiPreparingAnswerNotice } from "@/components/medscape/ai-response/preparing-answer-notice";
import {
  type AiAnswerSupportingContent,
  type AiAnswerReference,
  buildMockAnswer,
  buildMockAnswerSupportingContent,
  defaultInitialQuestion,
} from "@/data/ai-response";
import { getCurrentProgressText } from "@/data/medscape-ai-current";
import { createAnalyticsId } from "@/lib/analytics/events";
import {
  captureAnalyticsEvent,
  getPostHogSessionId,
} from "@/lib/analytics/posthog";

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

type MedscapeAiCurrentAnswerVariant = "default" | "summary-read-more";
type MedscapeAiCurrentFollowUpPlacement = "supporting-content" | "before-actions";

type MedscapeAiCurrentScreenProps = {
  adContentDelayMs?: number;
  adPlacement?: MedscapeAiCurrentScreenAdPlacement;
  answerVariant?: MedscapeAiCurrentAnswerVariant;
  composerPlaceholder?: string;
  followUpQuestionsPlacement?: MedscapeAiCurrentFollowUpPlacement;
  followUpQuestionsVariant?: AiResponseFollowUpQuestionsVariant;
  hideAnswerFooterAdForFirstTurn?: boolean;
  initialConversationMode?: "complete" | "stream";
  initialQuestion?: string;
  initialQuestionSource?: string;
  instantAnswerDelayMs?: number;
  instantAnswers?: boolean;
  keyPointsDefaultExpanded?: boolean;
  keyPointsVariant?: AiResponseKeyPointsVariant;
  prototypeRoute?: string;
  showHistoryAction?: boolean;
};

type MedscapeAiCurrentAnswerSummaryProps = {
  analyticsContext: {
    conversationId?: string;
    prototypeFamily?: string;
    prototypeRoute?: string;
    prototypeSlug?: string;
    question?: string;
    screenType?: string;
    turnId?: number;
  };
  answer: string;
  fullAnswer: string;
  isComplete: boolean;
  keyPoints: string[];
  references: AiAnswerReference[];
};

function buildAnswerSummary(answer: string) {
  const { body, keyPoints } = splitLeadingKeyPoints(answer);
  const blocks = buildAnswerBlocks(body);

  const summaryPieces = blocks.flatMap((block) => {
    if (block.type === "paragraph") {
      return [block.text];
    }

    if (block.type === "list") {
      return block.items.slice(0, 2);
    }

    return [];
  });

  if (summaryPieces.length > 0) {
    return summaryPieces.slice(0, 2).join(" ");
  }

  if (keyPoints.length > 0) {
    return keyPoints.slice(0, 3).join(" ");
  }

  return body.trim();
}

function MedscapeAiCurrentAnswerSummary({
  analyticsContext,
  answer,
  fullAnswer,
  isComplete,
  keyPoints,
  references,
}: MedscapeAiCurrentAnswerSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const summaryText = buildAnswerSummary(isComplete ? fullAnswer : answer);
  const hasExpandedContent = keyPoints.length > 0 || Boolean(fullAnswer.trim());

  if (!summaryText) {
    return null;
  }

  return (
    <section>
      <div>
        <div className="min-w-0">
          <p className="text-[18px] leading-[1.45] font-semibold text-[#11181d] md:max-w-[760px] md:text-[21px]">
            {renderInlineText(summaryText)}
            {isComplete && hasExpandedContent ? (
              <>
                {" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsExpanded((current) => {
                      const nextExpanded = !current;
                      captureAnalyticsEvent("summary_answer_toggled", {
                        conversation_id: analyticsContext.conversationId,
                        expanded: nextExpanded,
                        key_points_count: keyPoints.length,
                        prototype_family: analyticsContext.prototypeFamily,
                        prototype_route: analyticsContext.prototypeRoute,
                        prototype_slug: analyticsContext.prototypeSlug,
                        question_text: analyticsContext.question,
                        screen_type: analyticsContext.screenType,
                        turn_id: analyticsContext.turnId,
                      });
                      return nextExpanded;
                    });
                  }}
                  className="inline-flex items-center gap-1.5 align-baseline text-[16px] leading-none font-semibold text-[#064aa7] underline decoration-[#9db8dc] decoration-2 underline-offset-4 transition hover:text-[#043b84] hover:decoration-[#064aa7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.24)] focus-visible:ring-offset-2 focus-visible:ring-offset-white md:text-[18px]"
                >
                  <span>{isExpanded ? "Show less" : "Read more"}</span>
                  <AiChevronIcon
                    direction={isExpanded ? "up" : "down"}
                    className="h-4 w-4 shrink-0"
                  />
                </button>
              </>
            ) : null}
          </p>
          {!isComplete ? (
            <p className="mt-3 text-[13px] leading-[1.45] text-[#51616c]">
              Full answer is still generating below.
            </p>
          ) : null}
        </div>
      </div>

      {isExpanded && isComplete ? (
        <div className="mt-5 border-t border-[#d8e3ef] pt-5">
          {keyPoints.length > 0 ? (
            <AiResponseKeyPoints
              analyticsContext={analyticsContext}
              className="mb-6"
              defaultExpanded
              keyPoints={keyPoints}
            />
          ) : null}

          <AiResponseAnswerContent
            answer={fullAnswer}
            fullAnswer={fullAnswer}
            references={references}
          />
        </div>
      ) : null}
    </section>
  );
}

export function MedscapeAiCurrentScreen({
  adContentDelayMs = 0,
  adPlacement = "after-progress",
  answerVariant = "default",
  composerPlaceholder = "Ask anything",
  followUpQuestionsPlacement = "supporting-content",
  followUpQuestionsVariant = "default",
  hideAnswerFooterAdForFirstTurn = false,
  initialConversationMode = "stream",
  initialQuestion = defaultInitialQuestion,
  initialQuestionSource = "direct_url",
  instantAnswerDelayMs = 0,
  instantAnswers = false,
  keyPointsDefaultExpanded = true,
  keyPointsVariant = "default",
  prototypeRoute = "/medscape-ai-current",
  showHistoryAction = true,
}: MedscapeAiCurrentScreenProps) {
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
  const [expandedKeyPointTurnIds, setExpandedKeyPointTurnIds] = useState<Set<number>>(
    () => new Set(),
  );
  const [bottomSpacerHeight, setBottomSpacerHeight] = useState(0);
  const [showScrollToBottomButton, setShowScrollToBottomButton] = useState(false);
  const isGenerationInProgress = chatTurns.some(
    (turn) => turn.status === "preparing" || turn.status === "streaming",
  );
  const prototypeSlug = prototypeRoute.replace(/^\//, "");
  const prototypeAnalytics = useMemo(
    () =>
      ({
        ad_placement: adPlacement,
        answer_variant: answerVariant,
        key_points_default_expanded: keyPointsDefaultExpanded,
        key_points_variant: keyPointsVariant,
        prototype_family: "medscape-ai-current",
        prototype_route: prototypeRoute,
        prototype_slug: prototypeSlug,
        screen_type: "prototype_chat",
      }) as const,
    [
      adPlacement,
      answerVariant,
      keyPointsDefaultExpanded,
      keyPointsVariant,
      prototypeRoute,
      prototypeSlug,
    ],
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
        conversation_id: conversationId,
        progress_text: getCurrentProgressText(trimmedQuestion),
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
    (
      question: string,
      options: { focusComposer?: boolean; questionSource?: string } = {},
    ) => {
      const trimmedQuestion = question.trim();
      if (!trimmedQuestion) return;

      clearResponseTimers();
      activeTurnIdRef.current = null;
      setBottomSpacerHeight(0);
      setComposerDraft("");

      const nextTurnId = nextTurnIdRef.current;
      nextTurnIdRef.current += 1;

      const nextTurn: ChatTurn = {
        answer: buildMockAnswer(trimmedQuestion),
        fullAnswer: buildMockAnswer(trimmedQuestion),
        id: nextTurnId,
        question: trimmedQuestion,
        status: "complete",
        supportingContent: buildMockAnswerSupportingContent(trimmedQuestion),
      };

      captureAnalyticsEvent("question_submitted", {
        ...prototypeAnalytics,
        conversation_id: conversationId,
        entry_surface: options.questionSource ?? "composer",
        question_length: trimmedQuestion.length,
        question_source: options.questionSource ?? "composer",
        question_text: trimmedQuestion,
        session_id: getPostHogSessionId(),
        turn_id: nextTurnId,
      });

      captureAnalyticsEvent("generation_completed", {
        ...prototypeAnalytics,
        answer_length: nextTurn.answer.length,
        conversation_id: conversationId,
        follow_up_count: nextTurn.supportingContent.followUpQuestions.length,
        generation_mode: "complete",
        mock_generation: true,
        reference_count: nextTurn.supportingContent.references.length,
        time_to_complete_ms: 0,
        turn_id: nextTurnId,
      });

      if (instantAnswerDelayMs > 0) {
        activeTurnIdRef.current = nextTurnId;
        setChatTurns((currentTurns): ChatTurn[] => [
          ...currentTurns.map((turn): ChatTurn =>
            turn.status === "complete" ? turn : { ...turn, status: "complete" },
          ),
          {
            ...nextTurn,
            answer: "",
            status: "preparing",
          },
        ]);

        responseDelayTimeoutRef.current = setTimeout(() => {
          if (activeTurnIdRef.current !== nextTurnId) return;

          setChatTurns((currentTurns): ChatTurn[] =>
            currentTurns.map((turn): ChatTurn =>
              turn.id === nextTurnId ? nextTurn : turn,
            ),
          );
          activeTurnIdRef.current = null;
          responseDelayTimeoutRef.current = null;
        }, instantAnswerDelayMs);

        if (options.focusComposer !== false) {
          composerInputRef.current?.focus();
        }

        return;
      }

      setChatTurns((currentTurns): ChatTurn[] => [
        ...currentTurns.map((turn): ChatTurn =>
          turn.status === "complete" ? turn : { ...turn, status: "complete" },
        ),
        nextTurn,
      ]);

      if (options.focusComposer !== false) {
        composerInputRef.current?.focus();
      }
    },
    [clearResponseTimers, conversationId, instantAnswerDelayMs, prototypeAnalytics],
  );

  const showInitialCompletedTurn = useCallback(
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
    (
      question: string,
      options?: { focusComposer?: boolean; questionSource?: string },
    ) => {
      if (instantAnswers) {
        showCompletedTurn(question, options);
        return;
      }

      startStreamingTurn(question, options);
    },
    [instantAnswers, showCompletedTurn, startStreamingTurn],
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
        showInitialCompletedTurn(trimmedInitialQuestion);
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
    instantAnswers,
    showInitialCompletedTurn,
    submitQuestion,
  ]);

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
              onHistoryClick={() => {
                captureAnalyticsEvent("history_conversation_clicked", {
                  ...prototypeAnalytics,
                  conversation_id: conversationId,
                  question_text: defaultInitialQuestion,
                });
                navigate(
                  `${prototypeRoute}/chat?q=${encodeURIComponent(defaultInitialQuestion)}&mode=complete&source=${encodeURIComponent(
                    "history",
                  )}`,
                );
              }}
              onNewChatClick={() => {
                captureAnalyticsEvent("new_chat_clicked", {
                  ...prototypeAnalytics,
                  conversation_id: conversationId,
                });
                navigate(prototypeRoute);
              }}
              showHistory={showHistoryAction}
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
                  {
                    captureAnalyticsEvent("history_conversation_clicked", {
                      ...prototypeAnalytics,
                      conversation_id: conversationId,
                      question_text: defaultInitialQuestion,
                    });
                    navigate(
                      `${prototypeRoute}/chat?q=${encodeURIComponent(defaultInitialQuestion)}&mode=complete&source=${encodeURIComponent(
                        "history",
                      )}`,
                    );
                  }
                }
                onNewChatClick={() => {
                  captureAnalyticsEvent("new_chat_clicked", {
                    ...prototypeAnalytics,
                    conversation_id: conversationId,
                  });
                  navigate(prototypeRoute);
                }}
                showHistory={showHistoryAction}
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
                    adPlacement === "after-keypoints" &&
                    answerVariant === "default" &&
                    keyPoints.length > 0;
                  const summaryReadMoreKeyPoints = splitLeadingKeyPoints(turn.fullAnswer).keyPoints;
                  const isCollapsedReadMoreKeyPoints =
                    answerVariant === "default" && keyPointsVariant === "collapsed-read-more";
                  const isKeyPointsExpanded = expandedKeyPointTurnIds.has(turn.id);
                  const showFullAnswer =
                    turn.answer && (!isCollapsedReadMoreKeyPoints || isKeyPointsExpanded);
                  const showInlineAnswer =
                    showFullAnswer && !isCollapsedReadMoreKeyPoints;
                  const showBottomAnswer =
                    showFullAnswer && isCollapsedReadMoreKeyPoints;
                  const showCompletedTurnExtras =
                    turn.status === "complete" && turn.answer;
                  const answerSummaryText = buildAnswerSummary(
                    turn.status === "complete" ? turn.fullAnswer : turn.answer,
                  );

                  return (
                    <article
                      key={turn.id}
                      ref={(node) => registerTurnArticle(turn.id, node)}
                      className="mx-auto mb-10 max-w-[900px] last:mb-0"
                    >
                      {adPlacement === "above-question" ? (
                        <MedscapeCurrentAdBlock
                          adPlacement={adPlacement}
                          adSlot="above_question"
                          className="mb-5 md:mb-4"
                          conversationId={conversationId}
                          contentDelayMs={adContentDelayMs}
                          prototypeFamily="medscape-ai-current"
                          prototypeRoute={prototypeRoute}
                          prototypeSlug={prototypeSlug}
                          screenType="prototype_chat"
                          turnId={turn.id}
                        />
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
                            <MedscapeCurrentAdBlock
                              adPlacement={adPlacement}
                              adSlot="preparing"
                              className="mt-5 md:mt-4"
                              conversationId={conversationId}
                              contentDelayMs={adContentDelayMs}
                              prototypeFamily="medscape-ai-current"
                              prototypeRoute={prototypeRoute}
                              prototypeSlug={prototypeSlug}
                              screenType="prototype_chat"
                              turnId={turn.id}
                            />
                          ) : null}
                        </>
                      ) : null}

                      {turn.answer && answerVariant === "default" ? (
                        <AiResponseKeyPoints
                          analyticsContext={{
                            conversationId,
                            prototypeFamily: "medscape-ai-current",
                            prototypeRoute,
                            prototypeSlug,
                            question: turn.question,
                            screenType: "prototype_chat",
                            turnId: turn.id,
                          }}
                          className="mb-6"
                          defaultExpanded={keyPointsDefaultExpanded}
                          expanded={
                            isCollapsedReadMoreKeyPoints ? isKeyPointsExpanded : undefined
                          }
                          keyPoints={keyPoints}
                          onExpandedChange={
                            isCollapsedReadMoreKeyPoints
                              ? (expanded) => {
                                  setExpandedKeyPointTurnIds((current) => {
                                    const next = new Set(current);

                                    if (expanded) {
                                      next.add(turn.id);
                                    } else {
                                      next.delete(turn.id);
                                    }

                                    return next;
                                  });
                                }
                              : undefined
                          }
                          summaryText={answerSummaryText}
                          variant={keyPointsVariant}
                        />
                      ) : null}

                      {showAfterKeypointsAd ? (
                        <MedscapeCurrentAdBlock
                          adPlacement={adPlacement}
                          adSlot="after_keypoints"
                          className="mb-6"
                          conversationId={conversationId}
                          contentDelayMs={adContentDelayMs}
                          prototypeFamily="medscape-ai-current"
                          prototypeRoute={prototypeRoute}
                          prototypeSlug={prototypeSlug}
                          screenType="prototype_chat"
                          turnId={turn.id}
                        />
                      ) : null}

                      {turn.answer && answerVariant === "summary-read-more" ? (
                        <MedscapeAiCurrentAnswerSummary
                          analyticsContext={{
                            conversationId,
                            prototypeFamily: "medscape-ai-current",
                            prototypeRoute,
                            prototypeSlug,
                            question: turn.question,
                            screenType: "prototype_chat",
                            turnId: turn.id,
                          }}
                          answer={turn.answer}
                          fullAnswer={turn.fullAnswer}
                          isComplete={turn.status === "complete"}
                          keyPoints={summaryReadMoreKeyPoints}
                          references={turn.supportingContent.references}
                        />
                      ) : showInlineAnswer ? (
                        <AiResponseAnswerContent
                          answer={turn.answer}
                          fullAnswer={turn.fullAnswer}
                          references={turn.supportingContent.references}
                        />
                      ) : null}

                      {showCompletedTurnExtras ? (
                        <>
                          {showBottomAnswer ? (
                            <AiResponseAnswerContent
                              answer={turn.answer}
                              className="mt-5"
                              fullAnswer={turn.fullAnswer}
                              references={turn.supportingContent.references}
                            />
                          ) : null}
                          {followUpQuestionsPlacement === "before-actions" ? (
                            <AiResponseFollowUpQuestions
                              className="mt-5 md:mt-6"
                              onQuestionSelect={(question) => {
                                captureAnalyticsEvent("follow_up_question_clicked", {
                                  ...prototypeAnalytics,
                                  conversation_id: conversationId,
                                  follow_up_index:
                                    turn.supportingContent.followUpQuestions.indexOf(question),
                                  follow_up_text: question,
                                  parent_turn_id: turn.id,
                                });
                                submitQuestion(question, {
                                  questionSource: "follow_up_question",
                                });
                              }}
                              questions={turn.supportingContent.followUpQuestions}
                              variant={followUpQuestionsVariant}
                            />
                          ) : null}
                          <AiResponseAnswerActions
                            analyticsContext={{
                              conversationId,
                              prototypeFamily: "medscape-ai-current",
                              prototypeRoute,
                              prototypeSlug,
                              question: turn.question,
                              screenType: "prototype_chat",
                              turnId: turn.id,
                            }}
                            answer={turn.answer}
                            className={
                              followUpQuestionsPlacement === "before-actions" ? "mt-5" : undefined
                            }
                          />
                          <AiResponseAnswerSupportingContent
                            adPlacement="answer-footer"
                            adContentDelayMs={adContentDelayMs}
                            analyticsContext={{
                              conversationId,
                              prototypeFamily: "medscape-ai-current",
                              prototypeRoute,
                              prototypeSlug,
                              screenType: "prototype_chat",
                              turnId: turn.id,
                            }}
                            className="mt-5"
                            followUpQuestions={turn.supportingContent.followUpQuestions}
                            followUpQuestionsVariant={followUpQuestionsVariant}
                            hideAd={hideAnswerFooterAdForFirstTurn && turn.id === 1}
                            hideFollowUpQuestions={
                              followUpQuestionsPlacement === "before-actions"
                            }
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
                onClick={() => {
                  captureAnalyticsEvent("scroll_to_latest_clicked", {
                    ...prototypeAnalytics,
                    conversation_id: conversationId,
                  });
                  scrollResponseToBottom("smooth");
                }}
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
                  analyticsSourceSurface="medscape_current_chat"
                  isGenerating={isGenerationInProgress}
                  onStopGeneration={handleStopGeneration}
                  onSubmit={handleSubmitQuestion}
                  onValueChange={setComposerDraft}
                  placeholder={composerPlaceholder}
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
