"use client";

import { AiTopRailAction } from "@/components/medscape/ai-response/top-rail-action";
import { DrugAnswerSourceChips } from "@/components/medscape/drug-concepts/answer-source-chips";
import { DrugQuestionHeading } from "@/components/medscape/drug-concepts/question-heading";
import { aiResponseAssets } from "@/data/ai-response";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function EmphasizedDrugNames({
  description,
  drugNames,
}: {
  description: string;
  drugNames: string[];
}) {
  const names = drugNames.filter(Boolean);
  if (names.length === 0) return description;

  const pattern = new RegExp(`(${names.map(escapeRegExp).join("|")})`, "gi");
  return description.split(pattern).map((part, index) =>
    names.some((name) => name.toLowerCase() === part.toLowerCase()) ? (
      <span key={index} className="font-medium text-[var(--mscp-color-brand-primary)]">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export function DrugComparisonIntro({
  description,
  drugNames,
  onJumpToReferences,
  question,
  referenceCount,
}: {
  description: string;
  drugNames: string[];
  /** Scrolls to the canonical drug monographs represented by this comparison. */
  onJumpToReferences?: () => void;
  question: string;
  referenceCount: number;
}) {
  return (
    <header className="dc-rise border-b border-[#e4ebf3] pb-7 md:pb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <AiTopRailAction
            compact
            iconSrc={aiResponseAssets.uiIcons.history}
            label="History"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--mscp-color-brand-primary)] transition hover:bg-[#eef4fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
          />
          <AiTopRailAction
            compact
            iconSrc={aiResponseAssets.uiIcons.pencil}
            label="Edit comparison"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--mscp-color-brand-primary)] transition hover:bg-[#eef4fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
          />
        </div>
        <AiTopRailAction
          compact
          iconSrc={aiResponseAssets.uiIcons.download}
          label="Download comparison"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--mscp-color-brand-primary)] transition hover:bg-[#eef4fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
        />
      </div>

      <DrugQuestionHeading className="mt-6 max-w-[740px] md:mt-7">
        {question}
      </DrugQuestionHeading>

      <DrugAnswerSourceChips
        onJumpToReferences={onJumpToReferences}
        referenceCount={referenceCount}
        showSources={false}
      />

      <p className="mt-7 max-w-[760px] text-[18px] leading-[1.5] text-[#2c353a] md:text-[21px]">
        <EmphasizedDrugNames description={description} drugNames={drugNames} />
      </p>
    </header>
  );
}
