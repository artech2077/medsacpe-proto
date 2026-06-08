"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ClinicalBoxedWarning,
  ClinicalChevron,
  ClinicalSourceLabel,
  ClinicalZoneIcon,
  getZoneAccent,
} from "@/components/medscape/drug-concepts/clinical-system";
import {
  type DrugMonograph,
  type DrugSection,
  getSectionBySubfieldId,
} from "@/data/drug-monograph";

// ─── Subfield body (lazy-revealed, level 2) ─────────────────────────────────────
function SubfieldBody({
  body,
  open,
  source,
}: {
  body: string[];
  open: boolean;
  source: { label: string; section: string; url: string };
}) {
  return (
    <div className="dc-collapse ml-[26px]" data-open={open}>
      <div className="dc-collapse-inner">
        <div className="mt-1 rounded-[9px] border border-[#e3ebf4] bg-white px-3.5 py-3">
          <div className="[font-variant-numeric:tabular-nums]">
            {body.map((paragraph, index) => (
              <p key={index} className="text-[12.5px] leading-[1.62] text-[#2e3d4a] [&+p]:mt-2">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-2.5 border-t border-[#eef3f8] pt-2">
            <ClinicalSourceLabel source={source} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Zone tile ──────────────────────────────────────────────────────────────────
type ZoneTileProps = {
  index: number;
  isMatched: boolean;
  matchedSubfieldId?: string;
  onExpandSubfield: (subfieldId: string | null) => void;
  onToggle: () => void;
  open: boolean;
  openSubfieldId: string | null;
  section: DrugSection;
  /** Subfield anchor to deep-link into the monograph canvas (first subfield of section) */
  monographAnchor: string;
};

function ZoneTile({
  index,
  isMatched,
  matchedSubfieldId,
  monographAnchor,
  onExpandSubfield,
  onToggle,
  open,
  openSubfieldId,
  section,
}: ZoneTileProps) {
  const accent = getZoneAccent(section.id);
  const topSubfield = section.subfields[0];

  return (
    <div
      className={[
        "dc-rise self-start rounded-[14px] border bg-white transition-[box-shadow,border-color] duration-200",
        // An open tile spans the full row; collapsed neighbors reflow around it.
        open ? "sm:col-span-2" : "",
      ].join(" ")}
      style={{
        animationDelay: `${index * 55}ms`,
        borderColor: isMatched ? accent.fg : "#e4ebf3",
        boxShadow: isMatched
          ? `0 0 0 1px ${accent.fg}, 0 6px 18px ${accent.tint}`
          : "0 1px 2px rgba(16,24,40,0.04)",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-start gap-3 rounded-[14px] px-3.5 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] focus-visible:ring-offset-1"
      >
        <span
          className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
          style={{ backgroundColor: accent.soft, color: accent.fg }}
        >
          <ClinicalZoneIcon className="h-[19px] w-[19px]" sectionId={section.id} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="text-[13.5px] font-bold leading-snug text-[#1c2227]">
              {section.title}
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

      {/* Expanded: subfield mini-ToC */}
      <div className="dc-collapse" data-open={open}>
        <div className="dc-collapse-inner">
          <div className="border-t border-[#eef3f8] px-2 pb-2 pt-1.5">
            <ul className="space-y-0.5">
              {section.subfields.map((subfield) => {
                const isSubfieldOpen = openSubfieldId === subfield.id;
                const isSubfieldMatched = matchedSubfieldId === subfield.id;

                return (
                  <li key={subfield.id}>
                    <button
                      type="button"
                      onClick={() => onExpandSubfield(isSubfieldOpen ? null : subfield.id)}
                      aria-expanded={isSubfieldOpen}
                      className="group/sf flex w-full items-start gap-2.5 rounded-[9px] px-2 py-2 text-left transition-colors hover:bg-[#f5f8fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
                    >
                      <span
                        className="mt-[5px] h-2 w-2 shrink-0 rounded-full transition-colors"
                        style={{
                          backgroundColor: isSubfieldOpen || isSubfieldMatched ? accent.fg : "#cdd8e4",
                        }}
                        aria-hidden="true"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-1.5">
                          <span
                            className="text-[12px] font-semibold leading-snug"
                            style={{ color: isSubfieldMatched ? accent.fg : "#1c2227" }}
                          >
                            {subfield.title}
                          </span>
                          {isSubfieldMatched && (
                            <span
                              className="rounded-full px-1.5 py-px text-[8.5px] font-bold uppercase tracking-[0.05em] text-white"
                              style={{ backgroundColor: accent.fg }}
                            >
                              Answer
                            </span>
                          )}
                        </span>
                        <span className="mt-0.5 block text-[11px] leading-[1.45] text-[#647689] [font-variant-numeric:tabular-nums]">
                          {subfield.summary}
                        </span>
                      </span>
                    </button>

                    <SubfieldBody
                      body={subfield.body}
                      open={isSubfieldOpen}
                      source={subfield.source}
                    />
                  </li>
                );
              })}
            </ul>

            {/* Full monograph link — deep-links into Concept B canvas at this section */}
            <div className="mt-1.5 border-t border-[#eef3f8] pt-2">
              <Link
                href={`/drug-concept-b?anchor=${encodeURIComponent(monographAnchor)}`}
                style={{ touchAction: "manipulation" }}
                className="group/mono inline-flex w-full items-center justify-between gap-2 rounded-[9px] px-2 py-2 transition-colors hover:bg-[#f0f6ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
              >
                <span className="flex items-center gap-2">
                  {/* mini book icon */}
                  <svg
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                    className="h-3.5 w-3.5 shrink-0"
                    style={{ color: accent.fg }}
                    fill="none"
                  >
                    <rect x="2" y="1.5" width="9" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M5 4.5h4M5 7h4M5 9.5h2.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.3" />
                    <path d="M13 3.5v9" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
                  </svg>
                  <span
                    className="text-[11.5px] font-semibold"
                    style={{ color: accent.fg }}
                  >
                    Full monograph — {section.title}
                  </span>
                </span>
                <svg
                  viewBox="0 0 12 12"
                  aria-hidden="true"
                  className="h-3 w-3 shrink-0 opacity-50 transition-opacity group-hover/mono:opacity-100"
                  style={{ color: accent.fg }}
                  fill="none"
                >
                  <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DrugDashboardCard ──────────────────────────────────────────────────────────
type DrugDashboardCardProps = {
  matchedSubfieldId?: string;
  monograph: DrugMonograph;
  onOpenFullMonograph?: () => void;
};

export function DrugDashboardCard({
  matchedSubfieldId,
  monograph,
  onOpenFullMonograph,
}: DrugDashboardCardProps) {
  const matchedSection = matchedSubfieldId
    ? getSectionBySubfieldId(monograph, matchedSubfieldId)
    : undefined;

  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(
    matchedSection?.id ?? null,
  );
  const [expandedSubfieldId, setExpandedSubfieldId] = useState<string | null>(
    matchedSubfieldId ?? null,
  );

  // Promote the matched section to first position.
  const orderedSections = matchedSection
    ? [matchedSection, ...monograph.sections.filter((s) => s.id !== matchedSection.id)]
    : monograph.sections;

  const handleTileToggle = (sectionId: string) => {
    if (expandedSectionId === sectionId) {
      setExpandedSectionId(null);
      setExpandedSubfieldId(null);
    } else {
      setExpandedSectionId(sectionId);
      setExpandedSubfieldId(null);
    }
  };

  const handleExpandSubfield = (sectionId: string, subfieldId: string | null) => {
    if (expandedSectionId !== sectionId) setExpandedSectionId(sectionId);
    setExpandedSubfieldId(subfieldId);
  };

  return (
    <div className="dc-rise overflow-hidden rounded-[18px] border border-[#dde6f0] bg-[linear-gradient(180deg,#fbfdff_0%,#f4f8fc_100%)] shadow-[0_2px_8px_rgba(16,24,40,0.05)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#7d8ea0]">
            Drug Reference
          </p>
          <div className="mt-0.5 flex flex-wrap items-center gap-2">
            <h3
              className="text-[19px] font-extrabold leading-tight tracking-[-0.01em] text-[#161b1d]"
              translate="no"
            >
              {monograph.drug.name}
            </h3>
            <span className="rounded-full border border-[rgba(6,74,167,0.2)] bg-[rgba(6,74,167,0.05)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--mscp-color-brand-primary)]">
              {monograph.drug.drugClass}
            </span>
          </div>
        </div>
      </div>

      {/* Boxed warning — always eager, outside any collapse */}
      {monograph.blackBoxWarnings.length > 0 && (
        <div className="px-4 pt-3">
          <ClinicalBoxedWarning warnings={monograph.blackBoxWarnings} />
        </div>
      )}

      {/* Zone tile grid — an open tile spans both columns; dense flow backfills
          the gap with a later collapsed tile so heights stay uniform. */}
      <div className="grid grid-cols-1 grid-flow-row-dense items-start gap-2.5 px-4 pb-2 pt-3 sm:grid-cols-2">
        {orderedSections.map((section, index) => {
          const isOpen = expandedSectionId === section.id;
          const isMatched = matchedSection?.id === section.id;
          return (
            <ZoneTile
              key={section.id}
              index={index}
              isMatched={isMatched}
              matchedSubfieldId={isMatched ? matchedSubfieldId : undefined}
              monographAnchor={section.subfields[0]?.id ?? section.id}
              onExpandSubfield={(subfieldId) => handleExpandSubfield(section.id, subfieldId)}
              onToggle={() => handleTileToggle(section.id)}
              open={isOpen}
              openSubfieldId={isOpen ? expandedSubfieldId : null}
              section={section}
            />
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 border-t border-[#e4ebf3] bg-white/60 px-4 py-3">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#7d8ea0]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#12b76a]" aria-hidden="true" />
          Verbatim from Drug Reference — no AI synthesis
        </span>
        <button
          type="button"
          onClick={onOpenFullMonograph}
          className="shrink-0 rounded-full px-2 py-1 text-[12px] font-semibold text-[var(--mscp-color-brand-primary)] transition-colors hover:bg-[rgba(6,74,167,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
        >
          Open full monograph →
        </button>
      </div>
    </div>
  );
}
