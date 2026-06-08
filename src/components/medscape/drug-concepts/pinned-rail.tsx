"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ClinicalBoxedWarning,
  ClinicalChevron,
  ClinicalSourceLabel,
  ClinicalZoneIcon,
  getZoneAccent,
} from "@/components/medscape/drug-concepts/clinical-system";
import type { DrugMonograph } from "@/data/drug-monograph";

const HIGHLIGHT_MS = 2400;

export type DrugPinnedRailProps = {
  className?: string;
  /** Subfield id to scroll-to + highlight; changes on citation click or turn completion. */
  focusAnchor?: string;
  monograph: DrugMonograph;
  /** When provided (mobile sheet mode), renders a close button in the header. */
  onClose?: () => void;
};

// Persistent drug-reference rail: BBW pinned at top, scrollable section list below.
// Compact section rows expand in-place to subfield cards. focusAnchor drives
// auto-expand + scroll + 2.4s highlight ring used by Concept G citation links.
export function DrugPinnedRail({
  className,
  focusAnchor,
  monograph,
  onClose,
}: DrugPinnedRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const anchorRefs = useRef(new Map<string, HTMLElement>());
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [expandedSectionIds, setExpandedSectionIds] = useState<Set<string>>(new Set());
  const [expandedSubfieldIds, setExpandedSubfieldIds] = useState<Set<string>>(new Set());
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const registerAnchor = useCallback((id: string, node: HTMLElement | null) => {
    if (node) anchorRefs.current.set(id, node);
    else anchorRefs.current.delete(id);
  }, []);

  const scrollToAnchor = useCallback((id: string) => {
    const node = anchorRefs.current.get(id);
    const container = scrollRef.current;
    if (!node || !container) return;

    const top =
      node.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop -
      8;
    container.scrollTo({ behavior: "smooth", top: Math.max(0, top) });

    setHighlightedId(id);
    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    highlightTimerRef.current = setTimeout(() => setHighlightedId(null), HIGHLIGHT_MS);
  }, []);

  useEffect(() => {
    if (!focusAnchor) return;

    const section = monograph.sections.find((s) =>
      s.subfields.some((sf) => sf.id === focusAnchor),
    );
    if (!section) return;

    // Batch the two set-state calls in a microtask so they don't fire
    // synchronously inside the effect body (required by react-hooks/set-state-in-effect).
    const batchId = setTimeout(() => {
      setExpandedSectionIds((prev) => {
        if (prev.has(section.id)) return prev;
        const next = new Set(prev);
        next.add(section.id);
        return next;
      });
      setExpandedSubfieldIds((prev) => {
        if (prev.has(focusAnchor)) return prev;
        const next = new Set(prev);
        next.add(focusAnchor);
        return next;
      });
    }, 0);

    const timer = setTimeout(() => {
      requestAnimationFrame(() => scrollToAnchor(focusAnchor));
    }, 120);

    return () => {
      clearTimeout(batchId);
      clearTimeout(timer);
    };
  }, [focusAnchor, monograph.sections, scrollToAnchor]);

  useEffect(
    () => () => {
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    },
    [],
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSectionIds((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  const toggleSubfield = (subfieldId: string) => {
    setExpandedSubfieldIds((prev) => {
      const next = new Set(prev);
      if (next.has(subfieldId)) next.delete(subfieldId);
      else next.add(subfieldId);
      return next;
    });
  };

  return (
    <div
      className={[
        "flex h-full min-h-0 w-full flex-col bg-[#fafcff]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* ── Pinned header: drug name + BBW ──────────────────────────────────── */}
      <div className="shrink-0 border-b border-[#eef2f7] px-4 py-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[var(--mscp-color-brand-primary)]">
              Drug Reference
            </p>
            <h2 className="mt-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-[16px] font-bold leading-tight text-[#22282d]">
                {monograph.drug.name}
              </span>
              <span className="rounded-full border border-[rgba(6,74,167,0.18)] bg-[rgba(6,74,167,0.06)] px-2 py-0.5 text-[10px] font-semibold text-[var(--mscp-color-brand-primary)]">
                {monograph.drug.drugClass}
              </span>
            </h2>
          </div>

          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close drug reference"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#687680] transition hover:bg-[#f0f5fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
            >
              <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4" fill="none">
                <path
                  d="m4 4 8 8M12 4l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          ) : null}
        </div>

        {/* BBW — always pinned, never collapses */}
        <div className="mt-3">
          <ClinicalBoxedWarning warnings={monograph.blackBoxWarnings} />
        </div>
      </div>

      {/* ── Scrollable sections ──────────────────────────────────────────────── */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-2">
        {monograph.sections.map((section) => {
          const accent = getZoneAccent(section.id);
          const isExpanded = expandedSectionIds.has(section.id);

          return (
            <div key={section.id} className="mb-1">
              {/* Section row */}
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="flex min-h-[44px] w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-left transition-colors hover:bg-[rgba(6,74,167,0.04)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
              >
                <span
                  className="inline-flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7px]"
                  style={{ backgroundColor: accent.soft, color: accent.fg }}
                >
                  <ClinicalZoneIcon className="h-[14px] w-[14px]" sectionId={section.id} />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-bold leading-tight text-[#22282d]">
                    {section.title}
                  </p>
                  {!isExpanded && (
                    <p className="mt-0.5 line-clamp-1 text-[11px] leading-snug text-[#5a6e7e]">
                      {section.subfields[0]?.summary ?? ""}
                    </p>
                  )}
                </div>

                <ClinicalChevron className="h-4 w-4 shrink-0" open={isExpanded} />
              </button>

              {/* Expanded subfields */}
              {isExpanded ? (
                <div className="mb-2 ml-3 space-y-1.5 border-l-2 border-[#e4ecf4] pl-2.5">
                  {section.subfields.map((sf) => {
                    const isHighlighted = highlightedId === sf.id;
                    const isSubExpanded = expandedSubfieldIds.has(sf.id);

                    return (
                      <div
                        key={sf.id}
                        ref={(node) => registerAnchor(sf.id, node)}
                        className={[
                          "overflow-hidden rounded-[10px] border transition-[border-color,background-color,box-shadow] duration-300 ease-out",
                          isHighlighted
                            ? "border-[var(--mscp-color-brand-primary)] bg-[rgba(6,74,167,0.04)] shadow-[0_0_0_1px_var(--mscp-color-brand-primary),0_3px_10px_rgba(6,74,167,0.14)]"
                            : "border-[#e7edf4] bg-white",
                        ].join(" ")}
                      >
                        <button
                          type="button"
                          onClick={() => toggleSubfield(sf.id)}
                          className="flex min-h-[44px] w-full items-start justify-between gap-2 px-3 py-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-[12px] font-bold leading-snug text-[#22282d]">
                              {sf.title}
                            </p>
                            <p className="mt-0.5 text-[11px] leading-snug text-[#5a6e7e]">
                              {sf.summary}
                            </p>
                          </div>
                          <ClinicalChevron className="mt-0.5 h-3.5 w-3.5 shrink-0" open={isSubExpanded} />
                        </button>

                        {isSubExpanded ? (
                          <div className="border-t border-[#edf2f7] px-3 pb-3 pt-2.5">
                            <div className="space-y-1.5">
                              {sf.body.map((paragraph, i) => (
                                <p
                                  key={i}
                                  className="text-[12px] leading-[1.65] text-[#2e3d4a]"
                                >
                                  {paragraph}
                                </p>
                              ))}
                            </div>
                            <div className="mt-2.5 border-t border-[#edf2f7] pt-2">
                              <ClinicalSourceLabel source={sf.source} />
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
