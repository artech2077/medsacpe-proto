/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DrugConceptShell } from "@/components/medscape/drug-concepts/concept-shell";
import { DrugMonographCardFrame } from "@/components/medscape/drug-concepts/comparison-view";
import { DrugMonographCanvas } from "@/components/medscape/drug-concepts/monograph-canvas";
import { DrugAnswerSourceChips } from "@/components/medscape/drug-concepts/answer-source-chips";
import { DrugAnswerLoadingSkeleton } from "@/components/medscape/drug-concepts/answer-loading-skeleton";
import { AiResponseChatComposer } from "@/components/medscape/ai-response/chat-composer";
import { AiResponseAnswerContent } from "@/components/medscape/ai-response/answer-content";
import { AiResponseAnswerActions } from "@/components/medscape/ai-response/answer-actions";
import { AiResponseReferences } from "@/components/medscape/ai-response/references";
import { AiResponseFollowUpQuestions } from "@/components/medscape/ai-response/follow-up-questions";
import { AiResponseRelatedArticles } from "@/components/medscape/ai-response/related-articles";
import { AiMobileTopRail } from "@/components/medscape/ai-response/mobile-top-rail";
import { AiMenuIcon } from "@/components/medscape/ai-response/iconography";
import { AiTopRailAction } from "@/components/medscape/ai-response/top-rail-action";
import { ScrollDownFAB } from "@/components/ui/scroll-down-fab";
import { aiResponseAssets } from "@/data/ai-response";
import type { AiAnswerReference } from "@/data/ai-response";
import { getSubfieldById } from "@/data/drug-monograph";
import type { DrugMonograph } from "@/data/drug-monograph";
import { getMonographById } from "@/data/drug-monograph-registry";
import {
  DRUG_CONCEPT_J_RELATED_ARTICLES,
  DRUG_CONCEPT_J_SCENARIOS,
  getConceptJScenarioById,
  matchConceptJScenario,
  type DrugConceptJScenario,
} from "@/data/drug-concept-j-scenarios";

// The canonical card is shown instantly; only the complementary AI answer below
// it is held behind a ~10s shimmer to demonstrate the generation treatment.
const ANSWER_DELAY_MS = 10000;

function requireMonograph(drugId: string): DrugMonograph {
  const monograph = getMonographById(drugId);
  if (!monograph) throw new Error(`Unknown drug id in Concept J scenario: ${drugId}`);
  return monograph;
}

function buildReferences(
  monograph: DrugMonograph,
  answerKey: string,
): AiAnswerReference[] {
  const answer = monograph.synthesizedAnswers[answerKey];
  if (!answer) return [];
  return answer.citations.map((citation) => {
    const sf = getSubfieldById(monograph, citation.anchor);
    return {
      detail: sf?.summary ?? "",
      id: citation.marker,
      source: sf?.source.section ?? "",
      sourceLabel: sf?.source.label ?? "Drug Reference",
      title: sf?.title ?? citation.anchor,
      url: sf?.source.url,
    };
  });
}

// ─── Examples pill (header, shown while a question is active) ──────────────────

function ExamplesPill({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ touchAction: "manipulation" }}
      className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(6,74,167,0.2)] bg-[rgba(6,74,167,0.05)] px-3 py-1 text-[12px] font-semibold text-[var(--mscp-color-brand-primary)] transition hover:bg-[rgba(6,74,167,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="opacity-70">
        <path d="M7.5 3 4.5 6l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Examples
    </button>
  );
}

// ─── AI answer (below the canonical card) ──────────────────────────────────────
// Scripted synthesis, visually distinct from the canonical card above and
// clearly labeled. Citation markers open the matching source via the shared
// answer-content tooltip; the footer carries references, related articles, and
// follow-up questions.

function AiAnswerSection({
  aiAnswer,
  analyticsContext,
  followUpQuestions,
  onFollowUpQuestionSelect,
  references,
}: {
  aiAnswer: string;
  analyticsContext: {
    prototypeFamily: string;
    prototypeRoute: string;
    prototypeSlug: string;
    question: string;
    screenType: string;
    turnId: number;
  };
  followUpQuestions: string[];
  onFollowUpQuestionSelect: (question: string) => void;
  references: AiAnswerReference[];
}) {
  return (
    <section className="dc-rise border-t border-[#eef3f8] pt-5">
      <AiResponseAnswerContent
        answer={aiAnswer}
        references={references}
        className="!text-[15px] !leading-[1.6] text-[#2e3d4a]"
      />

      <AiResponseAnswerActions
        answer={aiAnswer}
        analyticsContext={analyticsContext}
        className="mt-4"
      />

      {/* References → Ask a follow-up → Related Articles (no ad between them) */}
      <AiResponseReferences
        analyticsContext={analyticsContext}
        className="mt-5"
        references={references}
      />

      {followUpQuestions.length > 0 ? (
        <section className="mt-5 border-t border-[#c5ced3] pt-3">
          <div className="mb-3 flex items-center gap-2 text-[#2c353a]">
            <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5 text-[var(--mscp-color-brand-primary)]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 2.5c0 0-.8 3-2.5 4.7C5.8 8.9 2.8 9.7 2.8 10s3 .8 4.7 2.5C9.2 14.2 10 17.5 10 17.5s.8-3.3 2.5-5C14.2 10.8 17.2 10 17.2 10s-3-.8-4.7-2.5C10.8 5.5 10 2.5 10 2.5Z" />
            </svg>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#5a6e7e]">
              Ask a follow-up
            </h2>
          </div>
          <AiResponseFollowUpQuestions
            variant="chips"
            questions={followUpQuestions}
            onQuestionSelect={onFollowUpQuestionSelect}
          />
        </section>
      ) : null}

      <AiResponseRelatedArticles
        articles={DRUG_CONCEPT_J_RELATED_ARTICLES}
        className="mt-6"
      />
    </section>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

type ActiveTurn = {
  scenario: DrugConceptJScenario;
  /** Governs only the AI answer below the card — the card itself is instant. */
  status: "loading" | "complete";
};

export function DrugConceptFlatAnswerScreen() {
  const composerInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const loadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [turn, setTurn] = useState<ActiveTurn | null>(null);
  const [draft, setDraft] = useState("");
  const [composerNotice, setComposerNotice] = useState<string | null>(null);
  const [canvas, setCanvas] = useState<{ anchor?: string; drugId: string } | null>(null);

  const isGenerating = turn?.status === "loading";

  const clearTimer = useCallback(() => {
    if (loadTimerRef.current) {
      clearTimeout(loadTimerRef.current);
      loadTimerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const playScenario = useCallback(
    (scenarioId: string, updateUrl = true) => {
      const scenario = getConceptJScenarioById(scenarioId);
      if (!scenario) return;
      clearTimer();
      setComposerNotice(null);
      setCanvas(null);
      setTurn({ scenario, status: "loading" });
      if (updateUrl && typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("scenario", scenarioId);
        window.history.replaceState(null, "", url.toString());
      }
      requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 0 }));
      loadTimerRef.current = setTimeout(() => {
        setTurn((prev) =>
          prev && prev.scenario.id === scenario.id
            ? { ...prev, status: "complete" }
            : prev,
        );
      }, ANSWER_DELAY_MS);
    },
    [clearTimer],
  );

  // ?scenario= deep link on mount.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("scenario");
    if (id) playScenario(id, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitQuestion = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const matched = matchConceptJScenario(trimmed);
      if (matched) {
        playScenario(matched.id);
      } else {
        clearTimer();
        setTurn(null);
        setComposerNotice(trimmed);
      }
    },
    [playScenario, clearTimer],
  );

  const resetToBrowser = useCallback(() => {
    clearTimer();
    setTurn(null);
    setComposerNotice(null);
    setCanvas(null);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("scenario");
      window.history.replaceState(null, "", url.toString());
    }
  }, [clearTimer]);

  const handleComposerSubmit = useCallback(() => {
    submitQuestion(draft);
    setDraft("");
    composerInputRef.current?.focus();
  }, [draft, submitQuestion]);

  const handleStopGeneration = useCallback(() => {
    clearTimer();
    setTurn((prev) => (prev ? { ...prev, status: "complete" } : prev));
  }, [clearTimer]);

  const scrollToCard = useCallback(() => {
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const openCanvas = useCallback((drugId: string, anchor?: string) => {
    setCanvas({ anchor, drugId });
  }, []);

  const monograph = turn ? requireMonograph(turn.scenario.drugId) : null;
  const references =
    turn && monograph ? buildReferences(monograph, turn.scenario.answerKey) : [];
  const followUpQuestions =
    turn && monograph
      ? (monograph.synthesizedAnswers[turn.scenario.answerKey]?.followUpQuestions ?? [])
      : [];

  return (
    <DrugConceptShell activeConcept="J">
      <div className="relative flex min-h-0 min-w-0 flex-1">
        {/* Chat / answer column */}
        <section
          className={[
            "relative flex min-h-0 min-w-0 flex-col",
            canvas ? "flex-1 md:w-[48%] md:flex-none md:min-w-[360px]" : "flex-1",
          ].join(" ")}
        >
          {/* Header */}
          <div className="z-20 shrink-0 bg-white">
            <AiMobileTopRail
              railClassName="bg-white px-3 pb-1 pt-2 md:hidden"
              contentClassName="relative flex min-h-[44px] items-center justify-between gap-2"
              left={
                <button
                  type="button"
                  aria-label="Home"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#687680] transition hover:bg-[#f1f5f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
                >
                  <AiMenuIcon />
                </button>
              }
              center={
                turn || composerNotice ? (
                  <ExamplesPill onClick={resetToBrowser} />
                ) : (
                  <img
                    src={aiResponseAssets.logoAssets.medscapeAi}
                    alt="Medscape AI"
                    className="h-[22px] w-auto object-contain"
                  />
                )
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
              <div className="relative flex min-h-[48px] items-center justify-between gap-2 px-5 pt-2">
                <button
                  type="button"
                  aria-label="Home"
                  className="relative z-10 inline-flex h-9 w-9 items-center justify-center rounded-full text-[#687680] transition hover:bg-[#f1f5f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
                >
                  <AiMenuIcon />
                </button>
                {turn || composerNotice ? (
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <ExamplesPill onClick={resetToBrowser} />
                  </div>
                ) : (
                  <img
                    src={aiResponseAssets.logoAssets.medscapeAi}
                    alt="Medscape AI"
                    className="absolute left-1/2 top-1/2 h-[24px] w-auto -translate-x-1/2 -translate-y-1/2 object-contain"
                  />
                )}
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
              className="mx-auto w-full max-w-[900px] px-4 pb-[136px] pt-4 md:px-6 md:pt-6"
            >
              {!turn && !composerNotice ? (
                // ── Landing — hero + example questions ──────────────────────
                <div className="flex flex-col items-center py-10 md:py-14">
                  <div className="dc-fade mb-3 rounded-full bg-[rgba(6,74,167,0.06)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--mscp-color-brand-primary)]">
                    Concept J · Canonical Card + AI Answer
                  </div>
                  <h2 className="dc-rise mt-2 max-w-[440px] text-center text-[22px] font-extrabold leading-[1.2] tracking-[-0.02em] text-[#161b1d] [text-wrap:balance] md:text-[28px]">
                    Canonical content first, AI answer below
                  </h2>
                  <p className="dc-rise mt-3 max-w-[480px] text-center text-[13.5px] leading-[1.65] text-[#5a6e7e] [text-wrap:balance]">
                    Each reply shows the canonical monograph card instantly, then the AI-generated
                    answer streams in below it — with references, related articles, and follow-up
                    questions. Pick a question to watch the answer load with a shimmer.
                  </p>

                  <div className="mt-8 w-full max-w-[560px] space-y-2">
                    {DRUG_CONCEPT_J_SCENARIOS.map((scenario) => (
                      <button
                        key={scenario.id}
                        type="button"
                        onClick={() => playScenario(scenario.id)}
                        style={{ touchAction: "manipulation" }}
                        className="dc-rise group flex w-full items-center gap-3 rounded-[14px] border border-[#e3eaf2] bg-white px-4 py-3 text-left shadow-[0_1px_3px_rgba(16,24,40,0.05)] transition hover:border-[rgba(6,74,167,0.3)] hover:bg-[#f7faff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] focus-visible:ring-offset-1"
                      >
                        <span className="inline-flex h-7 shrink-0 items-center rounded-full bg-[rgba(6,74,167,0.08)] px-2 text-[10px] font-bold uppercase tracking-[0.06em] text-[var(--mscp-color-brand-primary)]">
                          {scenario.group}
                        </span>
                        <span className="min-w-0 flex-1 text-[14px] font-semibold leading-snug text-[#1c2227]">
                          {scenario.question}
                        </span>
                        <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 shrink-0 text-[#9aa9b8] transition group-hover:translate-x-0.5 group-hover:text-[var(--mscp-color-brand-primary)]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 8h10M9 4l4 4-4 4" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              ) : turn && monograph ? (
                // ── Active answer ───────────────────────────────────────────
                <article className="mx-auto max-w-[860px]">
                  <h1 className="mb-4 text-[20px] font-extrabold leading-[1.24] tracking-[-0.02em] text-[#161b1d] [text-wrap:balance] md:text-[26px]">
                    {turn.scenario.question}
                  </h1>

                  <div className="space-y-6">
                    {/* References / Sources chips */}
                    <DrugAnswerSourceChips
                      references={references}
                      onJumpToSources={scrollToCard}
                    />

                    {/* Canonical monograph card — shown instantly */}
                    <div ref={cardRef} className="scroll-mt-4">
                      <DrugMonographCardFrame
                        anchor={turn.scenario.anchor}
                        expandSubfields
                        hideMatchBadges
                        hideSectionSummary
                        monograph={monograph}
                        onOpenMonograph={(subfieldId) =>
                          openCanvas(turn.scenario.drugId, subfieldId)
                        }
                      />
                    </div>

                    {/* AI answer below the card — shimmer until generated */}
                    {turn.status === "loading" ? (
                      <DrugAnswerLoadingSkeleton />
                    ) : (
                      <AiAnswerSection
                        aiAnswer={turn.scenario.aiAnswer}
                        analyticsContext={{
                          prototypeFamily: "drug-concept",
                          prototypeRoute: "/drug-concept-j",
                          prototypeSlug: "drug-concept-j",
                          question: turn.scenario.question,
                          screenType: "drug-concept-j",
                          turnId: 1,
                        }}
                        followUpQuestions={followUpQuestions}
                        onFollowUpQuestionSelect={submitQuestion}
                        references={references}
                      />
                    )}
                  </div>
                </article>
              ) : (
                // ── Composer fallback notice ────────────────────────────────
                <article className="mx-auto max-w-[860px]">
                  <h1 className="mb-4 text-[20px] font-extrabold leading-[1.24] tracking-[-0.02em] text-[#161b1d] md:text-[26px]">
                    {composerNotice}
                  </h1>
                  <p className="rounded-[12px] border border-[#e6edf4] bg-[#f8fafc] px-4 py-3 text-[13.5px] leading-[1.6] text-[#5a6e7e]">
                    This prototype is scripted — it plays preset questions rather than answering
                    live. Tap Examples in the header to browse the available questions.
                  </p>
                </article>
              )}
            </div>
          </div>

          {/* Scroll-down FAB */}
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
                  analyticsSourceSurface="drug_concept_j"
                  isGenerating={isGenerating}
                  onStopGeneration={handleStopGeneration}
                  onSubmit={handleComposerSubmit}
                  onValueChange={setDraft}
                  placeholder="Ask a drug question…"
                  submitButtonClassName="inline-flex h-8 w-8 shrink-0 items-center justify-center"
                  value={draft}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Monograph canvas */}
        {canvas ? (
          <div className="fixed inset-0 z-50 md:relative md:inset-auto md:z-auto md:flex md:min-w-0 md:flex-1 md:border-l md:border-[#e4ecf4]">
            <DrugMonographCanvas
              monograph={requireMonograph(canvas.drugId)}
              onClose={() => setCanvas(null)}
              targetAnchor={canvas.anchor}
            />
          </div>
        ) : null}
      </div>
    </DrugConceptShell>
  );
}
