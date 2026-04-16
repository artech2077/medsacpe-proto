/* eslint-disable @next/next/no-img-element */
"use client";

import { AiChevronIcon } from "@/components/medscape/ai-response/answer-section-icons";
import { aiResponseAssets } from "@/data/ai-response";

type AiResponseFollowUpQuestionsProps = {
  className?: string;
  onQuestionSelect?: (question: string) => void;
  questions: string[];
};

export function AiResponseFollowUpQuestions({
  className,
  onQuestionSelect,
  questions,
}: AiResponseFollowUpQuestionsProps) {
  if (questions.length === 0) {
    return null;
  }

  return (
    <section className={className}>
      <div className="border-t border-[#c5ced3] pt-3">
        <div className="flex items-center gap-2 text-[#2c353a]">
          <img
            src={aiResponseAssets.uiIcons.followUpQuestions}
            alt=""
            aria-hidden="true"
            className="h-4 w-4 shrink-0 object-contain"
          />
          <h2 className="text-[18px] leading-[1.2] font-semibold">Follow-up Questions</h2>
        </div>

        <div className="mt-3">
          {questions.map((question, index) => (
            <button
              key={`${question}-${index}`}
              type="button"
              onClick={() => onQuestionSelect?.(question)}
              className={`flex w-full items-center gap-4 border-[#c5ced3] py-2 text-left ${
                index === 0 ? "border-t" : ""
              } border-b`}
            >
              <span className="flex-1 text-[16px] leading-[1.3] text-[#064aa7]">
                {question}
              </span>
              <AiChevronIcon
                direction="right"
                className="h-4 w-4 shrink-0 text-[#161b1d]"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
