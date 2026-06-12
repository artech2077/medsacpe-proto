"use client";

import { ClinicalSourceLabel } from "@/components/medscape/drug-concepts/clinical-system";
import type { ConditionArticle } from "@/data/drug-concept-i-scenarios";

// ─── ConditionArticleCard ───────────────────────────────────────────────────────
// S7 condition-first handoff: a condition article summary card (Treatment /
// Medication sections) with drug pills. Tapping a pill opens that drug's
// canonical monograph card in the thread (handled by the screen).

type ConditionArticleCardProps = {
  article: ConditionArticle;
  /** Drug ids already opened in the thread — their pills show as active. */
  openedDrugIds?: string[];
  onPickDrug: (drugId: string) => void;
};

export function ConditionArticleCard({
  article,
  onPickDrug,
  openedDrugIds = [],
}: ConditionArticleCardProps) {
  return (
    <article className="dc-rise overflow-hidden rounded-[14px] border border-[#e2eaf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.05)]">
      <header className="border-b border-[#edf2f7] bg-[#f8fafc] px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8497a9]">
          Condition article
        </p>
        <h3 className="mt-0.5 text-[17px] font-extrabold tracking-[-0.01em] text-[#161b1d]">
          {article.title}
        </h3>
        <p className="text-[12px] font-medium text-[#7a8da0]">{article.subtitle}</p>
      </header>

      <div className="space-y-4 px-4 py-3.5">
        {article.sections.map((section) => (
          <section key={section.title}>
            <h4 className="text-[13px] font-bold text-[#2c353a]">{section.title}</h4>
            <ul className="mt-1.5 space-y-1.5">
              {section.body.map((line, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-[13px] leading-[1.55] text-[#3c454d]"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#bdc8d5]"
                  />
                  {line}
                </li>
              ))}
            </ul>
          </section>
        ))}

        {/* Drug handoff pills */}
        <div className="border-t border-[#eef3f8] pt-3">
          <p className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#8497a9]">
            Medications — open monograph
          </p>
          <div className="flex flex-wrap gap-1.5">
            {article.drugPills.map((pill) => {
              const isOpened = openedDrugIds.includes(pill.drugId);
              return (
                <button
                  key={pill.drugId}
                  type="button"
                  onClick={() => onPickDrug(pill.drugId)}
                  aria-pressed={isOpened}
                  style={{ touchAction: "manipulation" }}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] focus-visible:ring-offset-1 ${
                    isOpened
                      ? "border-[var(--mscp-color-brand-primary)] bg-[rgba(6,74,167,0.07)] text-[var(--mscp-color-brand-primary)]"
                      : "border-[#d4e0ec] bg-white text-[#33424f] hover:border-[rgba(6,74,167,0.45)] hover:text-[var(--mscp-color-brand-primary)]"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 rounded-full ${isOpened ? "bg-[var(--mscp-color-brand-primary)]" : "bg-[#aebccb]"}`}
                  />
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>

        <ClinicalSourceLabel source={article.source} />
      </div>
    </article>
  );
}
