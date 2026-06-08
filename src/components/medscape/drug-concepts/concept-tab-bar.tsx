"use client";

import { useRouter } from "next/navigation";
import { AnalyticsLink } from "@/components/analytics/analytics-link";
import { DRUG_CONCEPTS, type DrugConceptLetter } from "@/data/drug-concepts";

// Re-export for consumers that import from this file
export type { DrugConceptDefinition, DrugConceptLetter } from "@/data/drug-concepts";
export { DRUG_CONCEPTS } from "@/data/drug-concepts";

type DrugConceptTabBarProps = {
  activeConcept: DrugConceptLetter;
  compact?: boolean;
};

export function DrugConceptTabBar({ activeConcept, compact }: DrugConceptTabBarProps) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 md:px-4">
      <div className={`shrink-0 flex-col leading-none ${compact ? "hidden" : "hidden lg:flex"}`}>
        <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#5b7194]">
          Medscape AI
        </span>
        <span className="mt-0.5 text-[12px] font-extrabold tracking-[-0.01em] text-[#0d2f5e]">
          Drug Search
        </span>
      </div>

      <div
        aria-hidden="true"
        className="hidden h-7 w-px shrink-0 bg-[rgba(13,47,94,0.14)] lg:block"
      />

      <nav
        aria-label="Drug concept prototypes"
        className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto rounded-full border border-white/70 bg-white/45 p-1 backdrop-blur-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {DRUG_CONCEPTS.map((concept) => {
          const isActive = concept.letter === activeConcept;
          return (
            <AnalyticsLink
              key={concept.letter}
              href={concept.route}
              eventName="concept_tab_switched"
              eventProperties={{
                destination_route: concept.route,
                from_concept: activeConcept,
                to_concept: concept.letter,
              }}
              aria-current={isActive ? "page" : undefined}
              style={{ touchAction: "manipulation", color: isActive ? "#ffffff" : undefined }}
              onClick={isActive ? (e) => { e.preventDefault(); router.push(`${concept.route}?r=${Date.now()}`); } : undefined}
              className={[
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11.5px] font-semibold leading-none transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] focus-visible:ring-offset-1",
                isActive
                  ? "bg-[var(--mscp-color-brand-primary)] text-white shadow-[0_2px_6px_rgba(6,74,167,0.28)]"
                  : "text-[#3a4f6b] hover:bg-white/80 hover:text-[#0d2f5e]",
              ].join(" ")}
            >
              <span
                className={[
                  "inline-flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full text-[8.5px] font-bold leading-none",
                  isActive
                    ? "bg-white/25 text-white"
                    : "bg-[rgba(6,74,167,0.1)] text-[var(--mscp-color-brand-primary)]",
                ].join(" ")}
              >
                {concept.letter}
              </span>
              {!compact && <span className="hidden sm:inline">{concept.label}</span>}
            </AnalyticsLink>
          );
        })}
      </nav>
    </div>
  );
}
