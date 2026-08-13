"use client";

import { useEffect, useRef } from "react";
import { DrugMonographAccordion } from "@/components/medscape/drug-concepts/monograph-accordion";
import { getSubfieldById, type DrugMonograph } from "@/data/drug-monograph";

// ─── DrugMonographCardFrame ─────────────────────────────────────────────────────
// Card chrome around a DrugMonographAccordion: drug header + the accordion
// (which renders the boxed warning eagerly and pins it above all sections).
// Used by the S4 comparison columns, the S5 stacked source cards, the S6
// collapsed supporting card, and the S9 persistent card.

export function DrugMonographCardFrame({
  anchor,
  boxedWarningVariant,
  expandSubfields = false,
  flashAnchor = false,
  flat = false,
  hideMatchBadges = false,
  hideSectionSummary = false,
  hideSubfieldSummary = false,
  highlight = false,
  monograph,
  onOpenMonograph,
  promoteSelectedSection = false,
  sourceStatement = "Verbatim from Medscape Drug Reference — no AI synthesis",
  tabStyle,
}: {
  /** Subfield id to auto-expand two levels deep. Omit for a collapsed card. */
  anchor?: string;
  /** Color treatment for the boxed warning — "critical" (default) or "navy". */
  boxedWarningVariant?: "critical" | "navy";
  /** Show every subfield body in full inside an open section (no sub-accordion). */
  expandSubfields?: boolean;
  /** Plays a brief navigation flash on the anchored subfield row (V2
   * exact-answer anchoring). Defaults off — existing prototypes unchanged. */
  flashAnchor?: boolean;
  /** When true (Concept J / Figma match): section rows drop their icon and
   * subfield-count badge, and subfield rows drop their bullet, card border,
   * and trailing citation line. */
  flat?: boolean;
  /** Hide the "Matched"/"Answer" badges. */
  hideMatchBadges?: boolean;
  /** Hide the summary preview on collapsed section rows. */
  hideSectionSummary?: boolean;
  /** Hide the summary preview on collapsed subfield rows — title only. */
  hideSubfieldSummary?: boolean;
  /** Plays a brief highlight sweep — S9 "card updated in place". */
  highlight?: boolean;
  monograph: DrugMonograph;
  onOpenMonograph?: (subfieldId: string) => void;
  /** Float the selected section to the top of the list so it sits under the
   * sticky tab bar with no long scroll (V2). Defaults off. */
  promoteSelectedSection?: boolean;
  /** Provenance copy beneath the monograph title. */
  sourceStatement?: string;
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
      <p className="mb-3 flex items-center gap-1.5 text-[13px] font-medium text-[#5a6e7e]">
        <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5 shrink-0">
          <circle cx="8" cy="8" r="6.4" stroke="currentColor" strokeWidth="1.3" fill="none" />
          <path d="M8 7.3v3.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="8" cy="5.1" r="0.85" fill="currentColor" />
        </svg>
        {sourceStatement}
      </p>
      <DrugMonographAccordion
        key={anchor ?? "collapsed"}
        boxedWarningVariant={boxedWarningVariant}
        expandSubfields={expandSubfields}
        flashAnchor={flashAnchor}
        flat={flat}
        hideMatchBadges={hideMatchBadges}
        hideSectionSummary={hideSectionSummary}
        hideSubfieldSummary={hideSubfieldSummary}
        matchedSubfieldId={anchor}
        monograph={monograph}
        onOpenMonograph={onOpenMonograph}
        promoteSelectedSection={promoteSelectedSection}
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

// ─── DrugComparisonTopicTable ───────────────────────────────────────────────────
// V2 topic-row comparison: canonical monograph slices for two drugs placed side
// by side per clinical topic (dosing, renal adjustment, contraindications…).
// Desktop renders a table with sticky drug headers; mobile shows one topic at a
// time with a sticky topic selector and Previous/Next controls. Every cell shows
// the full canonical content of its anchored monograph subsection plus a source
// link. No winner, no synthesis.

export type ComparisonTopicCellSpec = {
  /** Monograph subfield anchor whose complete body is shown. */
  anchor: string;
  /** Set when the fixture lacks the field — renders "Not stated in this monograph". */
  notStated?: boolean;
  /** Optional deterministic patient-context applicability note. */
  patientNote?: string;
};

export type ComparisonTopicRowSpec = {
  cells: { left: ComparisonTopicCellSpec; right: ComparisonTopicCellSpec };
  id: string;
  title: string;
};

type ResolvedCell = {
  body: string[];
  notStated: boolean;
  patientNote?: string;
  /** Last path segment of the source section, e.g. "Renal Impairment". */
  sourceLabel: string;
  anchor: string;
};

// "Dosing > Renal Impairment" → "Renal Impairment"; the link shows only the
// section title, not the full breadcrumb path.
function lastPathSegment(section: string): string {
  const parts = section.split(">");
  return (parts[parts.length - 1] ?? section).trim();
}

function resolveCell(monograph: DrugMonograph, spec: ComparisonTopicCellSpec): ResolvedCell {
  const subfield = getSubfieldById(monograph, spec.anchor);
  if (!subfield || spec.notStated) {
    return {
      anchor: spec.anchor,
      body: [],
      notStated: true,
      patientNote: spec.patientNote,
      sourceLabel: "",
    };
  }
  return {
    anchor: spec.anchor,
    body: subfield.body,
    notStated: false,
    patientNote: spec.patientNote,
    sourceLabel: lastPathSegment(subfield.source.section),
  };
}

function TopicCellContent({
  cell,
  onSourceClick,
}: {
  cell: ResolvedCell;
  /** Source-link action — jumps to that section in the monograph at the bottom. */
  onSourceClick?: () => void;
}) {
  if (cell.notStated) {
    return (
      <p className="text-[12.5px] italic leading-[1.55] text-[#8497a9]">
        Not stated in this monograph
      </p>
    );
  }
  return (
    <div className="min-w-0">
      <ul className="space-y-1.5">
        {cell.body.map((line, i) => (
          <li
            key={i}
            className="text-[12.5px] leading-[1.55] text-[#33424f] [font-variant-numeric:tabular-nums]"
          >
            {line}
          </li>
        ))}
      </ul>
      {cell.patientNote ? (
        <p className="mt-2 rounded-[8px] bg-[rgba(6,74,167,0.05)] px-2.5 py-1.5 text-[11.5px] font-medium leading-[1.5] text-[#2e4763]">
          {cell.patientNote}
        </p>
      ) : null}
      <button
        type="button"
        onClick={onSourceClick}
        style={{ touchAction: "manipulation" }}
        title={cell.sourceLabel}
        className="mt-2 inline-flex max-w-full items-center gap-1 rounded-full text-[11px] font-semibold text-[var(--mscp-color-brand-primary)] transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6">
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
        <span className="min-w-0 truncate whitespace-nowrap">
          {cell.sourceLabel}
        </span>
      </button>
    </div>
  );
}

type DrugComparisonTopicTableProps = {
  /** Controlled active topic (peer-context chips move this). */
  activeTopicId?: string;
  left: DrugMonograph;
  onOpenSource?: (drugId: string, anchor: string) => void;
  onTopicChange?: (topicId: string) => void;
  right: DrugMonograph;
  topics: ComparisonTopicRowSpec[];
};

export function DrugComparisonTopicTable({
  activeTopicId,
  left,
  onOpenSource,
  onTopicChange,
  right,
  topics,
}: DrugComparisonTopicTableProps) {
  const rowRefs = useRef(new Map<string, HTMLDivElement>());
  const activeTopic = topics.find((t) => t.id === activeTopicId) ?? topics[0];
  const activeIndex = topics.findIndex((t) => t.id === activeTopic?.id);

  // Cell source link → jump to that section in the monograph at the bottom.
  const handleSourceClick = (topicId: string, drugId: string, anchor: string) => {
    onTopicChange?.(topicId);
    onOpenSource?.(drugId, anchor);
  };

  // Peer-context selection: scroll the (desktop) row into view.
  useEffect(() => {
    if (!activeTopicId) return;
    const node = rowRefs.current.get(activeTopicId);
    node?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeTopicId]);

  if (!activeTopic) return null;

  return (
    <div id="drug-comparison" className="dc-rise scroll-mt-4">
      {/* ── Desktop: topic-row table with sticky drug headers ── */}
      <div className="hidden overflow-hidden rounded-[14px] border border-[#dce6f0] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.05)] md:block">
        <div className="sticky top-0 z-10 grid grid-cols-[170px_minmax(0,1fr)_minmax(0,1fr)] border-b border-[#e4ebf3] bg-[#f8fafc]">
          <p className="px-4 py-2.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#8497a9]">
            Topic
          </p>
          {[left, right].map((m) => (
            <p key={m.drug.id} className="min-w-0 px-4 py-2.5 text-[13px] font-extrabold text-[#161b1d]">
              {m.drug.name}
              <span className="ml-1.5 text-[11px] font-medium text-[#7a8da0]">
                {m.drug.drugClass}
              </span>
            </p>
          ))}
        </div>

        {topics.map((topic) => {
          const isActive = topic.id === activeTopic.id;
          const cellLeft = resolveCell(left, topic.cells.left);
          const cellRight = resolveCell(right, topic.cells.right);
          return (
            <div
              key={topic.id}
              ref={(node) => {
                if (node) rowRefs.current.set(topic.id, node);
                else rowRefs.current.delete(topic.id);
              }}
              className={`grid scroll-mt-14 grid-cols-[170px_minmax(0,1fr)_minmax(0,1fr)] border-b border-[#eef3f8] last:border-b-0 ${
                isActive ? "bg-[rgba(6,74,167,0.035)]" : "bg-white"
              }`}
            >
              <div className="px-4 py-3.5">
                <p
                  className={`text-[12.5px] font-bold leading-snug ${
                    isActive ? "text-[var(--mscp-color-brand-primary)]" : "text-[#22303c]"
                  }`}
                >
                  {topic.title}
                </p>
              </div>
              <div className="min-w-0 border-l border-[#eef3f8] px-4 py-3.5">
                <TopicCellContent
                  cell={cellLeft}
                  onSourceClick={() => handleSourceClick(topic.id, left.drug.id, cellLeft.anchor)}
                />
              </div>
              <div className="min-w-0 border-l border-[#eef3f8] px-4 py-3.5">
                <TopicCellContent
                  cell={cellRight}
                  onSourceClick={() => handleSourceClick(topic.id, right.drug.id, cellRight.anchor)}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Mobile: one topic at a time, drugs stacked vertically ── */}
      <div className="rounded-[14px] border border-[#dce6f0] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.05)] md:hidden">
        <div className="sticky top-0 z-10 rounded-t-[14px] border-b border-[#e4ebf3] bg-[#f8fafc] px-3 pb-2 pt-2.5">
          <div
            className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Comparison topic"
          >
            {topics.map((topic) => {
              const isActive = topic.id === activeTopic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onTopicChange?.(topic.id)}
                  style={{ touchAction: "manipulation" }}
                  className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-[12px] font-semibold leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] ${
                    isActive
                      ? "border-[var(--mscp-color-brand-primary)] bg-[#e6eefb] text-[var(--mscp-color-brand-primary)]"
                      : "border-[#dbe4ee] bg-white text-[#3a4f6b]"
                  }`}
                >
                  {topic.title}
                </button>
              );
            })}
          </div>
        </div>

        <div aria-live="polite" className="space-y-4 px-3.5 py-3.5">
          {[
            { cell: resolveCell(left, activeTopic.cells.left), monograph: left },
            { cell: resolveCell(right, activeTopic.cells.right), monograph: right },
          ].map(({ cell, monograph }) => (
            <section key={monograph.drug.id} aria-label={`${monograph.drug.name} — ${activeTopic.title}`}>
              <h4 className="sticky top-[46px] z-[5] -mx-1 mb-1.5 bg-white/95 px-1 py-1 text-[13px] font-extrabold text-[#161b1d] backdrop-blur-sm">
                {monograph.drug.name}
              </h4>
              <TopicCellContent
                cell={cell}
                onSourceClick={() =>
                  handleSourceClick(activeTopic.id, monograph.drug.id, cell.anchor)
                }
              />
            </section>
          ))}

          <div className="flex items-center justify-between border-t border-[#eef3f8] pt-2.5">
            <button
              type="button"
              disabled={activeIndex <= 0}
              onClick={() => onTopicChange?.(topics[activeIndex - 1]!.id)}
              style={{ touchAction: "manipulation" }}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[12px] font-semibold text-[var(--mscp-color-brand-primary)] transition hover:bg-[#f2f7fe] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] disabled:text-[#9aa9b8]"
            >
              ← Previous
            </button>
            <span className="text-[11px] font-semibold tabular-nums text-[#8497a9]">
              {activeIndex + 1} of {topics.length}
            </span>
            <button
              type="button"
              disabled={activeIndex >= topics.length - 1}
              onClick={() => onTopicChange?.(topics[activeIndex + 1]!.id)}
              style={{ touchAction: "manipulation" }}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[12px] font-semibold text-[var(--mscp-color-brand-primary)] transition hover:bg-[#f2f7fe] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] disabled:text-[#9aa9b8]"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
