"use client";

import { useState } from "react";
import type { DrugScenarioGroup } from "@/data/drug-concept-i-scenarios";

// ─── DrugScenarioPicker ─────────────────────────────────────────────────────────
// Scenario browser for Concept I, rendered under the empty-state hero. The six
// use-case groups (from the Drug Question Use Case Taxonomy) appear as cards;
// selecting a card swaps in that group's preset questions below. Picking a
// question plays its scripted exchange. Reviewers can deep-link via
// ?scenario=<id> — the screen owns that URL state.

type DrugScenarioPickerProps = {
  activeScenarioId?: string;
  groups: DrugScenarioGroup[];
  onSelect: (scenarioId: string) => void;
};

export function DrugScenarioPicker({
  activeScenarioId,
  groups,
  onSelect,
}: DrugScenarioPickerProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<string>(() => {
    if (activeScenarioId) {
      const owner = groups.find((g) =>
        g.scenarios.some((s) => s.id === activeScenarioId),
      );
      if (owner) return owner.id;
    }
    return groups[0]?.id ?? "";
  });

  const selectedGroup =
    groups.find((g) => g.id === selectedGroupId) ?? groups[0];

  return (
    <div className="w-full">
      {/* Use-case group cards */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {groups.map((group, gi) => {
          const isSelected = group.id === selectedGroup?.id;
          // Uniform-pattern group → show the S-code; mixed group → show its number.
          const uniformPattern = group.scenarios.every(
            (s) => s.pattern === group.scenarios[0]?.pattern,
          )
            ? group.scenarios[0]?.pattern
            : undefined;
          return (
            <button
              key={group.id}
              type="button"
              onClick={() => setSelectedGroupId(group.id)}
              aria-pressed={isSelected}
              style={{ animationDelay: `${gi * 45}ms`, touchAction: "manipulation" }}
              className={`dc-rise flex flex-col items-start rounded-[14px] border p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] focus-visible:ring-offset-1 md:p-3.5 ${
                isSelected
                  ? "border-[var(--mscp-color-brand-primary)] bg-[rgba(6,74,167,0.05)] shadow-[0_2px_10px_rgba(6,74,167,0.1)]"
                  : "border-[#dde6f0] bg-white/80 hover:border-[rgba(6,74,167,0.4)] hover:bg-white hover:shadow-[0_2px_8px_rgba(16,24,40,0.06)]"
              }`}
            >
              <span className="flex w-full items-center gap-1.5">
                <span
                  className={`inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-[10.5px] font-bold tabular-nums ${
                    isSelected
                      ? "bg-[var(--mscp-color-brand-primary)] text-white"
                      : "bg-[#e7eef6] text-[#5d7186]"
                  }`}
                >
                  {uniformPattern ?? gi + 1}
                </span>
                <span
                  className={`ml-auto rounded-full px-1.5 py-px text-[9.5px] font-bold tabular-nums ${
                    isSelected
                      ? "bg-[rgba(6,74,167,0.1)] text-[var(--mscp-color-brand-primary)]"
                      : "bg-[#eef2f7] text-[#8497a9]"
                  }`}
                >
                  {group.scenarios.length}
                </span>
              </span>
              <span
                className={`mt-2 text-[12.5px] font-bold leading-snug ${
                  isSelected ? "text-[var(--mscp-color-brand-primary)]" : "text-[#22303c]"
                }`}
              >
                {group.title}
              </span>
              <span className="mt-1 line-clamp-2 text-[10.5px] leading-[1.45] text-[#8497a9]">
                {group.description}
              </span>
            </button>
          );
        })}
      </div>

      {/* Questions for the selected group */}
      {selectedGroup ? (
        <div key={selectedGroup.id} className="mt-5 flex flex-col items-center gap-2">
          {selectedGroup.scenarios.map((scenario, si) => {
            const isActive = scenario.id === activeScenarioId;
            // Per-question pattern tag only when the group mixes patterns.
            const showPatternTag = selectedGroup.scenarios.some(
              (s) => s.pattern !== selectedGroup.scenarios[0]?.pattern,
            );
            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => onSelect(scenario.id)}
                aria-pressed={isActive}
                style={{ animationDelay: `${80 + si * 50}ms`, touchAction: "manipulation" }}
                className={`dc-rise flex w-full max-w-[560px] items-center gap-2.5 rounded-full border px-4 py-2.5 text-left text-[13px] font-semibold leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] focus-visible:ring-offset-1 ${
                  isActive
                    ? "border-[var(--mscp-color-brand-primary)] bg-[rgba(6,74,167,0.06)] text-[var(--mscp-color-brand-primary)]"
                    : "border-[rgba(6,74,167,0.18)] bg-white/80 text-[var(--mscp-color-brand-primary)] hover:bg-white"
                }`}
              >
                <span className="min-w-0 flex-1">{scenario.question}</span>
                {showPatternTag ? (
                  <span
                    title={scenario.patternLabel}
                    className="shrink-0 rounded-full bg-[#eef2f7] px-1.5 py-px text-[9px] font-bold tabular-nums text-[#7d8ea0]"
                  >
                    {scenario.pattern}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
