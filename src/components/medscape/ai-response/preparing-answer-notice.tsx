/* eslint-disable @next/next/no-img-element */
"use client";

import { aiResponseAssets } from "@/data/ai-response";

type AiPreparingAnswerNoticeProps = {
  className?: string;
  iconClassName?: string;
  question?: string;
  text?: string;
  textClassName?: string;
};

export function AiPreparingAnswerNotice({
  className = "mb-6 inline-flex max-w-full items-center gap-2 text-[14px] leading-[1.35] text-[#4b5a67] md:text-[15px]",
  iconClassName = "h-[18px] w-[18px]",
  question,
  text,
  textClassName = "min-w-0 truncate",
}: AiPreparingAnswerNoticeProps) {
  const preview =
    question && question.length > 84 ? `${question.slice(0, 84)}...` : question;
  const noticeText = text ?? `Assessing evidence and outcomes related to ${preview ?? ""}`;

  return (
    <div className={className}>
      <span className="inline-flex h-5 w-5 items-center justify-center">
        <img
          src={aiResponseAssets.logoAssets.promptAnimation}
          alt=""
          aria-hidden="true"
          className={`${iconClassName} object-contain`}
        />
      </span>
      <p className={textClassName}>{noticeText}</p>
    </div>
  );
}
