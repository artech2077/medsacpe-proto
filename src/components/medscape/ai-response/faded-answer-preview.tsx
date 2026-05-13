"use client";

import {
  AiResponseAnswerContent,
  buildAnswerBlocks,
  splitLeadingKeyPoints,
} from "@/components/medscape/ai-response/answer-content";
import type { AiAnswerReference } from "@/data/ai-response";

type AiResponseFadedAnswerPreviewProps = {
  answer: string;
  collapsedContent?: "default" | "first-paragraph";
  expanded: boolean;
  fullAnswer: string;
  learnMoreLabel?: string;
  onExpandedChange: (expanded: boolean) => void;
  references: AiAnswerReference[];
};

function getFirstBodyParagraph(answer: string) {
  const { body } = splitLeadingKeyPoints(answer);
  const firstParagraph = buildAnswerBlocks(body).find((block) => block.type === "paragraph");

  return firstParagraph?.text ?? body.trim();
}

export function AiResponseFadedAnswerPreview({
  answer,
  collapsedContent = "default",
  expanded,
  fullAnswer,
  learnMoreLabel = "Read more",
  onExpandedChange,
  references,
}: AiResponseFadedAnswerPreviewProps) {
  const showFirstParagraphPreview = !expanded && collapsedContent === "first-paragraph";
  const previewAnswer = showFirstParagraphPreview ? getFirstBodyParagraph(answer) : answer;

  return (
    <div>
      <div
        className={
          expanded || showFirstParagraphPreview
            ? undefined
            : "relative max-h-[4.35em] overflow-hidden"
        }
      >
        <AiResponseAnswerContent
          answer={previewAnswer}
          fullAnswer={fullAnswer}
          references={references}
        />
        {!expanded && !showFirstParagraphPreview ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[1.7em] bg-gradient-to-t from-white via-white/80 to-white/0"
          />
        ) : null}
      </div>
      <div className="mt-2 text-center">
        <button
          type="button"
          onClick={() => onExpandedChange(!expanded)}
          className="font-semibold text-[#064aa7] transition hover:text-[#043b84] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.22)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          {expanded ? "Show less" : learnMoreLabel}
        </button>
      </div>
    </div>
  );
}
