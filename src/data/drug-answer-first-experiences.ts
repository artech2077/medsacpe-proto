import type { AiAnswerReference } from "./ai-response";
import { DRUG_CONCEPT_J_SCENARIOS, type DrugConceptJScenario } from "./drug-concept-j-scenarios";
import {
  MOUNJARO_APPROVAL_LETTER_URL,
  MOUNJARO_LABEL_URL,
  MOUNJARO_UPDATE,
  OZEMPIC_LABEL_URL,
  OZEMPIC_UPDATE,
  ZEPBOUND_LABEL_URL,
  type DrugMonographUpdate,
  type DrugUpdatePresentation,
} from "./drug-monograph-updates";

export type AnswerFirstScenario = DrugConceptJScenario & {
  citationLabel?: string;
  followUpQuestions?: string[];
  pillLabel?: string;
  references?: AiAnswerReference[];
  exampleTitle?: string;
  updatePresentation?: DrugUpdatePresentation;
  responseKind?: "drug-update";
  /** Scenario-specific update; overrides the experience-level update. */
  update?: DrugMonographUpdate;
};

export type DrugAnswerFirstExperience = {
  defaultScenarioId?: string;
  description: string;
  label: string;
  route: string;
  scenarios: readonly AnswerFirstScenario[];
  slug: string;
  title: string;
  updates?: DrugMonographUpdate;
  /** Single-link share build: no prototype menu, no Examples switcher. */
  share?: boolean;
};

export const ANSWER_FIRST_V3: DrugAnswerFirstExperience = {
  description:
    "The AI-generated answer responds to your exact question. The canonical Medscape monograph it’s grounded in is one tap away — tap the drug pill below the answer to open it.",
  label: "AI drug mono V3 · Answer-first",
  route: "/ai-drug-mono-v3",
  scenarios: DRUG_CONCEPT_J_SCENARIOS,
  slug: "ai-drug-mono-v3",
  title: "A direct answer first, the monograph on demand",
};

const ozempicCkdScenario: AnswerFirstScenario = {
  id: "ozempic-ckd-dosing",
  group: "Kidney indication",
  question: "How do I dose Ozempic for adults with type 2 diabetes and chronic kidney disease?",
  drugId: "semaglutide",
  anchor: "dosing.t2dm_sc",
  answerKey: "t2dm-dose-sc",
  pillLabel: "Ozempic (semaglutide)",
  citationLabel: "FDA prescribing information",
  aiAnswer:
    "Initiation and titration\n" +
    "Start Ozempic injection at 0.25 mg subcutaneously once weekly for 4 weeks, then increase to 0.5 mg once weekly [1].\n\n" +
    "Maintenance for the kidney indication\n" +
    "After at least 4 weeks at 0.5 mg, increase to 1 mg once weekly to reduce kidney disease progression and cardiovascular death risk in adults with type 2 diabetes and CKD. The 2 mg dose is an escalation option for additional glycemic control [1].\n\n" +
    "Monitoring during titration\n" +
    "Monitor kidney function if nausea, vomiting, or diarrhea could cause dehydration. Review concomitant insulin or sulfonylurea doses because of hypoglycemia risk [2].",
  references: [
    {
      id: 1,
      title: "Ozempic injection: indications and recommended dosage",
      detail: "Sections 1 and 2.2 of the U.S. prescribing information; kidney indication added January 2025.",
      source: "Sections 1 & 2.2",
      sourceLabel: "FDA prescribing information",
      url: OZEMPIC_LABEL_URL,
    },
    {
      id: 2,
      title: "Hypoglycemia and kidney injury from volume depletion",
      detail: "Sections 5.5 and 5.6: concomitant insulin/secretagogues and renal monitoring during volume depletion.",
      source: "Sections 5.5 & 5.6",
      sourceLabel: "FDA prescribing information",
      url: OZEMPIC_LABEL_URL,
    },
  ],
  followUpQuestions: [
    "What is the dosing for semaglutide (Ozempic)?",
    "What is the hypoglycemia risk with semaglutide?",
  ],
};

// Variation 5 — editorial update brief, sourced from the Mounjaro S-044/S-045
// approval (Aug 27, 2026) in older-verified-updates.csv.
const mounjaroUpdateScenario: AnswerFirstScenario = {
  id: "mounjaro-update-editorial",
  group: "Variation 5",
  exampleTitle: "Editorial update brief · Mounjaro",
  question: "Can I keep a patient with type 2 diabetes on Mounjaro 2.5 mg once weekly?",
  drugId: "tirzepatide",
  anchor: "dosing.t2dm",
  answerKey: "t2dm-dose",
  pillLabel: "Mounjaro (tirzepatide)",
  // One chip label covers all citations; all three sources are FDA documents.
  citationLabel: "FDA",
  updatePresentation: "editorial",
  update: MOUNJARO_UPDATE,
  aiAnswer:
    "2.5 mg is now a maintenance option\n" +
    "Yes. Under the August 2026 U.S. label, Mounjaro 2.5 mg subcutaneously once weekly can be used for ongoing glycemic control in type 2 diabetes. It is no longer only an initiation dose [1][2].\n\n" +
    "When more glycemic control is needed\n" +
    "Increase the dose in 2.5 mg increments after at least 4 weeks on the current dose, up to 15 mg once weekly in adults. Pediatric patients 10 years and older have age-specific maximum doses [1].\n\n" +
    "Mounjaro only, not Zepbound\n" +
    "The same update added an indication to reduce major adverse cardiovascular events in adults with type 2 diabetes at high risk [2]. Neither change applies to Zepbound, whose label still describes 2.5 mg as an initiation dose [3].",
  references: [
    {
      id: 1,
      title: "Mounjaro injection: recommended dosage",
      detail: "U.S. prescribing information revised with S-044 and S-045; 2.5 mg can be used for ongoing glycemic control.",
      source: "Dosage and administration",
      sourceLabel: "FDA prescribing information",
      url: MOUNJARO_LABEL_URL,
    },
    {
      id: 2,
      title: "FDA approval letter: NDA 215866 S-044 and S-045",
      detail: "Signed 08/27/2026. Cardiovascular risk reduction indication (S-044) and 2.5 mg dose for ongoing glycemic control (S-045).",
      source: "Approval letter",
      sourceLabel: "FDA approval letter",
      url: MOUNJARO_APPROVAL_LETTER_URL,
    },
    {
      id: 3,
      title: "Zepbound injection: recommended dosage",
      detail: "Zepbound labeling still describes 2.5 mg as a dose for treatment initiation.",
      source: "Dosage and administration",
      sourceLabel: "FDA prescribing information",
      url: ZEPBOUND_LABEL_URL,
    },
  ],
  followUpQuestions: ["How do I dose tirzepatide (Mounjaro) for type 2 diabetes?"],
};

export const ANSWER_FIRST_V4: DrugAnswerFirstExperience = {
  defaultScenarioId: ozempicCkdScenario.id,
  description:
    "Explore Ozempic and Mounjaro label updates, understand their clinical relevance, and get a direct answer with the Medscape monograph one tap away. Scripted demo; viewing history is simulated.",
  label: "AI drug mono V4 · Drug updates",
  route: "/ai-drug-mono-v4",
  scenarios: [
    ozempicCkdScenario,
    {
      ...ozempicCkdScenario,
      id: "ozempic-update-takeaway",
      group: "Variation 3",
      exampleTitle: "Clinical takeaway first",
      updatePresentation: "takeaway",
    },
    mounjaroUpdateScenario,
    {
      ...ozempicCkdScenario,
      id: "ozempic-update-email",
      group: "Email entry",
      exampleTitle: "Drug update as the answer — email link",
      question: OZEMPIC_UPDATE.editorial.headline,
      updatePresentation: "editorial",
      responseKind: "drug-update",
      references: OZEMPIC_UPDATE.sections.map((section, index) => ({
        id: index + 1,
        title: section.source.label,
        detail: section.whatChanged,
        source: section.sectionTitle,
        sourceLabel: section.source.label,
        url: section.source.url,
      })),
      citationLabel: undefined,
      aiAnswer: [
        OZEMPIC_UPDATE.updatedDate,
        OZEMPIC_UPDATE.editorial.audienceTitle,
        OZEMPIC_UPDATE.editorial.audience,
        `**${OZEMPIC_UPDATE.editorial.changeTitle}**`,
        `${OZEMPIC_UPDATE.editorial.whatChanged} [2]`,
        OZEMPIC_UPDATE.editorial.clinicalRelevanceTitle,
        `${OZEMPIC_UPDATE.editorial.clinicalRelevance} [1][2]`,
      ].join("\n\n"),
    },
    ...DRUG_CONCEPT_J_SCENARIOS,
  ],
  slug: "ai-drug-mono-v4",
  title: "Understand the update. Get the answer.",
  updates: OZEMPIC_UPDATE,
};

// Shareable Mounjaro-only link for user sessions. Pair with the
// SHARE_ONLY_PATHS proxy setting so no other page is reachable. Follow-ups are
// removed: the tirzepatide dosing scenario predates the update and contradicts it.
export const SHARE_MOUNJARO_UPDATE: DrugAnswerFirstExperience = {
  defaultScenarioId: mounjaroUpdateScenario.id,
  description: "Mounjaro drug update with a direct answer and the monograph one tap away.",
  label: "Medscape AI",
  route: "/share/mounjaro-update",
  scenarios: [{ ...mounjaroUpdateScenario, followUpQuestions: [] }],
  share: true,
  slug: "share-mounjaro-update",
  title: "Mounjaro drug update",
  updates: MOUNJARO_UPDATE,
};

export function matchAnswerFirstScenario(query: string, scenarios: readonly AnswerFirstScenario[]) {
  const normalized = query.toLowerCase();
  // Prioritize the specific CKD scenario over the general dosing question.
  if (/ozempic|semaglutide/.test(normalized) && /kidney|renal|ckd/.test(normalized)) {
    const ckd = scenarios.find((scenario) => scenario.id === "ozempic-ckd-dosing");
    if (ckd) return ckd;
  }
  if (/mounjaro|tirzepatide/.test(normalized) && /2\.5|maintenance|cardiovascular|update/.test(normalized)) {
    const mounjaro = scenarios.find((scenario) => scenario.id === "mounjaro-update-editorial");
    if (mounjaro) return mounjaro;
  }
  const words = normalized.split(/\s+/).filter((word) => word.length > 3);
  let best: { scenario: AnswerFirstScenario; score: number } | undefined;
  for (const scenario of scenarios) {
    const score = words.filter((word) => scenario.question.toLowerCase().includes(word)).length;
    if (score >= 2 && (!best || score > best.score)) best = { scenario, score };
  }
  return best?.scenario;
}
