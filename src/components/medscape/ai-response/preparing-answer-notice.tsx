/* eslint-disable @next/next/no-img-element */
"use client";

import { aiResponseAssets } from "@/data/ai-response";

type AiPreparingAnswerNoticeProps = {
  question: string;
};

export function AiPreparingAnswerNotice({ question }: AiPreparingAnswerNoticeProps) {
  const preview = question.length > 84 ? `${question.slice(0, 84)}...` : question;

  return (
    <div className="mb-6 inline-flex max-w-full items-center gap-2 text-[14px] leading-[1.35] text-[#4b5a67] md:text-[15px]">
      <span className="inline-flex h-5 w-5 items-center justify-center">
        <img
          src={aiResponseAssets.logoAssets.promptAnimation}
          alt=""
          aria-hidden="true"
          className="h-[18px] w-[18px] object-contain"
        />
      </span>
      <p className="min-w-0 truncate">Assessing evidence and outcomes related to {preview}</p>
    </div>
  );
}
