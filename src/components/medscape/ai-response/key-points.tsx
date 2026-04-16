"use client";

import { useState } from "react";
import { renderInlineText } from "@/components/medscape/ai-response/answer-content";
import { AiChevronIcon, AiLightbulbIcon } from "@/components/medscape/ai-response/answer-section-icons";

const COLLAPSED_PREVIEW_CHARACTER_LIMIT = 92;

type InlineTextSegment = {
  isBold: boolean;
  text: string;
};

export type AiResponseKeyPointsVariant = "default" | "collapsed-read-more";

type AiResponseKeyPointsProps = {
  className?: string;
  defaultExpanded?: boolean;
  keyPoints: string[];
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
  return segments.map((segment, index) =>
    segment.isBold ? (
      <strong key={`${segment.text}-${index}`} className="font-extrabold">
        {segment.text}
      </strong>
    ) : (
      <span key={`${segment.text}-${index}`}>{segment.text}</span>
    ),
  );
}

export function AiResponseKeyPoints({
  className,
  defaultExpanded = true,
  keyPoints,
  variant = "default",
}: AiResponseKeyPointsProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (keyPoints.length === 0) {
    return null;
  }

  const isCollapsedReadMoreVariant = variant === "collapsed-read-more";
  const collapsedPreview = buildCollapsedPreview(keyPoints[0]);
  const showCollapsedPreview = isCollapsedReadMoreVariant && !isExpanded;

  return (
    <section
      className={`rounded-[20px] bg-[#ecf1f9] px-4 py-4 md:px-5 md:py-5 ${className ?? ""}`.trim()}
    >
      <button
        type="button"
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded((current) => !current)}
        className="flex w-full items-center gap-2 text-left text-[#2c353a]"
      >
        <AiLightbulbIcon className="h-5 w-5 shrink-0 text-[#2c353a] md:h-6 md:w-6" />
        <span className="flex-1 text-[20px] leading-[1.3] font-bold md:text-[24px]">
          Key Points
        </span>
        <AiChevronIcon
          direction={isExpanded || isCollapsedReadMoreVariant ? "up" : "down"}
          className="h-5 w-5 shrink-0 text-[#2c353a]"
        />
      </button>

      {showCollapsedPreview ? (
        <div className="mt-4 flex items-start gap-3 text-[16px] leading-[1.3] text-[#2c353a]">
          <span aria-hidden="true" className="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#2c353a]" />
          <div className="min-w-0 flex-1">
            {renderInlineSegments(collapsedPreview.segments)}
            {collapsedPreview.wasTruncated ? <span>... </span> : <span> </span>}
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="font-semibold text-[#064aa7] transition hover:text-[#043b84] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.22)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#ecf1f9]"
            >
              Read More
            </button>
          </div>
        </div>
      ) : null}

      {isExpanded ? (
        <ul className="mt-4 list-disc space-y-3 pl-5 text-[16px] leading-[1.3] text-[#2c353a] marker:text-[#2c353a]">
          {keyPoints.map((item, index) => (
            <li key={`${item}-${index}`}>
              {renderInlineText(item)}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
