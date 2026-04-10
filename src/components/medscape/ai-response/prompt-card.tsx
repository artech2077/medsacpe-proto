"use client";

import type { PromptSection } from "@/data/ai-response";
import { AiPromptChevron, AiPromptSectionIcon } from "@/components/medscape/ai-response/iconography";

type AiPromptCardProps = {
  onPromptSelect: (prompt: string) => void;
  section: PromptSection;
};

export function AiPromptCard({ onPromptSelect, section }: AiPromptCardProps) {
  return (
    <section className="w-full rounded-[8px] bg-white px-4 pb-3 pt-5">
      <header className="flex items-center gap-2.5 pb-2 text-[16px] leading-[19px] font-semibold text-[var(--mscp-color-text-tertiary)]">
        <AiPromptSectionIcon id={section.id} />
        <span>{section.title}</span>
      </header>
      <div className="border-t border-[var(--mscp-color-border-primary)]">
        {section.prompts.map((prompt, index) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onPromptSelect(prompt)}
            className={`flex w-full items-start gap-3 py-2 text-left text-[15px] leading-[20px] text-[var(--mscp-color-brand-primary)] transition hover:text-[#0a5fd2] ${
              index < section.prompts.length - 1
                ? "border-b border-[var(--mscp-color-border-primary)]"
                : ""
            }`}
          >
            <span className="flex-1">{prompt}</span>
            <span className="pt-[2px]">
              <AiPromptChevron />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

type AiPromptSectionsListProps = {
  onPromptSelect: (prompt: string) => void;
  sections: PromptSection[];
};

export function AiPromptSectionsList({
  onPromptSelect,
  sections,
}: AiPromptSectionsListProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      {sections.map((section) => (
        <AiPromptCard key={section.id} section={section} onPromptSelect={onPromptSelect} />
      ))}
    </div>
  );
}
