"use client";

// ─── DrugMonographHandoffPill ───────────────────────────────────────────────────
// Answer-first pivot (2026-09-22): the AI-generated answer is primary and the
// full canonical monograph becomes a secondary reference the user opens
// on demand. This caption + pill sits below the AI answer; clicking the pill
// reveals (or hides) the canonical DrugMonographCardFrame rendered beneath it.

export function DrugMonographHandoffPill({
  className,
  drugName,
  isOpen,
  onToggle,
}: {
  className?: string;
  /** Drug name shown inside the pill, e.g. "Semaglutide". */
  drugName: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={className}>
      <p className="mb-2 text-[13px] font-semibold leading-snug text-[#3c4d5b]">
        {isOpen ? "Full monograph from Medscape Drug Reference" : "View the monograph from Medscape Drug Reference"}
      </p>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{ touchAction: "manipulation" }}
        className="inline-flex items-center rounded-full border border-[rgba(6,74,167,0.32)] bg-white px-4 py-2 text-[14px] font-semibold leading-none text-[var(--mscp-color-brand-primary)] transition hover:bg-[#f2f7fe] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] focus-visible:ring-offset-1"
      >
        {drugName}
      </button>
    </div>
  );
}
