/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DrugAnswerTabs } from "@/components/medscape/drug-concepts/answer-tabs";
import { DrugClarifyingQuestionCard } from "@/components/medscape/drug-concepts/clarifying-question-card";
import { ConditionArticleCard } from "@/components/medscape/drug-concepts/condition-article-card";
import { DrugConceptShell } from "@/components/medscape/drug-concepts/concept-shell";
import {
  DrugComparisonView,
  DrugMonographCardFrame,
} from "@/components/medscape/drug-concepts/comparison-view";
import { DrugMonographCanvas } from "@/components/medscape/drug-concepts/monograph-canvas";
import { DrugScenarioPicker } from "@/components/medscape/drug-concepts/scenario-picker";
import { DrugToolResultCard } from "@/components/medscape/drug-concepts/tool-result-card";
import { AiResponseChatComposer } from "@/components/medscape/ai-response/chat-composer";
import { renderInlineText } from "@/components/medscape/ai-response/answer-content";
import { AiMobileTopRail } from "@/components/medscape/ai-response/mobile-top-rail";
import { AiMenuIcon } from "@/components/medscape/ai-response/iconography";
import { AiTopRailAction } from "@/components/medscape/ai-response/top-rail-action";
import { AiPreparingAnswerNotice } from "@/components/medscape/ai-response/preparing-answer-notice";
import { ScrollDownFAB } from "@/components/ui/scroll-down-fab";
import { aiResponseAssets } from "@/data/ai-response";
import type { AiAnswerReference } from "@/data/ai-response";
import { getSubfieldById } from "@/data/drug-monograph";
import type { DrugMonograph, DrugSynthesizedAnswer } from "@/data/drug-monograph";
import { getMonographById } from "@/data/drug-monograph-registry";
import {
  DRUG_SCENARIO_GROUPS,
  getScenarioById,
  t2dmConditionArticle,
  type DrugScenario,
  type DrugScenarioTurn,
  type ScenarioAiAnswer,
  type ScenarioClarifyOption,
} from "@/data/drug-concept-i-scenarios";

const PRE_CARD_DELAY_MS = 1100;

// ─── Thread model ─────────────────────────────────────────────────────────────

type PlayedTurn = {
  id: number;
  /** S3: the option the reviewer picked (renders the derived S1 card). */
  pickedOption?: ScenarioClarifyOption;
  status: "complete" | "preparing";
  turn: DrugScenarioTurn;
};

function requireMonograph(drugId: string): DrugMonograph {
  const monograph = getMonographById(drugId);
  if (!monograph) throw new Error(`Unknown drug id in scenario data: ${drugId}`);
  return monograph;
}

function buildReferences(
  answer: DrugSynthesizedAnswer,
  monograph: DrugMonograph,
): AiAnswerReference[] {
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

/** Composer fallback: free text matches the scripted scenario sharing the most words. */
function matchScenarioToQuery(query: string): DrugScenario | undefined {
  const words = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3);
  let best: { scenario: DrugScenario; score: number } | undefined;
  for (const group of DRUG_SCENARIO_GROUPS) {
    for (const scenario of group.scenarios) {
      const haystack = scenario.question.toLowerCase();
      const score = words.filter((w) => haystack.includes(w)).length;
      if (score >= 2 && (!best || score > best.score)) best = { scenario, score };
    }
  }
  return best?.scenario;
}

// ─── AI answer block (S5 / S6) ───────────────────────────────────────────────
// Scripted cross-drug synthesis — visually distinct from canonical content and
// clearly labeled. Citation chips deep-link into the anchored monograph cards
// stacked below.

function ScenarioAiAnswerBlock({
  aiAnswer,
  onCitation,
}: {
  aiAnswer: ScenarioAiAnswer;
  onCitation: (drugId: string, anchor: string) => void;
}) {
  const renderChip = useCallback(
    (citationId: number, key: string) => {
      const citation = aiAnswer.citations.find((c) => c.marker === citationId);
      return (
        <button
          key={key}
          type="button"
          aria-label={`Citation ${citationId}: view source in drug information below`}
          onClick={() => citation && onCitation(citation.drugId, citation.anchor)}
          className="mx-0.5 inline-flex h-[18px] min-w-[18px] translate-y-[-1px] items-center justify-center rounded-full bg-[#ecf1f9] px-1.5 text-[12px] font-bold leading-none text-[#064aa7] transition hover:bg-[#dfeafb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.22)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          {citationId}
        </button>
      );
    },
    [aiAnswer.citations, onCitation],
  );

  return (
    <div className="dc-rise rounded-[14px] border border-[rgba(6,74,167,0.16)] bg-[linear-gradient(180deg,rgba(6,74,167,0.045)_0%,rgba(6,74,167,0.015)_100%)] p-4">
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--mscp-color-brand-primary)] px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.1em] text-white">
          AI answer
        </span>
        {aiAnswer.badge ? (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.08em] ${
              aiAnswer.badge === "off-label"
                ? "bg-[#fef0e3] text-[#b54708]"
                : "bg-[#e2f5ea] text-[#027a48]"
            }`}
          >
            {aiAnswer.badge === "off-label" ? "Off-label" : "Guideline-based"}
          </span>
        ) : null}
        <span className="text-[10.5px] font-medium text-[#8497a9]">
          AI-generated — verify against the canonical sources below
        </span>
      </div>

      <p className="text-[15px] leading-[1.62] text-[#2e3d4a]">
        {renderInlineText(aiAnswer.text, renderChip)}
      </p>

      {aiAnswer.note ? (
        <p className="mt-2.5 border-t border-[rgba(6,74,167,0.12)] pt-2.5 text-[12px] leading-[1.5] text-[#6b7f92]">
          {aiAnswer.note}
        </p>
      ) : null}
    </div>
  );
}

// ─── AI answer shimmer (S10) ─────────────────────────────────────────────────
// Placeholder shown above the (already-visible) monograph card while a delayed
// AI answer is still generating — the canonical content is shown instantly,
// the synthesis takes longer.

function ScenarioAiAnswerShimmer() {
  return (
    <div className="dc-fade rounded-[14px] border border-[rgba(6,74,167,0.16)] bg-[linear-gradient(180deg,rgba(6,74,167,0.045)_0%,rgba(6,74,167,0.015)_100%)] p-4">
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--mscp-color-brand-primary)] px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.1em] text-white">
          AI answer
        </span>
        <span className="inline-flex items-center gap-1.5 text-[10.5px] font-medium text-[#6b7f92]">
          <img
            src={aiResponseAssets.logoAssets.promptAnimation}
            alt=""
            aria-hidden="true"
            className="h-4 w-4 object-contain"
          />
          Generating answer from the canonical source below…
        </span>
      </div>
      <div className="space-y-2.5" aria-hidden="true">
        <span className="dc-shimmer block h-3.5 w-full rounded-full" />
        <span className="dc-shimmer block h-3.5 w-[96%] rounded-full" />
        <span className="dc-shimmer block h-3.5 w-[90%] rounded-full" />
        <span className="dc-shimmer block h-3.5 w-[58%] rounded-full" />
      </div>
    </div>
  );
}

// ─── Scenarios pill (header, shown while a scenario is playing) ───────────────

function ScenariosPill({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ touchAction: "manipulation" }}
      className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(6,74,167,0.2)] bg-[rgba(6,74,167,0.05)] px-3 py-1 text-[12px] font-semibold text-[var(--mscp-color-brand-primary)] transition hover:bg-[rgba(6,74,167,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
        className="opacity-70"
      >
        <path
          d="M7.5 3 4.5 6l3 3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Scenarios
    </button>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export function DrugConceptAccordionTabsScreen() {
  const composerInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextIdRef = useRef(1);
  const cardRefs = useRef(new Map<string, HTMLDivElement>());

  const [activeScenario, setActiveScenario] = useState<DrugScenario | null>(null);
  const [playedTurns, setPlayedTurns] = useState<PlayedTurn[]>([]);
  const [draft, setDraft] = useState("");
  const [composerNotice, setComposerNotice] = useState<string | null>(null);
  // S5/S6/S9 citation deep-links: per-turn-card anchor overrides.
  const [anchorOverrides, setAnchorOverrides] = useState<Record<string, string>>({});
  // S7: monograph cards opened from condition pills.
  const [openedConditionDrugs, setOpenedConditionDrugs] = useState<string[]>([]);
  // S9: compare chip tapped → swap latest cards into comparison view.
  const [compareActive, setCompareActive] = useState(false);
  // Side canvas (full monograph).
  const [canvas, setCanvas] = useState<{ anchor?: string; drugId: string } | null>(null);
  // S10: per-turn-id flag — true once the delayed AI answer has finished generating.
  const [aiAnswerReady, setAiAnswerReady] = useState<Record<number, boolean>>({});

  const aiGenerating = Object.values(aiAnswerReady).some((ready) => ready === false);
  const isGenerating =
    playedTurns.some((t) => t.status === "preparing") || aiGenerating;

  const clearTimer = useCallback(() => {
    if (delayTimerRef.current) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
    }
    if (aiTimerRef.current) {
      clearTimeout(aiTimerRef.current);
      aiTimerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const appendTurn = useCallback(
    (turn: DrugScenarioTurn, pickedOption?: ScenarioClarifyOption) => {
      clearTimer();
      const id = nextIdRef.current++;
      const liveAi = typeof turn.aiAnswerDelayMs === "number";
      setPlayedTurns((prev) => [
        ...prev.map((t): PlayedTurn => ({ ...t, status: "complete" })),
        // S10: render the turn body immediately so the monograph card shows
        // right away; the AI answer above it shimmers until its own timer fires.
        { id, pickedOption, status: liveAi ? "complete" : "preparing", turn },
      ]);
      if (liveAi) {
        setAiAnswerReady((prev) => ({ ...prev, [id]: false }));
        aiTimerRef.current = setTimeout(() => {
          setAiAnswerReady((prev) => ({ ...prev, [id]: true }));
        }, turn.aiAnswerDelayMs);
        return;
      }
      delayTimerRef.current = setTimeout(() => {
        setPlayedTurns((prev) =>
          prev.map((t): PlayedTurn => (t.id === id ? { ...t, status: "complete" } : t)),
        );
      }, PRE_CARD_DELAY_MS);
    },
    [clearTimer],
  );

  const playScenario = useCallback(
    (scenarioId: string, updateUrl = true) => {
      const scenario = getScenarioById(scenarioId);
      if (!scenario) return;
      clearTimer();
      setActiveScenario(scenario);
      setPlayedTurns([]);
      setAnchorOverrides({});
      setOpenedConditionDrugs([]);
      setCompareActive(false);
      setComposerNotice(null);
      setCanvas(null);
      setAiAnswerReady({});
      if (updateUrl && typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("scenario", scenarioId);
        window.history.replaceState(null, "", url.toString());
      }
      // Play the first scripted turn; S9 advances stepwise via the Continue chip.
      const first = scenario.turns[0];
      if (first) appendTurn(first);
      requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 0 }));
    },
    [appendTurn, clearTimer],
  );

  // ?scenario= deep link on mount.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("scenario");
    if (id) playScenario(id, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const advanceScenario = useCallback(() => {
    if (!activeScenario) return;
    const next = activeScenario.turns[playedTurns.length];
    if (next) appendTurn(next);
  }, [activeScenario, appendTurn, playedTurns.length]);

  // Back to the scenario browser (hero + cards): clears the thread + URL param.
  const resetToBrowser = useCallback(() => {
    clearTimer();
    setActiveScenario(null);
    setPlayedTurns([]);
    setAnchorOverrides({});
    setOpenedConditionDrugs([]);
    setCompareActive(false);
    setComposerNotice(null);
    setCanvas(null);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("scenario");
      window.history.replaceState(null, "", url.toString());
    }
  }, [clearTimer]);

  const handleComposerSubmit = useCallback(() => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setDraft("");
    composerInputRef.current?.focus();
    const matched = matchScenarioToQuery(trimmed);
    if (matched) {
      playScenario(matched.id);
    } else {
      setComposerNotice(trimmed);
    }
  }, [draft, playScenario]);

  const handleStopGeneration = useCallback(() => {
    clearTimer();
    setPlayedTurns((prev) => prev.map((t): PlayedTurn => ({ ...t, status: "complete" })));
    setAiAnswerReady((prev) => {
      const next: Record<number, boolean> = {};
      for (const key of Object.keys(prev)) next[Number(key)] = true;
      return next;
    });
  }, [clearTimer]);

  const registerCard = useCallback((key: string, el: HTMLDivElement | null) => {
    if (el) cardRefs.current.set(key, el);
    else cardRefs.current.delete(key);
  }, []);

  const deepLinkToCard = useCallback((turnId: number, drugId: string, anchor: string) => {
    const key = `${turnId}:${drugId}`;
    setAnchorOverrides((prev) => ({ ...prev, [key]: anchor }));
    requestAnimationFrame(() => {
      cardRefs.current.get(key)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const openCanvas = useCallback((drugId: string, anchor?: string) => {
    setCanvas({ anchor, drugId });
  }, []);

  // ─── Per-turn rendering ────────────────────────────────────────────────────

  const renderTurnBody = (played: PlayedTurn) => {
    const { turn, id } = played;

    // S3 — clarifying question. The option module is docked above the composer
    // (see pendingClarify below); here we render the derived S1 card once picked,
    // or a waiting note while the module is still open.
    if (turn.clarify) {
      const picked = played.pickedOption;
      if (!picked) {
        return (
          <p className="flex items-center gap-2 rounded-[12px] border border-dashed border-[#d4deea] bg-[#f8fafc] px-4 py-3 text-[13px] text-[#7a8da0]">
            <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--mscp-color-brand-primary)]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 4.5v4M8 11h.01" />
              <circle cx="8" cy="8" r="6.5" />
            </svg>
            Choose a product above the message box to continue.
          </p>
        );
      }
      const pickedMonograph = requireMonograph(picked.drugId);
      const pickedAnswer = pickedMonograph.synthesizedAnswers[picked.answerKey];
      return pickedAnswer ? (
        <DrugAnswerTabs
          key={picked.id}
          drugInfoMode="accordion"
          monograph={pickedMonograph}
          onOpenMonograph={(subfieldId) => openCanvas(picked.drugId, subfieldId)}
          question={`${turn.question} — ${picked.label}`}
          references={buildReferences(pickedAnswer, pickedMonograph)}
          synthesizedAnswer={pickedAnswer}
          initialAccordionAnchor={picked.anchor}
          analyticsContext={analyticsContextFor(id)}
        />
      ) : null;
    }

    // S7 — condition article with drug-pill handoff.
    if (turn.conditionArticle) {
      return (
        <div className="space-y-4">
          <ConditionArticleCard
            article={t2dmConditionArticle}
            openedDrugIds={openedConditionDrugs}
            onPickDrug={(drugId) =>
              setOpenedConditionDrugs((prev) =>
                prev.includes(drugId) ? prev : [...prev, drugId],
              )
            }
          />
          {openedConditionDrugs.map((drugId) => (
            <div key={drugId} ref={(el) => registerCard(`${id}:${drugId}`, el)}>
              <DrugMonographCardFrame
                monograph={requireMonograph(drugId)}
                highlight
                onOpenMonograph={(subfieldId) => openCanvas(drugId, subfieldId)}
              />
            </div>
          ))}
        </div>
      );
    }

    // S4 — side-by-side comparison.
    if (turn.comparisonSynthesis && turn.monographs.length >= 2) {
      return (
        <DrugComparisonView
          synthesis={turn.comparisonSynthesis}
          items={turn.monographs.map((view) => ({
            anchor: view.anchor,
            monograph: requireMonograph(view.drugId),
          }))}
          onOpenMonograph={(drugId, subfieldId) => openCanvas(drugId, subfieldId)}
        />
      );
    }

    // S8 — deterministic tool + anchored source slices.
    if (turn.tool) {
      return (
        <div className="space-y-4">
          <DrugToolResultCard tool={turn.tool} />
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8497a9]">
            Source monograph slices
          </p>
          {turn.monographs.map((view) => (
            <div key={view.drugId} ref={(el) => registerCard(`${id}:${view.drugId}`, el)}>
              <DrugMonographCardFrame
                anchor={anchorOverrides[`${id}:${view.drugId}`] ?? view.anchor}
                monograph={requireMonograph(view.drugId)}
                onOpenMonograph={(subfieldId) => openCanvas(view.drugId, subfieldId)}
              />
            </div>
          ))}
        </div>
      );
    }

    // S5 / S6 — AI answer leads; monograph cards stacked below (max 3 enforced in data).
    if (turn.aiAnswer) {
      // S10: when the answer generates live, shimmer until its timer fires while
      // the monograph cards below stay visible from the start.
      const aiPending =
        typeof turn.aiAnswerDelayMs === "number" && !aiAnswerReady[id];
      return (
        <div className="space-y-4">
          {aiPending ? (
            <ScenarioAiAnswerShimmer />
          ) : (
            <ScenarioAiAnswerBlock
              aiAnswer={turn.aiAnswer}
              onCitation={(drugId, anchor) => deepLinkToCard(id, drugId, anchor)}
            />
          )}
          {turn.monographs.map((view) => (
            <div key={view.drugId} ref={(el) => registerCard(`${id}:${view.drugId}`, el)}>
              <DrugMonographCardFrame
                anchor={
                  anchorOverrides[`${id}:${view.drugId}`] ??
                  (view.collapsed ? undefined : view.anchor)
                }
                monograph={requireMonograph(view.drugId)}
                onOpenMonograph={(subfieldId) => openCanvas(view.drugId, subfieldId)}
              />
            </div>
          ))}
        </div>
      );
    }

    // S1 / S2 / S9 — answer tabs with accordion drug info.
    const view = turn.monographs[0];
    if (!view) return null;
    const monograph = requireMonograph(view.drugId);
    const answer = turn.answerKey
      ? monograph.synthesizedAnswers[turn.answerKey]
      : undefined;
    if (!answer) return null;
    const anchor = anchorOverrides[`${id}:${view.drugId}`] ?? view.anchor;

    return (
      <div className="space-y-3">
        {turn.instantAnswer ? (
          <p className="dc-rise flex items-start gap-2 rounded-[12px] border border-[#cfe5d9] bg-[#f2fbf6] px-3.5 py-2.5 text-[14px] font-semibold leading-[1.5] text-[#085d3a]">
            <svg viewBox="0 0 16 16" aria-hidden="true" className="mt-[3px] h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 1.5 14 4v4c0 3.2-2.2 5.3-6 6.5C4.2 13.3 2 11.2 2 8V4L8 1.5Z" />
              <path d="m5.8 8 1.6 1.6 3-3.2" />
            </svg>
            {turn.instantAnswer}
          </p>
        ) : null}
        <div
          ref={(el) => registerCard(`${id}:${view.drugId}`, el)}
          className={turn.updatesPrevious ? "dc-rise" : undefined}
        >
          <DrugAnswerTabs
            key={`${view.drugId}:${anchor ?? ""}`}
            drugInfoMode="accordion"
            answerTabLabel={
              activeScenario?.pattern === "S1" ? "Explore with AI" : undefined
            }
            monograph={monograph}
            onOpenMonograph={(subfieldId) => openCanvas(view.drugId, subfieldId)}
            question={turn.question}
            references={buildReferences(answer, monograph)}
            synthesizedAnswer={answer}
            initialAccordionAnchor={anchor}
            analyticsContext={analyticsContextFor(id)}
          />
        </div>
      </div>
    );
  };

  const analyticsContextFor = (turnId: number) => ({
    prototypeFamily: "drug-concept",
    prototypeRoute: "/drug-concept-i",
    prototypeSlug: "drug-concept-i",
    screenType: "drug-concept-i",
    turnId,
  });

  const pickClarifyOption = useCallback(
    (turnId: number, option: ScenarioClarifyOption) => {
      setPlayedTurns((prev) =>
        prev.map((t) => (t.id === turnId ? { ...t, pickedOption: option } : t)),
      );
    },
    [],
  );

  // S9: scripted Continue chip + Compare chip.
  const nextScriptedTurn =
    activeScenario && !isGenerating ? activeScenario.turns[playedTurns.length] : undefined;
  const lastPlayed = playedTurns[playedTurns.length - 1];
  const compareChip =
    !isGenerating && !compareActive && lastPlayed?.turn.compareChip
      ? lastPlayed.turn.compareChip
      : undefined;
  const activeCompare = compareActive ? lastPlayed?.turn.compareChip : undefined;

  // S3: a complete clarify turn with no pick yet → dock the module above the composer.
  const pendingClarify =
    lastPlayed && lastPlayed.status === "complete" && lastPlayed.turn.clarify && !lastPlayed.pickedOption
      ? lastPlayed
      : undefined;

  return (
    <DrugConceptShell activeConcept="I">
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
                playedTurns.length > 0 || composerNotice ? (
                  <ScenariosPill onClick={resetToBrowser} />
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
                {playedTurns.length > 0 || composerNotice ? (
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <ScenariosPill onClick={resetToBrowser} />
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
              {playedTurns.length === 0 && !composerNotice ? (
                <div className="flex flex-col items-center py-10 md:py-14">
                  <div className="dc-fade mb-3 rounded-full bg-[rgba(6,74,167,0.06)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--mscp-color-brand-primary)]">
                    Concept I · Leading candidate
                  </div>
                  <h2 className="dc-rise mt-2 max-w-[420px] text-center text-[22px] font-extrabold leading-[1.2] tracking-[-0.02em] text-[#161b1d] [text-wrap:balance] md:text-[28px]">
                    Unified Canonical Experience
                  </h2>
                  <p className="dc-rise mt-3 max-w-[460px] text-center text-[13.5px] leading-[1.65] text-[#5a6e7e] [text-wrap:balance]">
                    Every reply carries Answer · Drug Information · References tabs, with the
                    canonical monograph as a progressive accordion. Pick a use case below to see
                    how each drug-question scenario plays out — every exchange is scripted from
                    canonical content, no live AI.
                  </p>

                  {/* Scenario picker — use-case cards + questions for the selected card */}
                  <div className="mt-8 w-full max-w-[680px]">
                    <DrugScenarioPicker
                      groups={DRUG_SCENARIO_GROUPS}
                      activeScenarioId={activeScenario?.id}
                      onSelect={playScenario}
                    />
                  </div>
                </div>
              ) : (
                <>
                  {playedTurns.map((played, index) => {
                    // S9 in-place update: skip the previous turn's card once the
                    // follow-up that replaces it has rendered.
                    const supersededByNext =
                      playedTurns[index + 1]?.turn.updatesPrevious &&
                      playedTurns[index + 1]?.status === "complete";
                    return (
                      <article key={played.id} className="mx-auto mb-10 max-w-[860px] last:mb-0">
                        <h1 className="mb-5 text-[20px] font-extrabold leading-[1.24] tracking-[-0.02em] text-[#161b1d] [text-wrap:balance] md:text-[26px]">
                          {played.turn.question}
                        </h1>
                        {played.status === "preparing" ? (
                          <AiPreparingAnswerNotice
                            question={played.turn.question}
                            text="Selecting canonical drug reference…"
                          />
                        ) : supersededByNext ? (
                          <p className="rounded-[10px] bg-[#f6f9fc] px-3 py-2 text-[12px] font-medium text-[#7a8da0]">
                            Card updated in place below — same drug, new section.
                          </p>
                        ) : activeCompare && index === playedTurns.length - 1 ? (
                          <DrugComparisonView
                            synthesis={activeCompare.synthesis}
                            items={activeCompare.views.map((view) => ({
                              anchor: view.anchor,
                              monograph: requireMonograph(view.drugId),
                            }))}
                            onOpenMonograph={(drugId, subfieldId) =>
                              openCanvas(drugId, subfieldId)
                            }
                          />
                        ) : (
                          renderTurnBody(played)
                        )}
                      </article>
                    );
                  })}

                  {/* Scripted follow-up chips */}
                  {(nextScriptedTurn || compareChip) && (
                    <div className="mx-auto mb-8 flex max-w-[860px] flex-wrap gap-2">
                      {nextScriptedTurn ? (
                        <button
                          type="button"
                          onClick={advanceScenario}
                          style={{ touchAction: "manipulation" }}
                          className="dc-rise inline-flex items-center gap-2 rounded-full border border-[rgba(6,74,167,0.3)] bg-white px-4 py-2 text-[13px] font-semibold text-[var(--mscp-color-brand-primary)] shadow-[0_1px_3px_rgba(6,74,167,0.1)] transition hover:bg-[rgba(6,74,167,0.05)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] focus-visible:ring-offset-1"
                        >
                          <span className="rounded-full bg-[rgba(6,74,167,0.08)] px-1.5 py-px text-[9px] font-bold uppercase tracking-[0.08em]">
                            Next turn
                          </span>
                          “{nextScriptedTurn.question}”
                        </button>
                      ) : null}
                      {compareChip ? (
                        <button
                          type="button"
                          onClick={() => setCompareActive(true)}
                          style={{ touchAction: "manipulation" }}
                          className="dc-rise inline-flex items-center gap-2 rounded-full bg-[var(--mscp-color-brand-primary)] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_2px_8px_rgba(6,74,167,0.25)] transition hover:bg-[#053d8a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] focus-visible:ring-offset-2"
                        >
                          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                            <path d="M6.5 2.5h-4v11h4M9.5 2.5h4v11h-4" />
                          </svg>
                          {compareChip.label}
                        </button>
                      ) : null}
                    </div>
                  )}

                  {/* Composer fallback notice */}
                  {composerNotice ? (
                    <article className="mx-auto mb-10 max-w-[860px]">
                      <h1 className="mb-4 text-[20px] font-extrabold leading-[1.24] tracking-[-0.02em] text-[#161b1d] md:text-[26px]">
                        {composerNotice}
                      </h1>
                      <p className="rounded-[12px] border border-[#e6edf4] bg-[#f8fafc] px-4 py-3 text-[13.5px] leading-[1.6] text-[#5a6e7e]">
                        This prototype is scripted — it plays preset scenarios rather than
                        answering live. Tap Scenarios in the header to browse the use cases
                        and pick the closest question.
                      </p>
                    </article>
                  ) : null}
                </>
              )}
            </div>
          </div>

          {/* Scroll-down FAB */}
          <div className="pointer-events-none absolute inset-x-0 bottom-[76px] z-10">
            <div className="mx-auto flex w-full max-w-[900px] justify-center px-5">
              <ScrollDownFAB scrollRef={scrollRef} />
            </div>
          </div>

          {/* Fixed composer (+ docked S3 clarify module) */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
            {pendingClarify?.turn.clarify ? (
              <div className="mx-auto w-full max-w-[900px] px-4 md:px-6">
                <div className="pointer-events-auto pb-2">
                  <DrugClarifyingQuestionCard
                    prompt={pendingClarify.turn.clarify.prompt}
                    options={pendingClarify.turn.clarify.options}
                    onPick={(option) => pickClarifyOption(pendingClarify.id, option)}
                  />
                </div>
              </div>
            ) : null}
            <div className="mx-auto w-full max-w-[900px] px-4 pb-0 md:px-6">
              <div className="rounded-t-[28px] bg-gradient-to-b from-transparent via-white/82 to-white px-2 pb-[max(env(safe-area-inset-bottom),6px)] pt-3 md:pt-4">
                <AiResponseChatComposer
                  formClassName="pointer-events-auto flex min-h-[48px] items-center gap-2 rounded-[999px] border border-[rgba(109,153,206,0.45)] bg-white px-4 py-1 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_22px_rgba(16,24,40,0.06)]"
                  iconClassName="h-8 w-8"
                  inputClassName="h-8 flex-1 border-0 bg-transparent text-[16px] leading-[20px] text-[#1b2b3a] outline-none placeholder:text-[#93a2ae]"
                  inputRef={composerInputRef}
                  analyticsSourceSurface="drug_concept_i"
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
