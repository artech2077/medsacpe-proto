import { MedscapeCurrentAdBlock } from "@/components/medscape/ai-current/ad-block";
import { MedscapeCurrentHeader } from "@/components/medscape/ai-current/global-header";
import {
  DrugAiTablesArticle,
  DrugAiTablesFloatingAiButton,
  DrugAiTablesRightRail,
} from "@/components/medscape/drug-ai-tables/drug-monograph";

export function DrugAiTablesScreen() {
  return (
    <main className="min-h-screen bg-white text-[var(--mscp-color-text-primary)]">
      <MedscapeCurrentHeader />
      <div className="mx-auto mt-12 hidden max-w-[728px] md:block">
        <MedscapeCurrentAdBlock className="!border-0 !bg-white !p-0" />
      </div>
      <div className="mx-auto flex w-full max-w-[1280px] gap-[57px] px-4 pb-24 pt-8 md:px-8 lg:px-10">
        <div className="w-full max-w-[923px] lg:ml-0">
          <DrugAiTablesArticle />
        </div>
        <DrugAiTablesRightRail />
      </div>
      <DrugAiTablesFloatingAiButton />
    </main>
  );
}
