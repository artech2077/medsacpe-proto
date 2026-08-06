import type { ReactNode } from "react";
import { MedscapeCurrentAdBlock } from "@/components/medscape/ai-current/ad-block";

export function DrugQuestionHeading({
  as: Tag = "h1",
  children,
  className,
}: {
  as?: "h1" | "h2";
  children: ReactNode;
  className?: string;
}) {
  return (
    <>
      {/* Ad banner — before the question. Desktop shows a single sticky ad
          above the whole thread instead (see screen-level placement), so this
          per-turn instance is mobile-only. */}
      <MedscapeCurrentAdBlock
        adPlacement="before-question"
        adSlot="drug_question_top"
        className="mb-5 md:hidden"
      />
      <Tag
        className={`mb-[27.6px] [font-family:var(--font-prototype-display)] text-[24px] font-[470] leading-[27.6px] tracking-[0] text-[#161b1d] [text-wrap:balance] md:mb-[52px] md:text-[40px] md:leading-[52px] ${className ?? ""}`.trim()}
      >
        {children}
      </Tag>
    </>
  );
}
