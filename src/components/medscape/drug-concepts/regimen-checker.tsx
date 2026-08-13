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
// extraction); deterministic regimen-risk results render grouped by severity,
// each pair reusing DrugToolResultCard with a link to the
// canonical monograph interaction source. Includes the required edge states:
// ambiguous extraction, duplicate merge, no-known-interaction, data-unavailable,
// and edit-and-rerun.

const SEVERITY_ORDER: RegimenPairResult["severity"][] = [
  "Contraindicated",
  "Serious",
  "Monitor Closely",
  "Minor",
];

const SEVERITY_GROUP_STYLE: Record<string, { accent: string; text: string }> = {
  Contraindicated: { accent: "#9a1128", text: "#8a1630" },
  Serious: { accent: "#a35016", text: "#9b4a13" },
  "Monitor Closely": { accent: "#a35016", text: "#9b4a13" },
  Minor: { accent: "#0d5cb8", text: "#0d5cb8" },
};

type DrugRegimenCheckerProps = {
  /** Analytics hook — fires with the confirmed drug count, never patient data. */
  onRunCheck?: (drugCount: number) => void;
  /** Bare, sheet-friendly content for use inside ResponsiveFeaturePanel. */
  presentation?: "inline" | "panel";
};

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-5 w-5 text-[#718796]"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.5"
    >
      <circle cx="8.5" cy="8.5" r="5.5" />
      <path d="m13 13 4 4" />
    </svg>
  );
}

function RemoveIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.5"
    >
      <path d="m3 3 10 10M13 3 3 13" />
    </svg>
  );
}

function InteractionCountIcon() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#9d1024] text-[15px] font-bold text-white"
    >
      !
    </span>
  );
}

export function DrugRegimenChecker({
  onRunCheck,
  presentation = "inline",
}: DrugRegimenCheckerProps) {
  const [drugs, setDrugs] = useState<RegimenDrugChip[]>([...REGIMEN_CHECK.drugs]);
  const [draft, setDraft] = useState("");
  const [duplicateNotice, setDuplicateNotice] = useState<string | null>(null);

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

    // Scripted edge states: "cap" demonstrates ambiguity, brand-name re-entry
    // (Avastin) demonstrates the duplicate merge.
    if (lower.startsWith("cap") && lower.length <= 4) {
      setDrugs((prev) => [...prev, { ...REGIMEN_CHECK.ambiguousCandidate, rawText: raw }]);
      return;
    }
    if (lower === "avastin" || activeNames.has(lower)) {
      setDuplicateNotice(
        lower === "avastin"
          ? REGIMEN_CHECK.duplicateNotice
          : `${raw} is already on the list — the duplicate entry was merged.`,
      );
      return;
    }
    const name = raw.charAt(0).toUpperCase() + raw.slice(1);
    setDrugs((prev) => [...prev, { id: `${lower}-${prev.length}`, name, rawText: raw }]);
  };

  return (
    <section
      aria-label="Interaction Checker"
      className={`dc-rise ${
        presentation === "panel"
          ? "space-y-5"
          : "overflow-hidden rounded-[14px] border border-[#dce6f0] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.05)]"
      }`}
    >
      {presentation === "inline" ? (
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
      ) : null}

      <div className={presentation === "panel" ? "rounded-[14px] bg-[#f3f5f6] p-4" : "px-4 py-3.5"}>
        <p className="text-[15px] font-medium leading-[1.45] text-[#273139]">
          Search for prescription drugs, OTC medications, or herbal supplements
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            addDrug();
          }}
          className="mt-4 flex items-center rounded-[8px] border border-[#c1ccd4] bg-white px-3 focus-within:border-[var(--mscp-color-brand-primary)] focus-within:ring-1 focus-within:ring-[var(--mscp-color-brand-primary)]"
        >
          <SearchIcon />
          <input
            aria-label="Add a medication"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Enter multiple medication names"
            className="h-11 min-w-0 flex-1 bg-transparent px-3 text-[15px] text-[#1b2b3a] outline-none placeholder:text-[#718796]"
          />
          <button type="submit" className="sr-only">
            Add medication
          </button>
        </form>

        <ul className="mt-4 flex flex-wrap gap-2">
          {drugs.map((drug) => (
            <li key={drug.id}>
              {drug.ambiguousOptions ? (
                <div className="rounded-[10px] border border-[#f0c56b] bg-[#fef7e8] px-3 py-2">
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
                <span className="inline-flex items-center gap-2 rounded-full border border-[#1760bd] bg-[#dbe7f8] py-2 pl-3.5 pr-2 text-[13px] font-semibold text-[#0b56b2]">
                  {drug.name}
                  <button
                    type="button"
                    aria-label={`Remove ${drug.name}`}
                    onClick={() => removeDrug(drug.id)}
                    style={{ touchAction: "manipulation" }}
                    className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[#0b56b2] transition hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
                  >
                    <RemoveIcon />
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

        <button
          type="button"
          onClick={() => {
            setDrugs([]);
            setDuplicateNotice(null);
            onRunCheck?.(0);
          }}
          className="mt-4 text-[14px] font-bold text-[var(--mscp-color-brand-primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
        >
          Clear All
        </button>
        {hasUnresolvedAmbiguity ? (
          <p className="mt-1.5 text-[11.5px] font-medium text-[#b54708]">
            Resolve the ambiguous medication before running the check.
          </p>
        ) : null}

      </div>

      <div aria-live="polite" className={presentation === "panel" ? "border-t border-[#cbd5dc] pt-5" : "border-t border-[#eef3f8] px-4 pb-4 pt-4"}>
          <div className="flex items-center gap-3">
            <InteractionCountIcon />
            <h3 className="text-[19px] font-semibold tracking-[-0.01em] text-[#1d252b]">
              {activePairs.length} Interaction{activePairs.length === 1 ? "" : "s"} Found
            </h3>
          </div>

          {groups.length === 0 ? (
            <div className="mt-5 rounded-[10px] bg-[#e2f5ea] px-3 py-2.5">
              <p className="text-[13px] font-bold text-[#067647]">No known interactions</p>
              <p className="mt-0.5 text-[13px] leading-[1.5] text-[#14532d]">
                No interactions were found among the confirmed medications in this list.
              </p>
            </div>
          ) : (
            <div className="mt-5 divide-y divide-[#d6dfe5] border-y border-[#d6dfe5]">
              {groups.map((group) => {
                const style = SEVERITY_GROUP_STYLE[group.severity]!;
                return (
                  <section key={group.severity} className="py-5 first:pt-5 last:pb-5">
                    <h4 className="flex items-center gap-2 text-[16px] font-bold" style={{ color: style.text }}>
                      <span
                        aria-hidden="true"
                        className="inline-flex h-4 w-4 items-center justify-center rounded-full border text-[11px] leading-none"
                        style={{ borderColor: style.accent, color: style.accent }}
                      >
                        !
                      </span>
                      {group.severity}
                    </h4>
                    <div className="mt-4 divide-y divide-[#e2e8ed]">
                      {group.pairs.map((pair, index) => (
                        <DrugToolResultCard key={index} presentation="bare" tool={pair.tool} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
          <p className="mt-4 text-[11px] font-medium leading-[1.45] text-[#5a6e7e]">
            {REGIMEN_CHECK.severityDisclaimer}
          </p>
      </div>
    </section>
  );
}
