"use client";

import { useState } from "react";
import { renderInlineText } from "@/components/medscape/ai-response/answer-content";
import { AiChevronIcon, AiLightbulbIcon } from "@/components/medscape/ai-response/answer-section-icons";
import { captureAnalyticsEvent } from "@/lib/analytics/posthog";

const COLLAPSED_PREVIEW_CHARACTER_LIMIT = 92;

type InlineTextSegment = {
  isBold: boolean;
  text: string;
};

export type AiResponseKeyPointsVariant = "default" | "collapsed-read-more";
export type AiResponseKeyPointsReadMorePlacement = "outside-summary" | "inside-summary";
export type AiResponseKeyPointsCollapsedContent = "summary" | "key-points";

export type AiResponseKeyPointsLabels = {
  collapsedHeading?: string;
  collapseButton?: string;
  expandButton?: string;
};

type AiResponseKeyPointsProps = {
  analyticsContext?: {
    conversationId?: string;
    prototypeFamily?: string;
    prototypeRoute?: string;
    prototypeSlug?: string;
    question?: string;
    screenType?: string;
    turnId?: number;
  };
  className?: string;
  collapsedContent?: AiResponseKeyPointsCollapsedContent;
  defaultExpanded?: boolean;
  expanded?: boolean;
  keyPoints: string[];
  labels?: AiResponseKeyPointsLabels;
  onExpandedChange?: (expanded: boolean, trigger: "header" | "read_more") => void;
  readMorePlacement?: AiResponseKeyPointsReadMorePlacement;
  summaryText?: string;
  variant?: AiResponseKeyPointsVariant;
};

function buildInlineTextSegments(text: string): InlineTextSegment[] {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return { isBold: true, text: part.slice(2, -2) };
      }

      return { isBold: false, text: part };
    });
}

function buildCollapsedPreview(text: string) {
  const segments = buildInlineTextSegments(text);
  const fullText = segments.map((segment) => segment.text).join("");

  if (fullText.length <= COLLAPSED_PREVIEW_CHARACTER_LIMIT) {
    return { segments, wasTruncated: false };
  }

  let remainingCharacters = COLLAPSED_PREVIEW_CHARACTER_LIMIT;
  const previewSegments: InlineTextSegment[] = [];

  for (const segment of segments) {
    if (remainingCharacters <= 0) break;

    if (segment.text.length <= remainingCharacters) {
      previewSegments.push(segment);
      remainingCharacters -= segment.text.length;
      continue;
    }

    const partialText = segment.text.slice(0, remainingCharacters);
    const safeText =
      partialText.lastIndexOf(" ") > COLLAPSED_PREVIEW_CHARACTER_LIMIT / 2
        ? partialText.slice(0, partialText.lastIndexOf(" "))
        : partialText;

    previewSegments.push({
      ...segment,
      text: safeText.trimEnd(),
    });
    remainingCharacters = 0;
  }

  return {
    segments: previewSegments.filter((segment) => segment.text.length > 0),
    wasTruncated: true,
  };
}

function renderInlineSegments(segments: InlineTextSegment[]) {
  return segments.flatMap((segment, index) => {
    const lines = segment.text.split("\n");

    return lines.flatMap((line, lineIndex) => {
      const content = segment.isBold ? (
        <strong
          key={`${segment.text}-${index}-${lineIndex}-text`}
          className="font-extrabold"
        >
          {line}
        </strong>
      ) : (
        <span key={`${segment.text}-${index}-${lineIndex}-text`}>{line}</span>
      );

      return lineIndex === lines.length - 1
        ? [content]
        : [
            content,
            <br key={`${segment.text}-${index}-${lineIndex}-break`} />,
          ];
    });
  });
}

export function AiResponseKeyPoints({
  analyticsContext,
  className,
  collapsedContent = "summary",
  defaultExpanded = true,
  expanded,
  keyPoints,
  labels,
  onExpandedChange,
  readMorePlacement = "outside-summary",
  summaryText,
  variant = "default",
}: AiResponseKeyPointsProps) {
  const [uncontrolledIsExpanded, setUncontrolledIsExpanded] = useState(defaultExpanded);

  if (keyPoints.length === 0) {
    return null;
  }

  const isCollapsedReadMoreVariant = variant === "collapsed-read-more";
  const showCollapsedKeyPoints =
    isCollapsedReadMoreVariant && collapsedContent === "key-points";
  const isExpanded = expanded ?? uncontrolledIsExpanded;
  const summaryContent = summaryText ?? keyPoints[0];
  const collapsedPreview = buildCollapsedPreview(summaryContent);
  const summarySegments = isCollapsedReadMoreVariant
    ? buildInlineTextSegments(summaryContent)
    : collapsedPreview.segments;
  const collapsedHeadingLabel = labels?.collapsedHeading ?? "Summary";
  const expandButtonLabel = labels?.expandButton ?? "Read full answer";
  const collapseButtonLabel = labels?.collapseButton ?? "Hide full answer";
  const placeReadMoreInsideSummary =
    isCollapsedReadMoreVariant && readMorePlacement === "inside-summary";
  const updateExpanded = (nextExpanded: boolean, trigger: "header" | "read_more") => {
    if (expanded === undefined) {
      setUncontrolledIsExpanded(nextExpanded);
    }

    onExpandedChange?.(nextExpanded, trigger);
    trackToggle(nextExpanded, trigger);
  };
  const trackToggle = (nextExpanded: boolean, trigger: "header" | "read_more") => {
    captureAnalyticsEvent("button_clicked", {
      button_id:
        trigger === "read_more"
          ? nextExpanded
            ? "key_points_read_full_answer"
            : "key_points_hide_full_answer"
          : "key_points_header_toggle",
      button_label:
        trigger === "read_more"
          ? nextExpanded
            ? expandButtonLabel
            : collapseButtonLabel
          : variant === "collapsed-read-more"
            ? collapsedHeadingLabel
            : "Key Points",
      button_role: "toggle",
      button_surface: "key_points",
      conversation_id: analyticsContext?.conversationId,
      prototype_family: analyticsContext?.prototypeFamily,
      prototype_route: analyticsContext?.prototypeRoute,
      prototype_slug: analyticsContext?.prototypeSlug,
      screen_type: analyticsContext?.screenType,
      turn_id: analyticsContext?.turnId,
    });
    captureAnalyticsEvent("key_points_toggled", {
      conversation_id: analyticsContext?.conversationId,
      expanded: nextExpanded,
      key_points_count: keyPoints.length,
      prototype_family: analyticsContext?.prototypeFamily,
      prototype_route: analyticsContext?.prototypeRoute,
      prototype_slug: analyticsContext?.prototypeSlug,
      question_text: analyticsContext?.question,
      screen_type: analyticsContext?.screenType,
      trigger,
      turn_id: analyticsContext?.turnId,
      variant,
    });
  };
  const readMoreButton = isCollapsedReadMoreVariant ? (
    <button
      type="button"
      onClick={() => {
        updateExpanded(!isExpanded, "read_more");
      }}
      className="font-semibold text-[#064aa7] transition hover:text-[#043b84] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.22)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
    >
      {isExpanded ? collapseButtonLabel : expandButtonLabel}
    </button>
  ) : null;

  const sectionClassName = `rounded-[20px] bg-[#ecf1f9] px-4 py-4 md:px-5 md:py-5 ${
    isCollapsedReadMoreVariant ? "" : className ?? ""
  }`.trim();

  return (
    <div className={isCollapsedReadMoreVariant ? className : undefined}>
      <section className={sectionClassName}>
        <button
          type="button"
          aria-expanded={isExpanded}
          onClick={() => {
            updateExpanded(!isExpanded, "header");
          }}
          className="flex w-full items-center gap-2 text-left text-[#2c353a]"
        >
          <AiLightbulbIcon className="h-5 w-5 shrink-0 text-[#2c353a] md:h-6 md:w-6" />
          <span className="flex-1 text-[20px] leading-[1.3] font-bold md:text-[24px]">
            {isCollapsedReadMoreVariant ? collapsedHeadingLabel : "Key Points"}
          </span>
          {isCollapsedReadMoreVariant ? null : (
            <AiChevronIcon
              direction={isExpanded ? "up" : "down"}
              className="h-5 w-5 shrink-0 text-[#2c353a]"
            />
          )}
        </button>

        {isCollapsedReadMoreVariant ? (
          <div className="mt-4 text-[16px] leading-[1.3] text-[#2c353a]">
            {showCollapsedKeyPoints ? (
              <ul className="list-disc space-y-3 pl-5 marker:text-[#2c353a]">
                {keyPoints.map((item, index) => (
                  <li key={`${item}-${index}`}>
                    {renderInlineText(item)}
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                {renderInlineSegments(summarySegments)}
                {!isCollapsedReadMoreVariant && collapsedPreview.wasTruncated ? (
                  <span>...</span>
                ) : null}
              </p>
            )}
            {placeReadMoreInsideSummary ? (
              <div className="mt-2 text-center">{readMoreButton}</div>
            ) : null}
          </div>
        ) : null}

        {isExpanded && !isCollapsedReadMoreVariant ? (
          <ul className="mt-4 list-disc space-y-3 pl-5 text-[16px] leading-[1.3] text-[#2c353a] marker:text-[#2c353a]">
            {keyPoints.map((item, index) => (
              <li key={`${item}-${index}`}>
                {renderInlineText(item)}
              </li>
            ))}
          </ul>
        ) : null}
      </section>
      {isCollapsedReadMoreVariant && !placeReadMoreInsideSummary ? (
        <div className="mt-2 text-center">{readMoreButton}</div>
      ) : null}
    </div>
  );
}
