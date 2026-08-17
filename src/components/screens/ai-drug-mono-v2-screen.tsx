/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DrugConceptShell } from "@/components/medscape/drug-concepts/concept-shell";
import {
  DrugComparisonTopicTable,
  DrugMonographCardFrame,
} from "@/components/medscape/drug-concepts/comparison-view";
import { DrugComparisonIntro } from "@/components/medscape/drug-concepts/comparison-intro";
import { DrugQuestionHeading } from "@/components/medscape/drug-concepts/question-heading";
import { DrugAnswerSourceChips } from "@/components/medscape/drug-concepts/answer-source-chips";
import { DrugAnswerLoadingSkeleton } from "@/components/medscape/drug-concepts/answer-loading-skeleton";
import { MedscapeCurrentAdBlock } from "@/components/medscape/ai-current/ad-block";
import {
  DrugPatientContextPanel,
  DrugPatientDetailsPrompt,
} from "@/components/medscape/drug-concepts/patient-context-panel";
import { DrugPeerContextFeature } from "@/components/medscape/drug-concepts/peer-context-feature";
import { InteractionCheckerFeature } from "@/components/medscape/drug-concepts/interaction-checker-feature";
import { DrugRegimenChecker } from "@/components/medscape/drug-concepts/regimen-checker";
import { DrugMonographChangeAlert } from "@/components/medscape/drug-concepts/monograph-change-alert";
import { AiResponseChatComposer } from "@/components/medscape/ai-response/chat-composer";
import { AiResponseAnswerContent } from "@/components/medscape/ai-response/answer-content";
import { AiResponseAnswerActions } from "@/components/medscape/ai-response/answer-actions";
import { AiResponseReferences } from "@/components/medscape/ai-response/references";
import { AiResponseAnswerFooter } from "@/components/medscape/ai-response/answer-footer";
import { AiMobileTopRail } from "@/components/medscape/ai-response/mobile-top-rail";
import { AiMenuIcon } from "@/components/medscape/ai-response/iconography";
import { PrototypeNavSidebar } from "@/components/medscape/drug-concepts/prototype-nav-sidebar";
import { AiTopRailAction } from "@/components/medscape/ai-response/top-rail-action";
import { ScrollDownFAB } from "@/components/ui/scroll-down-fab";
import {
  ResponsiveFeaturePanel,
  ResponsiveFeatureTrigger,
} from "@/components/ui/responsive-feature-panel";
import { aiResponseAssets } from "@/data/ai-response";
import type { AiAnswerReference } from "@/data/ai-response";
import { DRUG_CONCEPT_J_RELATED_ARTICLES } from "@/data/drug-concept-j-scenarios";
import { getSubfieldById } from "@/data/drug-monograph";
import type { DrugMonograph } from "@/data/drug-monograph";
import { getPocV2ScenarioMonograph } from "@/data/drug-monograph-poc-v2-scenarios";
import {
  getPocMonographById,
  resolveDrugQuery,
  warmDrugSearch,
} from "@/data/drug-search";
import {
  COMPARISON,
  CONNECTED_JOURNEY,
  DRUG_INTELLIGENCE_SCENARIOS,
  getDrugIntelligenceScenarioById,
  matchDrugIntelligenceUtterance,
  MONOGRAPH_UPDATE,
  ONCOLOGY_DOSE_CLARIFY_STEPS,
  ONCOLOGY_DOSE_CONTEXT,
  PEER_CONTEXT,
  REGIMEN_CHECK,
  SCRIPTED_FALLBACK_NOTICE,
  type DrugIntelligenceScenarioId,
} from "@/data/drug-intelligence-scenarios";

// The canonical answer + card render instantly; only the complementary AI
// answer below the card is held behind a shimmer (same treatment as V1). The
// patient-details prompt appears once this finishes rendering.
const ANSWER_DELAY_MS = 10000;
const V2_FOOTER_COPY = "Medscape AI prototype answer";

// Prototype instrumentation — local only, per the V2 prompt (§11). Logs which
// field TYPES were present, never patient values.
function logV2Event(event: string, detail?: Record<string, unknown>) {
  if (typeof console !== "undefined") {
    console.debug(`[ai-drug-mono-v2] ${event}`, detail ?? "");
  }
}

// Scripted V2 scenarios use the stored Content API POC oncology fixtures.
function requireMonograph(drugId: string): DrugMonograph {
  const monograph = getPocV2ScenarioMonograph(drugId);
  if (!monograph) throw new Error(`Unknown drug id in V2 scenario: ${drugId}`);
  return monograph;
}

// The side canvas was removed from V2 — "full monograph" affordances open the
// live reference.medscape.com monograph in a new tab instead.
function openLiveMonograph(monograph: DrugMonograph) {
  if (monograph.drug.referenceUrl && typeof window !== "undefined") {
    window.open(monograph.drug.referenceUrl, "_blank", "noopener");
  }
}

// Height of the monograph card's sticky section tab bar — a row scrolled to
// the top must clear it so its heading isn't hidden underneath.
const CARD_TAB_BAR_OFFSET = 64;

// Scrolls the nested chat scroller so `node` sits `offset` px from the top.
// Uses native smooth scrolling with a timed snap fallback — rAF-driven
// animation is avoided because some embedded/preview surfaces suppress
// requestAnimationFrame entirely, which would leave the scroll stuck.
function scrollNodeIntoView(node: HTMLElement | null, offset = 12) {
  if (!node) return;
  let scroller: HTMLElement | null = node.parentElement;
  while (scroller) {
    const { overflowY } = getComputedStyle(scroller);
    if (
      (overflowY === "auto" || overflowY === "scroll") &&
      scroller.scrollHeight > scroller.clientHeight
    ) {
      break;
    }
    scroller = scroller.parentElement;
  }
  if (!scroller) {
    node.scrollIntoView({ block: "start" });
    return;
  }
  const scrollerEl = scroller;
  const start = scrollerEl.scrollTop;
  const target = Math.max(
    start +
      (node.getBoundingClientRect().top - scrollerEl.getBoundingClientRect().top) -
      offset,
    0,
  );
  if (Math.abs(target - start) < 1) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  scrollerEl.scrollTo({ behavior: reduce ? "auto" : "smooth", top: target });
  // Snap fallback: if smooth scrolling silently no-oped, land instantly.
  window.setTimeout(() => {
    if (Math.abs(scrollerEl.scrollTop - start) < 2) scrollerEl.scrollTop = target;
  }, 260);
}

// After the card re-anchors to a subfield, bring the highlighted paragraph to
// the top of the viewport (just below the sticky tab bar), not the card header.
// The flash row renders after the anchor state commits, so poll briefly for it
// and fall back to the card top if it never appears.
function scrollAnchorRowToTop(cardEl: HTMLElement | null, attempt = 0) {
  if (!cardEl) return;
  const row = cardEl.querySelector<HTMLElement>(".dc-anchor-flash");
  if (row) {
    scrollNodeIntoView(row, CARD_TAB_BAR_OFFSET);
    return;
  }
  if (attempt < 8) {
    window.setTimeout(() => scrollAnchorRowToTop(cardEl, attempt + 1), 40);
  } else {
    scrollNodeIntoView(cardEl);
  }
}

// The complementary AI answer's [n] citations are authored in the scenario data
// (CONNECTED_JOURNEY.citations) and resolve to the POC monograph subfields — the
// POC content carries no synthesizedAnswers layer of its own.
function buildReferences(
  monograph: DrugMonograph,
  citations: ReadonlyArray<{ anchor: string; marker: number }>,
): AiAnswerReference[] {
  return citations.map((citation) => {
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

// ─── Start-over pill (header, shown while a thread is active) ─────────────────

function StartOverPill({ onClick }: { onClick: () => void }) {
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
      Start over
    </button>
  );
}

// ─── Monograph answer block (Moment 1) ─────────────────────────────────────────
// The exact answer at the top, rendered with the SAME body content and renderer
// as the monograph row itself (verbatim lines, monograph formatting) — never a
// rewritten sentence. The section title is the source link: clicking it scrolls
// to the answering paragraph in the canonical card below.

function MonographAnswerBlock({
  anchor,
  monograph,
  onSelectSource,
}: {
  /** Subfield whose verbatim body is the answer. */
  anchor: string;
  monograph: DrugMonograph;
  onSelectSource: (anchor: string) => void;
}) {
  const subfield = getSubfieldById(monograph, anchor);
  if (!subfield) return null;

  return (
    <div className="dc-rise">
      {/* Clickable section title — scrolls to the paragraph in the monograph card. */}
      <button
        type="button"
        onClick={() => onSelectSource(anchor)}
        style={{ touchAction: "manipulation" }}
        className="text-left text-[16px] font-bold leading-snug text-[var(--mscp-color-brand-primary)] transition hover:text-[#053b85] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
      >
        {subfield.title}
      </button>
      {/* Verbatim monograph body through the same renderer the card uses. */}
      <AiResponseAnswerContent
        answer={subfield.body.join("\n")}
        className="mt-1.5 text-[14px] leading-[1.6] text-[#161b1d] [font-variant-numeric:tabular-nums]"
      />
    </div>
  );
}

// ─── Thread turns ──────────────────────────────────────────────────────────────

type V2TurnInput =
  | { kind: "exact-answer"; status: "loading" | "complete" }
  | {
      kind: "dose-calculator";
      autoConfirmed?: boolean;
      values?: Record<string, string>;
    }
  | { kind: "comparison" }
  | { kind: "regimen" }
  | { kind: "monograph-update" }
  | {
      // Manually typed free-text drug query resolved against the exact POC
      // content (drug or drug + section). Not part of the scripted scenarios.
      kind: "drug-search";
      anchor: string;
      drugId: string;
      query: string;
      sectionId: string | null;
    }
  | { kind: "notice"; text: string };

type V2Turn = V2TurnInput & { id: number };

// ── Moment 1 — exact answer + anchored canonical card ──

function ExactAnswerTurn({
  onCompare,
  status,
  turnIndex,
}: {
  onCompare: () => void;
  /** Governs only the AI answer below the card — the canonical content is instant. */
  status: "loading" | "complete";
  turnIndex: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const monograph = requireMonograph(CONNECTED_JOURNEY.drugId);
  const references = buildReferences(monograph, CONNECTED_JOURNEY.citations);
  const aiAnswer = CONNECTED_JOURNEY.aiAnswer;
  const analyticsContext = {
    prototypeFamily: "drug-concept",
    prototypeRoute: "/ai-drug-mono-v2",
    prototypeSlug: "ai-drug-mono-v2",
    question: CONNECTED_JOURNEY.question,
    screenType: "ai-drug-mono-v2",
    turnId: turnIndex + 1,
  };
  const [cardAnchor, setCardAnchor] = useState<string>(CONNECTED_JOURNEY.anchor);

  useEffect(() => {
    logV2Event("exact_answer_anchor_rendered", { anchor: CONNECTED_JOURNEY.anchor });
  }, []);

  const scrollToCard = useCallback(() => {
    scrollNodeIntoView(cardRef.current);
  }, []);

  // Source row → re-anchor the card to that subfield and bring the highlighted
  // paragraph to the top of the viewport.
  const selectSource = (anchor: string) => {
    logV2Event("source_row_selected", { anchor });
    setCardAnchor(anchor);
    window.setTimeout(() => scrollAnchorRowToTop(cardRef.current), 30);
  };

  return (
    <article className="mx-auto max-w-[860px]">
      <DrugQuestionHeading>
        {CONNECTED_JOURNEY.question}
      </DrugQuestionHeading>

      <div className="space-y-5">
        {/* Returning-user update context is part of the first answer now, so a
            stakeholder can demonstrate it without leaving the main journey. */}
        <DrugMonographChangeAlert
          badge={MONOGRAPH_UPDATE.badge}
          changedSectionsLabel={MONOGRAPH_UPDATE.changedSectionsLabel}
          drugName={monograph.drug.name}
          lastViewedDate={MONOGRAPH_UPDATE.lastViewedDate}
          onDismiss={() => logV2Event("monograph_alert_dismissed")}
          onOpenSection={selectSource}
          sections={MONOGRAPH_UPDATE.sections}
        />

        <DrugAnswerSourceChips
          references={references}
          onJumpToReferences={scrollToCard}
          onJumpToSources={scrollToCard}
        />

        <MonographAnswerBlock
          anchor={CONNECTED_JOURNEY.anchor}
          monograph={monograph}
          onSelectSource={selectSource}
        />

        <section aria-label="Next steps">
          <h2 className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#5a6e7e]">
            Continue this task
          </h2>
          <div className="space-y-2">
            <ResponsiveFeaturePanel
              panelTitle="Patient Dose Calculator"
              title={CONNECTED_JOURNEY.actions.applyPatientContext}
              onOpenChange={(isOpen) =>
                logV2Event(isOpen ? "patient_details_opened" : "patient_details_closed")
              }
            >
              <DrugPatientContextPanel
                oncologyDose={ONCOLOGY_DOSE_CONTEXT}
                presentation="panel"
                onConfirm={(fieldIds) =>
                  logV2Event("oncology_dose_context_confirmed", {
                    fieldTypes: fieldIds,
                  })
                }
                onOpenSource={selectSource}
              />
            </ResponsiveFeaturePanel>

            <ResponsiveFeatureTrigger
              actionLabel="Open"
              title={CONNECTED_JOURNEY.actions.compare}
              onClick={onCompare}
            />

            <InteractionCheckerFeature
              onOpenChange={(isOpen) =>
                logV2Event(isOpen ? "interaction_checker_opened" : "interaction_checker_closed")
              }
              onRunCheck={(drugCount) => logV2Event("regimen_check_run", { drugCount })}
            />
          </div>
        </section>

        {/* Canonical card — sections AND subsections collapsed except the one
            answering the question. */}
        <div ref={cardRef} className="scroll-mt-4">
          <DrugMonographCardFrame
            key={cardAnchor}
            anchor={cardAnchor}
            boxedWarningVariant="navy"
            flashAnchor
            flat
            hideMatchBadges
            hideSectionSummary
            hideSubfieldSummary
            interactionAction={
              <InteractionCheckerFeature
                onOpenChange={(isOpen) =>
                  logV2Event(
                    isOpen
                      ? "interaction_checker_opened_from_monograph"
                      : "interaction_checker_closed",
                  )
                }
                onRunCheck={(drugCount) => logV2Event("regimen_check_run", { drugCount })}
              />
            }
            monograph={monograph}
            onOpenMonograph={() => openLiveMonograph(monograph)}
            promoteSelectedSection
            tabStyle="underline"
          />
        </div>

        {/* Complementary AI answer — shimmer until generated (V1 treatment). */}
        <div className="scroll-mt-4">
          {status === "loading" ? (
            <DrugAnswerLoadingSkeleton />
          ) : (
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
              <AiResponseReferences
                analyticsContext={analyticsContext}
                className="mt-5"
                references={references}
              />
            </section>
          )}
        </div>
      </div>
    </article>
  );
}

// ── Moment 2 — indication-aware, weight-based dose calculation ──

function OncologyDoseContextTurn({
  autoConfirmed,
  values,
}: {
  autoConfirmed?: boolean;
  values?: Record<string, string>;
}) {
  const [cardAnchor, setCardAnchor] = useState<string>(CONNECTED_JOURNEY.anchor);
  const cardRef = useRef<HTMLDivElement>(null);
  const monograph = requireMonograph(CONNECTED_JOURNEY.drugId);

  const moveAnchor = useCallback((anchor: string) => {
    logV2Event("source_row_selected", { anchor });
    setCardAnchor(anchor);
    window.setTimeout(() => scrollAnchorRowToTop(cardRef.current), 30);
  }, []);

  return (
    <article className="mx-auto max-w-[860px]">
      <DrugQuestionHeading>
        {CONNECTED_JOURNEY.patientContextQuestion}
      </DrugQuestionHeading>

      <div className="space-y-5">
        <DrugPatientContextPanel
          initialValues={values}
          oncologyDose={ONCOLOGY_DOSE_CONTEXT}
          onConfirm={(fieldIds) =>
            logV2Event("oncology_dose_context_confirmed", { fieldTypes: fieldIds })
          }
          onOpenSource={moveAnchor}
          startInResult={autoConfirmed}
        />

        {/* Canonical card stays beneath the shared patient-context component. */}
        <div ref={cardRef} className="scroll-mt-4">
          <DrugMonographCardFrame
            key={cardAnchor}
            anchor={cardAnchor}
            boxedWarningVariant="navy"
            flashAnchor
            flat
            hideMatchBadges
            hideSectionSummary
            hideSubfieldSummary
            monograph={monograph}
            onOpenMonograph={() => openLiveMonograph(monograph)}
            promoteSelectedSection
            tabStyle="underline"
          />
        </div>
      </div>
    </article>
  );
}

// ── Moments 3 + 4 — canonical comparison + peer context ──

function ComparisonTurn({
  onAlternativeSelect,
}: {
  onAlternativeSelect: (drugName: string) => void;
}) {
  const [activeTopicId, setActiveTopicId] = useState<string>(COMPARISON.topics[0]!.id);
  const left = requireMonograph(COMPARISON.drugIds.left);
  const right = requireMonograph(COMPARISON.drugIds.right);

  // Bottom monograph reference — a drug tab switcher, both cards start closed
  // (no anchor → all sections collapsed). Source links open a section here.
  const [monographDrugId, setMonographDrugId] = useState<string>(left.drug.id);
  const [monographAnchor, setMonographAnchor] = useState<string | undefined>(undefined);
  const monographRef = useRef<HTMLDivElement>(null);
  const activeMonograph = monographDrugId === right.drug.id ? right : left;

  useEffect(() => {
    logV2Event("comparison_opened", {
      drugs: [COMPARISON.drugIds.left, COMPARISON.drugIds.right],
    });
  }, []);

  const changeTopic = useCallback((topicId: string) => {
    setActiveTopicId(topicId);
    logV2Event("comparison_topic_changed", { topicId });
  }, []);

  // Source link → switch the bottom monograph to that drug, open the section,
  // and scroll it to the top of the viewport.
  const openSourceInMonograph = useCallback((drugId: string, anchor: string) => {
    logV2Event("source_opened", { anchor, drugId });
    setMonographDrugId(drugId);
    setMonographAnchor(anchor);
    window.setTimeout(() => scrollAnchorRowToTop(monographRef.current), 40);
  }, []);

  // Manual tab switch resets the card to its closed state.
  const switchMonograph = (drugId: string) => {
    setMonographDrugId(drugId);
    setMonographAnchor(undefined);
  };

  return (
    <article className="mx-auto max-w-[860px]">
      <div className="space-y-5">
        <DrugComparisonIntro
          description={COMPARISON.intro.description}
          drugNames={[left.drug.name, right.drug.name]}
          onJumpToReferences={() => scrollNodeIntoView(monographRef.current)}
          question={COMPARISON.intro.question}
          referenceCount={COMPARISON.topics.length}
        />

        {/* Cell source links jump to the section in the monograph below. */}
        <DrugComparisonTopicTable
          activeTopicId={activeTopicId}
          left={left}
          onOpenSource={openSourceInMonograph}
          onTopicChange={changeTopic}
          right={right}
          topics={COMPARISON.topics.map((topic) => ({
            cells: topic.cells,
            id: topic.id,
            title: topic.title,
          }))}
        />

        <DrugPeerContextFeature
          activeTopicId={
            PEER_CONTEXT.topics.find((topic) => topic.comparisonTopicId === activeTopicId)?.id
          }
          alternatives={PEER_CONTEXT.alternatives}
          alternativesDescription={PEER_CONTEXT.alternativesDescription}
          alternativesHeader={PEER_CONTEXT.alternativesHeader}
          behaviorLabel={PEER_CONTEXT.behaviorLabel}
          body={PEER_CONTEXT.body}
          explanation={PEER_CONTEXT.explanation}
          header={PEER_CONTEXT.header}
          onOpenChange={(isOpen) => {
            logV2Event(isOpen ? "peer_context_opened" : "peer_context_closed");
          }}
          onAlternativeSelect={(alternative) => {
            logV2Event("peer_alternative_selected", { drugId: alternative.id });
            onAlternativeSelect(alternative.name);
          }}
          onTopicSelect={(topic) => {
            logV2Event("peer_topic_selected", { topicId: topic.id });
            changeTopic(topic.comparisonTopicId);
          }}
          topics={PEER_CONTEXT.topics}
        />

        {/* Full monograph reference — drug tab switcher, both closed by default. */}
        <section ref={monographRef} className="scroll-mt-4" aria-label="Full drug monographs">
          <div role="tablist" aria-label="Drug monograph" className="flex gap-1.5">
            {[left, right].map((m) => {
              const isActive = m.drug.id === monographDrugId;
              return (
                <button
                  key={m.drug.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => switchMonograph(m.drug.id)}
                  style={{ touchAction: "manipulation" }}
                  className={`rounded-full border px-4 py-1.5 text-[13px] font-bold leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] ${
                    isActive
                      ? "border-[var(--mscp-color-brand-primary)] bg-[#e6eefb] text-[var(--mscp-color-brand-primary)]"
                      : "border-[#dbe4ee] bg-white text-[#3a4f6b] hover:bg-[#f2f7fe]"
                  }`}
                >
                  {m.drug.name}
                </button>
              );
            })}
          </div>
          <div className="mt-3">
            <DrugMonographCardFrame
              key={`${monographDrugId}:${monographAnchor ?? "closed"}`}
              anchor={monographAnchor}
              boxedWarningVariant="navy"
              flashAnchor={Boolean(monographAnchor)}
              flat
              hideMatchBadges
              hideSectionSummary
              hideSubfieldSummary
              monograph={activeMonograph}
              onOpenMonograph={() => openLiveMonograph(activeMonograph)}
              promoteSelectedSection
              tabStyle="underline"
            />
          </div>
        </section>
      </div>
    </article>
  );
}

// ── Scenario 2 — regimen interaction check ──

function RegimenTurn() {
  return (
    <article className="mx-auto max-w-[860px]">
      <DrugQuestionHeading>
        {REGIMEN_CHECK.question}
      </DrugQuestionHeading>
      <DrugRegimenChecker
        onRunCheck={(drugCount) => logV2Event("regimen_check_run", { drugCount })}
      />
    </article>
  );
}

// ── Scenario 3 — monograph change alert ──

function MonographUpdateTurn() {
  const [cardAnchor, setCardAnchor] = useState<string | undefined>(undefined);
  const cardRef = useRef<HTMLDivElement>(null);
  const monograph = requireMonograph(MONOGRAPH_UPDATE.drugId);
  const scenario = getDrugIntelligenceScenarioById("bevacizumab-monograph-update");

  const openSection = useCallback((anchor: string) => {
    logV2Event("monograph_alert_change_opened", { anchor });
    setCardAnchor(anchor);
    window.setTimeout(() => scrollAnchorRowToTop(cardRef.current), 30);
  }, []);

  return (
    <article className="mx-auto max-w-[860px]">
      <DrugQuestionHeading>
        {scenario?.startingQuestion}
      </DrugQuestionHeading>

      <div className="space-y-5">
        <DrugMonographChangeAlert
          badge={MONOGRAPH_UPDATE.badge}
          changedSectionsLabel={MONOGRAPH_UPDATE.changedSectionsLabel}
          drugName={monograph.drug.name}
          lastViewedDate={MONOGRAPH_UPDATE.lastViewedDate}
          onDismiss={() => logV2Event("monograph_alert_dismissed")}
          onOpenSection={openSection}
          sections={MONOGRAPH_UPDATE.sections}
        />

        <div ref={cardRef} className="scroll-mt-4">
          <DrugMonographCardFrame
            key={cardAnchor ?? "collapsed"}
            anchor={cardAnchor}
            boxedWarningVariant="navy"
            flashAnchor={Boolean(cardAnchor)}
            flat
            hideMatchBadges
            hideSectionSummary
            hideSubfieldSummary
            monograph={monograph}
            onOpenMonograph={() => openLiveMonograph(monograph)}
            promoteSelectedSection
            tabStyle="underline"
          />
        </div>
      </div>
    </article>
  );
}

// ── Free-text drug search result (manual composer input only) ──
// Renders exact POC content: the top answer is the anchored subfield verbatim
// (adult Forms & Strengths when no section was named), followed by the canonical
// card opened at that section. The Adult/Pediatric toggle lives in the card.

function DrugSearchTurn({
  anchor,
  drugId,
  query,
  sectionId,
}: {
  anchor: string;
  drugId: string;
  query: string;
  /** Canonical section the query named, or null when none was specified. */
  sectionId: string | null;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  // When a section is named, open the card at that section. When no section is
  // specified, the card stays collapsed — the first-section content still shows
  // in the answer block above, but nothing is auto-expanded below.
  const [cardAnchor, setCardAnchor] = useState<string | undefined>(
    sectionId ? anchor : undefined,
  );
  const monograph = getPocMonographById(drugId);

  useEffect(() => {
    logV2Event("drug_search_rendered", { anchor, drugId, sectionId });
  }, [anchor, drugId, sectionId]);

  const selectSource = useCallback((next: string) => {
    logV2Event("source_row_selected", { anchor: next });
    setCardAnchor(next);
    window.setTimeout(() => scrollAnchorRowToTop(cardRef.current), 30);
  }, []);

  if (!monograph) return null;

  return (
    <article id={`drug-${drugId}`} className="mx-auto max-w-[860px] scroll-mt-4">
      <DrugQuestionHeading>{query}</DrugQuestionHeading>

      <div className="space-y-5">
        <MonographAnswerBlock
          anchor={anchor}
          monograph={monograph}
          onSelectSource={selectSource}
        />

        <div ref={cardRef} className="scroll-mt-4">
          <DrugMonographCardFrame
            key={cardAnchor ?? "collapsed"}
            anchor={cardAnchor}
            boxedWarningVariant="navy"
            flashAnchor={Boolean(cardAnchor)}
            flat
            hideMatchBadges
            hideSectionSummary
            hideSubfieldSummary
            monograph={monograph}
            onOpenMonograph={() => openLiveMonograph(monograph)}
            promoteSelectedSection
            tabStyle="underline"
          />
        </div>
      </div>
    </article>
  );
}

// ─── Main screen ───────────────────────────────────────────────────────────────
// V2 exploration workspace: one stakeholder-ready bevacizumab journey progressing
// as a cumulative chat thread. Focused scenario deep links remain supported for
// testing. /ai-drug-mono-v1 keeps its own screen and is untouched by this file.

export function AiDrugMonoV2Screen() {
  const composerInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastTurnRef = useRef<HTMLDivElement>(null);
  const turnIdRef = useRef(0);
  const loadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [thread, setThread] = useState<V2Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [navOpen, setNavOpen] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const [promptKey, setPromptKey] = useState(0);

  const clearTimer = useCallback(() => {
    if (loadTimerRef.current) {
      clearTimeout(loadTimerRef.current);
      loadTimerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimer(), [clearTimer]);

  // Earlier turns never stay in the shimmer state once a new turn lands.
  const completeAll = (items: V2Turn[]): V2Turn[] =>
    items.map((item) =>
      item.kind === "exact-answer" ? { ...item, status: "complete" as const } : item,
    );

  const appendTurn = useCallback(
    (turn: V2TurnInput) => {
      clearTimer();
      setPromptOpen(false);
      const id = ++turnIdRef.current;
      setThread((prev) => [...completeAll(prev), { ...turn, id }]);
      if (turn.kind === "exact-answer" && turn.status === "loading") {
        loadTimerRef.current = setTimeout(() => {
          setThread((prev) =>
            prev.map((item) =>
              item.kind === "exact-answer" && item.id === id
                ? { ...item, status: "complete" }
                : item,
            ),
          );
        }, ANSWER_DELAY_MS);
      }
    },
    [clearTimer],
  );

  const setScenarioParam = useCallback((scenarioId: string | null) => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (scenarioId) url.searchParams.set("scenario", scenarioId);
    else url.searchParams.delete("scenario");
    window.history.replaceState(null, "", url.toString());
  }, []);

  const playScenario = useCallback(
    (scenarioId: DrugIntelligenceScenarioId, updateUrl = true) => {
      logV2Event("scenario_selected", { scenarioId });
      const firstTurn: V2TurnInput =
        scenarioId === "connected-bevacizumab"
          ? { kind: "exact-answer", status: "loading" }
          : scenarioId === "bevacizumab-regimen-check"
            ? { kind: "regimen" }
            : { kind: "monograph-update" };
      appendTurn(firstTurn);
      if (updateUrl) setScenarioParam(scenarioId);
    },
    [appendTurn, setScenarioParam],
  );

  const openOncologyDosePrompt = useCallback(() => {
    logV2Event("bevacizumab_dose_prompt_opened");
    setPromptKey((key) => key + 1);
    setPromptOpen(true);
  }, []);

  const handleJourneyAction = useCallback(
    (action: "dose-calculator" | "compare" | "regimen") => {
      if (action === "dose-calculator") {
        openOncologyDosePrompt();
      } else if (action === "compare") {
        appendTurn({ kind: "comparison" });
      } else {
        appendTurn({ kind: "regimen" });
      }
    },
    [appendTurn, openOncologyDosePrompt],
  );

  const confirmOncologyDoseDetails = useCallback(
    (values: Record<string, string>) => {
      logV2Event("oncology_dose_context_confirmed", {
        fieldTypes: Object.keys(values).filter((key) => values[key]?.trim()),
      });
      appendTurn({ autoConfirmed: true, kind: "dose-calculator", values });
    },
    [appendTurn],
  );

  // Scroll the newest turn into view when it is added.
  const threadLength = thread.length;
  useEffect(() => {
    if (threadLength === 1) {
      // Keep the top of the first answer visible. Scrolling its wrapper into
      // view would place the question and update banner beneath the sticky ad.
      scrollRef.current?.scrollTo({ top: 0 });
    } else if (threadLength > 1) {
      window.setTimeout(() => scrollNodeIntoView(lastTurnRef.current), 30);
    }
  }, [threadLength]);

  // ?scenario= deep link on mount.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("scenario");
    if (id && getDrugIntelligenceScenarioById(id)) {
      playScenario(id as DrugIntelligenceScenarioId, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitQuestion = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const matched = matchDrugIntelligenceUtterance(trimmed);
      if (matched) {
        if (matched.kind === "start-scenario") {
          playScenario(matched.scenarioId);
        } else if (matched.kind === "patient-context") {
          openOncologyDosePrompt();
        } else {
          handleJourneyAction("compare");
        }
        return;
      }

      // Manual free-text drug search over the exact POC content — resolve the
      // drug name (+ optional section intent) and render the monograph card.
      const result = await resolveDrugQuery(trimmed);
      if (result) {
        logV2Event("drug_search_matched", {
          drugId: result.drugId,
          sectionId: result.sectionId,
        });
        appendTurn({
          anchor: result.anchor,
          drugId: result.drugId,
          kind: "drug-search",
          query: trimmed,
          sectionId: result.sectionId,
        });
      } else {
        logV2Event("drug_search_no_match");
        appendTurn({ kind: "notice", text: trimmed });
      }
    },
    [appendTurn, handleJourneyAction, openOncologyDosePrompt, playScenario],
  );

  const resetToLanding = useCallback(() => {
    clearTimer();
    setThread([]);
    setPromptOpen(false);
    setScenarioParam(null);
  }, [clearTimer, setScenarioParam]);

  const isGenerating = thread.some(
    (item) => item.kind === "exact-answer" && item.status === "loading",
  );

  const handleStopGeneration = useCallback(() => {
    clearTimer();
    setThread((prev) => completeAll(prev));
  }, [clearTimer]);

  const handleComposerSubmit = useCallback(() => {
    void submitQuestion(draft);
    setDraft("");
    composerInputRef.current?.focus();
  }, [draft, submitQuestion]);

  return (
    <DrugConceptShell activeConcept="J" hideTabBar>
      <div className="relative flex min-h-0 min-w-0 flex-1">
        {/* Chat / answer column */}
        <section className="relative flex min-h-0 min-w-0 flex-1 flex-col">
          <PrototypeNavSidebar isOpen={navOpen} onClose={() => setNavOpen(false)} />
          {/* Header */}
          <div className="z-20 shrink-0 bg-white">
            <AiMobileTopRail
              railClassName="bg-white px-3 pb-1 pt-2 md:hidden"
              contentClassName="relative flex min-h-[44px] items-center justify-between gap-2"
              left={
                <button
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
                thread.length > 0 ? (
                  <StartOverPill onClick={resetToLanding} />
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
                  aria-label="Open prototypes menu"
                  aria-expanded={navOpen}
                  onClick={() => setNavOpen(true)}
                  className="relative z-10 inline-flex h-9 w-9 items-center justify-center rounded-full text-[#687680] transition hover:bg-[#f1f5f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
                >
                  <AiMenuIcon />
                </button>
                {thread.length > 0 ? (
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <StartOverPill onClick={resetToLanding} />
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
          <div
            ref={scrollRef}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div
              aria-live="polite"
              className="mx-auto w-full max-w-[900px] px-4 pb-[136px] pt-4 md:px-6 md:pt-6"
            >
              {thread.length === 0 ? (
                // ── Landing — hero + unified walkthrough card ───────────────
                <div className="flex flex-col items-center py-10 md:py-14">
                  <h2 className="dc-rise mt-2 max-w-[480px] text-center text-[22px] font-extrabold leading-[1.2] tracking-[-0.02em] text-[#161b1d] [text-wrap:balance] md:text-[28px]">
                    AI drug search V2 walkthrough
                  </h2>
                  <p className="dc-rise mt-3 max-w-[520px] text-center text-[13.5px] leading-[1.65] text-[#5a6e7e] [text-wrap:balance]">
                    Type a drug in the box below — e.g. “bevacizumab”, or “metformin
                    dosing” — to pull its canonical monograph straight from the POC
                    content, opened at the section you asked for. Or start the
                    complete stakeholder walkthrough below.
                  </p>

                  <div className="mt-8 w-full max-w-[560px] space-y-2">
                    {DRUG_INTELLIGENCE_SCENARIOS.filter(
                      (scenario) => scenario.id === "connected-bevacizumab",
                    ).map((scenario) => (
                      <button
                        key={scenario.id}
                        type="button"
                        onClick={() => playScenario(scenario.id)}
                        style={{ touchAction: "manipulation" }}
                        className="dc-rise group flex w-full items-start gap-3 rounded-[14px] border border-[#e3eaf2] bg-white px-4 py-3.5 text-left shadow-[0_1px_3px_rgba(16,24,40,0.05)] transition hover:border-[rgba(6,74,167,0.3)] hover:bg-[#f7faff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] focus-visible:ring-offset-1"
                      >
                        <span className="mt-0.5 inline-flex h-7 shrink-0 items-center rounded-full bg-[rgba(6,74,167,0.08)] px-2 text-[10px] font-bold uppercase tracking-[0.06em] text-[var(--mscp-color-brand-primary)]">
                          {scenario.group}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[14.5px] font-bold leading-snug text-[#1c2227]">
                            {scenario.title}
                          </span>
                          <span className="mt-1 block text-[12.5px] leading-[1.55] text-[#5a6e7e]">
                            {scenario.description}
                          </span>
                        </span>
                        <svg viewBox="0 0 16 16" aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[#9aa9b8] transition group-hover:translate-x-0.5 group-hover:text-[var(--mscp-color-brand-primary)]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 8h10M9 4l4 4-4 4" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                // ── Conversation thread — every turn stays visible ──────────
                <div className="space-y-0">
                  {/* Desktop-only — one persistent ad, sticky above the thread,
                      instead of a new banner per turn/follow-up. */}
                  <div className="sticky top-0 z-10 mx-auto hidden max-w-[860px] bg-white pb-3 md:block">
                    <MedscapeCurrentAdBlock
                      adPlacement="before-question"
                      adSlot="ai_drug_mono_v2_top"
                      prototypeFamily="drug-concept"
                      prototypeRoute="/ai-drug-mono-v2"
                      prototypeSlug="ai-drug-mono-v2"
                      screenType="ai-drug-mono-v2"
                    />
                </div>
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
                        <>
                          {item.kind === "exact-answer" ? (
                            <ExactAnswerTurn
                              onCompare={() => handleJourneyAction("compare")}
                              status={item.status}
                              turnIndex={index}
                            />
                          ) : item.kind === "dose-calculator" ? (
                            <OncologyDoseContextTurn
                              autoConfirmed={item.autoConfirmed}
                              values={item.values}
                            />
                          ) : item.kind === "comparison" ? (
                          <ComparisonTurn
                            onAlternativeSelect={(drugName) => {
                              void submitQuestion(drugName);
                            }}
                          />
                          ) : item.kind === "regimen" ? (
                            <RegimenTurn />
                          ) : item.kind === "monograph-update" ? (
                            <MonographUpdateTurn />
                          ) : item.kind === "drug-search" ? (
                            <DrugSearchTurn
                              anchor={item.anchor}
                              drugId={item.drugId}
                              query={item.query}
                              sectionId={item.sectionId}
                            />
                          ) : (
                            // ── Composer fallback notice ────────────────────
                            <article className="mx-auto max-w-[860px]">
                              <DrugQuestionHeading>{item.text}</DrugQuestionHeading>
                              <p className="rounded-[12px] border border-[#e6edf4] bg-[#f8fafc] px-4 py-3 text-[13.5px] leading-[1.6] text-[#5a6e7e]">
                                {SCRIPTED_FALLBACK_NOTICE}
                              </p>
                            </article>
                          )}

                          <AiResponseAnswerFooter
                            answer={V2_FOOTER_COPY}
                            articles={DRUG_CONCEPT_J_RELATED_ARTICLES}
                            className="mx-auto mt-6 max-w-[860px]"
                            onQuestionSelect={(question) => {
                              void submitQuestion(question);
                            }}
                            showActions={item.kind !== "exact-answer"}
                          />
                        </>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Scroll-down FAB */}
          <div className="pointer-events-none absolute inset-x-0 bottom-[76px] z-10">
            <div className="mx-auto flex w-full max-w-[900px] justify-end px-5 md:justify-center">
              <ScrollDownFAB scrollRef={scrollRef} />
            </div>
          </div>

          {/* Fixed composer with the shared docked oncology-dose prompt. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
            <div className="mx-auto w-full max-w-[900px] px-4 pb-0 md:px-6">
              <div className="rounded-t-[28px] bg-gradient-to-b from-transparent via-white/82 to-white pb-[max(env(safe-area-inset-bottom),6px)] pt-3 md:pt-4">
                {promptOpen ? (
                  <div className="pointer-events-auto">
                    <DrugPatientDetailsPrompt
                      key={promptKey}
                      onConfirm={confirmOncologyDoseDetails}
                      onDismiss={() => setPromptOpen(false)}
                      onFreeText={(text) => {
                        setPromptOpen(false);
                        void submitQuestion(text);
                      }}
                      steps={ONCOLOGY_DOSE_CLARIFY_STEPS}
                    />
                  </div>
                ) : (
                  <AiResponseChatComposer
                    formClassName="pointer-events-auto flex min-h-[48px] items-center gap-2 rounded-[999px] border border-[rgba(109,153,206,0.45)] bg-white px-4 py-1 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_22px_rgba(16,24,40,0.06)]"
                    iconClassName="h-8 w-8"
                    inputClassName="h-8 flex-1 border-0 bg-transparent text-[16px] leading-[20px] text-[#1b2b3a] outline-none placeholder:text-[#93a2ae]"
                    inputRef={composerInputRef}
                    analyticsSourceSurface="ai_drug_mono_v2"
                    isGenerating={isGenerating}
                    onStopGeneration={handleStopGeneration}
                    onSubmit={handleComposerSubmit}
                    onValueChange={(value) => {
                      setDraft(value);
                      // Warm the POC dataset while typing so the first manual
                      // search resolves without a load pause.
                      warmDrugSearch();
                    }}
                    placeholder="Ask a drug question — e.g. “bevacizumab” or “metformin dosing”…"
                    submitButtonClassName="inline-flex h-8 w-8 shrink-0 items-center justify-center"
                    value={draft}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </DrugConceptShell>
  );
}
