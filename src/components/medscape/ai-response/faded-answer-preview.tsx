"use client";

import { AiResponseAnswerContent } from "@/components/medscape/ai-response/answer-content";
import type { AiAnswerReference } from "@/data/ai-response";

type AiResponseFadedAnswerPreviewProps = {
  answer: string;
  expanded: boolean;
  fullAnswer: string;
  learnMoreLabel?: string;
  onExpandedChange: (expanded: boolean) => void;
  references: AiAnswerReference[];
};

export function AiResponseFadedAnswerPreview({
  answer,
  expanded,
  fullAnswer,
  learnMoreLabel = "Read more",
  onExpandedChange,
  references,
}: AiResponseFadedAnswerPreviewProps) {
  return (
    <div>
      <div className={expanded ? undefined : "relative max-h-[4.35em] overflow-hidden"}>
        <AiResponseAnswerContent
          answer={answer}
          fullAnswer={fullAnswer}
          references={references}
        />
        {!expanded ? (
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
