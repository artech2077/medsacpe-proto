/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { AiChevronIcon } from "@/components/medscape/ai-response/answer-section-icons";
import { aiResponseAssets } from "@/data/ai-response";

export type AiResponseFollowUpQuestionsVariant = "default" | "chips" | "accordion-preview";

type AiResponseFollowUpQuestionsProps = {
  answerPreviews?: Record<string, string>;
  className?: string;
  defaultOpenQuestionIndex?: number;
  onQuestionSelect?: (question: string) => void;
  onReadMoreSelect?: (question: string) => void;
  questions: string[];
  readMoreLabel?: string;
  readMoreUrls?: Record<string, string>;
  variant?: AiResponseFollowUpQuestionsVariant;
};

function buildAccordionPreview(text: string) {
  if (text.length <= 115) {
    return text;
  }

  const preview = text.slice(0, 115);
  const lastSpaceIndex = preview.lastIndexOf(" ");

  return `${preview.slice(0, lastSpaceIndex > 72 ? lastSpaceIndex : preview.length).trimEnd()}...`;
}

export function AiResponseFollowUpQuestions({
  answerPreviews,
  className,
  defaultOpenQuestionIndex = 0,
  onQuestionSelect,
  onReadMoreSelect,
  questions,
  readMoreLabel = "Read more",
  readMoreUrls,
  variant = "default",
}: AiResponseFollowUpQuestionsProps) {
  const [openQuestionIndex, setOpenQuestionIndex] = useState(defaultOpenQuestionIndex);

  if (questions.length === 0) {
    return null;
  }

  if (variant === "accordion-preview") {
    return (
      <section className={className}>
        <ol className="flex flex-col gap-2">
          {questions.map((question, index) => {
            const isOpen = index === openQuestionIndex;
            const preview = buildAccordionPreview(
              answerPreviews?.[question] ??
                "Open Medscape AI to continue with this follow-up question.",
            );
            const readMoreUrl = readMoreUrls?.[question] ?? "#";

            return (
              <li
                key={`${question}-${index}`}
                className="rounded-[8px] bg-[#ecf1f9] transition-colors hover:bg-[#e3ebf7]"
              >
                <div className="px-3 py-2">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => {
                      setOpenQuestionIndex(isOpen ? -1 : index);
                      onQuestionSelect?.(question);
                    }}
                    className="flex w-full max-w-full items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.22)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#ecf1f9]"
                  >
                    <span className="min-w-0 flex-1 truncate text-[16px] leading-[1.3] text-[#064aa7]">
                      {question}
                    </span>
                    <AiChevronIcon
                      direction={isOpen ? "up" : "down"}
                      className="h-4 w-4 shrink-0 text-[#161b1d]"
                    />
                  </button>

                  {isOpen ? (
                    <div className="pt-2">
                      <p
                        className="overflow-hidden text-[14px] leading-[1.45] text-[#2c353a]"
                        style={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 3,
                        }}
                      >
                        {preview}{" "}
                        <a
                          href={readMoreUrl}
                          onClick={(event) => {
                            if (!onReadMoreSelect) {
                              return;
                            }

                            event.preventDefault();
                            onReadMoreSelect(question);
                          }}
                          className="font-semibold !text-[#064aa7] underline decoration-[#064aa7] decoration-1 underline-offset-2 transition visited:!text-[#064aa7] hover:!text-[#064aa7] hover:decoration-[#064aa7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.22)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#ecf1f9]"
                          style={{ color: "#064aa7" }}
                        >
                          {readMoreLabel}
                        </a>
                      </p>
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    );
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
