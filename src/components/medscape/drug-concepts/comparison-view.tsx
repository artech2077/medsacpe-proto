"use client";

import { DrugMonographAccordion } from "@/components/medscape/drug-concepts/monograph-accordion";
import type { DrugMonograph } from "@/data/drug-monograph";

// ─── DrugMonographCardFrame ─────────────────────────────────────────────────────
// Card chrome around a DrugMonographAccordion: drug header + the accordion
// (which renders the boxed warning eagerly and pins it above all sections).
// Used by the S4 comparison columns, the S5 stacked source cards, the S6
// collapsed supporting card, and the S9 persistent card.

export function DrugMonographCardFrame({
  anchor,
  boxedWarningVariant,
  expandSubfields = false,
  flat = false,
  hideMatchBadges = false,
  hideSectionSummary = false,
  highlight = false,
  monograph,
  onOpenMonograph,
  tabStyle,
}: {
  /** Subfield id to auto-expand two levels deep. Omit for a collapsed card. */
  anchor?: string;
  /** Color treatment for the boxed warning — "critical" (default) or "navy". */
  boxedWarningVariant?: "critical" | "navy";
  /** Show every subfield body in full inside an open section (no sub-accordion). */
  expandSubfields?: boolean;
  /** When true (Concept J / Figma match): section rows drop their icon and
   * subfield-count badge, and subfield rows drop their bullet, card border,
   * and trailing citation line. */
  flat?: boolean;
  /** Hide the "Matched"/"Answer" badges. */
  hideMatchBadges?: boolean;
  /** Hide the summary preview on collapsed section rows. */
  hideSectionSummary?: boolean;
  /** Plays a brief highlight sweep — S9 "card updated in place". */
  highlight?: boolean;
  monograph: DrugMonograph;
  onOpenMonograph?: (subfieldId: string) => void;
  /** Sticky jump-bar style — "pill" (default) or "underline" (Concept J / Figma match). */
  tabStyle?: "pill" | "underline";
}) {
  return (
    <section
      // Re-runs the one-shot flash whenever the anchor changes (S9 in-place update).
      key={highlight ? (anchor ?? "flash") : undefined}
      aria-label={`${monograph.drug.name} drug information`}
      className={`min-w-0 ${
        // Flat (Concept J / Figma match): no card chrome at all — content sits
        // flush with the question above it, not inset in a bordered box.
        flat
          ? ""
          : "rounded-[14px] border border-[#e2eaf2] bg-white p-3.5 shadow-[0_1px_3px_rgba(16,24,40,0.05)] md:p-4"
      } ${highlight ? "dc-card-flash" : ""}`}
    >
      <header className="mb-2 flex items-baseline gap-2">
        <h3
          className={
            flat
              ? "text-[24px] font-extrabold tracking-[-0.01em] text-[#161b1d]"
              : "text-[16px] font-extrabold tracking-[-0.01em] text-[#161b1d]"
          }
        >
          {monograph.drug.name}
        </h3>
        <p
          className={`min-w-0 truncate font-medium ${
            flat ? "text-[14px] text-[#006aff]" : "text-[11.5px] text-[#7a8da0]"
          }`}
        >
          {monograph.drug.drugClass}
        </p>
      </header>
      <DrugMonographAccordion
        key={anchor ?? "collapsed"}
        boxedWarningVariant={boxedWarningVariant}
        expandSubfields={expandSubfields}
        flat={flat}
        hideMatchBadges={hideMatchBadges}
        hideSectionSummary={hideSectionSummary}
        matchedSubfieldId={anchor}
        monograph={monograph}
        onOpenMonograph={onOpenMonograph}
        tabStyle={tabStyle}
      />
    </section>
  );
}

// ─── DrugComparisonView ─────────────────────────────────────────────────────────
// S4 dual/triple canonical view: 2–3 monograph cards as side-by-side columns on
// desktop and a swipeable snap stack on mobile, each opened to the same section.
// Optional one-line synthesis above. BBW stays eager inside every column via the
// accordion.

export type DrugComparisonItem = {
  anchor?: string;
  monograph: DrugMonograph;
};

type DrugComparisonViewProps = {
  items: DrugComparisonItem[];
  onOpenMonograph?: (drugId: string, subfieldId: string) => void;
  /** Optional one-line AI synthesis above the columns. */
  synthesis?: string;
};

export function DrugComparisonView({
  items,
  onOpenMonograph,
  synthesis,
}: DrugComparisonViewProps) {
  const shown = items.slice(0, 3);

  return (
    <div className="dc-rise">
      {synthesis ? (
        <p className="mb-3 flex items-start gap-2 rounded-[10px] bg-[rgba(6,74,167,0.05)] px-3 py-2.5 text-[13px] leading-[1.55] text-[#2e3d4a]">
          <span className="mt-0.5 inline-flex shrink-0 items-center rounded-full bg-white px-1.5 py-px text-[9px] font-bold uppercase tracking-[0.08em] text-[var(--mscp-color-brand-primary)]">
            AI
          </span>
          {synthesis}
        </p>
      ) : null}

      {/* Mobile: swipeable snap stack · Desktop: equal columns */}
      <div
        className={`flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] md:grid md:snap-none md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden ${
          shown.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"
        }`}
      >
        {shown.map((item) => (
          <div
            key={item.monograph.drug.id}
            className="w-[86%] shrink-0 snap-center md:w-auto md:shrink"
          >
            <DrugMonographCardFrame
              anchor={item.anchor}
              monograph={item.monograph}
              onOpenMonograph={
                onOpenMonograph
                  ? (subfieldId) => onOpenMonograph(item.monograph.drug.id, subfieldId)
                  : undefined
              }
            />
          </div>
        ))}
      </div>

      <p className="mt-2 text-[11px] text-[#9aa9b8] md:hidden">
        Swipe to compare {shown.map((i) => i.monograph.drug.name).join(" · ")}
      </p>
    </div>
  );
}
