/* eslint-disable @next/next/no-img-element */
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AiResponseAnswerActions } from "@/components/medscape/ai-response/answer-actions";
import { AiResponseChatComposer } from "@/components/medscape/ai-response/chat-composer";
import { AiMenuIcon } from "@/components/medscape/ai-response/iconography";
import { AiMobileTopRail } from "@/components/medscape/ai-response/mobile-top-rail";
import { AiPreparingAnswerNotice } from "@/components/medscape/ai-response/preparing-answer-notice";
import { AiTopRailAction } from "@/components/medscape/ai-response/top-rail-action";
import { DrugConceptShell } from "@/components/medscape/drug-concepts/concept-shell";
import { DrugPinnedRail } from "@/components/medscape/drug-concepts/pinned-rail";
import { ScrollDownFAB } from "@/components/ui/scroll-down-fab";
import { aiResponseAssets } from "@/data/ai-response";
import {
  apixabanMonograph,
  getSynthesizedAnswerForQuestion,
  type DrugSynthesizedAnswer,
} from "@/data/drug-monograph";

const PRE_STREAM_DELAY_MS = 1100;
const STREAM_TICK_MS = 20;
const STREAM_CHUNK_SIZE = 3;

const INITIAL_QUESTION = "What's the standard apixaban dose for nonvalvular AF?";

const SUGGESTED_QUERIES = [
  "Standard apixaban dose for AFib",
  "Renal impairment adjustment",
  "Hepatic impairment guidance",
  "Interactions with ketoconazole",
  "Perioperative management",
];

type TurnStatus = "complete" | "preparing" | "streaming";

type ChatTurn = {
  answer: string;
  citations: { anchor: string; marker: number }[];
  followUpQuestions: string[];
  fullAnswer: string;
  id: number;
  question: string;
  status: TurnStatus;
};

// ── Cited answer text ──────────────────────────────────────────────────────────
// Renders paragraphs with [N] markers as interactive citation chips when complete,
// or plain superscript text during streaming.

function CitedText({
  citations,
  isComplete,
  onCitationClick,
  text,
}: {
  citations: { anchor: string; marker: number }[];
  isComplete: boolean;
  onCitationClick: (anchor: string) => void;
  text: string;
}) {
  const parts = text.split(/(\[\d+\])/);

  const rendered: ReactNode[] = parts.map((part, i) => {
    const match = part.match(/^\[(\d+)\]$/);
    if (match) {
      const marker = parseInt(match[1], 10);
      const citation = citations.find((c) => c.marker === marker);
      if (citation && isComplete) {
        return (
          <button
            key={i}
            type="button"
            title="Jump to source in drug reference"
            onClick={() => onCitationClick(citation.anchor)}
            className="group -m-2 mx-px inline-flex p-2 align-middle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
          >
            <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[rgba(6,74,167,0.1)] px-1 text-[10px] font-bold text-[var(--mscp-color-brand-primary)] transition-colors group-hover:bg-[rgba(6,74,167,0.22)]">
              {marker}
            </span>
          </button>
        );
      }
      return (
        <sup
          key={i}
          className="text-[10px] font-semibold text-[var(--mscp-color-brand-primary)]"
        >
          [{marker}]
        </sup>
      );
    }
    return <span key={i}>{part}</span>;
  });

  return <p className="text-[15px] leading-[1.7] text-[#2e3d4a]">{rendered}</p>;
}

// ── Follow-up chips ────────────────────────────────────────────────────────────

function FollowUpChips({
  onSelect,
  questions,
}: {
  onSelect: (q: string) => void;
  questions: string[];
}) {
  if (!questions.length) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <p className="w-full text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5a6e7e]">
        Follow-up
      </p>
      {questions.map((q) => (
        <button
          key={q}
          type="button"
          onClick={() => onSelect(q)}
          className="rounded-full border border-[rgba(6,74,167,0.22)] bg-[rgba(6,74,167,0.04)] px-3 py-1.5 text-[12px] font-semibold text-[var(--mscp-color-brand-primary)] transition-colors hover:bg-[rgba(6,74,167,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
        >
          {q}
        </button>
      ))}
    </div>
  );
}

// ── Mobile drug info sticky bar ────────────────────────────────────────────────
// Shows drug name + BBW badge and opens the rail sheet when tapped.

function MobileDrugInfoBar({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="md:hidden shrink-0 border-b border-[#eef2f7] bg-white/98 backdrop-blur-sm">
      <button
        type="button"
        onClick={onOpen}
        className="flex min-h-[44px] w-full items-center gap-3 px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--mscp-color-brand-primary)]"
        aria-label="Open drug reference panel"
      >
        <div className="min-w-0 flex-1 text-left">
          <span className="text-[13px] font-bold text-[#22282d]">
            {apixabanMonograph.drug.name}
          </span>
          <span className="ml-2 text-[11px] text-[#5a6e7e]">
            {apixabanMonograph.drug.drugClass}
          </span>
        </div>
        <span className="shrink-0 rounded-full border border-[#fecdc9] bg-[#fff5f4] px-2 py-0.5 text-[11px] font-bold text-[#7a271a]">
          ⚠ BBW
        </span>
        <span
          aria-hidden="true"
          className="shrink-0 text-[11px] font-semibold text-[var(--mscp-color-brand-primary)]"
        >
          Drug Info →
        </span>
      </button>
    </div>
  );
}

// ── Main screen ────────────────────────────────────────────────────────────────

export function DrugConceptPinnedRailScreen() {
  const composerInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const streamIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const nextIdRef = useRef(1);
  const startedInitRef = useRef(false);

  const [draft, setDraft] = useState("");
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [railFocusAnchor, setRailFocusAnchor] = useState<string | undefined>();
  const [mobileRailOpen, setMobileRailOpen] = useState(false);

  useEffect(() => {
    if (!mobileRailOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileRailOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileRailOpen]);

  const isGenerating = turns.some(
    (t) => t.status === "preparing" || t.status === "streaming",
  );

  const clearTimers = useCallback(() => {
    if (delayTimerRef.current) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
    }
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const handleCitationClick = useCallback((anchor: string) => {
    setRailFocusAnchor(anchor);
    setMobileRailOpen(true);
  }, []);

  const startTurn = useCallback(
    (question: string) => {
      const trimmed = question.trim();
      if (!trimmed) return;

      clearTimers();

      const id = nextIdRef.current++;
      const synthesized: DrugSynthesizedAnswer = getSynthesizedAnswerForQuestion(
        trimmed,
        apixabanMonograph,
      );
      const fullAnswer = synthesized.text;
      const citations = synthesized.citations;
      const followUpQuestions = synthesized.followUpQuestions ?? [];

      setTurns((prev) => [
        ...prev.map((t): ChatTurn =>
          t.status === "complete" ? t : { ...t, status: "complete" },
        ),
        {
          answer: "",
          citations,
          followUpQuestions,
          fullAnswer,
          id,
          question: trimmed,
          status: "preparing",
        },
      ]);
      setDraft("");
      composerInputRef.current?.focus();

      delayTimerRef.current = setTimeout(() => {
        setTurns((prev) =>
          prev.map((t): ChatTurn =>
            t.id === id ? { ...t, answer: "", status: "streaming" } : t,
          ),
        );

        let nextLength = 0;
        streamIntervalRef.current = setInterval(() => {
          nextLength = Math.min(nextLength + STREAM_CHUNK_SIZE, fullAnswer.length);
          const nextAnswer = fullAnswer.slice(0, nextLength);

          setTurns((prev) =>
            prev.map((t): ChatTurn => (t.id === id ? { ...t, answer: nextAnswer } : t)),
          );

          if (nextLength >= fullAnswer.length) {
            if (streamIntervalRef.current) {
              clearInterval(streamIntervalRef.current);
              streamIntervalRef.current = null;
            }
            setTurns((prev) =>
              prev.map((t): ChatTurn => (t.id === id ? { ...t, status: "complete" } : t)),
            );
            if (citations[0]) {
              setRailFocusAnchor(citations[0].anchor);
            }
          }
        }, STREAM_TICK_MS);
      }, PRE_STREAM_DELAY_MS);
    },
    [clearTimers],
  );

  const handleStopGeneration = useCallback(() => {
    clearTimers();
    setTurns((prev) =>
      prev.map((t): ChatTurn => ({ ...t, status: "complete" })),
    );
  }, [clearTimers]);

  useEffect(() => {
    if (startedInitRef.current) return;
    startedInitRef.current = true;
    const frameId = requestAnimationFrame(() => startTurn(INITIAL_QUESTION));
    return () => cancelAnimationFrame(frameId);
  }, [startTurn]);

  const handleSubmit = useCallback(() => {
    if (!draft.trim()) return;
    startTurn(draft);
  }, [draft, startTurn]);

  return (
    <DrugConceptShell activeConcept="G">
      <div className="relative flex min-h-0 flex-1">
        {/* ── Chat column ─────────────────────────────────────────────────── */}
        <section className="relative flex min-h-0 flex-1 flex-col">
          {/* Top fade */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[68px] bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_68%,rgba(255,255,255,0)_100%)]"
          />

          {/* Sticky header */}
          <div className="relative z-20 sticky top-0">
            <AiMobileTopRail
              railClassName="bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_72%,rgba(255,255,255,0)_100%)] px-3 pb-3 pt-2 md:hidden"
              contentClassName="relative flex min-h-[48px] items-start justify-between gap-2"
              left={
                <button
                  type="button"
                  aria-label="Menu"
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
                  aria-label="Menu"
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

          {/* Mobile sticky drug info bar */}
          <MobileDrugInfoBar onOpen={() => setMobileRailOpen(true)} />

          {/* Scrollable chat thread */}
          <div
            ref={scrollRef}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
          >
            <div
              aria-live="polite"
              className="mx-auto w-full max-w-[680px] px-4 pb-[136px] pt-3 md:px-6 md:pt-5"
            >
              {/* Empty state */}
              {turns.length === 0 ? (
                <div className="flex flex-col items-center py-10 md:py-16">
                  <div className="mb-3 rounded-full bg-[rgba(6,74,167,0.06)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--mscp-color-brand-primary)]">
                    Concept G
                  </div>
                  <h2 className="mt-2 max-w-[380px] text-center text-[22px] font-extrabold leading-[1.2] tracking-[-0.02em] text-[#161b1d] [text-wrap:balance] md:text-[27px]">
                    Conversational Thread + Pinned Drug Rail
                  </h2>
                  <p className="mt-3 max-w-[420px] text-center text-[14px] leading-[1.7] text-[#5a6e7e] [text-wrap:balance]">
                    Every answer is synthesized and cited. Tap a citation chip to scroll the
                    pinned drug rail to the matching subfield.
                  </p>
                  <div className="mt-7 flex flex-wrap justify-center gap-2">
                    {SUGGESTED_QUERIES.map((q, i) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => startTurn(q)}
                        style={{ animationDelay: `${120 + i * 55}ms` }}
                        className="rounded-full border border-[rgba(6,74,167,0.18)] bg-white/70 px-4 py-2 text-[13px] font-semibold text-[var(--mscp-color-brand-primary)] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Chat turns */}
              {turns.map((turn) => (
                <article key={turn.id} className="mb-10 last:mb-0">
                  <h2 className="mb-4 text-[19px] font-extrabold leading-[1.24] tracking-[-0.02em] text-[#161b1d] [text-wrap:balance] md:text-[22px]">
                    {turn.question}
                  </h2>

                  {turn.status === "preparing" ? (
                    <AiPreparingAnswerNotice
                      question={turn.question}
                      text="Synthesizing from drug reference…"
                    />
                  ) : (
                    <div>
                      <CitedText
                        citations={turn.citations}
                        isComplete={turn.status === "complete"}
                        onCitationClick={handleCitationClick}
                        text={turn.answer}
                      />

                      {turn.status === "complete" ? (
                        <>
                          <div className="mt-3 border-t border-[#eef2f7] pt-3">
                            <AiResponseAnswerActions
                              answer={turn.fullAnswer}
                              copyText={turn.fullAnswer}
                            />
                          </div>
                          <FollowUpChips
                            onSelect={startTurn}
                            questions={turn.followUpQuestions}
                          />
                        </>
                      ) : null}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>

          {/* Scroll-down FAB — visible when content overflows the viewport */}
          <div className="pointer-events-none absolute inset-x-0 bottom-[76px] z-10">
            <div className="mx-auto flex w-full max-w-[900px] justify-center px-5">
              <ScrollDownFAB scrollRef={scrollRef} />
            </div>
          </div>

          {/* Fixed floating composer */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
            <div className="mx-auto w-full max-w-[680px] px-4 pb-0 md:px-6">
              <div className="rounded-t-[28px] bg-gradient-to-b from-transparent via-white/82 to-white px-2 pb-[max(env(safe-area-inset-bottom),6px)] pt-3 md:pt-4">
                <AiResponseChatComposer
                  formClassName="pointer-events-auto flex min-h-[48px] items-center gap-2 rounded-[999px] border border-[rgba(109,153,206,0.45)] bg-white px-4 py-1 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_22px_rgba(16,24,40,0.06)]"
                  iconClassName="h-8 w-8"
                  inputClassName="h-8 flex-1 border-0 bg-transparent text-[16px] leading-[20px] text-[#1b2b3a] outline-none placeholder:text-[#93a2ae]"
                  inputRef={composerInputRef}
                  analyticsSourceSurface="drug_concept_g"
                  isGenerating={isGenerating}
                  onStopGeneration={handleStopGeneration}
                  onSubmit={handleSubmit}
                  onValueChange={setDraft}
                  placeholder="Ask about Apixaban…"
                  submitButtonClassName="inline-flex h-8 w-8 shrink-0 items-center justify-center"
                  value={draft}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Desktop pinned rail ──────────────────────────────────────────── */}
        <aside
          aria-label="Drug reference rail"
          className="hidden w-[280px] shrink-0 border-l border-[#e4ecf4] md:flex"
        >
          <DrugPinnedRail
            className="h-full w-full"
            focusAnchor={railFocusAnchor}
            monograph={apixabanMonograph}
          />
        </aside>

        {/* ── Mobile rail sheet ────────────────────────────────────────────── */}
        {mobileRailOpen ? (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <button
              type="button"
              aria-label="Close drug reference"
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
              onClick={() => setMobileRailOpen(false)}
            />
            {/* Sheet — slides up from bottom */}
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Drug reference"
              className="absolute inset-x-0 bottom-0 top-[8%] overflow-hidden rounded-t-[24px] bg-white shadow-[0_-8px_40px_rgba(6,74,167,0.16)]"
            >
              <DrugPinnedRail
                className="h-full w-full"
                focusAnchor={railFocusAnchor}
                monograph={apixabanMonograph}
                onClose={() => setMobileRailOpen(false)}
              />
            </div>
          </div>
        ) : null}
      </div>
    </DrugConceptShell>
  );
}
