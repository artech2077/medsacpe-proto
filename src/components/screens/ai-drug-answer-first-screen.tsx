/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DrugConceptShell } from "@/components/medscape/drug-concepts/concept-shell";
import { DrugMonographCardFrame } from "@/components/medscape/drug-concepts/comparison-view";
import { DrugMonographHandoffPill } from "@/components/medscape/drug-concepts/monograph-handoff-pill";
import { DrugMonographChangeAlert } from "@/components/medscape/drug-concepts/monograph-change-alert";
import { MedscapeCurrentAdBlock } from "@/components/medscape/ai-current/ad-block";
import { AiResponseChatComposer } from "@/components/medscape/ai-response/chat-composer";
import { AiResponseAnswerContent } from "@/components/medscape/ai-response/answer-content";
import { AiResponseAnswerActions } from "@/components/medscape/ai-response/answer-actions";
import { AiResponseFollowUpQuestions } from "@/components/medscape/ai-response/follow-up-questions";
import { AiMobileTopRail } from "@/components/medscape/ai-response/mobile-top-rail";
import { AiMenuIcon } from "@/components/medscape/ai-response/iconography";
import { PrototypeNavSidebar } from "@/components/medscape/drug-concepts/prototype-nav-sidebar";
import { AiTopRailAction } from "@/components/medscape/ai-response/top-rail-action";
import { ScrollDownFAB } from "@/components/ui/scroll-down-fab";
import { aiResponseAssets } from "@/data/ai-response";
import type { AiAnswerReference } from "@/data/ai-response";
import { getSubfieldById } from "@/data/drug-monograph";
import type { DrugMonograph } from "@/data/drug-monograph";
import { getMonographById } from "@/data/drug-monograph-registry";
import {
  ANSWER_FIRST_V3,
  matchAnswerFirstScenario,
  type AnswerFirstScenario,
  type DrugAnswerFirstExperience,
} from "@/data/drug-answer-first-experiences";

// ─── AI drug mono V3 — answer-first pivot ──────────────────────────────────────
// Explores the 2026-09-22 answer-format pivot (see workspace CLAUDE.md): the
// AI-generated answer is the PRIMARY response to the question; the canonical
// monograph is a SECONDARY reference opened on demand via a pill, rather than
// shown up front (Concept J / V1's order). Reuses the same scripted questions,
// monographs, and citations as Concept J — only the presentation order and the
// reveal mechanism change. Prototype only: no compliance/citation-fidelity gate
// exists yet for a live generative answer (see the reconciliation list in
// CLAUDE.md) — this demonstrates the layout, not a production-ready answer.
const ANSWER_DELAY_MS = 6000;

function requireMonograph(drugId: string): DrugMonograph {
  const monograph = getMonographById(drugId);
  if (!monograph) throw new Error(`Unknown drug id in scenario: ${drugId}`);
  return monograph;
}

// A scenario's own update wins; otherwise the experience-level update applies
// to scenarios about the same drug.
function resolveUpdate(scenario: AnswerFirstScenario, experience: DrugAnswerFirstExperience) {
  if (scenario.update) return scenario.update;
  return experience.updates?.drugId === scenario.drugId ? experience.updates : undefined;
}

function buildReferences(monograph: DrugMonograph, answerKey: string): AiAnswerReference[] {
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

// ─── Thread turn (question → AI answer → monograph pill) ───────────────────────

type ScenarioTurn = {
  id: number;
  kind: "scenario";
  monographOpen: boolean;
  scenario: AnswerFirstScenario;
  status: "loading" | "complete";
};

type NoticeTurn = {
  id: number;
  kind: "notice";
  text: string;
};

type ThreadTurn = ScenarioTurn | NoticeTurn;

function ScenarioTurnBlock({
  experience,
  isLast,
  onFollowUpQuestionSelect,
  onToggleMonograph,
  showUpdates,
  turn,
  turnIndex,
}: {
  experience: DrugAnswerFirstExperience;
  isLast: boolean;
  onFollowUpQuestionSelect: (question: string) => void;
  onToggleMonograph: (turnId: number) => void;
  showUpdates: boolean;
  turn: ScenarioTurn;
  turnIndex: number;
}) {
  const monographRef = useRef<HTMLDivElement>(null);
  const monograph = requireMonograph(turn.scenario.drugId);
  const answer = monograph.synthesizedAnswers[turn.scenario.answerKey];
  const references = turn.scenario.references ?? buildReferences(monograph, turn.scenario.answerKey);
  const followUpQuestions = isLast ? turn.scenario.followUpQuestions ?? answer?.followUpQuestions ?? [] : [];
  const updateIsAnswer = turn.scenario.responseKind === "drug-update";
  const updates = showUpdates && !updateIsAnswer ? resolveUpdate(turn.scenario, experience) : undefined;

  const handleToggle = useCallback(() => {
    const opening = !turn.monographOpen;
    onToggleMonograph(turn.id);
    if (opening) {
      requestAnimationFrame(() =>
        monographRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    }
  }, [onToggleMonograph, turn.id, turn.monographOpen]);

  return (
    <article className="mx-auto max-w-[720px]">
      <MedscapeCurrentAdBlock
        adPlacement="before-question"
        adSlot="ai_drug_answer_first_top"
        className="mb-5 md:hidden"
        prototypeFamily="drug-concept"
        prototypeRoute={experience.route}
        prototypeSlug={experience.slug}
        screenType={experience.slug}
        turnId={turnIndex + 1}
      />
      {updates ? (
        <div className="mb-[var(--space-5)]">
          <DrugMonographChangeAlert {...updates} presentation={turn.scenario.updatePresentation} />
        </div>
      ) : null}
      <h1 className="mb-4 text-[20px] font-extrabold leading-[1.24] tracking-[-0.02em] text-[#161b1d] [text-wrap:balance] md:text-[26px]">
        {turn.scenario.question}
      </h1>

      {/* AI answer — the primary response. While loading, no shimmer bars —
          just the generation status line, plus a 32px placeholder gap above
          the pill that collapses once the answer replaces this block. */}
      {turn.status === "loading" ? (
        <div>
          <p className="inline-flex items-center gap-2 text-[12.5px] font-medium text-[#6b7f92]">
            <img
              src={aiResponseAssets.logoAssets.promptAnimation}
              alt=""
              aria-hidden="true"
              className="h-4 w-4 object-contain"
            />
            Answering your question…
          </p>
          <div aria-hidden="true" className="h-8" />
        </div>
      ) : (
        <AiResponseAnswerContent
          answer={turn.scenario.aiAnswer}
          citationLabel={updateIsAnswer ? turn.scenario.citationLabel : turn.scenario.citationLabel ?? "Medscape Drugs"}
          references={references}
          className="!text-[15px] !leading-[1.6] text-[#2e3d4a]"
        />
      )}

      {/* Secondary reference — appears immediately when the question is
          submitted, independent of the AI answer's generation status. */}
      <DrugMonographHandoffPill
        className="mt-5"
        drugName={turn.scenario.pillLabel ?? monograph.drug.name}
        isOpen={turn.monographOpen}
        onToggle={handleToggle}
      />

      {turn.monographOpen ? (
        <div ref={monographRef} className="mt-3 scroll-mt-4">
          <DrugMonographCardFrame
            anchor={turn.scenario.anchor}
            boxedWarningVariant="navy"
            expandSubfields={Boolean(experience.updates)}
            flashAnchor={!experience.updates}
            flat
            hideMatchBadges
            hideSectionSummary
            hideSubfieldSummary
            monograph={monograph}
            onOpenMonograph={() => {
              if (monograph.drug.referenceUrl) {
                window.open(monograph.drug.referenceUrl, "_blank", "noopener");
              }
            }}
            promoteSelectedSection={!experience.updates}
            tabStyle="underline"
          />
        </div>
      ) : null}

      {turn.status === "complete" ? (
        <>
          <AiResponseAnswerActions
            answer={updateIsAnswer ? `${turn.scenario.question}\n\n${turn.scenario.aiAnswer}` : turn.scenario.aiAnswer}
            analyticsContext={{
              prototypeFamily: "drug-concept",
              prototypeRoute: experience.route,
              prototypeSlug: experience.slug,
              question: turn.scenario.question,
              screenType: experience.slug,
              turnId: turnIndex + 1,
            }}
            className="mt-5 border-t border-[#eef3f8] pt-4"
          />

          {followUpQuestions.length > 0 ? (
            <section className="mt-5 border-t border-[#c5ced3] pt-3">
              <div className="mb-3 flex items-center gap-2 text-[#2c353a]">
                <img
                  src={aiResponseAssets.uiIcons.followUpSparkle}
                  alt=""
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 object-contain"
                />
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
        </>
      ) : null}
    </article>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export function AiDrugAnswerFirstScreen({
  experience = ANSWER_FIRST_V3,
}: {
  experience?: DrugAnswerFirstExperience;
}) {
  const composerInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastTurnRef = useRef<HTMLDivElement>(null);
  const loadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const turnIdRef = useRef(0);

  const [thread, setThread] = useState<ThreadTurn[]>([]);
  const [draft, setDraft] = useState("");
  const [navOpen, setNavOpen] = useState(false);

  const isGenerating = thread.some(
    (item) => item.kind === "scenario" && item.status === "loading",
  );

  const clearTimer = useCallback(() => {
    if (loadTimerRef.current) {
      clearTimeout(loadTimerRef.current);
      loadTimerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const completeAll = (items: ThreadTurn[]): ThreadTurn[] =>
    items.map((item) =>
      item.kind === "scenario" ? { ...item, status: "complete" as const } : item,
    );

  const playScenario = useCallback(
    (scenarioId: string, updateUrl = true, replaceThread = false) => {
      const scenario = experience.scenarios.find((item) => item.id === scenarioId);
      if (!scenario) return;
      clearTimer();
      const turnId = ++turnIdRef.current;
      setThread((prev) => [
        ...(replaceThread ? [] : completeAll(prev)),
        { id: turnId, kind: "scenario", monographOpen: false, scenario, status: scenario.responseKind === "drug-update" ? "complete" : "loading" },
      ]);
      if (updateUrl && typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("scenario", scenarioId);
        window.history.replaceState(null, "", url.toString());
      }
      if (scenario.responseKind === "drug-update") return;
      loadTimerRef.current = setTimeout(() => {
        setThread((prev) =>
          prev.map((item) =>
            item.kind === "scenario" && item.id === turnId
              ? { ...item, status: "complete" }
              : item,
          ),
        );
      }, ANSWER_DELAY_MS);
    },
    [clearTimer, experience],
  );

  const threadLength = thread.length;
  useEffect(() => {
    if (threadLength > 0) {
      requestAnimationFrame(() =>
        lastTurnRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    }
  }, [threadLength]);

  useEffect(() => {
    const requestedId = new URLSearchParams(window.location.search).get("scenario");
    const id = experience.scenarios.some((item) => item.id === requestedId)
      ? requestedId
      : experience.defaultScenarioId;
    if (id) playScenario(id, false, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitQuestion = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const matched = matchAnswerFirstScenario(trimmed, experience.scenarios);
      if (matched) {
        playScenario(matched.id);
      } else {
        clearTimer();
        const turnId = ++turnIdRef.current;
        setThread((prev) => [...completeAll(prev), { id: turnId, kind: "notice", text: trimmed }]);
      }
    },
    [playScenario, clearTimer, experience],
  );

  const resetToBrowser = useCallback(() => {
    clearTimer();
    setThread([]);
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
    setThread((prev) => completeAll(prev));
  }, [clearTimer]);

  const toggleMonograph = useCallback((turnId: number) => {
    setThread((prev) =>
      prev.map((item) =>
        item.kind === "scenario" && item.id === turnId
          ? { ...item, monographOpen: !item.monographOpen }
          : item,
      ),
    );
  }, []);

  return (
    <DrugConceptShell activeConcept="J" hideTabBar>
      <div className="relative flex min-h-0 min-w-0 flex-1">
        <section className="relative flex min-h-0 min-w-0 flex-1 flex-col">
          {experience.share ? null : <PrototypeNavSidebar isOpen={navOpen} onClose={() => setNavOpen(false)} />}
          {/* Header */}
          <div className="z-20 shrink-0 bg-white">
            <AiMobileTopRail
              railClassName="bg-white px-3 pb-1 pt-2 md:hidden"
              contentClassName="relative flex min-h-[44px] items-center justify-between gap-2"
              left={
                experience.share ? null : <button
                  type="button"
                  aria-label="Open prototypes menu"
                  aria-expanded={navOpen}
                  onClick={() => setNavOpen(true)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#687680] transition hover:bg-[#f1f5f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
                >
                  <AiMenuIcon />
                </button>
              }
              center={
                thread.length > 0 && !experience.share ? (
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

            <div className="hidden md:block">
              <div className="relative flex min-h-[48px] items-center justify-between gap-2 px-5 pt-2">
                {experience.share ? null : <button
                  type="button"
                  aria-label="Open prototypes menu"
                  aria-expanded={navOpen}
                  onClick={() => setNavOpen(true)}
                  className="relative z-10 inline-flex h-9 w-9 items-center justify-center rounded-full text-[#687680] transition hover:bg-[#f1f5f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
                >
                  <AiMenuIcon />
                </button>}
                {thread.length > 0 && !experience.share ? (
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
              className="mx-auto w-full max-w-[820px] px-4 pb-[136px] pt-4 md:px-6 md:pt-6"
            >
              {thread.length === 0 ? (
                <div className="flex flex-col items-center py-10 md:py-14">
                  <div className="dc-fade mb-3 rounded-full bg-[rgba(6,74,167,0.06)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--mscp-color-brand-primary)]">
                    {experience.label}
                  </div>
                  <h2 className="dc-rise mt-2 max-w-[440px] text-center text-[22px] font-extrabold leading-[1.2] tracking-[-0.02em] text-[#161b1d] [text-wrap:balance] md:text-[28px]">
                    {experience.title}
                  </h2>
                  <p className="dc-rise mt-3 max-w-[480px] text-center text-[13.5px] leading-[1.65] text-[#5a6e7e] [text-wrap:balance]">
                    {experience.description}
                  </p>

                  <div className="mt-8 w-full max-w-[560px] space-y-2">
                    {experience.scenarios.map((scenario) => (
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
                          {scenario.exampleTitle ?? scenario.question}
                        </span>
                        <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 shrink-0 text-[#9aa9b8] transition group-hover:translate-x-0.5 group-hover:text-[var(--mscp-color-brand-primary)]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 8h10M9 4l4 4-4 4" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="sticky top-0 z-10 mx-auto hidden max-w-[720px] bg-white pb-3 md:block">
                    <MedscapeCurrentAdBlock
                      adPlacement="before-question"
                      adSlot="ai_drug_answer_first_top"
                      prototypeFamily="drug-concept"
                      prototypeRoute={experience.route}
                      prototypeSlug={experience.slug}
                      screenType={experience.slug}
                    />
                  </div>
                  <div className="space-y-0">
                    {thread.map((item, index) => {
                      const isLast = index === thread.length - 1;
                      return (
                        <div
                          key={item.id}
                          ref={isLast ? lastTurnRef : undefined}
                          className={
                            index > 0
                              ? "mt-10 scroll-mt-4 border-t border-[#dde7f0] pt-8"
                              : "scroll-mt-4"
                          }
                        >
                          {item.kind === "scenario" ? (
                            <ScenarioTurnBlock
                              experience={experience}
                              isLast={isLast}
                              showUpdates={(() => {
                                // Show each drug's update once: on the first turn that resolves to it.
                                const update = resolveUpdate(item.scenario, experience);
                                return Boolean(update) && index === thread.findIndex(
                                  (turn) => turn.kind === "scenario" && resolveUpdate(turn.scenario, experience)?.drugId === update?.drugId,
                                );
                              })()}
                              onFollowUpQuestionSelect={submitQuestion}
                              onToggleMonograph={toggleMonograph}
                              turn={item}
                              turnIndex={index}
                            />
                          ) : (
                            <article className="mx-auto max-w-[720px]">
                              <h1 className="mb-4 text-[20px] font-extrabold leading-[1.24] tracking-[-0.02em] text-[#161b1d] md:text-[26px]">
                                {item.text}
                              </h1>
                              <p className="rounded-[12px] border border-[#e6edf4] bg-[#f8fafc] px-4 py-3 text-[13.5px] leading-[1.6] text-[#5a6e7e]">
                                {experience.share
                                  ? "This prototype is scripted — it plays a preset question rather than answering live."
                                  : "This prototype is scripted — it plays preset questions rather than answering live. Tap Examples in the header to browse the available questions."}
                              </p>
                            </article>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-[76px] z-10">
            <div className="mx-auto flex w-full max-w-[820px] justify-center px-5">
              <ScrollDownFAB scrollRef={scrollRef} />
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
            <div className="mx-auto w-full max-w-[820px] px-4 pb-0 md:px-6">
              <div className="rounded-t-[28px] bg-gradient-to-b from-transparent via-white/82 to-white px-2 pb-[max(env(safe-area-inset-bottom),6px)] pt-3 md:pt-4">
                <AiResponseChatComposer
                  formClassName="pointer-events-auto flex min-h-[48px] items-center gap-2 rounded-[999px] border border-[rgba(109,153,206,0.45)] bg-white px-4 py-1 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_22px_rgba(16,24,40,0.06)]"
                  iconClassName="h-8 w-8"
                  inputClassName="h-8 flex-1 border-0 bg-transparent text-[16px] leading-[20px] text-[#1b2b3a] outline-none placeholder:text-[#93a2ae]"
                  inputRef={composerInputRef}
                  analyticsSourceSurface={experience.slug.replaceAll("-", "_")}
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
      </div>
    </DrugConceptShell>
  );
}
