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
  const titleClassName = [
    "min-w-0 max-w-full overflow-hidden !text-[#064aa7] [display:-webkit-box] [overflow-wrap:anywhere] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] transition visited:!text-[#064aa7] hover:!text-[#043b84] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.22)] focus-visible:ring-offset-2 focus-visible:ring-offset-white",
    isCompact ? "text-[16px] leading-[1.3]" : "text-[18px] leading-[1.35]",
  ]
    .filter(Boolean)
    .join(" ");
  const metaClassName =
    "mt-1 min-w-0 max-w-full break-words text-[13px] leading-[1.3] text-[#161b1d] [overflow-wrap:anywhere]";

  return (
    <article
      className={[
        "flex max-w-full gap-3 overflow-hidden",
        isCompact ? "items-start" : "items-start py-2",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ecf1f9] text-[13px] leading-none font-semibold text-[#5b6871]">
        {reference.id}
      </div>

      <div className="min-w-0 flex-1">
        {reference.url ? (
          <a
            href={reference.url}
            target="_blank"
            rel="noopener noreferrer"
            className={titleClassName}
          >
            {reference.title}
          </a>
        ) : (
          <p className={titleClassName}>
            {reference.title}
          </p>
        )}

        {isCompact ? (
          <>
            <p className={metaClassName}>
              <span className="font-bold">{reference.sourceLabel}</span>
              {" - "}
              {reference.publishedAt ? `${reference.publishedAt} - ` : ""}
              {reference.source}.
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-5 gap-y-1 text-[14px] leading-[1.2] text-[#064aa7]">
            <button
              type="button"
              className="cursor-pointer rounded-sm transition hover:text-[#043b84] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.22)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              View full reference
            </button>

            {reference.url ? (
              <a
                href={reference.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex cursor-pointer items-center gap-1 rounded-sm text-[#064aa7] transition hover:text-[#043b84] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.22)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                <span>View source</span>
                <AiExternalLinkIcon />
              </a>
            ) : null}
            </div>
          </>
        ) : (
          <p className={metaClassName}>
            <span className="font-bold">{reference.sourceLabel}</span>
            {" - "}
            {reference.publishedAt ? `${reference.publishedAt} - ` : ""}
            {reference.source}.
          </p>
        )}
      </div>
    </article>
  );
}
