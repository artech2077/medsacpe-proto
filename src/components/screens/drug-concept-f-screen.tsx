/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DrugConceptShell } from "@/components/medscape/drug-concepts/concept-shell";
import { DrugInstantCard } from "@/components/medscape/drug-concepts/instant-card";
import { DrugMonographCanvas } from "@/components/medscape/drug-concepts/monograph-canvas";
import { AiResponseChatComposer } from "@/components/medscape/ai-response/chat-composer";
import { AiResponseAnswerContent } from "@/components/medscape/ai-response/answer-content";
import { AiResponseAnswerActions } from "@/components/medscape/ai-response/answer-actions";
import { AiMobileTopRail } from "@/components/medscape/ai-response/mobile-top-rail";
import { AiMenuIcon } from "@/components/medscape/ai-response/iconography";
import { AiTopRailAction } from "@/components/medscape/ai-response/top-rail-action";
import { AiPreparingAnswerNotice } from "@/components/medscape/ai-response/preparing-answer-notice";
import { ScrollDownFAB } from "@/components/ui/scroll-down-fab";
import { aiResponseAssets } from "@/data/ai-response";
import {
  apixabanMonograph,
  getMatchedSubfieldId,
} from "@/data/drug-monograph";

const PRE_CARD_DELAY_MS = 900;
const AI_SYNTHESIS_DELAY_MS = 1800;

type TurnStatus = "complete" | "preparing";
type AiStatus = "complete" | "preparing" | null;

type ChatTurn = {
  aiStatus: AiStatus;
  id: number;
  matchedSubfieldId: string | undefined;
  question: string;
  status: TurnStatus;
};

function getSynthesisText(matchedSubfieldId: string | undefined): string {
  if (matchedSubfieldId?.includes("renal")) {
    return apixabanMonograph.synthesizedAnswers["renal-dose-gfr35"]?.text ?? "";
  }
  return apixabanMonograph.synthesizedAnswers["afib-dose"]?.text ?? "";
}

const SUGGESTED_QUERIES = [
  "Apixaban",
  "Apixaban renal dose",
  "Apixaban AFib dosing",
  "Apixaban perioperative",
  "Apixaban drug interactions",
];

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

export function DrugConceptInstantCardScreen() {
  const composerInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aiTimerRefs = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const nextIdRef = useRef(1);

  const [draft, setDraft] = useState("");
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [canvasOpen, setCanvasOpen] = useState(false);
  const [canvasAnchor, setCanvasAnchor] = useState<string | undefined>();

  const isGenerating = turns.some((t) => t.status === "preparing");

  const clearMainTimer = useCallback(() => {
    if (clearTimerRef.current) {
      clearTimeout(clearTimerRef.current);
      clearTimerRef.current = null;
    }
  }, []);

  useEffect(
    () => () => {
      clearMainTimer();
      aiTimerRefs.current.forEach((t) => clearTimeout(t));
    },
    [clearMainTimer],
  );

  const submitQuestion = useCallback(
    (question: string) => {
      const trimmed = question.trim();
      if (!trimmed) return;

      clearMainTimer();
      const id = nextIdRef.current++;
      const matchedSubfieldId = getMatchedSubfieldId(trimmed);

      setTurns((prev) => [
        ...prev.map((t): ChatTurn => ({ ...t, status: "complete" })),
        { aiStatus: null, id, matchedSubfieldId, question: trimmed, status: "preparing" },
      ]);
      setDraft("");
      composerInputRef.current?.focus();

      clearTimerRef.current = setTimeout(() => {
        setTurns((prev) =>
          prev.map((t): ChatTurn => (t.id === id ? { ...t, status: "complete" } : t)),
        );
      }, PRE_CARD_DELAY_MS);
    },
    [clearMainTimer],
  );

  const handleStopGeneration = useCallback(() => {
    clearMainTimer();
    setTurns((prev) => prev.map((t): ChatTurn => ({ ...t, status: "complete" })));
  }, [clearMainTimer]);

  const handleAskAi = useCallback(
    (turnId: number) => {
      // Immediately set preparing
      setTurns((prev) =>
        prev.map((t): ChatTurn => (t.id === turnId ? { ...t, aiStatus: "preparing" } : t)),
      );

      const timer = setTimeout(() => {
        setTurns((prev) =>
          prev.map((t): ChatTurn => (t.id === turnId ? { ...t, aiStatus: "complete" } : t)),
        );
        aiTimerRefs.current.delete(turnId);
      }, AI_SYNTHESIS_DELAY_MS);

      aiTimerRefs.current.set(turnId, timer);
    },
    [],
  );

  const handleOpenMonograph = useCallback((anchor?: string) => {
    setCanvasAnchor(anchor);
    setCanvasOpen(true);
  }, []);

  return (
    <DrugConceptShell activeConcept="F">
      <section className="relative flex min-h-0 flex-1 flex-col">
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
        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div
            aria-live="polite"
            className="mx-auto w-full max-w-[900px] px-4 pb-[136px] pt-3 md:px-6 md:pt-5"
          >
            {turns.length === 0 ? (
              /* Landing state */
              <div className="flex flex-col items-center py-12 md:py-20">
                <div className="dc-fade mb-3 rounded-full bg-[rgba(6,74,167,0.06)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--mscp-color-brand-primary)]">
                  Concept F
                </div>
                <h2 className="dc-rise mt-2 max-w-[400px] text-center text-[23px] font-extrabold leading-[1.2] tracking-[-0.02em] text-[#161b1d] [text-wrap:balance] md:text-[29px]">
                  Instant Deterministic Answer Card
                </h2>
                <p className="dc-rise mt-3 max-w-[420px] text-center text-[14px] leading-[1.7] text-[#5a6e7e] [text-wrap:balance]">
                  Verbatim drug facts — Black Box Warning, key fields, and source labels — the
                  moment you search. AI synthesis is always opt-in.
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
              turns.map((turn) => (
                <article key={turn.id} className="mx-auto mb-10 max-w-[860px] last:mb-0">
                  {/* Question heading */}
                  <h1 className="mb-5 text-[22px] font-extrabold leading-[1.24] tracking-[-0.02em] text-[#161b1d] [text-wrap:balance] md:text-[28px]">
                    {turn.question}
                  </h1>

                  {turn.status === "preparing" ? (
                    <AiPreparingAnswerNotice
                      question={turn.question}
                      text="Looking up drug reference…"
                    />
                  ) : (
                    <>
                      {/* Deterministic instant card — the trusted anchor */}
                      <DrugInstantCard
                        matchedSubfieldId={turn.matchedSubfieldId}
                        monograph={apixabanMonograph}
                        onAskAi={() => turn.aiStatus === null && handleAskAi(turn.id)}
                        onOpenMonograph={handleOpenMonograph}
                      />

                      {/* Ask AI turn — clearly-labeled synthesis below the deterministic card */}
                      {turn.aiStatus === "preparing" && (
                        <div className="mt-4">
                          <div className="mb-3 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(6,74,167,0.07)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--mscp-color-brand-primary)]">
                              <SparkIcon className="h-3 w-3" />
                              AI Synthesis
                            </span>
                            <span className="text-[11px] text-[#8499af]">Medscape AI</span>
                          </div>
                          <AiPreparingAnswerNotice
                            question={turn.question}
                            text="Generating AI synthesis…"
                          />
                        </div>
                      )}

                      {turn.aiStatus === "complete" && (
                        <div className="mt-4 overflow-hidden rounded-[14px] border border-[rgba(6,74,167,0.14)] bg-[#f9fbff]">
                          {/* Synthesis label header */}
                          <div className="flex items-center gap-2 border-b border-[rgba(6,74,167,0.10)] bg-white px-4 py-2.5">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--mscp-color-brand-primary)]">
                              <SparkIcon className="h-3 w-3" />
                              AI Synthesis
                            </span>
                            <span className="text-[11px] text-[#8499af]">· Medscape AI · Generated</span>
                          </div>
                          <div className="px-4 py-4">
                            <AiResponseAnswerContent
                              answer={getSynthesisText(turn.matchedSubfieldId)}
                            />
                            <AiResponseAnswerActions
                              answer={getSynthesisText(turn.matchedSubfieldId)}
                              className="mt-5"
                            />
                          </div>
                        </div>
                      )}
                    </>
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
          <div className="mx-auto w-full max-w-[900px] px-4 pb-0 md:px-6">
            <div className="rounded-t-[28px] bg-gradient-to-b from-transparent via-white/82 to-white px-2 pb-[max(env(safe-area-inset-bottom),6px)] pt-3 md:pt-4">
              <AiResponseChatComposer
                formClassName="pointer-events-auto flex min-h-[48px] items-center gap-2 rounded-[999px] border border-[rgba(109,153,206,0.45)] bg-white px-4 py-1 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_22px_rgba(16,24,40,0.06)]"
                iconClassName="h-8 w-8"
                inputClassName="h-8 flex-1 border-0 bg-transparent text-[16px] leading-[20px] text-[#1b2b3a] outline-none placeholder:text-[#93a2ae]"
                inputRef={composerInputRef}
                analyticsSourceSurface="drug_concept_f"
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

      {/* Full monograph canvas overlay */}
      {canvasOpen && (
        <div className="absolute inset-0 z-30">
          <DrugMonographCanvas
            monograph={apixabanMonograph}
            onClose={() => setCanvasOpen(false)}
            targetAnchor={canvasAnchor}
          />
        </div>
      )}
    </DrugConceptShell>
  );
}
