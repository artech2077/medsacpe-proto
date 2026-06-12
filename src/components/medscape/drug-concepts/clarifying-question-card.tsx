"use client";

import type { ScenarioClarifyOption } from "@/data/drug-concept-i-scenarios";

// ─── DrugClarifyingQuestionCard ─────────────────────────────────────────────────
// S3 plan-mode option card: the assistant asks which product the clinician means
// before answering. Picking an option renders the S1 card for that variant.

type DrugClarifyingQuestionCardProps = {
  onPick: (option: ScenarioClarifyOption) => void;
  options: ScenarioClarifyOption[];
  prompt: string;
  /** Set once the user has picked — locks the card and highlights the choice. */
  selectedOptionId?: string;
};

export function DrugClarifyingQuestionCard({
  onPick,
  options,
  prompt,
  selectedOptionId,
}: DrugClarifyingQuestionCardProps) {
  return (
    <div className="dc-rise rounded-[14px] border border-[#dbe6f2] bg-[#f8fbfe] p-4">
      <div className="flex items-start gap-2.5">
        <span
          aria-hidden="true"
          className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[rgba(6,74,167,0.08)] text-[var(--mscp-color-brand-primary)]"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 6a2 2 0 1 1 2.9 1.8c-.55.27-.9.83-.9 1.45v.25" />
            <circle cx="8" cy="12" r="0.4" fill="currentColor" />
            <circle cx="8" cy="8" r="6.5" />
          </svg>
        </span>
        <p className="text-[14px] font-medium leading-[1.55] text-[#28333e]">{prompt}</p>
      </div>

      <div className="mt-3.5 grid gap-2 sm:grid-cols-3">
        {options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isDimmed = Boolean(selectedOptionId) && !isSelected;
          return (
            <button
              key={option.id}
              type="button"
              disabled={Boolean(selectedOptionId)}
              onClick={() => onPick(option)}
              aria-pressed={isSelected}
              style={{ touchAction: "manipulation" }}
              className={`rounded-[12px] border px-3.5 py-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] focus-visible:ring-offset-1 ${
                isSelected
                  ? "border-[var(--mscp-color-brand-primary)] bg-[rgba(6,74,167,0.07)]"
                  : isDimmed
                    ? "border-[#e6edf4] bg-white opacity-45"
                    : "border-[#d9e4f0] bg-white hover:border-[rgba(6,74,167,0.45)] hover:shadow-[0_2px_8px_rgba(6,74,167,0.08)]"
              }`}
            >
              <span
                className={`block text-[13.5px] font-bold leading-tight ${
                  isSelected ? "text-[var(--mscp-color-brand-primary)]" : "text-[#1c2935]"
                }`}
              >
                {option.label}
              </span>
              <span className="mt-1 block text-[11.5px] leading-tight text-[#73879a]">
                {option.sublabel}
              </span>
            </button>
          );
        })}
      </div>

      {selectedOptionId ? null : (
        <p className="mt-3 text-[11.5px] text-[#8ba0b2]">
          Pick a product to get its canonical dosing card.
        </p>
      )}
    </div>
  );
}
