"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  ClinicalBoxedWarning,
  ClinicalChevron,
  ClinicalSourceLabel,
  ClinicalZoneIcon,
  getZoneAccent,
} from "@/components/medscape/drug-concepts/clinical-system";
import { AiResponseAnswerContent } from "@/components/medscape/ai-response/answer-content";
import {
  type DrugMonograph,
  type DrugSection,
  type DrugSubfield,
  getSectionBySubfieldId,
} from "@/data/drug-monograph";

// Short jump-bar labels per section id. Falls back to the full section title.
const SECTION_JUMP_LABEL: Record<string, string> = {
  adverse: "Adverse",
  dosing: "Dosing",
  interactions: "Interactions",
  renal_hepatic: "Renal",
  safety: "Safety",
};

// Subfields flagged as clinically critical. They get a "Critical" badge when
// their section is opened, but are not auto-expanded unless the query matches.
const CRITICAL_SUBFIELD_IDS = ["safety.contraindications"];

// Height reserved for the sticky jump bar so a jumped-to section clears it.
const JUMP_BAR_OFFSET = 56;

// Nearest vertically-scrollable ancestor. Native smooth scrolling no-ops on this
// nested chat scroller in some engines, so we animate the scroll ourselves.
function getScrollParent(node: HTMLElement | null): HTMLElement | null {
  let current = node?.parentElement ?? null;
  while (current) {
    const { overflowY } = getComputedStyle(current);
    if (
      (overflowY === "auto" || overflowY === "scroll") &&
      current.scrollHeight > current.clientHeight
    ) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}

// Self-contained smooth scroll so the jump works regardless of native
// scroll-behavior support; falls back to an instant jump under reduced motion.
function smoothScrollTo(scroller: HTMLElement, target: number) {
  const top = Math.max(target, 0);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    scroller.scrollTop = top;
    return;
  }
  const start = scroller.scrollTop;
  const distance = top - start;
  if (Math.abs(distance) < 1) return;
  const duration = 380;
  const startedAt = performance.now();
  const step = (now: number) => {
    const t = Math.min((now - startedAt) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
    scroller.scrollTop = start + distance * eased;
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ─── Subfield row (level 2 → verbatim body) ─────────────────────────────────────
function SubfieldRow({
  accentFg,
  isCritical,
  isMatched,
  onToggle,
  open,
  subfield,
}: {
  accentFg: string;
  isCritical: boolean;
  isMatched: boolean;
  onToggle: () => void;
  open: boolean;
  subfield: DrugSubfield;
}) {
  // Verbatim canonical body, rendered through the shared answer renderer so the
  // deep text matches existing AI-answer typography exactly.
  const answer = useMemo(() => subfield.body.join("\n"), [subfield.body]);

  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        style={{ touchAction: "manipulation" }}
        className="group/sf flex w-full items-start gap-2.5 rounded-[9px] px-2 py-2.5 text-left transition-colors hover:bg-[#f5f8fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
      >
        <span
          className="mt-[5px] h-2 w-2 shrink-0 rounded-full transition-colors"
          style={{ backgroundColor: open || isMatched ? accentFg : "#cdd8e4" }}
          aria-hidden="true"
        />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-1.5">
            <span
              className="text-[12.5px] font-semibold leading-snug"
              style={{ color: isMatched ? accentFg : "#1c2227" }}
            >
              {subfield.title}
            </span>
            {isMatched && (
              <span
                className="rounded-full px-1.5 py-px text-[8.5px] font-bold uppercase tracking-[0.05em] text-white"
                style={{ backgroundColor: accentFg }}
              >
                Answer
              </span>
            )}
            {isCritical && !isMatched && (
              <span className="rounded-full bg-[#fde7e5] px-1.5 py-px text-[8.5px] font-bold uppercase tracking-[0.05em] text-[#b42318]">
                Critical
              </span>
            )}
          </span>
          {!open && (
            <span className="mt-0.5 block text-[11.5px] leading-[1.45] text-[#647689] [font-variant-numeric:tabular-nums]">
              {subfield.summary}
            </span>
          )}
        </span>
        <ClinicalChevron className="mt-1 h-3.5 w-3.5" open={open} />
      </button>

      <div className="dc-collapse ml-2" data-open={open}>
        <div className="dc-collapse-inner">
          <div className="mb-1 mt-1 rounded-[9px] border border-[#e3ebf4] bg-white px-3 py-2.5">
            <AiResponseAnswerContent
              answer={answer}
              className="text-[13.5px] leading-[1.6] text-[#2e3d4a] [font-variant-numeric:tabular-nums]"
            />
            <div className="mt-2.5 border-t border-[#eef3f8] pt-2">
              <ClinicalSourceLabel source={subfield.source} />
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

// ─── Section row (level 1 → subfield rows) ──────────────────────────────────────
function SectionRow({
  expandedSubfields,
  index,
  isMatched,
  matchedSubfieldId,
  onOpenMonograph,
  onToggleSection,
  onToggleSubfield,
  open,
  registerRef,
  section,
}: {
  expandedSubfields: Set<string>;
  index: number;
  isMatched: boolean;
  matchedSubfieldId?: string;
  onOpenMonograph?: (subfieldId: string) => void;
  onToggleSection: () => void;
  onToggleSubfield: (subfieldId: string) => void;
  open: boolean;
  registerRef: (sectionId: string, node: HTMLDivElement | null) => void;
  section: DrugSection;
}) {
  const accent = getZoneAccent(section.id);
  const topSubfield = section.subfields[0];

  return (
    <div
      ref={(node) => registerRef(section.id, node)}
      className="dc-rise scroll-mt-[56px] overflow-hidden rounded-[12px] border bg-white transition-[box-shadow,border-color] duration-200"
      style={{
        animationDelay: `${index * 45}ms`,
        borderColor: isMatched ? accent.fg : "#e4ebf3",
        boxShadow: isMatched
          ? `0 0 0 1px ${accent.fg}, 0 4px 14px ${accent.tint}`
          : "0 1px 2px rgba(16,24,40,0.04)",
      }}
    >
      <button
        type="button"
        onClick={onToggleSection}
        aria-expanded={open}
        style={{ touchAction: "manipulation" }}
        className="flex w-full items-start gap-3 px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] focus-visible:ring-offset-1"
      >
        <span
          className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px]"
          style={{ backgroundColor: accent.soft, color: accent.fg }}
        >
          <ClinicalZoneIcon className="h-[18px] w-[18px]" sectionId={section.id} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-[13.5px] font-bold leading-snug text-[#1c2227]">
              {section.title}
            </span>
            <span className="shrink-0 rounded-full bg-[#eef2f7] px-1.5 py-0.5 text-[9.5px] font-bold tabular-nums text-[#7d8ea0]">
              {section.subfields.length}
            </span>
            {isMatched && (
              <span
                className="shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.06em]"
                style={{ backgroundColor: accent.tint, color: accent.fg }}
              >
                Matched
              </span>
            )}
          </span>
          {!open && topSubfield && (
            <span className="mt-0.5 line-clamp-2 block text-[12px] leading-[1.45] text-[#5a6e7e] [font-variant-numeric:tabular-nums]">
              {topSubfield.summary}
            </span>
          )}
        </span>
        <ClinicalChevron className="mt-1.5 h-4 w-4" open={open} />
      </button>

      <div className="dc-collapse" data-open={open}>
        <div className="dc-collapse-inner">
          <div className="border-t border-[#eef3f8] px-2 pb-2.5 pt-1.5">
            <ul className="space-y-0.5">
              {section.subfields.map((subfield) => (
                <SubfieldRow
                  key={subfield.id}
                  accentFg={accent.fg}
                  isCritical={CRITICAL_SUBFIELD_IDS.includes(subfield.id)}
                  isMatched={matchedSubfieldId === subfield.id}
                  onToggle={() => onToggleSubfield(subfield.id)}
                  open={expandedSubfields.has(subfield.id)}
                  subfield={subfield}
                />
              ))}
            </ul>

            {topSubfield && (
              <div className="mt-2 border-t border-[#eef3f8] pt-2">
                {onOpenMonograph ? (
                  <button
                    type="button"
                    onClick={() => onOpenMonograph(topSubfield.id)}
                    style={{ color: accent.fg, touchAction: "manipulation" }}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[11.5px] font-semibold transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] focus-visible:ring-offset-1"
                  >
                    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                    Full {section.title} in monograph
                  </button>
                ) : (
                  <a
                    href={`/drug-concept-b?anchor=${topSubfield.id}`}
                    style={{ color: accent.fg, touchAction: "manipulation" }}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[11.5px] font-semibold transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] focus-visible:ring-offset-1"
                  >
                    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                    Full {section.title} in monograph
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DrugMonographAccordion ─────────────────────────────────────────────────────
type DrugMonographAccordionProps = {
  matchedSubfieldId?: string;
  monograph: DrugMonograph;
  /** When provided, "Full X in monograph" section links call this instead of navigating to Concept B. */
  onOpenMonograph?: (subfieldId: string) => void;
};

export function DrugMonographAccordion({
  matchedSubfieldId,
  monograph,
  onOpenMonograph,
}: DrugMonographAccordionProps) {
  const matchedSection = matchedSubfieldId
    ? getSectionBySubfieldId(monograph, matchedSubfieldId)
    : undefined;

  const sectionRefs = useRef(new Map<string, HTMLDivElement>());
  const registerRef = useCallback((sectionId: string, node: HTMLDivElement | null) => {
    if (node) sectionRefs.current.set(sectionId, node);
    else sectionRefs.current.delete(sectionId);
  }, []);

  // Default-expanded: only the section the query actually matched. Sections the
  // query does not specify (including Safety) stay collapsed until tapped.
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    if (matchedSection) initial.add(matchedSection.id);
    return initial;
  });

  // Default-expanded subfields: only the matched intent. Critical subfields are
  // still badged when opened, but not pre-expanded for unrelated queries.
  const [expandedSubfields, setExpandedSubfields] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    if (matchedSubfieldId) initial.add(matchedSubfieldId);
    return initial;
  });

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  }, []);

  const toggleSubfield = useCallback((subfieldId: string) => {
    setExpandedSubfields((prev) => {
      const next = new Set(prev);
      if (next.has(subfieldId)) next.delete(subfieldId);
      else next.add(subfieldId);
      return next;
    });
  }, []);

  const jumpToSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) => {
      if (prev.has(sectionId)) return prev;
      const next = new Set(prev);
      next.add(sectionId);
      return next;
    });
    // Defer the scroll until the section has expanded so its target is in place.
    requestAnimationFrame(() => {
      const node = sectionRefs.current.get(sectionId);
      const scroller = getScrollParent(node ?? null);
      if (!node || !scroller) return;
      const top =
        scroller.scrollTop +
        (node.getBoundingClientRect().top - scroller.getBoundingClientRect().top) -
        JUMP_BAR_OFFSET;
      smoothScrollTo(scroller, top);
    });
  }, []);

  return (
    <div className="dc-rise">
      {/* Sticky jump bar — floats as a pill row, no borders */}
      <div className="sticky top-0 z-10 bg-white/90 pb-3 backdrop-blur-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {monograph.sections.map((section) => {
            const accent = getZoneAccent(section.id);
            const isMatched = matchedSection?.id === section.id;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => jumpToSection(section.id)}
                style={{
                  touchAction: "manipulation",
                  backgroundColor: isMatched ? accent.tint : "transparent",
                  borderColor: isMatched ? accent.fg : "#dbe4ee",
                  color: isMatched ? accent.fg : "#3a4f6b",
                }}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11.5px] font-semibold leading-none transition-colors hover:bg-[#f1f6fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] focus-visible:ring-offset-1"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: accent.fg }}
                  aria-hidden="true"
                />
                {SECTION_JUMP_LABEL[section.id] ?? section.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Boxed warning — always eager and pinned, never collapsed. */}
      {monograph.blackBoxWarnings.length > 0 && (
        <div className="pt-3">
          <ClinicalBoxedWarning warnings={monograph.blackBoxWarnings} />
        </div>
      )}

      {/* Section accordion rows */}
      <div className="space-y-2 pb-2 pt-4">
        {monograph.sections.map((section, index) => (
          <SectionRow
            key={section.id}
            expandedSubfields={expandedSubfields}
            index={index}
            isMatched={matchedSection?.id === section.id}
            matchedSubfieldId={matchedSubfieldId}
            onOpenMonograph={onOpenMonograph}
            onToggleSection={() => toggleSection(section.id)}
            onToggleSubfield={toggleSubfield}
            open={expandedSections.has(section.id)}
            registerRef={registerRef}
            section={section}
          />
        ))}
      </div>

      {/* Inline source label */}
      <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-medium text-[#9aa9b8]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#12b76a]" aria-hidden="true" />
        Verbatim from Drug Reference — no AI synthesis
      </p>
    </div>
  );
}
