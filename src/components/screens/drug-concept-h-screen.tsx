/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DrugConceptShell } from "@/components/medscape/drug-concepts/concept-shell";
import { AiResponseChatComposer } from "@/components/medscape/ai-response/chat-composer";
import { AiMobileTopRail } from "@/components/medscape/ai-response/mobile-top-rail";
import { AiMenuIcon } from "@/components/medscape/ai-response/iconography";
import { AiTopRailAction } from "@/components/medscape/ai-response/top-rail-action";
import { AiPreparingAnswerNotice } from "@/components/medscape/ai-response/preparing-answer-notice";
import {
  ClinicalBoxedWarning,
  ClinicalZoneIcon,
  getZoneAccent,
} from "@/components/medscape/drug-concepts/clinical-system";
import {
  DrugFieldSheet,
  CONCEPT_H_FIELD_CHIPS,
  getMatchedChipIntent,
  type FieldChip,
} from "@/components/medscape/drug-concepts/field-sheet";
import { ScrollDownFAB } from "@/components/ui/scroll-down-fab";
import { aiResponseAssets } from "@/data/ai-response";
import { apixabanMonograph, getMatchedSubfieldId, getSubfieldById } from "@/data/drug-monograph";

// ─── Constants ───────────────────────────────────────────────────────────────────

const PRE_CARD_DELAY_MS = 1100;

const SUGGESTED_QUERIES = [
  "Apixaban",
  "Apixaban AFib dose",
  "Apixaban renal dose",
  "Apixaban drug interactions",
  "Apixaban perioperative",
];

// ─── Types ───────────────────────────────────────────────────────────────────────

type TurnStatus = "complete" | "preparing";

type ChatTurn = {
  id: number;
  matchedSubfieldId: string | undefined;
  question: string;
  status: TurnStatus;
};

type SheetState =
  | { kind: "field"; chip: FieldChip; initialSubfieldId: string }
  | { kind: "interaction-checker" }
  | null;

// ─── Field chip pill ─────────────────────────────────────────────────────────────

function FieldChipPill({
  chip,
  isMatched,
  onClick,
}: {
  chip: FieldChip;
  isMatched: boolean;
  onClick: () => void;
}) {
  const accent = getZoneAccent(chip.sectionId);
  return (
    <button
      type="button"
      onClick={onClick}
      style={
        isMatched
          ? {
              backgroundColor: accent.tint,
              borderColor: accent.line,
              color: accent.fg,
            }
          : {
              backgroundColor: accent.soft,
              borderColor: accent.line,
              color: accent.fg,
            }
      }
      className="inline-flex min-h-[42px] shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-semibold leading-none transition-all hover:brightness-95 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.25)] focus-visible:ring-offset-1"
    >
      <ClinicalZoneIcon sectionId={chip.sectionId} className="h-[14px] w-[14px] shrink-0" />
      {chip.label}
      {isMatched && (
        <span
          className="ml-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] text-white"
          style={{ backgroundColor: accent.fg }}
          aria-label="Matched to your query"
        >
          ✓
        </span>
      )}
    </button>
  );
}

// Small pill-shaped chip for the interaction checker action
function InteractionCheckerChip({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-[42px] shrink-0 items-center gap-1.5 rounded-full border border-[#dcd2fb] bg-[#f3f0fe] px-3.5 text-[13px] font-semibold leading-none text-[#6938ef] transition-all hover:bg-[#ebe6fd] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(105,56,239,0.25)] focus-visible:ring-offset-1"
    >
      {/* two overlapping circles — interaction icon inline */}
      <svg
        viewBox="0 0 16 16"
        className="h-[14px] w-[14px] shrink-0"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="5.5" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="10.5" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.4" />
      </svg>
      Check Interactions
    </button>
  );
}

// ─── Chat reply card ──────────────────────────────────────────────────────────────

function DrugReplyCard({
  matchedSubfieldId,
  onChipOpen,
  onInteractionCheckerOpen,
}: {
  matchedSubfieldId: string | undefined;
  onChipOpen: (chip: FieldChip, subfieldId: string) => void;
  onInteractionCheckerOpen: () => void;
}) {
  const { drug, blackBoxWarnings } = apixabanMonograph;
  const matchedSubfield = matchedSubfieldId
    ? getSubfieldById(apixabanMonograph, matchedSubfieldId)
    : undefined;

  // Determine which chip is "matched" so it gets the highlighted style
  const matchedChipId = CONCEPT_H_FIELD_CHIPS.find((c) =>
    matchedSubfieldId ? c.subfieldIds.includes(matchedSubfieldId) : false,
  )?.id;

  // One-liner context text shown between the BBW and the chip strip
  const contextText =
    matchedSubfield?.summary ??
    "Tap a field below to explore canonical dosing, warnings, interactions, and renal content.";

  return (
    <div className="overflow-hidden rounded-[16px] border border-[rgba(109,153,206,0.28)] bg-white shadow-[0_2px_12px_rgba(6,74,167,0.07)]">
      {/* Drug header */}
      <div className="flex items-center gap-3 border-b border-[#eef2f7] px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e6eefb]">
          <svg
            viewBox="0 0 24 24"
            className="h-[18px] w-[18px] text-[#064aa7]"
            fill="none"
            aria-hidden="true"
          >
            <g
              style={{
                transformBox: "fill-box",
                transformOrigin: "center",
                transform: "rotate(45deg)",
              }}
            >
              <rect
                x="2.5"
                y="8.5"
                width="19"
                height="7"
                rx="3.5"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <path
                d="M12 8.5v7"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-[17px] font-extrabold leading-tight text-[#161b1d]">
            {drug.name}
          </p>
          <p className="text-[11.5px] font-medium text-[#7a90a4]">{drug.drugClass}</p>
        </div>
        {/* Verified badge */}
        <span className="ml-auto flex shrink-0 items-center gap-1 rounded-full bg-[#f0f4f8] px-2.5 py-1 text-[10.5px] font-semibold text-[#5a6e7e]">
          <svg
            viewBox="0 0 12 12"
            className="h-2.5 w-2.5 text-[#0e7090]"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 1 10.5 2.6v3.8c0 2.8-2 4.8-4.5 5.6C3.5 11.2 1.5 9.2 1.5 6.4V2.6L6 1Z"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
            <path
              d="m4 6 1.4 1.4 2.6-2.8"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Drug Reference
        </span>
      </div>

      {/* Boxed Warning — always shown eagerly, never hidden */}
      <div className="px-4 pt-3.5">
        <ClinicalBoxedWarning warnings={blackBoxWarnings} compact />
      </div>

      {/* Context text */}
      <div className="px-4 pt-3.5">
        <p className="text-[13.5px] leading-[1.6] text-[#4b5a67]">{contextText}</p>
      </div>

      {/* Field-switcher chip strip */}
      <div className="px-4 pb-3 pt-3">
        <div className="flex flex-wrap gap-2">
          {CONCEPT_H_FIELD_CHIPS.map((chip) => {
            const intent = getMatchedChipIntent(matchedSubfieldId);
            const initialSubfieldId =
              chip.id === intent?.chip.id
                ? intent.initialSubfieldId
                : chip.subfieldIds[0] ?? "";
            return (
              <FieldChipPill
                key={chip.id}
                chip={chip}
                isMatched={chip.id === matchedChipId}
                onClick={() => onChipOpen(chip, initialSubfieldId)}
              />
            );
          })}
          <InteractionCheckerChip onClick={onInteractionCheckerOpen} />
        </div>
      </div>
    </div>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────────

export function DrugConceptMobileSheetsScreen({ shellClassName, compact }: { shellClassName?: string; compact?: boolean } = {}) {
  const composerInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextIdRef = useRef(1);

  const [draft, setDraft] = useState("");
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [sheetState, setSheetState] = useState<SheetState>(null);

  const isGenerating = turns.some((t) => t.status === "preparing");

  const clearTimer = useCallback(() => {
    if (delayTimerRef.current) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const submitQuestion = useCallback(
    (question: string) => {
      const trimmed = question.trim();
      if (!trimmed) return;

      clearTimer();
      const id = nextIdRef.current++;
      const matchedSubfieldId = getMatchedSubfieldId(trimmed);

      setTurns((prev) => [
        ...prev.map((t): ChatTurn => ({ ...t, status: "complete" })),
        { id, matchedSubfieldId, question: trimmed, status: "preparing" },
      ]);
      setDraft("");
      composerInputRef.current?.focus();

      delayTimerRef.current = setTimeout(() => {
        setTurns((prev) =>
          prev.map((t): ChatTurn => t.id === id ? { ...t, status: "complete" } : t),
        );
      }, PRE_CARD_DELAY_MS);
    },
    [clearTimer],
  );

  const handleStopGeneration = useCallback(() => {
    clearTimer();
    setTurns((prev) => prev.map((t): ChatTurn => ({ ...t, status: "complete" })));
  }, [clearTimer]);

  const openFieldSheet = useCallback((chip: FieldChip, initialSubfieldId: string) => {
    setSheetState({ kind: "field", chip, initialSubfieldId });
  }, []);

  const openInteractionChecker = useCallback(() => {
    setSheetState({ kind: "interaction-checker" });
  }, []);

  const closeSheet = useCallback(() => {
    setSheetState(null);
  }, []);

  return (
    <DrugConceptShell activeConcept="H" className={shellClassName} compact={compact}>
      <section className="relative flex min-h-0 flex-1 flex-col">
        {/* Mobile top rail — always visible (not md:hidden) since Concept H is phone-first */}
        <div className="relative z-20 sticky top-0">
          <AiMobileTopRail
            className="relative z-20"
            railClassName="bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_72%,rgba(255,255,255,0)_100%)] px-3 pb-3 pt-2"
            contentClassName="relative flex min-h-[48px] items-start justify-between gap-2"
            left={
              <button
                type="button"
                aria-label="Home"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#687680] transition hover:bg-[rgba(0,0,0,0.05)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
              >
                <AiMenuIcon />
              </button>
            }
            center={
              <img
                src={aiResponseAssets.logoAssets.medscapeAi}
                alt="Medscape AI"
                className="h-[22px] w-auto object-contain"
              />
            }
            right={
              <>
                <AiTopRailAction iconSrc={aiResponseAssets.uiIcons.share} label="Share" compact={compact} />
                <AiTopRailAction iconSrc={aiResponseAssets.uiIcons.download} label="Download" compact={compact} />
              </>
            }
            rightClassName="relative z-10 ml-auto flex items-center gap-0.5"
          />
        </div>

        {/* Scrollable chat thread */}
        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div
            aria-live="polite"
            className="mx-auto w-full max-w-[520px] px-4 pb-[144px] pt-2 md:px-6"
          >
            {turns.length === 0 ? (
              /* ─── Empty / landing state ─── */
              <div className="flex flex-col items-center py-10">
                <div className="mb-2 rounded-full bg-[rgba(6,74,167,0.06)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--mscp-color-brand-primary)]">
                  Concept H
                </div>
                <h2 className="mt-2 max-w-[340px] text-center text-[22px] font-extrabold leading-[1.2] tracking-[-0.02em] text-[#161b1d] [text-wrap:balance] md:text-[26px]">
                  Mobile-First Chat Answer
                </h2>
                <p className="mt-2.5 max-w-[360px] text-center text-[13.5px] leading-[1.65] text-[#5a6e7e] [text-wrap:balance]">
                  Ask about a drug. The reply pins the Black Box Warning and opens
                  field-specific content in a dismissible sheet — one-handed, no scroll.
                </p>

                {/* Suggested query chips */}
                <div className="mt-7 flex flex-wrap justify-center gap-2">
                  {SUGGESTED_QUERIES.map((q, i) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => submitQuestion(q)}
                      style={{ animationDelay: `${100 + i * 50}ms`, touchAction: "manipulation" }}
                      className="rounded-full border border-[rgba(6,74,167,0.18)] bg-white/80 px-4 py-2.5 text-[13px] font-semibold text-[var(--mscp-color-brand-primary)] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] focus-visible:ring-offset-1"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {/* Chip strip preview hint */}
                <div className="mt-8 w-full max-w-[360px] overflow-hidden rounded-[14px] border border-[rgba(109,153,206,0.22)] bg-[rgba(255,255,255,0.7)] px-3 py-3 backdrop-blur-sm">
                  <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9aafc2]">
                    Field switcher preview
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {CONCEPT_H_FIELD_CHIPS.map((chip) => {
                      const accent = getZoneAccent(chip.sectionId);
                      return (
                        <span
                          key={chip.id}
                          className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11.5px] font-semibold"
                          style={{
                            backgroundColor: accent.soft,
                            borderColor: accent.line,
                            color: accent.fg,
                          }}
                        >
                          <ClinicalZoneIcon
                            sectionId={chip.sectionId}
                            className="h-3 w-3 shrink-0"
                          />
                          {chip.label}
                        </span>
                      );
                    })}
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#dcd2fb] bg-[#f3f0fe] px-2.5 py-1 text-[11.5px] font-semibold text-[#6938ef]">
                      ↔ Check Interactions
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* ─── Chat turns ─── */
              turns.map((turn) => (
                <article key={turn.id} className="mb-6 last:mb-0">
                  {/* User question bubble — right-aligned */}
                  <div className="mb-4 flex justify-end">
                    <div className="max-w-[80%] rounded-[18px] rounded-tr-[6px] bg-[#064aa7] px-4 py-2.5 text-[14px] leading-[1.5] font-medium text-white shadow-[0_2px_8px_rgba(6,74,167,0.28)]">
                      {turn.question}
                    </div>
                  </div>

                  {/* AI reply */}
                  {turn.status === "preparing" ? (
                    <AiPreparingAnswerNotice
                      question={turn.question}
                      text="Looking up drug reference…"
                    />
                  ) : (
                    <DrugReplyCard
                      matchedSubfieldId={turn.matchedSubfieldId}
                      onChipOpen={openFieldSheet}
                      onInteractionCheckerOpen={openInteractionChecker}
                    />
                  )}
                </article>
              ))
            )}
          </div>
        </div>

        {/* Scroll-down FAB — visible when content overflows the viewport */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[72px] z-20 flex justify-center">
          <ScrollDownFAB scrollRef={scrollRef} />
        </div>

        {/* Fixed composer */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
          <div className="mx-auto w-full max-w-[520px] px-4 pb-0 md:px-6">
            <div className="rounded-t-[28px] bg-gradient-to-b from-transparent via-white/85 to-white px-2 pb-[max(env(safe-area-inset-bottom),6px)] pt-3">
              <AiResponseChatComposer
                formClassName="pointer-events-auto flex min-h-[48px] items-center gap-2 rounded-[999px] border border-[rgba(109,153,206,0.45)] bg-white px-4 py-1 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_22px_rgba(16,24,40,0.06)]"
                iconClassName="h-8 w-8"
                inputClassName="h-8 flex-1 border-0 bg-transparent text-[16px] leading-[20px] text-[#1b2b3a] outline-none placeholder:text-[#93a2ae]"
                inputRef={composerInputRef}
                analyticsSourceSurface="drug_concept_h"
                isGenerating={isGenerating}
                onStopGeneration={handleStopGeneration}
                onSubmit={() => submitQuestion(draft)}
                onValueChange={setDraft}
                placeholder="Ask about a drug…"
                submitButtonClassName="inline-flex h-8 w-8 shrink-0 items-center justify-center"
                value={draft}
              />
            </div>
          </div>
        </div>

        {/* Bottom sheet — rendered inside the white panel so z-40 stacks above the thread */}
        {sheetState?.kind === "field" ? (
          <DrugFieldSheet
            variant="field"
            chip={sheetState.chip}
            initialSubfieldId={sheetState.initialSubfieldId}
            monograph={apixabanMonograph}
            onClose={closeSheet}
          />
        ) : sheetState?.kind === "interaction-checker" ? (
          <DrugFieldSheet
            variant="interaction-checker"
            monograph={apixabanMonograph}
            onClose={closeSheet}
          />
        ) : null}
      </section>
    </DrugConceptShell>
  );
}
