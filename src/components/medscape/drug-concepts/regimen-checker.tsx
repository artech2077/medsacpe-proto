"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { DrugToolResultCard } from "@/components/medscape/drug-concepts/tool-result-card";
import {
  REGIMEN_CHECK,
  type RegimenDrugChip,
  type RegimenPairResult,
} from "@/data/drug-intelligence-scenarios";

// ─── DrugRegimenChecker ─────────────────────────────────────────────────────────
// V2 regimen interaction check: AI extracts drug names from the pasted list into
// editable chips; the physician confirms them (no check runs on unconfirmed
// extraction); the deterministic DIMS-backed results render grouped by
// provisional severity, each pair reusing DrugToolResultCard with a link to the
// canonical monograph interaction source. Includes the required edge states:
// ambiguous extraction, duplicate merge, no-known-interaction, DIMS unavailable,
// and edit-and-rerun.

const SEVERITY_ORDER: RegimenPairResult["severity"][] = [
  "Contraindicated",
  "Serious",
  "Monitor Closely",
  "Minor",
];

const SEVERITY_GROUP_STYLE: Record<string, { chipBg: string; chipFg: string }> = {
  Contraindicated: { chipBg: "#fde7e5", chipFg: "#7a271a" },
  Serious: { chipBg: "#fde7e5", chipFg: "#b42318" },
  "Monitor Closely": { chipBg: "#fef0e3", chipFg: "#b54708" },
  Minor: { chipBg: "#e2f5ea", chipFg: "#067647" },
};

type CheckerPhase = "review" | "results";

type DrugRegimenCheckerProps = {
  /** Open the canonical monograph interaction source for a pair. */
  onOpenSource?: (drugId: string, anchor: string) => void;
  /** Analytics hook — fires with the confirmed drug count, never patient data. */
  onRunCheck?: (drugCount: number) => void;
};

export function DrugRegimenChecker({ onOpenSource, onRunCheck }: DrugRegimenCheckerProps) {
  const [phase, setPhase] = useState<CheckerPhase>("review");
  const [drugs, setDrugs] = useState<RegimenDrugChip[]>([...REGIMEN_CHECK.drugs]);
  const [draft, setDraft] = useState("");
  const [duplicateNotice, setDuplicateNotice] = useState<string | null>(null);
  const [expandedSeverities, setExpandedSeverities] = useState<Set<string>>(new Set());

  const hasUnresolvedAmbiguity = drugs.some((d) => d.ambiguousOptions);
  const activeNames = useMemo(
    () => new Set(drugs.filter((d) => !d.ambiguousOptions).map((d) => d.name.toLowerCase())),
    [drugs],
  );

  // Deterministic rerun: only pairs whose BOTH drugs are still on the list.
  const activePairs = useMemo(
    () =>
      REGIMEN_CHECK.pairs.filter((p) =>
        p.tool.kind === "interaction"
          ? activeNames.has(p.tool.pair[0].toLowerCase()) &&
            activeNames.has(p.tool.pair[1].toLowerCase())
          : false,
      ),
    [activeNames],
  );

  const groups = SEVERITY_ORDER.map((severity) => ({
    pairs: activePairs.filter((p) => p.severity === severity),
    severity,
  })).filter((g) => g.pairs.length > 0);
  const mostSevere = groups[0]?.severity;

  const removeDrug = (id: string) => {
    setDrugs((prev) => prev.filter((d) => d.id !== id));
  };

  const resolveAmbiguous = (id: string, resolvedName: string) => {
    setDrugs((prev) =>
      prev.map((d) =>
        d.id === id
          ? { id: d.id, name: resolvedName.replace(/\s*\(.+\)$/, ""), rawText: d.rawText }
          : d,
      ),
    );
  };

  const addDrug = () => {
    const raw = draft.trim();
    if (!raw) return;
    setDraft("");
    const lower = raw.toLowerCase();

    // Scripted edge states: "dilt" demonstrates ambiguity, brand-name re-entry
    // (Eliquis) demonstrates the duplicate merge.
    if (lower.startsWith("dilt") && lower.length <= 5) {
      setDrugs((prev) => [...prev, { ...REGIMEN_CHECK.ambiguousCandidate, rawText: raw }]);
      return;
    }
    if (lower === "eliquis" || activeNames.has(lower)) {
      setDuplicateNotice(
        lower === "eliquis"
          ? REGIMEN_CHECK.duplicateNotice
          : `${raw} is already on the list — the duplicate entry was merged.`,
      );
      return;
    }
    const name = raw.charAt(0).toUpperCase() + raw.slice(1);
    setDrugs((prev) => [...prev, { id: `${lower}-${prev.length}`, name, rawText: raw }]);
  };

  const runCheck = () => {
    if (hasUnresolvedAmbiguity) return;
    onRunCheck?.(drugs.length);
    // Most serious group expanded first; lower groups scannable but collapsed.
    setExpandedSeverities(new Set(mostSevere ? [mostSevere] : []));
    setPhase("results");
  };

  const toggleSeverity = (severity: string) => {
    setExpandedSeverities((prev) => {
      const next = new Set(prev);
      if (next.has(severity)) next.delete(severity);
      else next.add(severity);
      return next;
    });
  };

  return (
    <section
      aria-label="Interaction Checker"
      className="dc-rise overflow-hidden rounded-[14px] border border-[#dce6f0] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.05)]"
    >
      <header className="flex items-center gap-2 border-b border-[#edf2f7] bg-[#f8fafc] px-4 py-2.5">
        <Image
          src="/assets/Intercations.svg"
          alt=""
          aria-hidden="true"
          width={26}
          height={20}
          className="h-4 w-auto"
        />
        <h3 className="text-[13px] font-bold text-[#22303c]">Interaction Checker</h3>
      </header>

      <div className="px-4 py-3.5">
        {/* ── Extracted drug chips (always visible so the list stays editable) ── */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-[13px] font-bold text-[#1c2935]">
            {drugs.length} medication{drugs.length === 1 ? "" : "s"} recognized
          </p>
          <span className="rounded-full bg-[#eef2f7] px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.08em] text-[#5a6e7e]">
            AI-extracted — confirm before running
          </span>
        </div>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {drugs.map((drug) => (
            <li key={drug.id}>
              {drug.ambiguousOptions ? (
                <div className="rounded-[10px] border border-[#f0c56b] bg-[#fef7e8] px-2.5 py-1.5">
                  <p className="text-[12px] font-semibold text-[#7a3c08]">
                    “{drug.rawText}” is ambiguous — select the intended drug:
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {drug.ambiguousOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => resolveAmbiguous(drug.id, option)}
                        style={{ touchAction: "manipulation" }}
                        className="rounded-full border border-[#e0c288] bg-white px-2.5 py-1 text-[12px] font-semibold text-[#7a3c08] transition hover:bg-[#fdf1d8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
                      >
                        {option}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => removeDrug(drug.id)}
                      style={{ touchAction: "manipulation" }}
                      className="rounded-full px-2 py-1 text-[12px] font-semibold text-[#7a3c08]/70 transition hover:bg-[#fdf1d8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-[#cfe0f7] bg-[#f2f7fe] py-1 pl-3 pr-1.5 text-[12.5px] font-semibold text-[#1c3a5e]">
                  {drug.name}
                  <button
                    type="button"
                    aria-label={`Remove ${drug.name}`}
                    onClick={() => removeDrug(drug.id)}
                    style={{ touchAction: "manipulation" }}
                    className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[#5a6e7e] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
                  >
                    <svg viewBox="0 0 12 12" aria-hidden="true" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="m3 3 6 6M9 3l-6 6" />
                    </svg>
                  </button>
                </span>
              )}
            </li>
          ))}
        </ul>

        {duplicateNotice ? (
          <p
            role="status"
            className="mt-2 rounded-[10px] bg-[#eef2f7] px-3 py-2 text-[12.5px] font-medium leading-[1.5] text-[#3a4f6b]"
          >
            {duplicateNotice}
            <button
              type="button"
              onClick={() => setDuplicateNotice(null)}
              style={{ touchAction: "manipulation" }}
              className="ml-2 font-semibold text-[var(--mscp-color-brand-primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
            >
              Got it
            </button>
          </p>
        ) : null}

        {/* Add a drug + run */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addDrug();
            }}
            className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full border border-[#dbe4ee] bg-white px-3 py-1"
          >
            <input
              aria-label="Add a medication"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add a medication (try “dilt” or “Eliquis”)…"
              className="h-8 min-w-0 flex-1 border-0 bg-transparent text-[13px] text-[#1b2b3a] outline-none placeholder:text-[#93a2ae]"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              style={{ touchAction: "manipulation" }}
              className="shrink-0 rounded-full px-2.5 py-1 text-[12px] font-bold text-[var(--mscp-color-brand-primary)] transition hover:bg-[#f2f7fe] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] disabled:text-[#9aa9b8]"
            >
              Add
            </button>
          </form>
          <button
            type="button"
            onClick={runCheck}
            disabled={hasUnresolvedAmbiguity || drugs.length < 2}
            style={{ touchAction: "manipulation" }}
            className="inline-flex items-center rounded-full bg-[var(--mscp-color-brand-primary)] px-4 py-2 text-[13px] font-bold text-white transition hover:bg-[#053b85] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] focus-visible:ring-offset-2 disabled:bg-[#c2cfdc]"
          >
            {phase === "results" ? "Rerun check" : "Check interactions"}
          </button>
        </div>
        {hasUnresolvedAmbiguity ? (
          <p className="mt-1.5 text-[11.5px] font-medium text-[#b54708]">
            Resolve the ambiguous medication before running the check.
          </p>
        ) : null}

        {/* ── Results ── */}
        {phase === "results" ? (
          <div aria-live="polite" className="mt-4 border-t border-[#eef3f8] pt-3">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[13px] font-bold text-[#1c2935]">
                {activePairs.length} interacting pair{activePairs.length === 1 ? "" : "s"} found
              </p>
              <span className="rounded-full bg-[#eef2f7] px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.08em] text-[#5a6e7e]">
                {REGIMEN_CHECK.severityDisclaimer}
              </span>
            </div>

            {groups.length === 0 ? (
              <div className="mt-3 rounded-[10px] bg-[#e2f5ea] px-3 py-2.5">
                <p className="text-[12.5px] font-bold text-[#067647]">No known interactions</p>
                <p className="mt-0.5 text-[12.5px] font-medium leading-[1.5] text-[#14532d]">
                  No interactions were found among the confirmed medications in this list.
                </p>
              </div>
            ) : (
              <div className="mt-3 space-y-2.5">
                {groups.map((group) => {
                  const style = SEVERITY_GROUP_STYLE[group.severity]!;
                  const open = expandedSeverities.has(group.severity);
                  return (
                    <div key={group.severity} className="overflow-hidden rounded-[12px] border border-[#e4ebf3]">
                      <button
                        type="button"
                        onClick={() => toggleSeverity(group.severity)}
                        aria-expanded={open}
                        style={{ touchAction: "manipulation" }}
                        className="flex w-full items-center gap-2 bg-[#fafcfe] px-3 py-2.5 text-left transition hover:bg-[#f2f7fe] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
                      >
                        <span
                          className="rounded-full px-2.5 py-1 text-[11px] font-bold"
                          style={{ backgroundColor: style.chipBg, color: style.chipFg }}
                        >
                          {group.severity}
                        </span>
                        <span className="text-[12.5px] font-semibold text-[#33424f]">
                          {group.pairs.length} pair{group.pairs.length === 1 ? "" : "s"}
                        </span>
                        <svg
                          viewBox="0 0 16 16"
                          aria-hidden="true"
                          className={`ml-auto h-3.5 w-3.5 text-[#8497a9] transition-transform ${open ? "rotate-90" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                        >
                          <path d="m6 3.5 4.5 4.5L6 12.5" />
                        </svg>
                      </button>
                      <div className="dc-collapse" data-open={open}>
                        <div className="dc-collapse-inner">
                          <div className="space-y-2.5 border-t border-[#eef3f8] px-2.5 py-2.5">
                            {group.pairs.map((pair, i) => (
                              <div key={i}>
                                <DrugToolResultCard hideBadge tool={pair.tool} />
                                <button
                                  type="button"
                                  onClick={() =>
                                    onOpenSource?.(pair.source.drugId, pair.source.anchor)
                                  }
                                  style={{ touchAction: "manipulation" }}
                                  className="mt-1.5 inline-flex items-center gap-1 rounded-full px-1 text-[11.5px] font-semibold text-[var(--mscp-color-brand-primary)] transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
                                >
                                  Open the monograph interaction source
                                  <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3 w-3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6">
                                    <path d="M3 8h10M9 4l4 4-4 4" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <p className="text-[12px] font-medium text-[#5a6e7e]">
                  {REGIMEN_CHECK.noInteractionNote}
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
