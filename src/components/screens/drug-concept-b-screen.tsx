/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DrugConceptShell } from "@/components/medscape/drug-concepts/concept-shell";
import { DrugMonographCanvas } from "@/components/medscape/drug-concepts/monograph-canvas";
import { AiResponseAnswerContent } from "@/components/medscape/ai-response/answer-content";
import { AiResponseChatComposer } from "@/components/medscape/ai-response/chat-composer";
import { AiMobileTopRail } from "@/components/medscape/ai-response/mobile-top-rail";
import { AiMenuIcon } from "@/components/medscape/ai-response/iconography";
import { AiTopRailAction } from "@/components/medscape/ai-response/top-rail-action";
import { AiPreparingAnswerNotice } from "@/components/medscape/ai-response/preparing-answer-notice";
import { ScrollDownFAB } from "@/components/ui/scroll-down-fab";
import { aiResponseAssets } from "@/data/ai-response";
import {
  apixabanMonograph,
  getMatchedSubfieldId,
  getSectionBySubfieldId,
  getSubfieldById,
} from "@/data/drug-monograph";

const PRE_REPLY_DELAY_MS = 1100;

type TurnStatus = "complete" | "preparing";

type ChatTurn = {
  id: number;
  matchedSubfieldId: string | undefined;
  question: string;
  status: TurnStatus;
};

const SUGGESTED_QUERIES = [
  "Apixaban renal dose",
  "Apixaban AFib dosing",
  "Apixaban perioperative",
  "Apixaban drug interactions",
];

// Anchor the canvas lands on when a query matches no specific subfield.
const DEFAULT_ANCHOR = apixabanMonograph.sections[0]?.subfields[0]?.id;

// One-line in-thread pointer naming where the answer lives in the monograph.
function buildPointer(matchedSubfieldId: string | undefined): string {
  const subfield = matchedSubfieldId
    ? getSubfieldById(apixabanMonograph, matchedSubfieldId)
    : undefined;
  const section = matchedSubfieldId
    ? getSectionBySubfieldId(apixabanMonograph, matchedSubfieldId)
    : undefined;

  if (subfield && section) {
    return `That's covered under **${section.title} → ${subfield.title}** in the ${apixabanMonograph.drug.name} monograph. Open it to read the canonical text.`;
  }

  return `Open the **${apixabanMonograph.drug.name}** monograph to browse dosing, safety, interactions, and renal/hepatic guidance.`;
}

type DrugConceptMonographCanvasScreenProps = {
  /** If provided (from ?anchor= URL param), auto-opens the monograph canvas at this subfield. */
  initialAnchor?: string;
};

export function DrugConceptMonographCanvasScreen({ initialAnchor }: DrugConceptMonographCanvasScreenProps) {
  const composerInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextIdRef = useRef(1);

  const [draft, setDraft] = useState("");
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  // Auto-open the canvas when an anchor is provided via URL param.
  const [canvasOpen, setCanvasOpen] = useState(!!initialAnchor);
  const [canvasAnchor, setCanvasAnchor] = useState<string | undefined>(initialAnchor ?? undefined);
  const isGenerating = turns.some((t) => t.status === "preparing");

  const clearTimer = useCallback(() => {
    if (delayTimerRef.current) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const openCanvasAt = useCallback((subfieldId: string | undefined) => {
    setCanvasAnchor(subfieldId ?? DEFAULT_ANCHOR);
    setCanvasOpen(true);
  }, []);

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
        // If the canvas is already open, a follow-up re-points it instead of
        // dumping content into the thread.
        setCanvasOpen((open) => {
          if (open) setCanvasAnchor(matchedSubfieldId ?? DEFAULT_ANCHOR);
          return open;
        });
      }, PRE_REPLY_DELAY_MS);
    },
    [clearTimer],
  );

  const handleStopGeneration = useCallback(() => {
    clearTimer();
    setTurns((prev) => prev.map((t): ChatTurn => ({ ...t, status: "complete" })));
  }, [clearTimer]);

  return (
    <DrugConceptShell activeConcept="B">
      <div className="relative flex min-h-0 flex-1">
        {/* Chat column — shrinks to make room for the canvas on desktop */}
        <section
          className={[
            "relative flex min-h-0 flex-col",
            canvasOpen ? "flex-1 md:w-[42%] md:flex-none md:min-w-[360px]" : "flex-1",
          ].join(" ")}
        >
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
              className="mx-auto w-full max-w-[760px] px-4 pb-[136px] pt-3 md:px-6 md:pt-5"
            >
              {turns.length === 0 ? (
                <div className="flex flex-col items-center py-12 md:py-20">
                  <div className="dc-fade mb-3 rounded-full bg-[rgba(6,74,167,0.06)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--mscp-color-brand-primary)]">
                    Concept B
                  </div>
                  <h2 className="dc-rise mt-2 max-w-[380px] text-center text-[23px] font-extrabold leading-[1.2] tracking-[-0.02em] text-[#161b1d] [text-wrap:balance] md:text-[29px]">
                    Expandable Monograph Canvas
                  </h2>
                  <p className="dc-rise mt-3 max-w-[410px] text-center text-[14px] leading-[1.7] text-[#5a6e7e] [text-wrap:balance]">
                    The reply is a one-line pointer plus an Open monograph button that launches a
                    side canvas scrolled to the exact subfield. Follow-ups re-point the canvas.
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
                  <article key={turn.id} className="mx-auto mb-10 max-w-[720px] last:mb-0">
                    <h1 className="mb-5 text-[20px] font-extrabold leading-[1.24] tracking-[-0.02em] text-[#161b1d] [text-wrap:balance] md:text-[24px]">
                      {turn.question}
                    </h1>

                    {turn.status === "preparing" ? (
                      <AiPreparingAnswerNotice
                        question={turn.question}
                        text="Locating in drug reference…"
                      />
                    ) : (
                      <div className="dc-rise">
                        <AiResponseAnswerContent answer={buildPointer(turn.matchedSubfieldId)} />
                        <button
                          type="button"
                          onClick={() => openCanvasAt(turn.matchedSubfieldId)}
                          style={{ touchAction: "manipulation" }}
                          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--mscp-color-brand-primary)] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#0b5cc9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] focus-visible:ring-offset-2"
                        >
                          Open monograph
                          <span aria-hidden="true">→</span>
                        </button>
                      </div>
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
            <div className="mx-auto w-full max-w-[760px] px-4 pb-0 md:px-6">
              <div className="rounded-t-[28px] bg-gradient-to-b from-transparent via-white/82 to-white px-2 pb-[max(env(safe-area-inset-bottom),6px)] pt-3 md:pt-4">
                <AiResponseChatComposer
                  formClassName="pointer-events-auto flex min-h-[48px] items-center gap-2 rounded-[999px] border border-[rgba(109,153,206,0.45)] bg-white px-4 py-1 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_22px_rgba(16,24,40,0.06)]"
                  iconClassName="h-8 w-8"
                  inputClassName="h-8 flex-1 border-0 bg-transparent text-[16px] leading-[20px] text-[#1b2b3a] outline-none placeholder:text-[#93a2ae]"
                  inputRef={composerInputRef}
                  analyticsSourceSurface="drug_concept_b"
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

        {/* Monograph canvas — full-screen sheet on mobile, docked right panel on desktop */}
        {canvasOpen ? (
          <div className="fixed inset-0 z-50 md:relative md:inset-auto md:z-auto md:flex md:min-w-0 md:flex-1 md:border-l md:border-[#e4ecf4]">
            <DrugMonographCanvas
              monograph={apixabanMonograph}
              onClose={() => setCanvasOpen(false)}
              targetAnchor={canvasAnchor}
            />
          </div>
        ) : null}
      </div>
    </DrugConceptShell>
  );
}
