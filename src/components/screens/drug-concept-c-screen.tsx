/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DrugMonographAccordion } from "@/components/medscape/drug-concepts/monograph-accordion";
import { DrugConceptShell } from "@/components/medscape/drug-concepts/concept-shell";
import { AiResponseChatComposer } from "@/components/medscape/ai-response/chat-composer";
import { AiMobileTopRail } from "@/components/medscape/ai-response/mobile-top-rail";
import { AiMenuIcon } from "@/components/medscape/ai-response/iconography";
import { AiTopRailAction } from "@/components/medscape/ai-response/top-rail-action";
import { AiPreparingAnswerNotice } from "@/components/medscape/ai-response/preparing-answer-notice";
import { ScrollDownFAB } from "@/components/ui/scroll-down-fab";
import { aiResponseAssets } from "@/data/ai-response";
import { apixabanMonograph, getMatchedSubfieldId } from "@/data/drug-monograph";

const PRE_CARD_DELAY_MS = 1100;

type TurnStatus = "complete" | "preparing";

type ChatTurn = {
  id: number;
  matchedSubfieldId: string | undefined;
  question: string;
  status: TurnStatus;
};

// Suggested queries shown in the empty state
const SUGGESTED_QUERIES = [
  "Apixaban",
  "Apixaban renal dose",
  "Apixaban AFib dosing",
  "Apixaban perioperative",
  "Apixaban drug interactions",
];

export function DrugConceptAccordionScreen() {
  const composerInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextIdRef = useRef(1);

  const [draft, setDraft] = useState("");
  const [turns, setTurns] = useState<ChatTurn[]>([]);
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
          prev.map((t): ChatTurn => (t.id === id ? { ...t, status: "complete" } : t)),
        );
      }, PRE_CARD_DELAY_MS);
    },
    [clearTimer],
  );

  const handleStopGeneration = useCallback(() => {
    clearTimer();
    setTurns((prev) => prev.map((t): ChatTurn => ({ ...t, status: "complete" })));
  }, [clearTimer]);

  return (
    <DrugConceptShell activeConcept="C">
      <section className="relative flex min-h-0 min-w-0 flex-1 flex-col">
        {/* Top fade */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[68px] bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_68%,rgba(255,255,255,0)_100%)]"
        />

        {/* Mobile header */}
        <div className="relative z-20 sticky top-0">
          <AiMobileTopRail
            railClassName="bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_72%,rgba(255,255,255,0)_100%)] px-3 pb-3 pt-2"
            contentClassName="relative flex min-h-[48px] items-start justify-between gap-2"
            left={
              <button
                type="button"
                aria-label="Home"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#687680] transition hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
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
                <AiTopRailAction iconSrc={aiResponseAssets.uiIcons.share} label="Share" />
                <AiTopRailAction iconSrc={aiResponseAssets.uiIcons.download} label="Download" />
              </>
            }
            rightClassName="relative z-10 ml-auto flex items-center gap-0.5"
          />

          {/* Desktop header */}
          <div className="hidden md:block">
            <div className="absolute inset-x-0 top-0 h-[68px] bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_72%,rgba(255,255,255,0)_100%)]" />
            <div className="relative flex min-h-[52px] items-center justify-between gap-2 px-5 pt-2">
              <button
                type="button"
                aria-label="Home"
                className="relative z-10 inline-flex h-9 w-9 items-center justify-center rounded-full text-[#687680] transition hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
              >
                <AiMenuIcon />
              </button>
              <img
                src={aiResponseAssets.logoAssets.medscapeAi}
                alt="Medscape AI"
                className="absolute left-1/2 top-2 h-[24px] w-auto -translate-x-1/2 object-contain"
              />
              <div className="relative z-10 ml-auto flex items-center gap-1">
                <AiTopRailAction iconSrc={aiResponseAssets.uiIcons.share} label="Share" />
                <AiTopRailAction iconSrc={aiResponseAssets.uiIcons.download} label="Download" />
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable chat area */}
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain"
        >
          <div
            aria-live="polite"
            className="mx-auto w-full max-w-[900px] px-4 pb-[136px] pt-3 md:px-6 md:pt-5"
          >
            {turns.length === 0 ? (
              /* Empty / landing state */
              <div className="flex flex-col items-center py-12 md:py-20">
                <div className="dc-fade mb-3 rounded-full bg-[rgba(6,74,167,0.06)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--mscp-color-brand-primary)]">
                  Concept C
                </div>
                <h2 className="dc-rise mt-2 max-w-[380px] text-center text-[23px] font-extrabold leading-[1.2] tracking-[-0.02em] text-[#161b1d] [text-wrap:balance] md:text-[29px]">
                  Progressive Accordion Answer
                </h2>
                <p className="dc-rise mt-3 max-w-[410px] text-center text-[14px] leading-[1.7] text-[#5a6e7e] [text-wrap:balance]">
                  One compact message that nests from section summaries to subfields to verbatim
                  canonical text. A sticky jump bar keeps your place. Fully deterministic.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                  {SUGGESTED_QUERIES.map((q, i) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => submitQuestion(q)}
                      style={{ animationDelay: `${120 + i * 55}ms`, touchAction: "manipulation" }}
                      className="dc-rise rounded-full border border-[rgba(6,74,167,0.18)] bg-white/70 px-4 py-2 text-[13px] font-semibold text-[var(--mscp-color-brand-primary)] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] focus-visible:ring-offset-1"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Chat turns */
              turns.map((turn) => (
                <article key={turn.id} className="mx-auto mb-10 max-w-[860px] last:mb-0">
                  <h1 className="mb-5 text-[22px] font-extrabold leading-[1.24] tracking-[-0.02em] text-[#161b1d] [text-wrap:balance] md:text-[28px]">
                    {turn.question}
                  </h1>

                  {turn.status === "preparing" ? (
                    <AiPreparingAnswerNotice
                      question={turn.question}
                      text="Looking up drug reference…"
                    />
                  ) : (
                    <DrugMonographAccordion
                      matchedSubfieldId={turn.matchedSubfieldId}
                      monograph={apixabanMonograph}
                    />
                  )}
                </article>
              ))
            )}
          </div>
        </div>

        {/* Scroll-down FAB — visible when content overflows the viewport */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[76px] z-10">
          <div className="mx-auto flex w-full max-w-[900px] justify-center px-5">
            <ScrollDownFAB scrollRef={scrollRef} />
          </div>
        </div>

        {/* Fixed composer */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
          <div className="mx-auto w-full max-w-[900px] px-4 pb-0 md:px-6">
            <div className="rounded-t-[28px] bg-gradient-to-b from-transparent via-white/82 to-white px-2 pb-[max(env(safe-area-inset-bottom),6px)] pt-3 md:pt-4">
              <AiResponseChatComposer
                formClassName="pointer-events-auto flex min-h-[48px] items-center gap-2 rounded-[999px] border border-[rgba(109,153,206,0.45)] bg-white px-4 py-1 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_22px_rgba(16,24,40,0.06)]"
                iconClassName="h-8 w-8"
                inputClassName="h-8 flex-1 border-0 bg-transparent text-[16px] leading-[20px] text-[#1b2b3a] outline-none placeholder:text-[#93a2ae]"
                inputRef={composerInputRef}
                analyticsSourceSurface="drug_concept_c"
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
      </section>
    </DrugConceptShell>
  );
}
