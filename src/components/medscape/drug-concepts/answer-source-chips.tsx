"use client";

import { useState } from "react";
import { AiResponseReferenceCard } from "@/components/medscape/ai-response/reference-card";
import type { AiAnswerReference } from "@/data/ai-response";

// ─── DrugAnswerSourceChips ──────────────────────────────────────────────────────
// Pill row shown directly under the question (Concept J): a "References N" chip
// that toggles the inline reference list, plus a "Sources" chip that scrolls to
// the canonical monograph card. Reuses AiResponseReferenceCard for the list.

function ReferencesIcon() {
  return (
    <svg viewBox="0 0 14 14" aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2.5h6.5A1.5 1.5 0 0 1 11 4v7.5H4.5A1.5 1.5 0 0 1 3 10V2.5Z" />
      <path d="M3 10.5A1.5 1.5 0 0 1 4.5 9H11" />
    </svg>
  );
}

function SourcesIcon() {
  return (
    <svg viewBox="0 0 14 14" aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 1.5 12.5 4 7 6.5 1.5 4 7 1.5Z" />
      <path d="m1.5 7 5.5 2.5L12.5 7M1.5 10 7 12.5 12.5 10" />
    </svg>
  );
}

export function DrugAnswerSourceChips({
  className,
  onJumpToSources,
  references,
}: {
  className?: string;
  /** Called by the "Sources" chip — scrolls to the canonical monograph card. */
  onJumpToSources?: () => void;
  references: AiAnswerReference[];
}) {
  const [open, setOpen] = useState(false);
  const count = references.length;

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          style={{ touchAction: "manipulation" }}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#e3eaf2] bg-[#f4f7fb] px-3 py-1 text-[12px] font-semibold text-[#3a4f6b] transition hover:bg-[#eaf1f9] hover:text-[var(--mscp-color-brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.22)] focus-visible:ring-offset-1"
        >
          <ReferencesIcon />
          References
          <span className="rounded-full bg-white px-1.5 py-px text-[10.5px] font-bold tabular-nums text-[#7d8ea0]">
            {count}
          </span>
        </button>
        <button
          type="button"
          onClick={onJumpToSources}
          style={{ touchAction: "manipulation" }}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#e3eaf2] bg-[#f4f7fb] px-3 py-1 text-[12px] font-semibold text-[#3a4f6b] transition hover:bg-[#eaf1f9] hover:text-[var(--mscp-color-brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.22)] focus-visible:ring-offset-1"
        >
          <SourcesIcon />
          Sources
        </button>
      </div>

      <div className="dc-collapse" data-open={open}>
        <div className="dc-collapse-inner">
          <div className="mt-3 space-y-3">
            {references.length === 0 ? (
              <p className="text-[13px] text-[#8499af]">No references for this answer.</p>
            ) : (
              references.map((ref) => (
                <AiResponseReferenceCard key={ref.id} reference={ref} variant="compact" />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
