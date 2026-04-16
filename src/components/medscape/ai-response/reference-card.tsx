"use client";

import type { AiAnswerReference } from "@/data/ai-response";

type AiResponseReferenceCardProps = {
  className?: string;
  reference: AiAnswerReference;
  variant?: "compact" | "full";
};

function AiExternalLinkIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden="true"
      className="h-3 w-3"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.2"
    >
      <path d="M4.25 2.25H9.75V7.75" />
      <path d="M9.25 2.75L5 7" />
      <path d="M7.25 5.25V9.75H2.25V4.75H6.75" />
    </svg>
  );
}

export function AiResponseReferenceCard({
  className,
  reference,
  variant = "full",
}: AiResponseReferenceCardProps) {
  const isCompact = variant === "compact";

  return (
    <article
      className={[
        "flex gap-3",
        isCompact ? "items-start" : "items-start py-2",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ecf1f9] text-[13px] leading-none font-semibold text-[#161b1d]">
        {reference.id}
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={[
            "text-[#064aa7]",
            isCompact ? "text-[16px] leading-[1.3]" : "text-[18px] leading-[1.35]",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {reference.title}
        </p>

        <p className="mt-1 text-[16px] leading-[1.2] font-bold text-[#161b1d]">
          {reference.source}
        </p>

        {isCompact ? (
          <div className="mt-1.5 flex flex-wrap items-center gap-x-5 gap-y-1 text-[14px] leading-[1.2] text-[#064aa7]">
            <button
              type="button"
              className="cursor-pointer rounded-sm transition hover:text-[#043b84] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.22)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              View full reference
            </button>

            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-1 rounded-sm transition hover:text-[#043b84] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.22)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <span>View source</span>
              <AiExternalLinkIcon />
            </button>
          </div>
        ) : (
          <>
            {reference.publishedAt ? (
              <p className="mt-1 text-[16px] leading-[1.2] text-[#161b1d]">
                {reference.publishedAt}
              </p>
            ) : null}

            <p className="mt-1 text-[16px] leading-[1.3] text-[#161b1d]">{reference.detail}</p>

            {reference.doi ? (
              <p className="mt-1 text-[12px] leading-[1.5] text-[#435056]">{reference.doi}</p>
            ) : null}

            {reference.tags?.length ? (
              <div className="mt-2 flex flex-wrap gap-1">
                {reference.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#d6f5eb] px-2 py-[3px] text-[13px] leading-[1.2] text-[#0f573f]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </>
        )}
      </div>
    </article>
  );
}
