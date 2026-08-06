"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DrugMonograph, DrugSubfield } from "@/data/drug-monograph";
import { getSubfieldById } from "@/data/drug-monograph";
import { AiResponseAnswerContent } from "@/components/medscape/ai-response/answer-content";
import {
  ClinicalSourceLabel,
  ClinicalZoneIcon,
  getZoneAccent,
} from "@/components/medscape/drug-concepts/clinical-system";

// ─── Public types ────────────────────────────────────────────────────────────────

export type FieldChip = {
  id: string;
  label: string;
  sectionId: string;
  subfieldIds: string[];
};

// Canonical Concept-H field chips — exported so the screen and gallery can import them.
export const CONCEPT_H_FIELD_CHIPS: FieldChip[] = [
  {
    id: "dosing",
    label: "Dosing",
    sectionId: "dosing",
    subfieldIds: [
      "dosing.afib",
      "dosing.dose_reduction",
      "dosing.dvt_pe",
      "dosing.renal_adjustment",
      "dosing.hepatic",
      "dosing.perioperative",
      "dosing.administration",
    ],
  },
  {
    id: "warnings",
    label: "Warnings",
    sectionId: "safety",
    subfieldIds: ["safety.contraindications", "safety.bleeding_risk", "safety.renal_risk"],
  },
  {
    id: "interactions",
    label: "Interactions",
    sectionId: "interactions",
    subfieldIds: [
      "interactions.cyp3a4_pgp",
      "interactions.anticoagulants",
      "interactions.nsaids",
    ],
  },
  {
    id: "renal",
    label: "Renal",
    sectionId: "renal_hepatic",
    subfieldIds: ["renal.mild_moderate", "renal.severe", "hepatic.impairment"],
  },
];

// Given a matched subfield ID, return the chip + initial subfield for the sheet.
export function getMatchedChipIntent(
  subfieldId: string | undefined,
): { chip: FieldChip; initialSubfieldId: string } | undefined {
  if (!subfieldId) return undefined;
  const chip = CONCEPT_H_FIELD_CHIPS.find((c) => c.subfieldIds.includes(subfieldId));
  if (!chip) return undefined;
  return { chip, initialSubfieldId: subfieldId };
}

// ─── Internal constants ──────────────────────────────────────────────────────────

const DISMISS_THRESHOLD_PX = 72;
const DISMISS_VELOCITY_PX_MS = 0.38;

// Short display labels for sub-field tabs — keeps the strip compact on narrow screens.
const TAB_LABEL: Record<string, string> = {
  "dosing.afib": "AFib",
  "dosing.dose_reduction": "2.5 mg",
  "dosing.dvt_pe": "DVT/PE",
  "dosing.renal_adjustment": "Renal",
  "dosing.hepatic": "Hepatic",
  "dosing.perioperative": "Periop",
  "dosing.administration": "Admin",
  "safety.contraindications": "Contraind.",
  "safety.bleeding_risk": "Bleeding",
  "safety.renal_risk": "Renal Risk",
  "interactions.anticoagulants": "Anticoag",
  "interactions.cyp3a4_pgp": "CYP3A4/P-gp",
  "interactions.nsaids": "NSAIDs",
  "renal.mild_moderate": "CrCl 15–79",
  "renal.severe": "Severe / ESRD",
  "hepatic.impairment": "Hepatic",
};

// ─── Sub-components ──────────────────────────────────────────────────────────────

function CloseXIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
      <path
        d="M18 6 6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SubfieldTabStrip({
  accentFg,
  activeSubfieldId,
  onSelect,
  subfields,
}: {
  accentFg: string;
  activeSubfieldId: string;
  onSelect: (id: string) => void;
  subfields: DrugSubfield[];
}) {
  return (
    // scrollbarWidth:none hides the horizontal scrollbar on the tab strip — the strip
    // itself CAN scroll horizontally so all tabs are reachable without wrapping.
    <div
      className="shrink-0 overflow-x-auto border-b border-[#eef2f7]"
      style={{ scrollbarWidth: "none" }}
    >
      <div className="flex min-w-max gap-0 px-1">
        {subfields.map((sf) => {
          const isActive = sf.id === activeSubfieldId;
          const label = TAB_LABEL[sf.id] ?? sf.title;
          return (
            <button
              key={sf.id}
              type="button"
              onClick={() => onSelect(sf.id)}
              style={
                isActive
                  ? { borderBottomColor: accentFg, color: accentFg }
                  : undefined
              }
              className={`min-h-[44px] shrink-0 border-b-2 px-3.5 py-2 text-[13px] font-semibold leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.25)] focus-visible:ring-inset ${
                isActive
                  ? "border-current"
                  : "border-transparent text-[#5a6e7e] hover:text-[#2c353a]"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SubfieldBody({ subfield }: { subfield: DrugSubfield }) {
  // Join body items as double-newline paragraphs so AiResponseAnswerContent
  // renders each item as a separate paragraph block — reuses the shared renderer
  // rather than forking typography.
  const answer = subfield.body.join("\n\n");
  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-8 pt-4">
      <p className="mb-4 text-[11.5px] font-semibold uppercase tracking-[0.07em] text-[#9aafc2]">
        {subfield.summary}
      </p>
      <AiResponseAnswerContent answer={answer} />
      <div className="mt-6 border-t border-[#f0f4f8] pt-3.5">
        <ClinicalSourceLabel source={subfield.source} />
      </div>
    </div>
  );
}

// Content for the "field" variant — owns its active tab state starting at initialSubfieldId.
function FieldContent({
  chip,
  initialSubfieldId,
  monograph,
}: {
  chip: FieldChip;
  initialSubfieldId: string;
  monograph: DrugMonograph;
}) {
  const [activeSubfieldId, setActiveSubfieldId] = useState(initialSubfieldId);
  const accent = getZoneAccent(chip.sectionId);

  const subfields = chip.subfieldIds
    .map((id) => getSubfieldById(monograph, id))
    .filter((sf): sf is DrugSubfield => sf !== undefined);

  const activeSubfield =
    subfields.find((sf) => sf.id === activeSubfieldId) ?? subfields[0];

  return (
    <>
      <SubfieldTabStrip
        subfields={subfields}
        activeSubfieldId={activeSubfield?.id ?? ""}
        accentFg={accent.fg}
        onSelect={setActiveSubfieldId}
      />
      {activeSubfield ? <SubfieldBody subfield={activeSubfield} /> : null}
    </>
  );
}

// Content for the "interaction-checker" variant — shows interaction subfields
// framed as drug + interaction-type check.
function InteractionCheckerContent({ monograph }: { monograph: DrugMonograph }) {
  const interactionsSection = monograph.sections.find((s) => s.id === "interactions");
  const subfields = interactionsSection?.subfields ?? [];
  const [activeSubfieldId, setActiveSubfieldId] = useState(subfields[0]?.id ?? "");
  const accent = getZoneAccent("interactions");
  const activeSubfield =
    subfields.find((sf) => sf.id === activeSubfieldId) ?? subfields[0];

  return (
    <>
      {/* Drug pair indicator */}
      <div className="shrink-0 border-b border-[#eef2f7] px-5 pb-3 pt-1">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f3f0fe] px-3 py-1.5 text-[12.5px] font-semibold text-[#6938ef]">
          <span>Apixaban</span>
          <span aria-hidden="true" className="opacity-60">↔</span>
          <span>Drug interactions</span>
        </div>
      </div>

      <SubfieldTabStrip
        subfields={subfields}
        activeSubfieldId={activeSubfield?.id ?? ""}
        accentFg={accent.fg}
        onSelect={setActiveSubfieldId}
      />
      {activeSubfield ? <SubfieldBody subfield={activeSubfield} /> : null}
    </>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────────

type DrugFieldSheetProps = (
  | { variant: "field"; chip: FieldChip; initialSubfieldId: string }
  | { variant: "interaction-checker" }
) & {
  monograph: DrugMonograph;
  onClose: () => void;
};

export function DrugFieldSheet(props: DrugFieldSheetProps) {
  const { monograph, onClose } = props;

  const [phase, setPhase] = useState<"enter" | "open" | "leave">("enter");
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startYRef = useRef(0);
  const startTimeRef = useRef(0);

  // Trigger the enter slide-up animation after the initial render has painted.
  useEffect(() => {
    const id = requestAnimationFrame(() => setPhase("open"));
    return () => cancelAnimationFrame(id);
  }, []);

  const dismiss = useCallback(() => {
    setPhase("leave");
    setDragY(0);
    setTimeout(onClose, 300);
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dismiss]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    startYRef.current = e.clientY;
    startTimeRef.current = Date.now();
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const delta = e.clientY - startYRef.current;
    if (delta > 0) setDragY(delta);
  }, []);

  const handlePointerUp = useCallback(() => {
    const elapsed = Math.max(Date.now() - startTimeRef.current, 1);
    const velocity = dragY / elapsed;
    setIsDragging(false);
    if (dragY > DISMISS_THRESHOLD_PX || velocity > DISMISS_VELOCITY_PX_MS) {
      dismiss();
    } else {
      setDragY(0);
    }
  }, [dragY, dismiss]);

  // Compute sheet transform and transition
  const translateY =
    phase === "enter" || phase === "leave" ? "100%" : `${dragY}px`;
  const sheetTransition = isDragging
    ? "none"
    : "transform 300ms cubic-bezier(0.32, 0.72, 0, 1)";
  const backdropOpacity = phase === "open" ? 1 : 0;

  const sectionId =
    props.variant === "field" ? props.chip.sectionId : "interactions";
  const accent = getZoneAccent(sectionId);
  const headerTitle =
    props.variant === "field" ? props.chip.label : "Interaction Checker";

  return (
    <div
      className="absolute inset-0 z-40"
      role="dialog"
      aria-modal="true"
      aria-label={headerTitle}
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[rgba(6,18,38,0.28)] transition-opacity duration-300"
        style={{ opacity: backdropOpacity }}
        onClick={dismiss}
      />

      {/* Sheet panel */}
      <div
        className="absolute inset-x-0 bottom-0 flex max-h-[82dvh] flex-col overflow-hidden rounded-t-[22px] bg-white shadow-[0_-8px_40px_rgba(6,74,167,0.18),0_-1px_0_rgba(6,74,167,0.08)]"
        style={{
          transform: `translateY(${translateY})`,
          transition: sheetTransition,
        }}
      >
        {/* Drag handle — only this area captures pointer events for swipe-dismiss */}
        <div
          aria-hidden="true"
          className="shrink-0 touch-none cursor-grab select-none px-4 pb-2 pt-3 active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="mx-auto h-[5px] w-9 rounded-full bg-[#dde5ef]" />
        </div>

        {/* Sheet header */}
        <div className="flex shrink-0 items-center gap-2.5 px-4 pb-3 pt-0.5">
          <span
            aria-hidden="true"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: `${accent.tint}`, color: accent.fg }}
          >
            <ClinicalZoneIcon sectionId={sectionId} className="h-[15px] w-[15px]" />
          </span>

          <h2 className="flex-1 text-[17px] font-bold leading-snug text-[#161b1d]">
            {headerTitle}
          </h2>

          <button
            type="button"
            aria-label={`Close ${headerTitle}`}
            onClick={dismiss}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#687680] transition hover:bg-[#f4f7fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.22)]"
          >
            <CloseXIcon />
          </button>
        </div>

        {/* Variant-specific content — each variant owns its own tab state */}
        {props.variant === "field" ? (
          <FieldContent
            chip={props.chip}
            initialSubfieldId={props.initialSubfieldId}
            monograph={monograph}
          />
        ) : (
          <InteractionCheckerContent monograph={monograph} />
        )}
      </div>
    </div>
  );
}
