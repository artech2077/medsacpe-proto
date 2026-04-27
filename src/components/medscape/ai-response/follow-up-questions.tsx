/* eslint-disable @next/next/no-img-element */
"use client";

import { AiChevronIcon } from "@/components/medscape/ai-response/answer-section-icons";
import { aiResponseAssets } from "@/data/ai-response";

export type AiResponseFollowUpQuestionsVariant = "default" | "chips";

type AiResponseFollowUpQuestionsProps = {
  className?: string;
  onQuestionSelect?: (question: string) => void;
  questions: string[];
  variant?: AiResponseFollowUpQuestionsVariant;
};

export function AiResponseFollowUpQuestions({
  className,
  onQuestionSelect,
  questions,
  variant = "default",
}: AiResponseFollowUpQuestionsProps) {
  if (questions.length === 0) {
    return null;
  }

  if (variant === "chips") {
    return (
      <section className={className}>
        <ol className="flex flex-col gap-2">
          {questions.map((question, index) => (
            <li key={`${question}-${index}`}>
              <button
                type="button"
                onClick={() => onQuestionSelect?.(question)}
                className="flex w-full max-w-full items-center gap-3 rounded-[8px] bg-[#ecf1f9] px-3 py-2 text-left transition-colors hover:bg-[#e3ebf7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.22)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                <span className="min-w-0 flex-1 truncate text-[16px] leading-[1.3] text-[#064aa7]">
                  {question}
                </span>
                <AiChevronIcon
                  direction="right"
                  className="h-4 w-4 shrink-0 text-[#161b1d]"
                />
              </button>
            </li>
          ))}
        </ol>
      </section>
    );
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
