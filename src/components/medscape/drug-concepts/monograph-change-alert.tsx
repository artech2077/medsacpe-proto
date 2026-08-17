"use client";

import { useState } from "react";
import type { MonographChangeSection } from "@/data/drug-intelligence-scenarios";

// ─── DrugMonographChangeAlert ───────────────────────────────────────────────────
// V2 returning-user change alert: a banner stating the monograph changed since
// the last view, expanding into section titles and their deterministic
// old-versus-current changes. Added text is highlighted as added, removed text
// as removed; each change links to the exact updated row in the monograph.

type DrugMonographChangeAlertProps = {
  badge: string;
  changedSectionsLabel: string;
  drugName: string;
  lastViewedDate: string;
  onDismiss?: () => void;
  /** Jump to the exact updated row in the canonical card/canvas. */
  onOpenSection?: (anchor: string) => void;
  sections: readonly MonographChangeSection[];
};

function DiffLine({ kind, text }: { kind: "added" | "removed"; text: string }) {
  if (kind === "added") {
    return (
      <li className="flex items-start gap-2 rounded-[8px] bg-[#e2f5ea] px-2.5 py-1.5">
        <span className="mt-0.5 shrink-0 rounded-full bg-white px-1.5 py-px text-[9px] font-bold uppercase tracking-[0.06em] text-[#067647]">
          Added
        </span>
        <span className="text-[12.5px] leading-[1.55] text-[#14532d] [font-variant-numeric:tabular-nums]">
          {text}
        </span>
      </li>
    );
  }
  return (
    <li className="flex items-start gap-2 rounded-[8px] bg-[#fde7e5] px-2.5 py-1.5">
      <span className="mt-0.5 shrink-0 rounded-full bg-white px-1.5 py-px text-[9px] font-bold uppercase tracking-[0.06em] text-[#b42318]">
        Removed
      </span>
      <span className="text-[12.5px] leading-[1.55] text-[#7a271a] line-through decoration-[#b42318]/50 [font-variant-numeric:tabular-nums]">
        {text}
      </span>
    </li>
  );
}

export function DrugMonographChangeAlert({
  badge,
  changedSectionsLabel,
  drugName,
  lastViewedDate,
  onDismiss,
  onOpenSection,
  sections,
}: DrugMonographChangeAlertProps) {
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <section
      aria-label={`${drugName} monograph updates`}
      className="dc-rise overflow-hidden rounded-[14px] border border-[rgba(6,74,167,0.28)] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.05)]"
    >
      {/* Banner */}
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 bg-[rgba(6,74,167,0.05)] px-4 py-3">
        <span aria-hidden="true" className="text-[var(--mscp-color-brand-primary)]">
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 2.2a4.2 4.2 0 0 0-4.2 4.2c0 3-1.3 4-1.3 4h11s-1.3-1-1.3-4A4.2 4.2 0 0 0 8 2.2ZM6.6 12.9a1.5 1.5 0 0 0 2.8 0" />
          </svg>
        </span>
        <p className="text-[13px] font-bold text-[var(--mscp-color-brand-primary)]">{badge}</p>
        <span className="rounded-full bg-white px-2 py-0.5 text-[10.5px] font-bold text-[#3a4f6b]">
          {changedSectionsLabel}
        </span>
        <span className="text-[11.5px] font-medium text-[#5a6e7e]">
          Last viewed {lastViewedDate}
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            style={{ touchAction: "manipulation" }}
            className="rounded-full bg-[var(--mscp-color-brand-primary)] px-3 py-1.5 text-[12px] font-bold text-white transition hover:bg-[#053b85] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] focus-visible:ring-offset-2"
          >
            {expanded ? "Hide changes" : "See what changed"}
          </button>
          <button
            type="button"
            onClick={() => {
              setDismissed(true);
              onDismiss?.();
            }}
            style={{ touchAction: "manipulation" }}
            className="rounded-full px-2.5 py-1.5 text-[12px] font-semibold text-[#5a6e7e] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
          >
            Dismiss
          </button>
        </div>
      </div>

      {/* Expanded change summary */}
      <div className="dc-collapse" data-open={expanded}>
        <div className="dc-collapse-inner">
          <div className="border-t border-[#e8eef5] px-4 py-3.5">
            <div className="space-y-4">
              {sections.map((section) => (
                <article key={section.anchor}>
                  <h4 className="text-[13px] font-bold text-[#22303c]">{section.sectionTitle}</h4>
                  <ul className="mt-2 space-y-1 rounded-[10px] border border-[#e8eef5] bg-[#fafcfe] p-1.5">
                    {section.diff.map((line, i) => (
                      <DiffLine key={i} kind={line.kind} text={line.text} />
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => onOpenSection?.(section.anchor)}
                    style={{ touchAction: "manipulation" }}
                    className="mt-1.5 inline-flex items-center gap-1 rounded-full px-1 text-[12px] font-semibold text-[var(--mscp-color-brand-primary)] transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
                  >
                    Open the updated row in the monograph
                    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3 w-3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </button>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
