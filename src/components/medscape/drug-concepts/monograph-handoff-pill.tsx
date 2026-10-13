"use client";

import { useId } from "react";

// ─── DrugMonographHandoffPill ───────────────────────────────────────────────────
// Answer-first pivot (2026-09-22): the AI-generated answer is primary and the
// full canonical monograph becomes a secondary reference the user opens
// on demand. This caption + pill sits below the AI answer; clicking the pill
// reveals (or hides) the canonical DrugMonographCardFrame rendered beneath it.
// Optional alternatives render beside the pill as a separately labeled group
// with a neutral gray style so they never read as the answer's own drug.

export type DrugMonographHandoffAlternative = {
  id: string;
  /** Drug name shown inside the alternative chip, e.g. "Ozempic (semaglutide)". */
  label: string;
};

export function DrugMonographHandoffPill({
  alternatives,
  alternativesLabel = "Alternatives",
  className,
  drugName,
  isOpen,
  onAlternativeToggle,
  onToggle,
  openAlternativeId,
}: {
  alternatives?: readonly DrugMonographHandoffAlternative[];
  alternativesLabel?: string;
  className?: string;
  /** Drug name shown inside the pill, e.g. "Semaglutide". */
  drugName: string;
  isOpen: boolean;
  onAlternativeToggle?: (alternativeId: string) => void;
  onToggle: () => void;
  /** The alternative whose monograph is currently open, if any. */
  openAlternativeId?: string | null;
}) {
  const alternativesLabelId = useId();
  const hasAlternatives = Boolean(alternatives?.length);

  return (
    <div className={className}>
      <p className="mb-2 text-[13px] font-semibold leading-snug text-[#3c4d5b]">
        {isOpen ? "Full monograph from Medscape Drug Reference" : "View the monograph from Medscape Drug Reference"}
      </p>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2.5">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          style={{ touchAction: "manipulation" }}
          className="inline-flex items-center rounded-full border border-[rgba(6,74,167,0.32)] bg-white px-4 py-2 text-[14px] font-semibold leading-none text-[var(--mscp-color-brand-primary)] transition hover:bg-[#f2f7fe] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] focus-visible:ring-offset-1"
        >
          {drugName}
        </button>

        {hasAlternatives ? (
          // Label sits above the chips on phones (so a wrapped chip never loses
          // it) and inline after a divider from sm up.
          <div
            role="group"
            aria-labelledby={alternativesLabelId}
            className="flex w-full flex-col gap-1.5 sm:w-auto sm:flex-row sm:items-center sm:gap-2 sm:border-l sm:border-[#d5dde5] sm:pl-3"
          >
            <span
              id={alternativesLabelId}
              className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#4f6172]"
            >
              {alternativesLabel}
            </span>
            <div className="flex flex-wrap gap-2">
              {alternatives?.map((alternative) => {
                const open = openAlternativeId === alternative.id;
                return (
                  <button
                    key={alternative.id}
                    type="button"
                    onClick={() => onAlternativeToggle?.(alternative.id)}
                    aria-expanded={open}
                    aria-label={`Alternative: ${alternative.label} monograph`}
                    style={{ touchAction: "manipulation" }}
                    // Same height as the answer's pill; the ::before extends the tap
                    // area without overlapping the 8px gap's neighbors.
                    className={`relative inline-flex items-center whitespace-nowrap rounded-full border px-4 py-2 text-[14px] font-semibold leading-none transition-colors duration-150 before:absolute before:inset-x-0 before:-inset-y-1 before:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] focus-visible:ring-offset-1 ${
                      open
                        ? "border-[#4f6172] bg-[#e9eef3] text-[#22303c]"
                        : "border-[#7b8c9c] bg-[#f6f8fa] text-[#3c4d5b] hover:border-[#4f6172] hover:bg-[#eef2f6]"
                    }`}
                  >
                    {alternative.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
