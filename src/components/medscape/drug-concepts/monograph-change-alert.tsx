"use client";

import { useId, useState } from "react";
import type { MonographChangeSection } from "@/data/drug-intelligence-scenarios";
import type { DrugMonographUpdate, DrugMonographUpdateSection, DrugUpdatePresentation } from "@/data/drug-monograph-updates";

// ─── DrugMonographChangeAlert ───────────────────────────────────────────────────
// V2 returning-user change alert: a banner stating the monograph changed since
// the last view, expanding into section titles and their deterministic
// old-versus-current changes. Added text is highlighted as added, removed text
// as removed; each change links to the exact updated row in the monograph.

type DrugMonographChangeAlertProps = {
  badge: string;
  changedSectionsLabel: string;
  drugName: string;
  lastViewedDate?: string;
  updatedDate?: string;
  /** Plain-language introduction visible even when details are collapsed. */
  summary?: string;
  presentation?: DrugUpdatePresentation;
  clinicalTakeaway?: string;
  editorial?: DrugMonographUpdate["editorial"];
  onDismiss?: () => void;
  /** Jump to the exact updated row in the canonical card/canvas. */
  onOpenSection?: (anchor: string) => void;
  sections: readonly (MonographChangeSection | DrugMonographUpdateSection)[];
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
  updatedDate,
  summary,
  presentation = "summary",
  clinicalTakeaway,
  editorial,
  onDismiss,
  onOpenSection,
  sections,
}: DrugMonographChangeAlertProps) {
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const detailsId = useId();

  if (dismissed) return null;

  return (
    <section
      aria-label={`${drugName} monograph updates`}
      className="dc-rise overflow-hidden rounded-[var(--radius-md)] border border-[var(--mscp-color-border-primary)] bg-white"
    >
      {/* Banner */}
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 bg-[var(--mscp-color-bg-section)] px-[var(--space-4)] py-[var(--space-3)]">
        <span aria-hidden="true" className="text-[var(--mscp-color-brand-primary)]">
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 2.2a4.2 4.2 0 0 0-4.2 4.2c0 3-1.3 4-1.3 4h11s-1.3-1-1.3-4A4.2 4.2 0 0 0 8 2.2ZM6.6 12.9a1.5 1.5 0 0 0 2.8 0" />
          </svg>
        </span>
        <p className="text-[13px] font-bold text-[var(--mscp-color-brand-primary)]">{badge}</p>
        <span className="rounded-full bg-white px-2 py-0.5 text-[10.5px] font-bold text-[#3a4f6b]">
          {changedSectionsLabel}
        </span>
        {updatedDate || lastViewedDate ? (
          <span className="text-[11.5px] font-medium text-[var(--text-secondary)]">
            {updatedDate ?? `Last viewed ${lastViewedDate}`}
          </span>
        ) : null}
        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls={detailsId}
            style={{ touchAction: "manipulation" }}
            className="rounded-full bg-[var(--mscp-color-brand-primary)] px-3 py-1.5 text-[12px] font-bold text-white transition hover:bg-[#053b85] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] focus-visible:ring-offset-2"
          >
            {expanded ? "Hide details" : presentation === "takeaway" ? "What changed in the label" : "See what changed"}
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

      {presentation === "takeaway" && clinicalTakeaway ? (
        <div className="bg-[var(--mscp-color-bg-section)] px-[var(--space-4)] pb-[var(--space-4)]">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--mscp-color-brand-primary)]">Clinical takeaway</h2>
          <p className="text-base font-bold leading-relaxed text-[var(--mscp-color-text-primary)]">{clinicalTakeaway}</p>
        </div>
      ) : presentation !== "editorial" && summary ? (
        <p className="bg-[var(--mscp-color-bg-section)] px-[var(--space-4)] pb-[var(--space-4)] text-sm leading-relaxed text-[var(--mscp-color-text-body)]">
          {summary}
        </p>
      ) : null}

      {presentation === "editorial" && editorial ? (
        <h2 className="bg-[var(--mscp-color-bg-section)] px-[var(--space-4)] pb-[var(--space-4)] text-[14px] font-bold leading-snug text-[var(--mscp-color-text-primary)]">
          {editorial.headline}
        </h2>
      ) : null}

      {/* Expanded change summary */}
      <div id={detailsId} className="dc-collapse" data-open={expanded} hidden={!expanded}>
        <div className="dc-collapse-inner">
          {presentation === "editorial" && editorial ? (
        <article className="space-y-[var(--space-4)] px-[var(--space-4)] py-[var(--space-5)] text-sm leading-relaxed text-[var(--mscp-color-text-body)]">
          <dl className="space-y-[var(--space-4)]">
            <div><dt className="font-bold">{editorial.audienceTitle}</dt><dd className="mt-1">{editorial.audience}</dd></div>
            <div><dt className="font-bold">{editorial.changeTitle}</dt><dd className="mt-1">{editorial.whatChanged}</dd></div>
            <div><dt className="font-bold">{editorial.clinicalRelevanceTitle}</dt><dd className="mt-1">{editorial.clinicalRelevance}</dd></div>
          </dl>
          <div className="border-t border-[var(--border-subtle)] pt-[var(--space-3)]">
            <h3 className="mb-2 font-bold">{editorial.sourcesTitle}</h3>
            <ul className="space-y-2">
              {sections.map((section) => "source" in section ? (
                <li key={section.source.url}>
                  <a href={section.source.url} target="_blank" rel="noopener noreferrer" className="rounded text-xs font-semibold text-[var(--mscp-color-brand-primary)] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]">
                    {section.source.label}<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ) : null)}
            </ul>
          </div>
        </article>
          ) : (
          <div className="border-t border-[#e8eef5] px-4 py-3.5">
            <div className="space-y-4">
              {sections.map((section) => (
                <article key={`${section.anchor}-${section.sectionTitle}`}>
                  <h4 className="text-[13px] font-bold text-[#22303c]">{section.sectionTitle}</h4>
                  {"whatChanged" in section ? (
                    <>
                      <dl className="mt-[var(--space-3)] space-y-[var(--space-3)] text-sm leading-relaxed text-[var(--mscp-color-text-body)]">
                        <div>
                          <dt className="font-bold text-[var(--mscp-color-text-primary)]">What changed</dt>
                          <dd className="mt-1">{section.whatChanged}</dd>
                        </div>
                        <div>
                          <dt className="font-bold text-[var(--mscp-color-text-primary)]">Why it matters</dt>
                          <dd className="mt-1">{section.whyItMatters}</dd>
                        </div>
                      </dl>
                      <a href={section.source.url} target="_blank" rel="noopener noreferrer" className="mt-[var(--space-3)] inline-block rounded text-xs font-semibold text-[var(--mscp-color-brand-primary)] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]">
                        {section.source.label}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </>
                  ) : (
                    <ul className="mt-2 space-y-1 rounded-[10px] border border-[#e8eef5] bg-[#fafcfe] p-1.5">
                      {section.diff.map((line, i) => (
                        <DiffLine key={i} kind={line.kind} text={line.text} />
                      ))}
                    </ul>
                  )}
                  {onOpenSection ? <button
                    type="button"
                    onClick={() => onOpenSection?.(section.anchor)}
                    style={{ touchAction: "manipulation" }}
                    className="mt-2 flex w-fit items-center gap-1 rounded-full text-[12px] font-semibold text-[var(--mscp-color-brand-primary)] transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
                  >
                    {"whatChanged" in section ? "View updated section in the monograph" : "Open the updated row in the monograph"}
                    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3 w-3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </button> : null}
                </article>
              ))}
            </div>
          </div>
          )}
        </div>
      </div>
    </section>
  );
}
