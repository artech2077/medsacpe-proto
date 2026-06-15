"use client";

import { useEffect, useRef, useState } from "react";
import type { ScenarioClarifyOption } from "@/data/drug-concept-i-scenarios";

// ─── DrugClarifyingQuestionCard ─────────────────────────────────────────────────
// S3 plan-mode option card, styled like the Claude/Codex elicitation module: the
// assistant asks which product the clinician means before answering. Numbered
// rows with keyboard navigation (↑/↓ + Enter), a hover/active arrow affordance,
// and a "Something else / Skip" footer row. Picking an option renders the S1
// card for that variant; Skip dismisses without choosing.

type DrugClarifyingQuestionCardProps = {
  onPick: (option: ScenarioClarifyOption) => void;
  /** Optional — dismiss the card without choosing (the Skip / × affordance). */
  onSkip?: () => void;
  options: ScenarioClarifyOption[];
  prompt: string;
  /** Set once the user has picked — locks the card and highlights the choice. */
  selectedOptionId?: string;
};

export function DrugClarifyingQuestionCard({
  onPick,
  onSkip,
  options,
  prompt,
  selectedOptionId,
}: DrugClarifyingQuestionCardProps) {
  const locked = Boolean(selectedOptionId);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation across the option rows while the card is interactive.
  useEffect(() => {
    if (locked) return;
    const node = containerRef.current;
    if (!node) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % options.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + options.length) % options.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const option = options[activeIndex];
        if (option) onPick(option);
      }
    };
    node.addEventListener("keydown", onKeyDown);
    return () => node.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, locked, onPick, options]);

  return (
    <div
      ref={containerRef}
      tabIndex={locked ? -1 : 0}
      role="listbox"
      aria-label={prompt}
      className="dc-rise overflow-hidden rounded-[14px] border border-[#e1e8f0] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.25)]"
    >
      {/* Header — question + clarify badge / skip affordance */}
      <div className="flex items-start gap-3 border-b border-[#eef2f7] px-4 py-3">
        <p className="min-w-0 flex-1 text-[14px] font-semibold leading-[1.5] text-[#1c2935]">
          {prompt}
        </p>
        <span className="shrink-0 rounded-full bg-[rgba(6,74,167,0.07)] px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.08em] text-[var(--mscp-color-brand-primary)]">
          Clarify
        </span>
        {onSkip && !locked ? (
          <button
            type="button"
            onClick={onSkip}
            aria-label="Dismiss clarifying question"
            className="-mr-1 -mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[#9aa9b8] transition hover:bg-[#f1f5f9] hover:text-[#5a6e7e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.22)]"
          >
            <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="m3.5 3.5 7 7M10.5 3.5l-7 7" />
            </svg>
          </button>
        ) : null}
      </div>

      {/* Option rows */}
      <ul className="py-1">
        {options.map((option, index) => {
          const isSelected = selectedOptionId === option.id;
          const isActive = !locked && index === activeIndex;
          const isDimmed = locked && !isSelected;
          return (
            <li key={option.id}>
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={locked}
                onMouseEnter={() => !locked && setActiveIndex(index)}
                onClick={() => onPick(option)}
                style={{ touchAction: "manipulation" }}
                className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors focus-visible:outline-none ${
                  isSelected
                    ? "bg-[rgba(6,74,167,0.06)]"
                    : isActive
                      ? "bg-[#f5f8fc]"
                      : "bg-transparent"
                } ${isDimmed ? "opacity-45" : ""}`}
              >
                <span
                  className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] text-[11px] font-bold tabular-nums ${
                    isSelected || isActive
                      ? "bg-[var(--mscp-color-brand-primary)] text-white"
                      : "bg-[#eef2f7] text-[#7d8ea0]"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block text-[13.5px] font-semibold leading-tight ${
                      isSelected ? "text-[var(--mscp-color-brand-primary)]" : "text-[#1c2935]"
                    }`}
                  >
                    {option.label}
                  </span>
                  <span className="mt-0.5 block truncate text-[11.5px] leading-tight text-[#73879a]">
                    {option.sublabel}
                  </span>
                </span>
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  className={`h-4 w-4 shrink-0 transition-opacity ${
                    isActive || isSelected ? "opacity-100" : "opacity-0"
                  } text-[var(--mscp-color-brand-primary)]`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </button>
            </li>
          );
        })}

        {/* Something else / Skip row */}
        {!locked ? (
          <li className="mt-1 border-t border-[#eef2f7]">
            <div className="flex items-center gap-3 px-3 py-2.5">
              <span
                aria-hidden="true"
                className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] bg-[#f4f6f9] text-[#9aa9b8]"
              >
                <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.5 2.5 11.5 4.5 5 11l-2.5.5L3 9z" />
                </svg>
              </span>
              <span className="min-w-0 flex-1 text-[12.5px] text-[#93a4b5]">
                Something else — type your question below
              </span>
              {onSkip ? (
                <button
                  type="button"
                  onClick={onSkip}
                  className="shrink-0 rounded-full border border-[#dbe3ec] px-3 py-1 text-[11.5px] font-semibold text-[#5a6e7e] transition hover:border-[rgba(6,74,167,0.4)] hover:text-[var(--mscp-color-brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.22)]"
                >
                  Skip
                </button>
              ) : null}
            </div>
          </li>
        ) : null}
      </ul>

      {/* Footer hint */}
      {!locked ? (
        <div className="border-t border-[#eef2f7] bg-[#fafbfd] px-4 py-2 text-[10.5px] text-[#9aa9b8]">
          <span className="font-semibold text-[#7d8ea0]">↑ ↓</span> to navigate
          <span className="mx-1.5">·</span>
          <span className="font-semibold text-[#7d8ea0]">Enter</span> to select
          <span className="mx-1.5">·</span>
          or type below
        </div>
      ) : null}
    </div>
  );
}
