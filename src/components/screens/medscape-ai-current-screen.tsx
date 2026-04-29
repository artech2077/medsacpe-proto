"use client";

import {
  type WheelEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import {
  type AnalyticsProperties,
  createAnalyticsId,
  getQuestionLengthBucket,
} from "@/lib/analytics/events";
import {
  captureAnalyticsEvent,
  getPostHogSessionId,
} from "@/lib/analytics/posthog";

const PRE_STREAM_DELAY_MS = 5000;
const STREAM_TICK_MS = 18;
const STREAM_CHUNK_SIZE = 4;
const CHAT_BOTTOM_CONTENT_PADDING_PX = 112;
const SCROLL_DOWN_VISIBILITY_THRESHOLD_PX = 8;
const MEDSCAPE_AI_SEARCH_URL = "https://www.medscape.com/ai-search";
const PAID_ADS_ROUTE = "/paid-ads-exp";
const PAID_ADS_ENGAGEMENT_MILESTONES_SECONDS = [5, 15, 30, 60, 120] as const;
const PAID_ADS_SCROLL_DEPTH_MILESTONES = [25, 50, 75, 90, 100] as const;
const PAID_ADS_USER_SCROLL_INPUT_WINDOW_MS = 2000;

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
  autoScrollToInitialAd?: boolean;
  composerPlaceholder?: string;
  followUpQuestionsPlacement?: MedscapeAiCurrentFollowUpPlacement;
  followUpQuestionsOverride?: string[];
  followUpQuestionsVariant?: AiResponseFollowUpQuestionsVariant;
  followUpQuestionRedirectUrls?: Record<string, string>;
  hideAnswerFooterAdForFirstTurn?: boolean;
  hideAdImage?: boolean;
  initialConversationMode?: "complete" | "stream";
  initialQuestion?: string;
  initialQuestionSource?: string;
  instantAnswerDelayMs?: number;
  instantAnswers?: boolean;
  keyPointsDefaultExpanded?: boolean;
  keyPointsVariant?: AiResponseKeyPointsVariant;
  prototypeRoute?: string;
  queryRedirectUrl?: string;
  referencesDefaultExpanded?: boolean;
  showHistoryAction?: boolean;
  summaryOverride?: string;
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

function captureButtonClicked(properties: AnalyticsProperties) {
  captureAnalyticsEvent("button_clicked", properties);
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
                      captureButtonClicked({
                        button_id: nextExpanded
                          ? "summary_read_more"
                          : "summary_show_less",
                        button_label: nextExpanded ? "Read more" : "Show less",
                        button_role: "toggle",
                        button_surface: "summary_answer",
                        conversation_id: analyticsContext.conversationId,
                        prototype_family: analyticsContext.prototypeFamily,
                        prototype_route: analyticsContext.prototypeRoute,
                        prototype_slug: analyticsContext.prototypeSlug,
                        screen_type: analyticsContext.screenType,
                        turn_id: analyticsContext.turnId,
                      });
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
  autoScrollToInitialAd = false,
  composerPlaceholder = "Ask anything",
  followUpQuestionsPlacement = "supporting-content",
  followUpQuestionsOverride,
  followUpQuestionsVariant = "default",
  followUpQuestionRedirectUrls,
  hideAnswerFooterAdForFirstTurn = false,
  hideAdImage = false,
  initialConversationMode = "stream",
  initialQuestion = defaultInitialQuestion,
  initialQuestionSource = "direct_url",
  instantAnswerDelayMs = 0,
  instantAnswers = false,
  keyPointsDefaultExpanded = true,
  keyPointsVariant = "default",
  prototypeRoute = "/medscape-ai-current",
  queryRedirectUrl,
  referencesDefaultExpanded = false,
  showHistoryAction = true,
  summaryOverride,
}: MedscapeAiCurrentScreenProps) {
  const responseScrollRef = useRef<HTMLDivElement>(null);
  const initialAdRef = useRef<HTMLDivElement>(null);
  const turnArticleRefs = useRef(new Map<number, HTMLElement>());
  const composerInputRef = useRef<HTMLInputElement>(null);
  const autoScrollFrameRef = useRef<number | null>(null);
  const hasAutoScrolledInitialAdRef = useRef(false);
  const responseDelayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const responseStreamIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoScrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeTurnIdRef = useRef<number | null>(null);
  const generationStartedAtRef = useRef(new Map<number, number>());
  const nextTurnIdRef = useRef(1);
  const startedInitialConversationRef = useRef<string | null>(null);
  const paidAdsStartedAtRef = useRef<number | null>(null);
  const paidAdsEngagementTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const paidAdsTrackedScrollDepthsRef = useRef(new Set<number>());
  const paidAdsMaxScrollDepthRef = useRef(0);
  const paidAdsLastUserScrollInputAtRef = useRef<number | null>(null);
  const paidAdsComposerStartedRef = useRef(false);
  const paidAdsQuestionSubmittedRef = useRef(false);
  const paidAdsClickedAnyButtonRef = useRef(false);
  const paidAdsAdViewedRef = useRef(false);

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
  const isPaidAdsPrototype = prototypeRoute === PAID_ADS_ROUTE;
  const prototypeFamily = isPaidAdsPrototype ? "paid-ads" : "medscape-ai-current";
  const prototypeAnalytics = useMemo(
    () =>
      ({
        ad_placement: adPlacement,
      answer_variant: answerVariant,
      auto_scroll_to_initial_ad: autoScrollToInitialAd,
        key_points_default_expanded: keyPointsDefaultExpanded,
        key_points_variant: keyPointsVariant,
        prototype_family: prototypeFamily,
        prototype_route: prototypeRoute,
        prototype_slug: prototypeSlug,
        screen_type: "prototype_chat",
      }) as const,
    [
      adPlacement,
      answerVariant,
      autoScrollToInitialAd,
      keyPointsDefaultExpanded,
      keyPointsVariant,
      prototypeFamily,
      prototypeRoute,
      prototypeSlug,
    ],
  );
  const paidAdsAnalytics = useMemo(
    () => ({
      ...prototypeAnalytics,
      campaign_entry: isPaidAdsPrototype,
    }),
    [isPaidAdsPrototype, prototypeAnalytics],
  );
  const trackPaidAdsButton = useCallback(
    (properties: AnalyticsProperties) => {
      if (!isPaidAdsPrototype) return;

      paidAdsClickedAnyButtonRef.current = true;
      captureButtonClicked({
        ...paidAdsAnalytics,
        ...properties,
      });
    },
    [isPaidAdsPrototype, paidAdsAnalytics],
  );
  const markPaidAdsAdViewed = useCallback(() => {
    if (!isPaidAdsPrototype) return;

    paidAdsAdViewedRef.current = true;
  }, [isPaidAdsPrototype]);
  const markPaidAdsUserScrollInput = useCallback(() => {
    if (!isPaidAdsPrototype) return;

    paidAdsLastUserScrollInputAtRef.current = performance.now();
  }, [isPaidAdsPrototype]);

  const openQueryRedirect = useCallback(
    (question: string, questionSource: string) => {
      const destinationUrl =
        questionSource === "follow_up_question"
          ? followUpQuestionRedirectUrls?.[question] ?? queryRedirectUrl
          : queryRedirectUrl;

      if (!destinationUrl) return false;

      trackPaidAdsButton({
        button_id: "external_ai_search_open",
        button_label: "Open Medscape AI search",
        button_role: "external_navigation",
        button_surface: questionSource,
        conversation_id: conversationId,
      });
      captureAnalyticsEvent("external_ai_search_opened", {
        ...prototypeAnalytics,
        conversation_id: conversationId,
        destination_url: destinationUrl,
        question_source: questionSource,
        question_text: question,
      });
      window.location.assign(destinationUrl);
      setComposerDraft("");
      return true;
    },
    [
      conversationId,
      followUpQuestionRedirectUrls,
      prototypeAnalytics,
      queryRedirectUrl,
      trackPaidAdsButton,
    ],
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

    if (autoScrollTimeoutRef.current) {
      clearTimeout(autoScrollTimeoutRef.current);
      autoScrollTimeoutRef.current = null;
    }

    if (autoScrollFrameRef.current !== null) {
      cancelAnimationFrame(autoScrollFrameRef.current);
      autoScrollFrameRef.current = null;
    }
  }, []);

  const animateResponseScrollTo = useCallback((targetTop: number, durationMs = 1200) => {
    const responseScroll = responseScrollRef.current;
    if (!responseScroll) return Promise.resolve();

    if (autoScrollFrameRef.current !== null) {
      cancelAnimationFrame(autoScrollFrameRef.current);
      autoScrollFrameRef.current = null;
    }

    const startTop = responseScroll.scrollTop;
    const distance = targetTop - startTop;

    if (Math.abs(distance) < 1) {
      return Promise.resolve();
    }

    const startedAt = performance.now();
    const easeInOutCubic = (progress: number) =>
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    return new Promise<void>((resolve) => {
      const step = (now: number) => {
        const progress = Math.min((now - startedAt) / durationMs, 1);
        responseScroll.scrollTop = startTop + distance * easeInOutCubic(progress);

        if (progress < 1) {
          autoScrollFrameRef.current = requestAnimationFrame(step);
          return;
        }

        autoScrollFrameRef.current = null;
        resolve();
      };

      autoScrollFrameRef.current = requestAnimationFrame(step);
    });
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
  const buildSupportingContent = useCallback(
    (question: string): AiAnswerSupportingContent => {
      const supportingContent = buildMockAnswerSupportingContent(question);

      if (!followUpQuestionsOverride) {
        return supportingContent;
      }

      return {
        ...supportingContent,
        followUpQuestions: followUpQuestionsOverride,
      };
    },
    [followUpQuestionsOverride],
  );

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
      const supportingContent = buildSupportingContent(trimmedQuestion);
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
      paidAdsQuestionSubmittedRef.current = true;

      captureAnalyticsEvent("question_submitted", {
        ...prototypeAnalytics,
        conversation_id: conversationId,
        entry_surface: questionSource,
        is_prefilled_question: questionSource !== "composer",
        question_length: trimmedQuestion.length,
        question_length_bucket: getQuestionLengthBucket(trimmedQuestion.length),
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
      buildSupportingContent,
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
        supportingContent: buildSupportingContent(trimmedQuestion),
      };
      paidAdsQuestionSubmittedRef.current = true;

      captureAnalyticsEvent("question_submitted", {
        ...prototypeAnalytics,
        conversation_id: conversationId,
        entry_surface: options.questionSource ?? "composer",
        is_prefilled_question: (options.questionSource ?? "composer") !== "composer",
        question_length: trimmedQuestion.length,
        question_length_bucket: getQuestionLengthBucket(trimmedQuestion.length),
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
    [
      buildSupportingContent,
      clearResponseTimers,
      conversationId,
      instantAnswerDelayMs,
      prototypeAnalytics,
    ],
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
          supportingContent: buildSupportingContent(trimmedQuestion),
        },
      ]);
    },
    [buildSupportingContent, clearResponseTimers],
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
    if (!isPaidAdsPrototype) return;

    captureAnalyticsEvent("paid_ads_landing_viewed", {
      ...paidAdsAnalytics,
      has_prefilled_question: initialQuestion.trim().length > 0,
      initial_mode: initialConversationMode,
      initial_question_source: initialQuestionSource,
    });
  }, [
    initialConversationMode,
    initialQuestion,
    initialQuestionSource,
    isPaidAdsPrototype,
    paidAdsAnalytics,
  ]);

  useEffect(() => {
    if (!isPaidAdsPrototype) return;

    paidAdsStartedAtRef.current = performance.now();
    paidAdsEngagementTimersRef.current = PAID_ADS_ENGAGEMENT_MILESTONES_SECONDS.map(
      (milestoneSeconds) =>
        setTimeout(() => {
          captureAnalyticsEvent("engagement_timer_reached", {
            ...paidAdsAnalytics,
            milestone_seconds: milestoneSeconds,
          });
        }, milestoneSeconds * 1000),
    );

    const captureEngagementEnd = () => {
      const startedAt = paidAdsStartedAtRef.current;
      if (startedAt === null) return;

      captureAnalyticsEvent("page_engagement_ended", {
        ...paidAdsAnalytics,
        ad_viewed: paidAdsAdViewedRef.current,
        clicked_any_button: paidAdsClickedAnyButtonRef.current,
        composer_started: paidAdsComposerStartedRef.current,
        engaged_time_ms: Math.round(performance.now() - startedAt),
        max_scroll_depth_percent: paidAdsMaxScrollDepthRef.current,
        question_submitted: paidAdsQuestionSubmittedRef.current,
      });
      paidAdsStartedAtRef.current = null;
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        captureEngagementEnd();
      }
    };
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest("button, a, [role='button']")
      ) {
        paidAdsClickedAnyButtonRef.current = true;
      }
    };

    window.addEventListener("pagehide", captureEngagementEnd);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("click", handleDocumentClick, { capture: true });

    return () => {
      paidAdsEngagementTimersRef.current.forEach((timerId) => clearTimeout(timerId));
      paidAdsEngagementTimersRef.current = [];
      captureEngagementEnd();
      window.removeEventListener("pagehide", captureEngagementEnd);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("click", handleDocumentClick, { capture: true });
    };
  }, [isPaidAdsPrototype, paidAdsAnalytics]);

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
    if (!isPaidAdsPrototype) return;

    const responseScroll = responseScrollRef.current;
    if (!responseScroll) return;

    const trackScrollDepth = () => {
      const lastUserInputAt = paidAdsLastUserScrollInputAtRef.current;
      const isUserInitiated =
        lastUserInputAt !== null &&
        performance.now() - lastUserInputAt <= PAID_ADS_USER_SCROLL_INPUT_WINDOW_MS;

      if (!isUserInitiated) return;

      const contentHeight = Math.max(
        responseScroll.scrollHeight - CHAT_BOTTOM_CONTENT_PADDING_PX - bottomSpacerHeight,
        responseScroll.clientHeight,
      );
      if (contentHeight <= 0) return;

      const scrollDepthPercent = Math.min(
        100,
        Math.max(
          0,
          Math.round(((responseScroll.scrollTop + responseScroll.clientHeight) / contentHeight) * 100),
        ),
      );
      paidAdsMaxScrollDepthRef.current = Math.max(
        paidAdsMaxScrollDepthRef.current,
        scrollDepthPercent,
      );

      for (const milestone of PAID_ADS_SCROLL_DEPTH_MILESTONES) {
        if (
          scrollDepthPercent >= milestone &&
          !paidAdsTrackedScrollDepthsRef.current.has(milestone)
        ) {
          paidAdsTrackedScrollDepthsRef.current.add(milestone);
          captureAnalyticsEvent("scroll_depth_reached", {
            ...paidAdsAnalytics,
            scroll_container: "chat_response",
            scroll_depth_basis: "viewport_bottom_content_exposure",
            scroll_depth_percent: milestone,
            scroll_source: "user",
          });
        }
      }
    };
    const markUserScrollInput = () => {
      paidAdsLastUserScrollInputAtRef.current = performance.now();
    };

    responseScroll.addEventListener("wheel", markUserScrollInput, { passive: true });
    responseScroll.addEventListener("touchmove", markUserScrollInput, { passive: true });
    responseScroll.addEventListener("pointerdown", markUserScrollInput, { passive: true });
    responseScroll.addEventListener("scroll", trackScrollDepth, { passive: true });

    return () => {
      responseScroll.removeEventListener("wheel", markUserScrollInput);
      responseScroll.removeEventListener("touchmove", markUserScrollInput);
      responseScroll.removeEventListener("pointerdown", markUserScrollInput);
      responseScroll.removeEventListener("scroll", trackScrollDepth);
    };
  }, [bottomSpacerHeight, isPaidAdsPrototype, paidAdsAnalytics]);

  useEffect(() => {
    if (!showScrollToBottomButton) return;

    captureAnalyticsEvent("scroll_to_latest_shown", {
      ...prototypeAnalytics,
      conversation_id: conversationId,
    });
  }, [conversationId, prototypeAnalytics, showScrollToBottomButton]);

  useEffect(() => {
    if (!autoScrollToInitialAd || hasAutoScrolledInitialAdRef.current) return;

    const firstTurn = chatTurns[0];
    if (!firstTurn || firstTurn.status !== "complete" || !firstTurn.answer) return;

    autoScrollTimeoutRef.current = setTimeout(() => {
      const responseScroll = responseScrollRef.current;
      const initialAd = initialAdRef.current;

      if (!responseScroll || !initialAd) return;

      const responseRect = responseScroll.getBoundingClientRect();
      const adRect = initialAd.getBoundingClientRect();
      const adTop = adRect.top - responseRect.top + responseScroll.scrollTop;
      const maxScrollTop = Math.max(responseScroll.scrollHeight - responseScroll.clientHeight, 0);
      const targetTop = Math.min(
        Math.max(adTop + adRect.height * 0.85, responseScroll.scrollTop),
        maxScrollTop,
      );

      hasAutoScrolledInitialAdRef.current = true;
      void animateResponseScrollTo(targetTop, 1400).then(() => {
        autoScrollTimeoutRef.current = setTimeout(() => {
          void animateResponseScrollTo(0, 1000);
        }, 250);
      });
    }, 150);

    return () => {
      if (autoScrollTimeoutRef.current) {
        clearTimeout(autoScrollTimeoutRef.current);
        autoScrollTimeoutRef.current = null;
      }
    };
  }, [animateResponseScrollTo, autoScrollToInitialAd, chatTurns]);

  useEffect(() => {
    const trimmedInitialQuestion = initialQuestion.trim();
    if (!trimmedInitialQuestion) return;

    const initialConversationKey = `${initialConversationMode}:${trimmedInitialQuestion}`;
    if (startedInitialConversationRef.current === initialConversationKey) return;

    const frameId = requestAnimationFrame(() => {
      if (startedInitialConversationRef.current === initialConversationKey) return;

      startedInitialConversationRef.current = initialConversationKey;

      if (initialConversationMode === "complete") {
        if (instantAnswerDelayMs > 0) {
          showCompletedTurn(trimmedInitialQuestion, {
            focusComposer: false,
            questionSource: initialQuestionSource,
          });
          return;
        }

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
    instantAnswerDelayMs,
    instantAnswers,
    showCompletedTurn,
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
    markPaidAdsUserScrollInput();

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
    const trimmedQuestion = composerDraft.trim();
    if (!trimmedQuestion) return;

    if (isPaidAdsPrototype) {
      paidAdsQuestionSubmittedRef.current = true;
    }

    if (openQueryRedirect(trimmedQuestion, "composer")) {
      return;
    }

    submitQuestion(trimmedQuestion);
  };

  const handleComposerValueChange = (nextValue: string) => {
    const trimmedValue = nextValue.trim();

    if (isPaidAdsPrototype && trimmedValue.length > 0 && !paidAdsComposerStartedRef.current) {
      paidAdsComposerStartedRef.current = true;
      captureAnalyticsEvent("composer_typing_started", {
        ...paidAdsAnalytics,
        source_surface: "medscape_current_chat",
      });
    }

    setComposerDraft(nextValue);
  };

  const redirectToMedscapeAiSearch = () => {
    window.location.assign(MEDSCAPE_AI_SEARCH_URL);
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
                trackPaidAdsButton({
                  button_id: "top_rail_history",
                  button_label: "History",
                  button_role: "navigation",
                  button_surface: "top_rail",
                  conversation_id: conversationId,
                });
                captureAnalyticsEvent("history_conversation_clicked", {
                  ...prototypeAnalytics,
                  conversation_id: conversationId,
                  question_text: defaultInitialQuestion,
                });
                redirectToMedscapeAiSearch();
              }}
              onNewChatClick={() => {
                trackPaidAdsButton({
                  button_id: "top_rail_new_chat",
                  button_label: "New Chat",
                  button_role: "navigation",
                  button_surface: "top_rail",
                  conversation_id: conversationId,
                });
                captureAnalyticsEvent("new_chat_clicked", {
                  ...prototypeAnalytics,
                  conversation_id: conversationId,
                });
                redirectToMedscapeAiSearch();
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
                    trackPaidAdsButton({
                      button_id: "top_rail_history",
                      button_label: "History",
                      button_role: "navigation",
                      button_surface: "mobile_top_rail",
                      conversation_id: conversationId,
                    });
                    captureAnalyticsEvent("history_conversation_clicked", {
                      ...prototypeAnalytics,
                      conversation_id: conversationId,
                      question_text: defaultInitialQuestion,
                    });
                    redirectToMedscapeAiSearch();
                  }
                }
                onNewChatClick={() => {
                  trackPaidAdsButton({
                    button_id: "top_rail_new_chat",
                    button_label: "New Chat",
                    button_role: "navigation",
                    button_surface: "mobile_top_rail",
                    conversation_id: conversationId,
                  });
                  captureAnalyticsEvent("new_chat_clicked", {
                    ...prototypeAnalytics,
                    conversation_id: conversationId,
                  });
                  redirectToMedscapeAiSearch();
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
                  const answerSummaryText =
                    summaryOverride && turn.question === initialQuestion
                      ? summaryOverride
                      : buildAnswerSummary(
                          turn.status === "complete" ? turn.fullAnswer : turn.answer,
                        );

                  return (
                    <article
                      key={turn.id}
                      ref={(node) => registerTurnArticle(turn.id, node)}
                      className="mx-auto mb-10 max-w-[900px] last:mb-0"
                    >
                      {adPlacement === "above-question" ? (
                        <div ref={turn.id === 1 ? initialAdRef : undefined}>
                          <MedscapeCurrentAdBlock
                            adPlacement={adPlacement}
                            adSlot="above_question"
                            className="mb-5 md:mb-4"
                            conversationId={conversationId}
                            contentDelayMs={adContentDelayMs}
                            hideImage={hideAdImage}
                            onAdViewed={markPaidAdsAdViewed}
                            prototypeFamily={prototypeFamily}
                            prototypeRoute={prototypeRoute}
                            prototypeSlug={prototypeSlug}
                            screenType="prototype_chat"
                            turnId={turn.id}
                          />
                        </div>
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
                              hideImage={hideAdImage}
                              onAdViewed={markPaidAdsAdViewed}
                              prototypeFamily={prototypeFamily}
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
                            prototypeFamily,
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
                          readMorePlacement={
                            isCollapsedReadMoreKeyPoints && turn.id > 1
                              ? "inside-summary"
                              : "outside-summary"
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
                          hideImage={hideAdImage}
                          onAdViewed={markPaidAdsAdViewed}
                          prototypeFamily={prototypeFamily}
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
                            prototypeFamily,
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
                                trackPaidAdsButton({
                                  button_id: "follow_up_question",
                                  button_label: "Follow-up question",
                                  button_role: "suggested_question",
                                  button_surface: "follow_up_questions",
                                  conversation_id: conversationId,
                                  follow_up_index:
                                    turn.supportingContent.followUpQuestions.indexOf(question),
                                  parent_turn_id: turn.id,
                                });
                                captureAnalyticsEvent("follow_up_question_clicked", {
                                  ...prototypeAnalytics,
                                  conversation_id: conversationId,
                                  follow_up_index:
                                    turn.supportingContent.followUpQuestions.indexOf(question),
                                  follow_up_text: question,
                                  parent_turn_id: turn.id,
                                });
                                if (openQueryRedirect(question, "follow_up_question")) {
                                  return;
                                }

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
                              prototypeFamily,
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
                            copyText={turn.fullAnswer}
                          />
                          <AiResponseAnswerSupportingContent
                            adPlacement="answer-footer"
                            adContentDelayMs={adContentDelayMs}
                            analyticsContext={{
                              conversationId,
                              prototypeFamily,
                              prototypeRoute,
                              prototypeSlug,
                              screenType: "prototype_chat",
                              turnId: turn.id,
                            }}
                            className="mt-5"
                            followUpQuestions={turn.supportingContent.followUpQuestions}
                            followUpQuestionsVariant={followUpQuestionsVariant}
                            hideAd={hideAnswerFooterAdForFirstTurn && turn.id === 1}
                            hideAdImage={hideAdImage}
                            hideFollowUpQuestions={
                              followUpQuestionsPlacement === "before-actions"
                            }
                            onAdViewed={markPaidAdsAdViewed}
                            onFollowUpQuestionSelect={(question) => {
                              trackPaidAdsButton({
                                button_id: "follow_up_question",
                                button_label: "Follow-up question",
                                button_role: "suggested_question",
                                button_surface: "follow_up_questions",
                                conversation_id: conversationId,
                                follow_up_index: turn.supportingContent.followUpQuestions.indexOf(question),
                                parent_turn_id: turn.id,
                              });
                              captureAnalyticsEvent("follow_up_question_clicked", {
                                ...prototypeAnalytics,
                                conversation_id: conversationId,
                                follow_up_index: turn.supportingContent.followUpQuestions.indexOf(question),
                                follow_up_text: question,
                                parent_turn_id: turn.id,
                              });
                              if (openQueryRedirect(question, "follow_up_question")) {
                                return;
                              }

                              submitQuestion(question, {
                                questionSource: "follow_up_question",
                              });
                            }}
                            referencesDefaultExpanded={referencesDefaultExpanded}
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
                  trackPaidAdsButton({
                    button_id: "scroll_to_latest",
                    button_label: "Scroll to latest",
                    button_role: "scroll",
                    button_surface: "chat_response",
                    conversation_id: conversationId,
                  });
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
                  analyticsEventProperties={{
                    ...paidAdsAnalytics,
                    conversation_id: conversationId,
                    redirects_to_ai_search: Boolean(queryRedirectUrl),
                  }}
                  analyticsSourceSurface="medscape_current_chat"
                  isGenerating={isGenerationInProgress}
                  onStopGeneration={handleStopGeneration}
                  onSubmit={handleSubmitQuestion}
                  onValueChange={handleComposerValueChange}
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
