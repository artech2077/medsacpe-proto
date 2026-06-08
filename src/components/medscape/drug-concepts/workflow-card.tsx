"use client";

import { useMemo, useState } from "react";
import {
  ClinicalBoxedWarning,
  ClinicalSourceLabel,
  getZoneAccent,
} from "@/components/medscape/drug-concepts/clinical-system";
import { DrugMonographCanvas } from "@/components/medscape/drug-concepts/monograph-canvas";
import { AiResponseAnswerContent } from "@/components/medscape/ai-response/answer-content";
import {
  type DrugMonograph,
  type DrugSubfield,
  getSubfieldById,
  getSectionBySubfieldId,
} from "@/data/drug-monograph";

const DEFAULT_TASK_CHIP_ID = "afib-dosing";

export type DrugWorkflowCardProps = {
  initialTaskChipId?: string;
  monograph: DrugMonograph;
};

// Renders a single promoted subfield with zone-accent heading and canonical body.
function TaskSubfield({
  monograph,
  subfield,
}: {
  monograph: DrugMonograph;
  subfield: DrugSubfield;
}) {
  const section = getSectionBySubfieldId(monograph, subfield.id);
  const accent = getZoneAccent(section?.id ?? "");
  const answer = useMemo(() => subfield.body.join("\n"), [subfield.body]);

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span
          aria-hidden="true"
          className="h-[14px] w-[3px] shrink-0 rounded-full"
          style={{ backgroundColor: accent.fg }}
        />
        <h3
          className="text-[11.5px] font-bold uppercase tracking-[0.08em]"
          style={{ color: accent.fg }}
        >
          {subfield.title}
        </h3>
      </div>
      <AiResponseAnswerContent answer={answer} references={[]} />
      <div className="mt-2.5">
        <ClinicalSourceLabel source={subfield.source} />
      </div>
    </div>
  );
}

export function DrugWorkflowCard({ initialTaskChipId, monograph }: DrugWorkflowCardProps) {
  const [selectedChipId, setSelectedChipId] = useState(
    initialTaskChipId ?? DEFAULT_TASK_CHIP_ID,
  );
  const [canvasOpen, setCanvasOpen] = useState(false);

  const selectedChip =
    monograph.taskChips.find((c) => c.id === selectedChipId) ?? monograph.taskChips[0];

  const promotedSubfields = useMemo(() => {
    if (!selectedChip) return [];
    return selectedChip.subfieldIds
      .map((id) => getSubfieldById(monograph, id))
      .filter((sf): sf is NonNullable<typeof sf> => sf !== undefined);
  }, [selectedChip, monograph]);

  const firstSubfieldId = selectedChip?.subfieldIds[0];

  return (
    <>
      <div className="overflow-hidden rounded-[18px] border border-[rgba(109,153,206,0.28)] bg-white shadow-[0_2px_16px_rgba(6,74,167,0.08)]">

        {/* ── Drug header ─────────────────────────────────────────────────────── */}
        <div className="flex items-start gap-3 border-b border-[#eef3f8] px-4 pb-3 pt-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-[19px] font-extrabold leading-[1.2] tracking-[-0.02em] text-[#161b1d]">
              {monograph.drug.name}
            </h2>
            <p className="mt-0.5 text-[12px] font-medium text-[#687680]">
              {monograph.drug.drugClass}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-[#f0f5fb] px-2.5 py-[5px] text-[10px] font-bold uppercase tracking-[0.08em] text-[#064aa7]">
            Drug Ref
          </span>
        </div>

        {/* ── BBW — always pinned, never collapsed ────────────────────────────── */}
        <div className="px-4 pt-3">
          <ClinicalBoxedWarning compact warnings={monograph.blackBoxWarnings} />
        </div>

        {/* ── Task chip row ────────────────────────────────────────────────────── */}
        <div className="px-4 pt-3.5">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#9aaab8]">
            Clinical Task
          </p>
          <div
            aria-label="Clinical task chips"
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {monograph.taskChips.map((chip) => {
              const isSelected = chip.id === selectedChipId;
              return (
                <button
                  key={chip.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedChipId(chip.id)}
                  className={`shrink-0 rounded-full px-3.5 py-[7px] text-[13px] font-semibold leading-none transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.3)] focus-visible:ring-offset-1 ${
                    isSelected
                      ? "bg-[#064aa7] text-white shadow-[0_2px_8px_rgba(6,74,167,0.28)]"
                      : "bg-[#ecf1f9] text-[#064aa7] hover:bg-[#dce8f8]"
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Divider ──────────────────────────────────────────────────────────── */}
        <div className="mx-4 border-t border-[#f0f5fb]" />

        {/* ── Promoted task content — key triggers fade-in on chip change ──────── */}
        <div key={selectedChipId} className="dc-fade space-y-4 px-4 py-4">
          {promotedSubfields.map((subfield, index) => (
            <div
              key={subfield.id}
              className={index > 0 ? "border-t border-[#f0f5fb] pt-4" : ""}
            >
              <TaskSubfield monograph={monograph} subfield={subfield} />
            </div>
          ))}
        </div>

        {/* ── Full monograph link ──────────────────────────────────────────────── */}
        <div className="border-t border-[#eef3f8] px-4 py-3">
          <button
            type="button"
            onClick={() => setCanvasOpen(true)}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-[#064aa7] transition-colors hover:text-[#0554c2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.22)] focus-visible:ring-offset-1"
          >
            <span>View full monograph</span>
            <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Full monograph canvas overlay ────────────────────────────────────── */}
      {canvasOpen ? (
        <div className="fixed inset-0 z-50">
          <DrugMonographCanvas
            monograph={monograph}
            onClose={() => setCanvasOpen(false)}
            targetAnchor={firstSubfieldId}
          />
        </div>
      ) : null}
    </>
  );
}
