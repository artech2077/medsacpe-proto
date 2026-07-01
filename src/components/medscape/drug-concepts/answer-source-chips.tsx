"use client";

import type { AiAnswerReference } from "@/data/ai-response";

// ─── DrugAnswerSourceChips ──────────────────────────────────────────────────────
// Single combined pill shown directly under the question (Concept J), matching
// the Figma "content available box" (node 1287:15260): a "References N" segment
// that scrolls to the References section in the footer, a divider, and a
// "Sources" segment that scrolls to the canonical monograph card.
//   pill bg   Color/Background/Container/Primary  #ecf1f9
//   text/icon Color/Brand/Primary (eyebrow)        #064aa7
//   count bg  white

function ReferencesIcon() {
  return (
    <svg viewBox="0 0 14 14" aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2.5h6.5A1.5 1.5 0 0 1 11 4v7.5H4.5A1.5 1.5 0 0 1 3 10V2.5Z" />
      <path d="M3 10.5A1.5 1.5 0 0 1 4.5 9H11" />
    </svg>
  );
}

export function DrugAnswerSourceChips({
  className,
  onJumpToReferences,
  onJumpToSources,
  references,
}: {
  className?: string;
  /** Called by the "References" segment — scrolls to the References section in the footer. */
  onJumpToReferences?: () => void;
  /** Called by the "Sources" segment — scrolls to the canonical monograph card. */
  onJumpToSources?: () => void;
  references: AiAnswerReference[];
}) {
  const count = references.length;

  return (
    <div className={className}>
      <div className="inline-flex items-center gap-2.5 rounded-[70px] bg-[#ecf1f9] px-3 py-1.5">
        <button
          type="button"
          onClick={onJumpToReferences}
          style={{ touchAction: "manipulation" }}
          className="inline-flex items-center gap-1.5 text-[14px] font-semibold leading-none text-[var(--mscp-color-brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] focus-visible:ring-offset-1"
        >
          <ReferencesIcon />
          References
          <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-white px-1 text-[14px] font-semibold leading-none text-[var(--mscp-color-brand-primary)]">
            {count}
          </span>
        </button>
        <span aria-hidden="true" className="h-[20px] w-px bg-[#c5ced3]" />
        <button
          type="button"
          onClick={onJumpToSources}
          style={{ touchAction: "manipulation" }}
          className="text-[14px] font-semibold leading-none text-[var(--mscp-color-brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] focus-visible:ring-offset-1"
        >
          Sources
        </button>
      </div>
    </div>
  );
}
