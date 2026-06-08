"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AiCloseIcon } from "@/components/medscape/ai-response/iconography";
import {
  ClinicalBoxedWarning,
  ClinicalSourceLabel,
  ClinicalZoneIcon,
  getZoneAccent,
} from "@/components/medscape/drug-concepts/clinical-system";
import { type DrugMonograph } from "@/data/drug-monograph";

const HIGHLIGHT_MS = 2400;

function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4" fill="none">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="m11 11 3 3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    </svg>
  );
}

type DrugMonographCanvasProps = {
  className?: string;
  monograph: DrugMonograph;
  onClose: () => void;
  // Subfield id the canvas should scroll to + highlight, both on open and on follow-up re-point.
  targetAnchor?: string;
};

// Side canvas / full-screen sheet holding the full monograph: left section nav,
// center scrollable content, right quick-reference rail (pinned BBW + key facts),
// and a search-within-monograph input that filters and jumps to subfields.
export function DrugMonographCanvas({
  className,
  monograph,
  onClose,
  targetAnchor,
}: DrugMonographCanvasProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const anchorRefs = useRef(new Map<string, HTMLElement>());
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [query, setQuery] = useState("");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const registerAnchor = useCallback((id: string, node: HTMLElement | null) => {
    if (node) anchorRefs.current.set(id, node);
    else anchorRefs.current.delete(id);
  }, []);

  const scrollToAnchor = useCallback((id: string, highlight: boolean) => {
    const node = anchorRefs.current.get(id);
    const container = scrollRef.current;
    if (!node || !container) return;

    const top =
      node.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop -
      12;
    container.scrollTo({ behavior: "smooth", top });

    if (highlight) {
      setHighlightedId(id);
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
      highlightTimerRef.current = setTimeout(() => setHighlightedId(null), HIGHLIGHT_MS);
    }
  }, []);

  // Deep-link on open and re-point on follow-up. Clear any active search so the
  // target subfield is guaranteed to be in the DOM before we scroll to it.
  useEffect(() => {
    if (!targetAnchor) return;
    const timer = setTimeout(() => {
      setQuery("");
      requestAnimationFrame(() => scrollToAnchor(targetAnchor, true));
    }, 90);
    return () => clearTimeout(timer);
  }, [targetAnchor, scrollToAnchor]);

  useEffect(
    () => () => {
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    },
    [],
  );

  const normalizedQuery = query.trim().toLowerCase();

  const matchingIds = useMemo(() => {
    if (!normalizedQuery) return null;
    const ids = new Set<string>();
    for (const section of monograph.sections) {
      for (const sf of section.subfields) {
        const hay = [sf.title, sf.summary, ...sf.body, section.title].join(" ").toLowerCase();
        if (hay.includes(normalizedQuery)) ids.add(sf.id);
      }
    }
    return ids;
  }, [normalizedQuery, monograph]);

  const visibleSections = useMemo(() => {
    if (!matchingIds) return monograph.sections;
    return monograph.sections
      .map((section) => ({
        ...section,
        subfields: section.subfields.filter((sf) => matchingIds.has(sf.id)),
      }))
      .filter((section) => section.subfields.length > 0);
  }, [matchingIds, monograph]);

  const { blackBoxWarnings, keyFields } = monograph;

  return (
    <div
      className={[
        "flex h-full w-full min-w-0 flex-col bg-white",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Header */}
      <header className="flex shrink-0 items-start gap-3 border-b border-[#e4ecf4] px-4 py-3 md:px-5">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--mscp-color-brand-primary)]">
            Full monograph
          </p>
          <h2 className="mt-0.5 flex flex-wrap items-center gap-2 text-[17px] font-bold leading-tight text-[#22282d]">
            {monograph.drug.name}
            <span className="rounded-full border border-[rgba(6,74,167,0.18)] bg-[rgba(6,74,167,0.06)] px-2 py-0.5 text-[11px] font-semibold text-[var(--mscp-color-brand-primary)]">
              {monograph.drug.drugClass}
            </span>
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close monograph"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#687680] transition hover:bg-[#f4f7fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
        >
          <AiCloseIcon />
        </button>
      </header>

      {/* Search-within-monograph */}
      <div className="shrink-0 border-b border-[#eef2f7] px-4 py-2.5 md:px-5">
        <div className="flex items-center gap-2 rounded-full border border-[rgba(109,153,206,0.45)] bg-white px-3.5 py-2 text-[#6b8499] focus-within:border-[var(--mscp-color-brand-primary)]">
          <SearchIcon />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search within monograph…"
            className="h-5 flex-1 border-0 bg-transparent text-[14px] text-[#1b2b3a] outline-none placeholder:text-[#93a2ae]"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-[12px] font-semibold text-[var(--mscp-color-brand-primary)]"
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>

      {/* Compact BBW + key facts bar — shown when the right rail is hidden so the
          boxed warning stays visible at any scroll depth on narrow widths. */}
      <div className="shrink-0 border-b border-[#eef2f7] px-4 py-2.5 lg:hidden">
        <ClinicalBoxedWarning compact warnings={blackBoxWarnings} />
        <div className="mt-2 flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {keyFields.map((field) => (
            <button
              key={field.subfieldId}
              type="button"
              onClick={() => scrollToAnchor(field.subfieldId, true)}
              className="shrink-0 rounded-full border border-[rgba(6,74,167,0.18)] bg-white px-2.5 py-1 text-[11px] font-semibold text-[var(--mscp-color-brand-primary)] transition-colors hover:bg-[rgba(6,74,167,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
            >
              {field.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Left section nav */}
        <nav
          aria-label="Monograph sections"
          className="hidden w-[190px] shrink-0 overflow-y-auto border-r border-[#eef2f7] px-2 py-3 md:block"
        >
          {monograph.sections.map((section) => {
            const accent = getZoneAccent(section.id);
            return (
            <div key={section.id} className="mb-2">
              <button
                type="button"
                onClick={() => scrollToAnchor(section.id, false)}
                className="flex w-full items-center gap-2 rounded-[8px] px-2.5 py-1.5 text-left text-[12px] font-bold text-[#22282d] transition hover:bg-[rgba(6,74,167,0.05)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
              >
                <span
                  className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px]"
                  style={{ backgroundColor: accent.soft, color: accent.fg }}
                >
                  <ClinicalZoneIcon className="h-[13px] w-[13px]" sectionId={section.id} />
                </span>
                <span className="min-w-0 flex-1">{section.title}</span>
              </button>
              <ul className="mt-0.5 space-y-0.5">
                {section.subfields.map((sf) => (
                  <li key={sf.id}>
                    <button
                      type="button"
                      onClick={() => scrollToAnchor(sf.id, true)}
                      className={[
                        "w-full rounded-[7px] px-2.5 py-1 pl-3 text-left text-[11px] leading-snug transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]",
                        highlightedId === sf.id
                          ? "bg-[rgba(6,74,167,0.1)] font-semibold text-[var(--mscp-color-brand-primary)]"
                          : "text-[#5a6e7e] hover:bg-[rgba(6,74,167,0.04)] hover:text-[#22282d]",
                      ].join(" ")}
                    >
                      {sf.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            );
          })}
        </nav>

        {/* Center content */}
        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-5">
          {/* Mobile-only section chip nav */}
          <div className="mb-4 flex gap-1.5 overflow-x-auto md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {monograph.sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToAnchor(section.id, false)}
                className="shrink-0 rounded-full border border-[#dde5ef] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#3c454d]"
              >
                {section.title}
              </button>
            ))}
          </div>

          {visibleSections.length === 0 ? (
            <p className="py-12 text-center text-[14px] text-[#5a6e7e]">
              No subfields match &ldquo;{query}&rdquo;. Try a broader term.
            </p>
          ) : (
            visibleSections.map((section) => (
              <section
                key={section.id}
                ref={(node) => registerAnchor(section.id, node)}
                className="mb-9 scroll-mt-3 last:mb-2"
              >
                <h3 className="mb-3 border-b border-[#eef2f7] pb-2 text-[18px] font-bold text-[#161b1d]">
                  {section.title}
                </h3>
                <div className="space-y-3">
                  {section.subfields.map((sf) => {
                    const isHighlighted = highlightedId === sf.id;
                    return (
                      <div
                        key={sf.id}
                        ref={(node) => registerAnchor(sf.id, node)}
                        className={[
                          "scroll-mt-3 rounded-[12px] border px-4 py-3.5 transition-shadow duration-300",
                          isHighlighted
                            ? "border-[var(--mscp-color-brand-primary)] bg-[rgba(6,74,167,0.04)] shadow-[0_0_0_1px_var(--mscp-color-brand-primary),0_4px_14px_rgba(6,74,167,0.14)]"
                            : "border-[#e7edf4] bg-white",
                        ].join(" ")}
                      >
                        <h4 className="text-[15px] font-bold text-[#22282d]">{sf.title}</h4>
                        <div className="mt-2 space-y-2 [font-variant-numeric:tabular-nums]">
                          {sf.body.map((paragraph, index) => (
                            <p
                              key={index}
                              className="text-[14px] leading-[1.6] text-[#2e3d4a]"
                            >
                              {paragraph}
                            </p>
                          ))}
                        </div>
                        <div className="mt-2.5 border-t border-[#edf2f7] pt-2">
                          <ClinicalSourceLabel source={sf.source} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))
          )}
        </div>

        {/* Right quick-reference rail — pinned BBW + key facts */}
        <aside
          aria-label="Quick reference"
          className="hidden w-[230px] shrink-0 overflow-y-auto border-l border-[#eef2f7] bg-[#fafcff] px-3.5 py-4 lg:block"
        >
          <div className="sticky top-0 space-y-4">
            <ClinicalBoxedWarning warnings={blackBoxWarnings} />

            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#6b8499]">
                Key facts
              </p>
              <ul className="space-y-1.5">
                {keyFields.map((field) => (
                  <li key={field.subfieldId}>
                    <button
                      type="button"
                      onClick={() => scrollToAnchor(field.subfieldId, true)}
                      className="flex w-full items-center justify-between gap-2 rounded-[8px] border border-[#e7edf4] bg-white px-3 py-2 text-left text-[12px] font-semibold text-[#22282d] transition hover:border-[var(--mscp-color-brand-primary)] hover:text-[var(--mscp-color-brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
                    >
                      <span className="min-w-0 flex-1">{field.label}</span>
                      <span aria-hidden="true" className="text-[var(--mscp-color-brand-primary)]">
                        →
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
