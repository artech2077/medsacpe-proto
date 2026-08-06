// Concept J — Canonical card first, AI answer below: scripted scenarios.
// Drives the example questions on /drug-concept-j. Every scenario is
// deterministic — no real AI. Clinical facts come from the drug monograph
// registry (drug-monograph-diabetes.ts) via answerKey/anchor. The aiAnswer
// prose authored here is the complementary AI-generated synthesis shown (and
// clearly labeled) BELOW the canonical card; its [n] citations resolve to the
// same monograph subfields as the answerKey's references.

export type DrugConceptJScenario = {
  /** AI-generated synthesis shown below the canonical card. Short Capitalized
   * lines (no trailing period) render as sub-headings; [n] markers cite the
   * answerKey's references. Clearly labeled as AI — verify against the card. */
  aiAnswer: string;
  /** Subfield id to auto-expand the monograph card two levels deep. */
  anchor: string;
  /** Key into the drug monograph's synthesizedAnswers map (used for citations/references). */
  answerKey: string;
  /** Registry drug id, e.g. "semaglutide". */
  drugId: string;
  /** Picker grouping label. */
  group: string;
  id: string;
  /** The HCP question shown as the message heading. */
  question: string;
};

export const DRUG_CONCEPT_J_SCENARIOS: DrugConceptJScenario[] = [
  {
    id: "sema-t2dm-dosing",
    group: "Dosing",
    question: "What is the dosing for semaglutide (Ozempic)?",
    drugId: "semaglutide",
    answerKey: "t2dm-dose-sc",
    anchor: "dosing.t2dm_sc",
    aiAnswer:
      "Starting and titrating Ozempic\n" +
      "Initiate Ozempic at 0.25 mg SC once weekly for 4 weeks — this initiation dose is for tolerability and does not improve glycemic control [1]. After 4 weeks, step up to 0.5 mg once weekly, the first therapeutic dose.\n\n" +
      "Reaching the target dose\n" +
      "If additional glycemic control is needed, increase in 0.5-mg increments no sooner than every 4 weeks, up to a maximum of 2 mg/week [1]. No dose adjustment is required for renal or hepatic impairment, but consider lowering concomitant insulin or sulfonylureas to limit hypoglycemia.",
  },
  {
    id: "sema-hypoglycemia",
    group: "Safety",
    question: "What is the hypoglycemia risk with semaglutide?",
    drugId: "semaglutide",
    answerKey: "hypoglycemia",
    anchor: "safety.hypoglycemia_risk",
    aiAnswer:
      "How much hypoglycemia to expect\n" +
      "Semaglutide alone rarely causes hypoglycemia. The risk rises sharply when it is combined with insulin or insulin secretagogues such as sulfonylureas [1]. Documented symptomatic hypoglycemia occurred in 16.7–29.8% of patients on Ozempic as add-on therapy [1].\n\n" +
      "Adjusting concomitant therapy\n" +
      "When initiating semaglutide, consider lowering the dose of concomitant insulin or secretagogues, and monitor blood glucose during titration [2].",
  },
  {
    id: "tirz-t2dm-dosing",
    group: "Dosing",
    question: "How do I dose tirzepatide (Mounjaro) for type 2 diabetes?",
    drugId: "tirzepatide",
    answerKey: "t2dm-dose",
    anchor: "dosing.t2dm",
    aiAnswer:
      "Initiating Mounjaro\n" +
      "Initiate Mounjaro at 2.5 mg SC once weekly for 4 weeks — an initiation dose for tolerability, not glycemic control [1]. After 4 weeks, increase to 5 mg once weekly, the first therapeutic dose.\n\n" +
      "Titrating to the maximum\n" +
      "If additional control is needed, increase in 2.5-mg increments every 4 weeks, up to a maximum of 15 mg/week in adults (10 mg/week for pediatric patients ≥10 years) [1].",
  },
];

// GLP-1 / incretin-themed related articles shown in the answer footer. Shared
// across the (all GLP-1) Concept J scenarios. Mirrors Medscape related content.
import type { RelatedArticle } from "@/components/medscape/ai-response/related-articles";

export const DRUG_CONCEPT_J_RELATED_ARTICLES: RelatedArticle[] = [
  {
    id: "pert-glp1",
    title: "Pancreatic Enzyme Replacement Therapy for GLP-1 Symptoms?",
    contentType: "Sponsored",
    sponsored: true,
    accent: "from-[#e7eefb] to-[#cdddf7]",
    imageSrc: "/assets/ai-drug-mono-v2/related-pert-glp1.png",
  },
  {
    id: "glp1-crc",
    title: "The GLP-1 Paradox in Colorectal Cancer in Real-World Practice",
    contentType: "Medscape Medical News",
    timeAgo: "2 hours ago",
    accent: "from-[#e9f6ef] to-[#cdebd9]",
    imageSrc: "/assets/ai-drug-mono-v2/related-glp1-colorectal-cancer.png",
  },
  {
    id: "glp1-stroke",
    title: "GLP-1 RAs Protective Against Stroke, Neurodegeneration?",
    contentType: "Medscape Medical News",
    timeAgo: "2 hours ago",
    accent: "from-[#f3ecfb] to-[#e0d2f5]",
    imageSrc: "/assets/ai-drug-mono-v2/related-glp1-neurology.png",
  },
];

export function getConceptJScenarioById(id: string): DrugConceptJScenario | undefined {
  return DRUG_CONCEPT_J_SCENARIOS.find((s) => s.id === id);
}

/** Composer fallback: pick the scenario sharing the most words with free text. */
export function matchConceptJScenario(query: string): DrugConceptJScenario | undefined {
  const words = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3);
  let best: { scenario: DrugConceptJScenario; score: number } | undefined;
  for (const scenario of DRUG_CONCEPT_J_SCENARIOS) {
    const haystack = scenario.question.toLowerCase();
    const score = words.filter((w) => haystack.includes(w)).length;
    if (score >= 2 && (!best || score > best.score)) best = { scenario, score };
  }
  return best?.scenario;
}
