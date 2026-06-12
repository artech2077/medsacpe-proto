"use client";

import { useState } from "react";
import {
  ClinicalBoxedWarning,
  ClinicalSourceLabel,
  ClinicalZoneIcon,
  getZoneAccent,
} from "@/components/medscape/drug-concepts/clinical-system";
import {
  type DrugKeyField,
  type DrugMonograph,
  type DrugSubfield,
  getSubfieldById,
  getSectionBySubfieldId,
} from "@/data/drug-monograph";

function SparkIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className} fill="none">
      <path
        d="M8 2c0 0-.6 2.4-2 3.8C4.6 7.2 2 7.8 2 8s2.6.8 4 2.2C7.4 11.6 8 14 8 14s.6-2.4 2-3.8C11.4 8.8 14 8.2 14 8s-2.6-.8-4-2.2C8.6 4.4 8 2 8 2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className} fill="none">
      <path
        d="M3 2.5h7a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 10 13.5H3V2.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M11.5 4H13a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-1.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M5.5 6h4M5.5 8.5h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// A single deterministic key-field row.
function KeyFieldRow({
  isMatched,
  sectionId,
  subfield,
}: {
  isMatched: boolean;
  sectionId: string;
  subfield: DrugSubfield;
}) {
  const [expanded, setExpanded] = useState(false);
  const accent = getZoneAccent(sectionId);

  return (
    <div
      data-matched={isMatched || undefined}
      className={[
        "group relative overflow-hidden rounded-[10px] border transition-all",
        isMatched
          ? "border-[var(--match-line)] bg-[var(--match-soft)]"
          : "border-[#e8edf3] bg-white",
      ].join(" ")}
      style={
        {
          "--match-line": accent.line,
          "--match-soft": accent.soft,
        } as React.CSSProperties
      }
    >
      {/* Zone accent stripe */}
      <div
        className="absolute inset-y-0 left-0 w-[3px] rounded-l-[10px]"
        style={{ background: isMatched ? accent.fg : accent.line }}
      />

      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-start gap-3 px-3.5 py-3 pl-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[rgba(6,74,167,0.22)]"
      >
        {/* Zone icon */}
        <span
          className="mt-[1px] flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px]"
          style={{ background: accent.tint, color: accent.fg }}
        >
          <ClinicalZoneIcon sectionId={sectionId} className="h-[15px] w-[15px]" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: accent.fg }}>
              {subfield.title}
            </span>
            {isMatched && (
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none" style={{ background: accent.tint, color: accent.fg }}>
                Matched
              </span>
            )}
          </div>

          <p className="mt-0.5 text-[14px] leading-[1.5] text-[#22282d]">
            {subfield.summary}
          </p>

          {expanded && (
            <ul className="mt-2 space-y-1.5 text-[13px] leading-[1.55] text-[#3c454d]">
              {subfield.body.map((line, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span aria-hidden="true" className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent.fg }} />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-2">
            <ClinicalSourceLabel source={subfield.source} />
          </div>
        </div>

        {/* Expand chevron */}
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className={`mt-1 h-4 w-4 shrink-0 text-[#8499af] transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        >
          <path d="m4 6 4 4 4-4" />
        </svg>
      </button>
    </div>
  );
}

// ─── DrugInstantCard ────────────────────────────────────────────────────────────
// The deterministic first-state card: drug identity, pinned BBW, 2–4 verbatim key
// fields with source labels, and two actions (Open full monograph / Ask AI).
// A contextual matchedSubfieldId promotes that field to the top of the list.

export type DrugInstantCardProps = {
  matchedSubfieldId: string | undefined;
  monograph: DrugMonograph;
  onAskAi: () => void;
  onOpenMonograph: (anchor?: string) => void;
};

export function DrugInstantCard({
  matchedSubfieldId,
  monograph,
  onAskAi,
  onOpenMonograph,
}: DrugInstantCardProps) {
  const { drug, blackBoxWarnings, keyFields } = monograph;

  // Build the ordered field list: matched field promoted first, then remaining keyFields
  const orderedFields: { isMatched: boolean; keyField: DrugKeyField }[] = (() => {
    if (!matchedSubfieldId) {
      return keyFields.map((kf) => ({ isMatched: false, keyField: kf }));
    }

    const matchedKeyField = keyFields.find((kf) => kf.subfieldId === matchedSubfieldId);
    const syntheticMatched: DrugKeyField | null = matchedKeyField
      ? null
      : (() => {
          const sf = getSubfieldById(monograph, matchedSubfieldId);
          return sf ? { label: sf.title, subfieldId: matchedSubfieldId } : null;
        })();

    const matched = matchedKeyField ?? syntheticMatched;
    if (!matched) {
      return keyFields.map((kf) => ({ isMatched: false, keyField: kf }));
    }

    const rest = keyFields.filter((kf) => kf.subfieldId !== matchedSubfieldId).slice(0, 3);
    return [
      { isMatched: true, keyField: matched },
      ...rest.map((kf) => ({ isMatched: false, keyField: kf })),
    ];
  })();

  return (
    <div className="dc-rise">
      <div className="space-y-3">
        {/* Boxed warning — always eager, never collapsed */}
        {blackBoxWarnings.length > 0 && (
          <ClinicalBoxedWarning warnings={blackBoxWarnings} />
        )}

        {/* Key fields */}
        <div className="space-y-2">
          {orderedFields.map(({ isMatched, keyField }) => {
            const subfield = getSubfieldById(monograph, keyField.subfieldId);
            if (!subfield) return null;
            const section = getSectionBySubfieldId(monograph, keyField.subfieldId);
            return (
              <KeyFieldRow
                key={keyField.subfieldId}
                isMatched={isMatched}
                sectionId={section?.id ?? "dosing"}
                subfield={subfield}
              />
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5 border-t border-[rgba(109,153,206,0.18)] pt-3 sm:flex-row">
          <button
            type="button"
            onClick={() => onOpenMonograph(matchedSubfieldId)}
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[rgba(6,74,167,0.32)] bg-white py-2.5 px-4 text-[13.5px] font-semibold text-[var(--mscp-color-brand-primary)] transition hover:border-[rgba(6,74,167,0.55)] hover:bg-[rgba(6,74,167,0.04)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.22)] focus-visible:ring-offset-1"
          >
            <BookIcon className="h-[15px] w-[15px] shrink-0" />
            Open full monograph
          </button>
          <button
            type="button"
            onClick={onAskAi}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#064aa7] py-2.5 px-4 text-[13.5px] font-semibold text-white shadow-[0_1px_6px_rgba(6,74,167,0.28)] transition hover:bg-[#043b84] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.32)] focus-visible:ring-offset-1"
          >
            <SparkIcon className="h-[15px] w-[15px] shrink-0" />
            Ask AI about this drug
          </button>
        </div>
      </div>
    </div>
  );
}
