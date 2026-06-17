"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AiResponseAnswerActions } from "@/components/medscape/ai-response/answer-actions";
import { renderInlineText } from "@/components/medscape/ai-response/answer-content";
import { AiResponseReferenceCard } from "@/components/medscape/ai-response/reference-card";
import {
  ClinicalBoxedWarning,
  ClinicalSourceLabel,
  ClinicalZoneIcon,
  getZoneAccent,
} from "@/components/medscape/drug-concepts/clinical-system";
import { DrugMonographAccordion } from "@/components/medscape/drug-concepts/monograph-accordion";
import type { AiAnswerReference } from "@/data/ai-response";
import type { DrugMonograph, DrugSynthesizedAnswer } from "@/data/drug-monograph";

// ─── Tab types ────────────────────────────────────────────────────────────────

type MessageTab = "answer" | "drug-info" | "references";
type DrugInfoSubTab = "overview" | "dosing" | "safety" | "clinical" | "references";

type TabSpec = { id: string; label: string; ai?: boolean };

function buildMessageTabs(answerLabel: string): TabSpec[] {
  return [
    { id: "drug-info", label: "Drug Information" },
    { id: "answer", label: answerLabel, ai: true },
    { id: "references", label: "References" },
  ];
}

const DRUG_INFO_SUB_TABS: { id: DrugInfoSubTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "dosing", label: "Dosing" },
  { id: "safety", label: "Safety" },
  { id: "clinical", label: "Clinical" },
  { id: "references", label: "References" },
];

// Sticky subfield strip for the Dosing sub-tab per spec
const DOSING_STRIP: { id: string; label: string }[] = [
  { id: "dosing.afib", label: "AFib" },
  { id: "dosing.dose_reduction", label: "2.5 mg criteria" },
  { id: "dosing.dvt_pe", label: "DVT/PE" },
  { id: "dosing.renal_adjustment", label: "Renal" },
  { id: "dosing.hepatic", label: "Hepatic" },
];

const HIGHLIGHT_MS = 2200;

// ─── Internal icons + link ────────────────────────────────────────────────────

function ExternalLinkIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden="true"
      className="h-3 w-3 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 10 10 2M5.5 2H10v4.5" />
    </svg>
  );
}

// Full-monograph link shown at the bottom of every tab panel.
function MonographLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 rounded text-[12.5px] font-semibold text-[var(--mscp-color-brand-primary)] transition-colors hover:text-[#0352c9] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.22)] focus-visible:ring-offset-1"
    >
      {label}
      <ExternalLinkIcon />
    </a>
  );
}

// AI spark glyph — marks the AI-generated answer tab (matches instant-card.tsx).
function AiSparkIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
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

function ChevronRightMiniIcon() {
  return (
    <svg
      viewBox="0 0 10 10"
      aria-hidden="true"
      className="h-2.5 w-2.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3.5 2 3 3-3 3" />
    </svg>
  );
}

// ─── Tab bar ─────────────────────────────────────────────────────────────────

function TabBar({
  activeTab,
  onSelect,
  tabs,
}: {
  activeTab: string;
  onSelect: (id: string) => void;
  tabs: { id: string; label: string; ai?: boolean }[];
}) {
  return (
    <div
      role="tablist"
      className="flex items-center overflow-x-auto border-b border-[#eaeef2]"
      style={{ scrollbarWidth: "none" }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          id={`tab-${tab.id}`}
          role="tab"
          type="button"
          aria-selected={activeTab === tab.id}
          aria-controls={`panel-${tab.id}`}
          onClick={() => onSelect(tab.id)}
          className={`relative inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap px-4 py-[11px] text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[rgba(6,74,167,0.22)] ${
            activeTab === tab.id
              ? "text-[var(--mscp-color-brand-primary)]"
              : "text-[#8499af] hover:text-[#2c353a]"
          }`}
        >
          {tab.ai ? <AiSparkIcon /> : null}
          {tab.label}
          {activeTab === tab.id ? (
            <span
              aria-hidden="true"
              className="absolute inset-x-2 bottom-0 h-[2px] rounded-t-full bg-[var(--mscp-color-brand-primary)]"
            />
          ) : null}
        </button>
      ))}
    </div>
  );
}

// ─── Subfield row ─────────────────────────────────────────────────────────────

function SubfieldRow({
  body,
  bulletColor = "#bdc8d5",
  highlighted,
  id,
  onRegister,
  source,
  title,
}: {
  body: string[];
  bulletColor?: string;
  highlighted: boolean;
  id: string;
  onRegister: (id: string, el: HTMLElement | null) => void;
  source: { label: string; section: string; url: string };
  title: string;
}) {
  return (
    <div
      ref={(el) => onRegister(id, el)}
      className={`border-b border-[#f0f4f9] px-4 py-3.5 last:border-0 transition-colors duration-500 ${
        highlighted ? "bg-[#eef4fd]" : ""
      }`}
    >
      <h4 className="text-[13.5px] font-bold text-[#2c353a]">{title}</h4>
      <ul className="mt-2 space-y-1.5">
        {body.map((line, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-[13px] leading-[1.55] text-[#3c454d]"
          >
            <span
              aria-hidden="true"
              className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: bulletColor }}
            />
            {line}
          </li>
        ))}
      </ul>
      <ClinicalSourceLabel source={source} className="mt-2.5" />
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

export type DrugAnswerTabsProps = {
  /** Label for the AI answer tab. Defaults to "AI Answer"; some scenarios use a
   * more exploratory label to signal the answer goes beyond the monograph. */
  answerTabLabel?: string;
  analyticsContext?: {
    conversationId?: string;
    prototypeFamily?: string;
    prototypeRoute?: string;
    prototypeSlug?: string;
    screenType?: string;
    turnId?: number;
  };
  /** Controls how drug info is shown in the Drug Information tab.
   * "tabs" (default) = bounded sub-tabs panel (Concept E).
   * "accordion" = full progressive accordion (Concept C style). */
  drugInfoMode?: "tabs" | "accordion";
  /** Accordion mode only: pre-expands the accordion to this subfield on mount (matched from the query). */
  initialAccordionAnchor?: string;
  monograph: DrugMonograph;
  /** Accordion mode only: called when the user clicks a "Full X in monograph" section link. Opens the side canvas. */
  onOpenMonograph?: (subfieldId: string) => void;
  question: string;
  references: AiAnswerReference[];
  synthesizedAnswer: DrugSynthesizedAnswer;
};

// ─── Component ────────────────────────────────────────────────────────────────

// Message-level tab switcher for Concept E. Shows Answer / Drug Information /
// References tabs on every reply. Citation chips in the Answer tab navigate to
// the exact subfield in the Drug Information tab (no tooltip popup).
export function DrugAnswerTabs({
  answerTabLabel = "AI Answer",
  analyticsContext,
  drugInfoMode = "tabs",
  initialAccordionAnchor,
  monograph,
  onOpenMonograph,
  question,
  references,
  synthesizedAnswer,
}: DrugAnswerTabsProps) {
  const [activeTab, setActiveTab] = useState<MessageTab>("drug-info");
  const [activeDrugInfoSubTab, setActiveDrugInfoSubTab] =
    useState<DrugInfoSubTab>("dosing");
  const [highlightedSubfieldId, setHighlightedSubfieldId] = useState<string | null>(
    null,
  );
  const [pendingAnchor, setPendingAnchor] = useState<string | null>(null);
  // Accordion mode: starts at the query-matched subfield; updated on citation clicks.
  const [accordionAnchor, setAccordionAnchor] = useState<string | null>(
    initialAccordionAnchor ?? null,
  );

  const drugInfoScrollRef = useRef<HTMLDivElement>(null);
  const subfieldRefs = useRef(new Map<string, HTMLElement>());
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const registerSubfield = useCallback((id: string, el: HTMLElement | null) => {
    if (el) subfieldRefs.current.set(id, el);
    else subfieldRefs.current.delete(id);
  }, []);

  useEffect(() => {
    return () => {
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    };
  }, []);

  // After tab + sub-tab are both correct, fire scroll to pending anchor
  useEffect(() => {
    if (!pendingAnchor || activeTab !== "drug-info") return;

    const frameId = window.requestAnimationFrame(() => {
      const el = subfieldRefs.current.get(pendingAnchor);
      const container = drugInfoScrollRef.current;
      if (el && container) {
        const top =
          el.getBoundingClientRect().top -
          container.getBoundingClientRect().top +
          container.scrollTop -
          // account for sticky dosing strip (~40px) + a little breathing room
          56;
        container.scrollTo({ behavior: "smooth", top: Math.max(0, top) });

        setHighlightedSubfieldId(pendingAnchor);
        if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
        highlightTimerRef.current = setTimeout(
          () => setHighlightedSubfieldId(null),
          HIGHLIGHT_MS,
        );
      }
      setPendingAnchor(null);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [pendingAnchor, activeTab, activeDrugInfoSubTab]);

  const navigateToCitation = useCallback(
    (anchor: string) => {
      if (drugInfoMode === "accordion") {
        setActiveTab("drug-info");
        setAccordionAnchor(anchor);
        return;
      }

      const section = monograph.sections.find((s) =>
        s.subfields.some((sf) => sf.id === anchor),
      );

      let subTab: DrugInfoSubTab = "dosing";
      if (section) {
        if (section.id === "dosing") subTab = "dosing";
        else if (section.id === "safety") subTab = "safety";
        else subTab = "clinical";
      }

      setActiveTab("drug-info");
      setActiveDrugInfoSubTab(subTab);
      setPendingAnchor(anchor);
    },
    [drugInfoMode, monograph],
  );

  const scrollToSubfield = useCallback((id: string) => {
    const el = subfieldRefs.current.get(id);
    const container = drugInfoScrollRef.current;
    if (el && container) {
      const top =
        el.getBoundingClientRect().top -
        container.getBoundingClientRect().top +
        container.scrollTop -
        56;
      container.scrollTo({ behavior: "smooth", top: Math.max(0, top) });
      setHighlightedSubfieldId(id);
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
      highlightTimerRef.current = setTimeout(
        () => setHighlightedSubfieldId(null),
        HIGHLIGHT_MS,
      );
    }
  }, []);

  // Citation chip that navigates instead of showing a tooltip popup
  const renderCitationChip = useCallback(
    (citationId: number, key: string) => {
      const citation = synthesizedAnswer.citations.find(
        (c) => c.marker === citationId,
      );
      return (
        <button
          key={key}
          type="button"
          aria-label={`Citation ${citationId}: view in Drug Information`}
          onClick={() => citation && navigateToCitation(citation.anchor)}
          className="group mx-0.5 inline-flex h-[18px] min-w-[18px] translate-y-[-1px] items-center gap-[2px] rounded-full bg-[#ecf1f9] pl-1.5 pr-1 text-[12px] font-bold leading-none text-[#064aa7] transition hover:bg-[#dfeafb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.22)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          {citationId}
          <span className="opacity-0 transition-opacity group-hover:opacity-100">
            <ChevronRightMiniIcon />
          </span>
        </button>
      );
    },
    [synthesizedAnswer.citations, navigateToCitation],
  );

  // Derived section slices
  const dosingSection = monograph.sections.find((s) => s.id === "dosing");
  const safetySection = monograph.sections.find((s) => s.id === "safety");
  const clinicalSections = monograph.sections.filter((s) =>
    ["interactions", "adverse", "renal_hepatic"].includes(s.id),
  );

  // Monograph link — label is contextual to the active Drug Info sub-tab
  const drugInfoMonographHref =
    activeDrugInfoSubTab === "dosing"
      ? (dosingSection?.subfields[0]?.source.url ?? "#drug-reference")
      : activeDrugInfoSubTab === "safety"
        ? (safetySection?.subfields[0]?.source.url ?? "#drug-reference")
        : "#drug-reference";

  const drugInfoLinkLabel =
    activeDrugInfoSubTab === "overview"
      ? `View full ${monograph.drug.name} monograph`
      : activeDrugInfoSubTab === "dosing"
        ? `View full ${dosingSection?.title ?? "Dosing"} section`
        : activeDrugInfoSubTab === "safety"
          ? `View full ${safetySection?.title ?? "Safety"} section`
          : activeDrugInfoSubTab === "clinical"
            ? "View full Clinical sections"
            : `View full ${monograph.drug.name} references`;

  return (
    <div className="dc-rise overflow-hidden">
      {/* ── Message-level tab bar ─────────────────────────── */}
      <TabBar
        tabs={buildMessageTabs(answerTabLabel)}
        activeTab={activeTab}
        onSelect={(id) => setActiveTab(id as MessageTab)}
      />

      {/* ── Answer tab ───────────────────────────────────── */}
      {activeTab === "answer" ? (
        <div
          id="panel-answer"
          role="tabpanel"
          aria-labelledby="tab-answer"
          className="p-4 md:p-5"
        >
          <p className="text-[15.5px] leading-[1.6] text-[#3c454d]">
            {renderInlineText(synthesizedAnswer.text, renderCitationChip)}
          </p>

          <p className="mt-3 flex items-center gap-1 text-[11.5px] text-[#93a2ae]">
            <ChevronRightMiniIcon />
            Tap a citation to view source in Drug Information
          </p>

          <AiResponseAnswerActions
            answer={synthesizedAnswer.text}
            analyticsContext={
              analyticsContext
                ? {
                    ...analyticsContext,
                    question,
                    turnId: analyticsContext.turnId ?? 1,
                  }
                : undefined
            }
            className="mt-4"
          />

          <div className="mt-4 border-t border-[#eaeef2] pt-3">
            <MonographLink
              href={references[0]?.url ?? "#drug-reference"}
              label={`View full ${monograph.drug.name} monograph`}
            />
          </div>
        </div>
      ) : null}

      {/* ── Drug Information tab — accordion mode (Concept I) ── */}
      {activeTab === "drug-info" && drugInfoMode === "accordion" ? (
        <div
          id="panel-drug-info"
          role="tabpanel"
          aria-labelledby="tab-drug-info"
          className="p-4 md:p-5"
        >
          <DrugMonographAccordion
            key={accordionAnchor ?? "default"}
            matchedSubfieldId={accordionAnchor ?? undefined}
            monograph={monograph}
            onOpenMonograph={onOpenMonograph}
          />
        </div>
      ) : null}

      {/* ── Drug Information tab — sub-tabs mode (Concept E default) ── */}
      {activeTab === "drug-info" && drugInfoMode !== "accordion" ? (
        <div
          id="panel-drug-info"
          role="tabpanel"
          aria-labelledby="tab-drug-info"
          className="flex flex-col"
        >
          {/* BBW — pinned above sub-tabs; always eager per spec */}
          <div className="shrink-0 px-4 pt-4">
            <ClinicalBoxedWarning warnings={monograph.blackBoxWarnings} />
          </div>

          {/* Drug Info sub-tab strip — below BBW, outside scroll area */}
          <div className="mt-3 shrink-0">
            <TabBar
              tabs={DRUG_INFO_SUB_TABS}
              activeTab={activeDrugInfoSubTab}
              onSelect={(id) => {
                setActiveDrugInfoSubTab(id as DrugInfoSubTab);
                drugInfoScrollRef.current?.scrollTo({ top: 0 });
              }}
            />
          </div>

          {/* Sub-tab content — bounded scrollable panel */}
          <div
            ref={drugInfoScrollRef}
            className="overflow-y-auto overscroll-contain"
            style={{ maxHeight: "460px" }}
          >
            {/* Overview */}
            {activeDrugInfoSubTab === "overview" ? (
              <div
                id="panel-overview"
                role="tabpanel"
                aria-labelledby="tab-overview"
                className="p-4"
              >
                <div className="mb-4">
                  <h3 className="text-[20px] font-extrabold tracking-[-0.02em] text-[#161b1d]">
                    {monograph.drug.name}
                  </h3>
                  <p className="mt-0.5 text-[13px] font-medium text-[#687680]">
                    {monograph.drug.drugClass}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {monograph.keyFields.map((kf) => {
                    const sf = monograph.sections
                      .flatMap((s) => s.subfields)
                      .find((s) => s.id === kf.subfieldId);
                    if (!sf) return null;
                    return (
                      <button
                        key={kf.subfieldId}
                        type="button"
                        onClick={() => navigateToCitation(kf.subfieldId)}
                        className="group rounded-[10px] border border-[#e6eaed] bg-[#f9fafb] p-3 text-left transition hover:border-[rgba(6,74,167,0.25)] hover:bg-[#f0f6fe] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.22)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      >
                        <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#8499af] group-hover:text-[#687680]">
                          {kf.label}
                        </p>
                        <p className="mt-1 line-clamp-2 text-[12.5px] leading-[1.4] text-[#2c353a]">
                          {sf.summary}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* Dosing */}
            {activeDrugInfoSubTab === "dosing" && dosingSection ? (
              <div
                id="panel-dosing"
                role="tabpanel"
                aria-labelledby="tab-dosing"
              >
                {/* Sticky subfield strip — sticks within this scroll container */}
                <div
                  className="sticky top-0 z-[5] overflow-x-auto bg-[#f5f8fd] py-2"
                  style={{ scrollbarWidth: "none" }}
                >
                  <div className="flex items-center gap-1.5 px-4">
                    {DOSING_STRIP.map((item) => {
                      const isActive = highlightedSubfieldId === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => scrollToSubfield(item.id)}
                          className={`shrink-0 rounded-full px-3 py-1 text-[11.5px] font-semibold whitespace-nowrap transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.22)] ${
                            isActive
                              ? "bg-[var(--mscp-color-brand-primary)] text-white"
                              : "border border-[#d8e3ee] bg-white text-[#687680] hover:border-[rgba(6,74,167,0.3)] hover:bg-[#ecf1f9] hover:text-[var(--mscp-color-brand-primary)]"
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Subfields */}
                {dosingSection.subfields.map((sf) => (
                  <SubfieldRow
                    key={sf.id}
                    id={sf.id}
                    title={sf.title}
                    body={sf.body}
                    source={sf.source}
                    highlighted={highlightedSubfieldId === sf.id}
                    onRegister={registerSubfield}
                    bulletColor="#bdc8d5"
                  />
                ))}
              </div>
            ) : null}

            {/* Safety */}
            {activeDrugInfoSubTab === "safety" && safetySection ? (
              <div
                id="panel-safety"
                role="tabpanel"
                aria-labelledby="tab-safety"
              >
                {safetySection.subfields.map((sf) => {
                  const accent = getZoneAccent("safety");
                  return (
                    <div
                      key={sf.id}
                      ref={(el) => registerSubfield(sf.id, el)}
                      className={`border-b border-[#f0f4f9] px-4 py-3.5 last:border-0 transition-colors duration-500 ${
                        highlightedSubfieldId === sf.id ? "bg-[#fff2f1]" : ""
                      }`}
                    >
                      <div className="mb-1.5 flex items-center gap-1.5">
                        <span style={{ color: accent.fg }}>
                          <ClinicalZoneIcon sectionId="safety" className="h-3.5 w-3.5" />
                        </span>
                        <h4 className="text-[13.5px] font-bold text-[#2c353a]">
                          {sf.title}
                        </h4>
                      </div>
                      <ul className="space-y-1.5">
                        {sf.body.map((line, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-[13px] leading-[1.55] text-[#3c454d]"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full"
                              style={{ backgroundColor: accent.line }}
                            />
                            {line}
                          </li>
                        ))}
                      </ul>
                      <ClinicalSourceLabel source={sf.source} className="mt-2.5" />
                    </div>
                  );
                })}
              </div>
            ) : null}

            {/* Clinical (interactions + adverse + renal_hepatic) */}
            {activeDrugInfoSubTab === "clinical" ? (
              <div
                id="panel-clinical"
                role="tabpanel"
                aria-labelledby="tab-clinical"
              >
                {clinicalSections.map((section) => {
                  const accent = getZoneAccent(section.id);
                  return (
                    <div key={section.id}>
                      {/* Section header with zone accent */}
                      <div
                        className="flex items-center gap-2 border-b px-4 py-2"
                        style={{
                          backgroundColor: accent.tint,
                          borderColor: accent.line,
                        }}
                      >
                        <span style={{ color: accent.fg }}>
                          <ClinicalZoneIcon sectionId={section.id} className="h-3.5 w-3.5" />
                        </span>
                        <h3
                          className="text-[11.5px] font-bold uppercase tracking-[0.07em]"
                          style={{ color: accent.fg }}
                        >
                          {section.title}
                        </h3>
                      </div>

                      {section.subfields.map((sf) => (
                        <SubfieldRow
                          key={sf.id}
                          id={sf.id}
                          title={sf.title}
                          body={sf.body}
                          source={sf.source}
                          highlighted={highlightedSubfieldId === sf.id}
                          onRegister={registerSubfield}
                          bulletColor={accent.line}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            ) : null}

            {/* References within Drug Info (inner sub-tab) */}
            {activeDrugInfoSubTab === "references" ? (
              <div
                id="panel-di-references"
                role="tabpanel"
                aria-labelledby="tab-references"
                className="space-y-3 p-4"
              >
                {references.length === 0 ? (
                  <p className="text-[13.5px] text-[#8499af]">
                    No references for this answer.
                  </p>
                ) : (
                  references.map((ref) => (
                    <AiResponseReferenceCard key={ref.id} reference={ref} />
                  ))
                )}
              </div>
            ) : null}
          </div>

          {/* Full monograph link — always visible below the bounded scroll area */}
          <div className="shrink-0 border-t border-[#eaeef2] px-4 py-3">
            <MonographLink href={drugInfoMonographHref} label={drugInfoLinkLabel} />
          </div>
        </div>
      ) : null}

      {/* ── References tab ────────────────────────────────── */}
      {activeTab === "references" ? (
        <div
          id="panel-references"
          role="tabpanel"
          aria-labelledby="tab-references"
          className="p-4 md:p-5"
        >
          {references.length === 0 ? (
            <p className="text-[13.5px] text-[#8499af]">No references for this answer.</p>
          ) : (
            <div className="space-y-3">
              {references.map((ref) => (
                <AiResponseReferenceCard key={ref.id} reference={ref} />
              ))}
            </div>
          )}

          <div className="mt-4 border-t border-[#eaeef2] pt-3">
            <MonographLink
              href={references[0]?.url ?? "#drug-reference"}
              label={`View full ${monograph.drug.name} monograph`}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
