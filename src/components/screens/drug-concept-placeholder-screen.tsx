import { DrugConceptShell } from "@/components/medscape/drug-concepts/concept-shell";
import { DRUG_CONCEPTS, type DrugConceptLetter } from "@/data/drug-concepts";

type DrugConceptPlaceholderScreenProps = {
  concept: DrugConceptLetter;
};

export function DrugConceptPlaceholderScreen({ concept }: DrugConceptPlaceholderScreenProps) {
  const def = DRUG_CONCEPTS.find((c) => c.letter === concept);

  return (
    <DrugConceptShell activeConcept={concept}>
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(6,74,167,0.08)] text-[22px] font-black text-[var(--mscp-color-brand-primary)]">
          {concept}
        </div>
        <h2 className="mt-2 text-[20px] font-extrabold tracking-tight text-[#22282d] md:text-[24px]">
          {def?.title ?? `Concept ${concept}`}
        </h2>
        <p className="mt-3 max-w-[420px] text-[14px] leading-[1.7] text-[#5a6e7e]">
          {def?.description}
        </p>
        <p className="mt-6 rounded-full bg-[rgba(6,74,167,0.06)] px-4 py-2 text-[12px] font-semibold text-[var(--mscp-color-brand-primary)]">
          Coming soon — see build prompt in <code>AI drug search/prompts/</code>
        </p>
      </div>
    </DrugConceptShell>
  );
}
