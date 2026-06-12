// Concept I — Unified Canonical Experience: scripted scenario table.
// Drives the grouped scenario picker on /drug-concept-i. Every scenario is
// deterministic: no real AI. Drug facts come from drug-monograph-diabetes.ts /
// drug-monograph.ts via the registry — never inline clinical strings here
// beyond scripted AI-synthesis text (S5/S6), which is clearly labeled in the UI.
// Source of truth: AI drug search/prompts/I - Unified Canonical Experience (Accordion + Tabs).md
// Grouping mirrors AI drug search/03_Discovery_Research/Drug Question Use Case Taxonomy.md
// (sections 1–6: use-case categories, not solution patterns).

// ─── Types ────────────────────────────────────────────────────────────────────

export type DrugScenarioPattern =
  | "S1"
  | "S2"
  | "S3"
  | "S4"
  | "S5"
  | "S6"
  | "S7"
  | "S8"
  | "S9";

/** One monograph card rendered in a scenario turn. */
export type ScenarioMonographView = {
  /** Subfield id to auto-expand two levels deep (section → subfield). */
  anchor?: string;
  /** Render fully collapsed (S6 supporting reference). BBW stays eager. */
  collapsed?: boolean;
  /** Registry id, e.g. "semaglutide". */
  drugId: string;
};

/** Cross-drug AI-synthesized answer (S5/S6) — citations carry the drug id. */
export type ScenarioAiAnswer = {
  /** Visual badge next to the AI label. */
  badge?: "off-label" | "guideline-based";
  citations: { anchor: string; drugId: string; marker: number }[];
  /** Shown under the answer, e.g. the "not covered by the monograph" caveat. */
  note?: string;
  text: string;
};

export type ScenarioClarifyOption = {
  /** Subfield anchor for the S1 card rendered after picking. */
  anchor: string;
  /** Key into the drug's monograph.synthesizedAnswers. */
  answerKey: string;
  drugId: string;
  id: string;
  label: string;
  sublabel: string;
};

export type DrugToolResult =
  | {
      kind: "interaction";
      title: string;
      pair: [string, string];
      severity: "Contraindicated" | "Serious" | "Monitor Closely" | "Minor";
      summary: string;
      lines: string[];
    }
  | {
      kind: "calculator";
      title: string;
      inputs: { label: string; value: string }[];
      result: { label: string; value: string };
      lines: string[];
      caution: string;
    };

export type ConditionArticlePill = { drugId: string; label: string };

export type ConditionArticle = {
  drugPills: ConditionArticlePill[];
  sections: { body: string[]; title: string }[];
  source: { label: string; section: string; url: string };
  subtitle: string;
  title: string;
};

/** One assistant reply in a scenario script. */
export type DrugScenarioTurn = {
  /** S5/S6: scripted cross-drug AI answer (Answer tab leads). */
  aiAnswer?: ScenarioAiAnswer;
  /** S1/S2/S9: key into the primary drug's monograph.synthesizedAnswers. */
  answerKey?: string;
  /** S3: clarifying options rendered as an inline option card. */
  clarify?: { options: ScenarioClarifyOption[]; prompt: string };
  /** S4 (and S9 compare): one-line synthesis above side-by-side cards. */
  comparisonSynthesis?: string;
  /** S7: condition article card with drug pills. */
  conditionArticle?: boolean;
  /** S2: deterministic one-line instant answer above the card. */
  instantAnswer?: string;
  /** Monograph cards for this turn. ≥2 with comparisonSynthesis → comparison view. */
  monographs: ScenarioMonographView[];
  question: string;
  /** S9 step 3: chip that swaps the turn into the comparison view. */
  compareChip?: { label: string; synthesis: string; views: ScenarioMonographView[] };
  /** S9 step 2: update the previous card in place instead of adding a new one. */
  updatesPrevious?: boolean;
  /** S8: deterministic tool result card rendered above anchored slices. */
  tool?: DrugToolResult;
};

export type DrugScenario = {
  id: string;
  pattern: DrugScenarioPattern;
  patternLabel: string;
  question: string;
  turns: DrugScenarioTurn[];
};

export type DrugScenarioGroup = {
  description: string;
  id: string;
  scenarios: DrugScenario[];
  title: string;
};

// ─── Scenario scripts ────────────────────────────────────────────────────────

const S1_DOSING: DrugScenario = {
  id: "s1-dosing",
  pattern: "S1",
  patternLabel: "S1 · Canonical card + AI tab",
  question: "What is the dosing for semaglutide (Ozempic)?",
  turns: [
    {
      question: "What is the dosing for semaglutide (Ozempic)?",
      answerKey: "t2dm-dose-sc",
      monographs: [{ drugId: "semaglutide", anchor: "dosing.t2dm_sc" }],
    },
  ],
};

const S1_ADVERSE: DrugScenario = {
  id: "s1-adverse",
  pattern: "S1",
  patternLabel: "S1 · Canonical card + AI tab",
  question: "What are the adverse effects of tirzepatide?",
  turns: [
    {
      question: "What are the adverse effects of tirzepatide?",
      answerKey: "gi-effects",
      monographs: [{ drugId: "tirzepatide", anchor: "adverse.gi" }],
    },
  ],
};

const S2_MISSED: DrugScenario = {
  id: "s2-missed",
  pattern: "S2",
  patternLabel: "S2 · Canonical slice (deep link)",
  question: "My patient missed their semaglutide injection by 3 days — how should they resume?",
  turns: [
    {
      question:
        "My patient missed their semaglutide injection by 3 days — how should they resume?",
      instantAnswer:
        "≤5 days since the missed Ozempic dose: administer as soon as possible, then resume the regular weekly schedule.",
      answerKey: "missed-dose",
      monographs: [{ drugId: "semaglutide", anchor: "administration.missed_dose" }],
    },
  ],
};

const S2_WASHOUT: DrugScenario = {
  id: "s2-washout",
  pattern: "S2",
  patternLabel: "S2 · Canonical slice (deep link)",
  question: "How long before a planned pregnancy should semaglutide be discontinued?",
  turns: [
    {
      question:
        "How long before a planned pregnancy should semaglutide be discontinued?",
      instantAnswer:
        "Discontinue semaglutide at least 2 months before a planned pregnancy (long half-life).",
      answerKey: "pregnancy-washout",
      monographs: [{ drugId: "semaglutide", anchor: "pregnancy.planning" }],
    },
  ],
};

const S2_PEDS: DrugScenario = {
  id: "s2-peds",
  pattern: "S2",
  patternLabel: "S2 · Canonical slice (deep link)",
  question: "Can I start liraglutide in a 14-year-old with obesity?",
  turns: [
    {
      question: "Can I start liraglutide in a 14-year-old with obesity?",
      answerKey: "saxenda-peds",
      monographs: [{ drugId: "liraglutide", anchor: "dosing.pediatric" }],
    },
  ],
};

const S3_DOSE: DrugScenario = {
  id: "s3-dose",
  pattern: "S3",
  patternLabel: "S3 · Clarifying question first",
  question: "What's the semaglutide dose?",
  turns: [
    {
      question: "What's the semaglutide dose?",
      clarify: {
        prompt:
          "Semaglutide has three products with different dosing — which one are you asking about?",
        options: [
          {
            id: "ozempic",
            label: "Ozempic",
            sublabel: "Type 2 diabetes · SC weekly",
            drugId: "semaglutide",
            answerKey: "t2dm-dose-sc",
            anchor: "dosing.t2dm_sc",
          },
          {
            id: "wegovy",
            label: "Wegovy",
            sublabel: "Weight management · SC weekly",
            drugId: "semaglutide",
            answerKey: "weight-dose",
            anchor: "dosing.weight_sc",
          },
          {
            id: "rybelsus",
            label: "Rybelsus",
            sublabel: "Type 2 diabetes · oral daily",
            drugId: "semaglutide",
            answerKey: "t2dm-dose-po",
            anchor: "dosing.t2dm_po",
          },
        ],
      },
      monographs: [],
    },
  ],
};

const S4_DOSING: DrugScenario = {
  id: "s4-dosing",
  pattern: "S4",
  patternLabel: "S4 · Dual canonical view",
  question: "How does semaglutide dosing compare with tirzepatide?",
  turns: [
    {
      question: "How does semaglutide dosing compare with tirzepatide?",
      comparisonSynthesis:
        "Both are once-weekly SC with stepwise escalation; the schedules and maximum doses differ.",
      monographs: [
        { drugId: "semaglutide", anchor: "dosing.t2dm_sc" },
        { drugId: "tirzepatide", anchor: "dosing.t2dm" },
      ],
    },
  ],
};

const S4_MOA: DrugScenario = {
  id: "s4-moa",
  pattern: "S4",
  patternLabel: "S4 · Dual canonical view",
  question: "How does liraglutide's mechanism differ from tirzepatide's?",
  turns: [
    {
      question: "How does liraglutide's mechanism differ from tirzepatide's?",
      comparisonSynthesis:
        "Liraglutide is a daily GLP-1 analogue; tirzepatide is a weekly dual GIP + GLP-1 receptor agonist.",
      monographs: [
        { drugId: "liraglutide", anchor: "pharmacology.moa" },
        { drugId: "tirzepatide", anchor: "pharmacology.moa" },
      ],
    },
  ],
};

const S5_SWITCH: DrugScenario = {
  id: "s5-switch",
  pattern: "S5",
  patternLabel: "S5 · Composed canonical + AI synthesis",
  question: "How do I transition a patient from liraglutide to semaglutide?",
  turns: [
    {
      question: "How do I transition a patient from liraglutide to semaglutide?",
      aiAnswer: {
        text: "Neither monograph specifies a direct switching protocol. A common approach: discontinue liraglutide (no taper required — it was titrated for tolerability, not dependence) [1], then initiate semaglutide at the 0.25 mg/week starting dose the day after the last liraglutide dose and follow the standard escalation schedule [2]. Starting semaglutide at a higher dose increases GI adverse effects. Monitor glycemic control during the transition and watch hypoglycemia risk if the patient also takes insulin or a sulfonylurea [2].",
        note: "Switching guidance is not covered by either monograph — the steps above are AI-synthesized from the canonical dosing sections cited.",
        citations: [
          { drugId: "liraglutide", anchor: "dosing.t2dm_victoza", marker: 1 },
          { drugId: "semaglutide", anchor: "dosing.t2dm_sc", marker: 2 },
        ],
      },
      monographs: [
        { drugId: "liraglutide", anchor: "dosing.t2dm_victoza" },
        { drugId: "semaglutide", anchor: "dosing.t2dm_sc" },
      ],
    },
  ],
};

const S5_BBW: DrugScenario = {
  id: "s5-bbw",
  pattern: "S5",
  patternLabel: "S5 · Composed canonical + AI synthesis",
  question: "Which GLP-1 agonists carry the thyroid C-cell black box warning?",
  turns: [
    {
      question: "Which GLP-1 agonists carry the thyroid C-cell black box warning?",
      aiAnswer: {
        text: "All three GLP-1 receptor agonists in this class carry the boxed warning for thyroid C-cell tumors observed in rodents: liraglutide [1], semaglutide [2], and tirzepatide [3]. Each is contraindicated in patients with a personal or family history of medullary thyroid carcinoma (MTC) or multiple endocrine neoplasia syndrome type 2 (MEN2).",
        citations: [
          { drugId: "liraglutide", anchor: "safety.contraindications", marker: 1 },
          { drugId: "semaglutide", anchor: "safety.contraindications", marker: 2 },
          { drugId: "tirzepatide", anchor: "safety.contraindications", marker: 3 },
        ],
      },
      monographs: [
        { drugId: "liraglutide", anchor: "safety.contraindications" },
        { drugId: "semaglutide", anchor: "safety.contraindications" },
        { drugId: "tirzepatide", anchor: "safety.contraindications" },
      ],
    },
  ],
};

const S6_PERIOP: DrugScenario = {
  id: "s6-periop",
  pattern: "S6",
  patternLabel: "S6 · AI answer + canonical source card",
  question: "Should I hold my patient's GLP-1 before elective surgery?",
  turns: [
    {
      question: "Should I hold my patient's GLP-1 before elective surgery?",
      aiAnswer: {
        badge: "guideline-based",
        text: "The monograph itself states that available data are insufficient to recommend holding GLP-1 agonists before surgery [1]. Multi-society guidance (ASA-aligned, 2023–2025) suggests: for weekly agents, consider holding the dose the week before an elective procedure; for daily agents, hold the day of surgery. If the drug was not held, treat the patient as having a full stomach — consider point-of-care gastric ultrasound, rapid-sequence induction, or postponement based on aspiration risk.",
        note: "Hold recommendations come from anesthesia society guidance, not the drug monograph — the monograph only documents the aspiration reports and the evidence gap.",
        citations: [
          { drugId: "semaglutide", anchor: "safety.periop_aspiration", marker: 1 },
        ],
      },
      monographs: [
        { drugId: "semaglutide", anchor: "safety.periop_aspiration", collapsed: true },
      ],
    },
  ],
};

const S6_OFFLABEL: DrugScenario = {
  id: "s6-offlabel",
  pattern: "S6",
  patternLabel: "S6 · AI answer + canonical source card",
  question: "Can semaglutide be used off-label in type 1 diabetes?",
  turns: [
    {
      question: "Can semaglutide be used off-label in type 1 diabetes?",
      aiAnswer: {
        badge: "off-label",
        text: "Semaglutide is not indicated for type 1 diabetes — the label explicitly states it is not a substitute for insulin [1]. Small trials and case series report adjunctive use in T1DM (often with obesity or insulin resistance) showing reduced insulin requirements and weight loss, but with increased hypoglycemia and possible DKA risk if insulin is reduced too aggressively. Any off-label use requires continued insulin therapy and close monitoring.",
        note: "Off-label evidence summarized from published literature; the monograph covers only the approved indications cited.",
        citations: [
          { drugId: "semaglutide", anchor: "safety.contraindications", marker: 1 },
        ],
      },
      monographs: [
        { drugId: "semaglutide", anchor: "safety.contraindications", collapsed: true },
      ],
    },
  ],
};

const S7_T2DM: DrugScenario = {
  id: "s7-t2dm",
  pattern: "S7",
  patternLabel: "S7 · Condition article → drug handoff",
  question: "What are the treatment options for type 2 diabetes?",
  turns: [
    {
      question: "What are the treatment options for type 2 diabetes?",
      conditionArticle: true,
      monographs: [],
    },
  ],
};

const S8_DDI: DrugScenario = {
  id: "s8-ddi",
  pattern: "S8",
  patternLabel: "S8 · Deterministic tool",
  question: "Can I add semaglutide for a patient already on insulin regular human?",
  turns: [
    {
      question: "Can I add semaglutide for a patient already on insulin regular human?",
      tool: {
        kind: "interaction",
        title: "Interaction check",
        pair: ["Semaglutide", "Insulin regular human"],
        severity: "Monitor Closely",
        summary:
          "Either increases the effect of the other by pharmacodynamic synergism — additive hypoglycemia risk.",
        lines: [
          "Coadministration of GLP-1 agonists with insulin increases hypoglycemia risk.",
          "Consider lowering the insulin dose when initiating semaglutide.",
          "Educate the patient on hypoglycemia signs and symptoms; monitor glucose closely during titration.",
        ],
      },
      monographs: [
        { drugId: "semaglutide", anchor: "interactions.insulin_secretagogues" },
        { drugId: "insulin-regular-human", anchor: "interactions.glp1_agents" },
      ],
    },
  ],
};

const S8_U500: DrugScenario = {
  id: "s8-u500",
  pattern: "S8",
  patternLabel: "S8 · Deterministic tool",
  question:
    "My patient takes 300 units/day of Humulin R U-100 — how do I convert to U-500?",
  turns: [
    {
      question:
        "My patient takes 300 units/day of Humulin R U-100 — how do I convert to U-500?",
      tool: {
        kind: "calculator",
        title: "U-100 → U-500 conversion",
        inputs: [
          { label: "Current total daily dose (U-100)", value: "300 units/day" },
          { label: "U-500 concentration", value: "5× (500 units/mL)" },
        ],
        result: { label: "Equivalent U-500 volume", value: "0.6 mL/day (300 units)" },
        lines: [
          "The total daily dose in units stays the same — U-500 delivers it in one-fifth the volume (300 units = 0.6 mL of U-500 vs 3 mL of U-100).",
          "Divide across the patient's usual injection schedule per the prescriber's regimen.",
        ],
        caution:
          "Prescribe with U-500 syringes (or the U-500 KwikPen) to avoid dosing errors — drawing U-500 in a U-100 syringe delivers 5× the intended dose.",
      },
      monographs: [{ drugId: "insulin-regular-human", anchor: "safety.u500_errors" }],
    },
  ],
};

const S9_THREAD: DrugScenario = {
  id: "s9-thread",
  pattern: "S9",
  patternLabel: "S9 · Persistent drug context",
  question: "Semaglutide dosing → pregnancy → tirzepatide (3 turns)",
  turns: [
    {
      question: "What is the dosing for semaglutide (Ozempic)?",
      answerKey: "t2dm-dose-sc",
      monographs: [{ drugId: "semaglutide", anchor: "dosing.t2dm_sc" }],
    },
    {
      question: "and in pregnancy?",
      answerKey: "pregnancy-washout",
      updatesPrevious: true,
      monographs: [{ drugId: "semaglutide", anchor: "pregnancy.planning" }],
    },
    {
      question: "what about tirzepatide instead?",
      answerKey: "pregnancy",
      monographs: [{ drugId: "tirzepatide", anchor: "pregnancy.planning" }],
      compareChip: {
        label: "Compare semaglutide vs tirzepatide",
        synthesis:
          "Semaglutide carries an explicit ≥2-month pre-pregnancy washout; tirzepatide has no defined washout — both advise against use for weight loss in pregnancy.",
        views: [
          { drugId: "semaglutide", anchor: "pregnancy.planning" },
          { drugId: "tirzepatide", anchor: "pregnancy.planning" },
        ],
      },
    },
  ],
};

// ─── Groups — one per solution pattern (S1–S9, taxonomy legend) ───────────────

export const DRUG_SCENARIO_GROUPS: DrugScenarioGroup[] = [
  {
    id: "s1-canonical-card",
    title: "Canonical card + AI tab",
    description:
      "Concept I as designed: monograph card opens on the relevant section; short AI summary in the Answer tab.",
    scenarios: [S1_DOSING, S1_ADVERSE],
  },
  {
    id: "s2-canonical-slice",
    title: "Canonical slice (deep link)",
    description:
      "Card auto-expanded two levels deep to the exact subfield; instant answer line for single facts.",
    scenarios: [S2_MISSED, S2_PEDS, S2_WASHOUT],
  },
  {
    id: "s3-clarify-first",
    title: "Clarifying question first",
    description:
      "Ambiguous question → inline option card first (plan-mode style); picking a product renders the answer.",
    scenarios: [S3_DOSE],
  },
  {
    id: "s4-dual-view",
    title: "Dual canonical view",
    description:
      "Two cards side by side, both opened to the same section; one-line AI synthesis above. Max 3 monographs.",
    scenarios: [S4_DOSING, S4_MOA],
  },
  {
    id: "s5-composed-synthesis",
    title: "Composed canonical + AI synthesis",
    description:
      "Answer leads with a cited synthesis; citation chips deep-link into stacked monograph cards (max 3).",
    scenarios: [S5_SWITCH, S5_BBW],
  },
  {
    id: "s6-beyond-monograph",
    title: "AI answer + canonical source card",
    description:
      "Question is outside monograph scope — AI answer leads (clearly labeled); collapsed monograph card as reference.",
    scenarios: [S6_PERIOP, S6_OFFLABEL],
  },
  {
    id: "s7-condition-first",
    title: "Condition article → drug handoff",
    description:
      "Condition article card with drug pills; tapping a pill opens that drug's monograph card in the thread.",
    scenarios: [S7_T2DM],
  },
  {
    id: "s8-deterministic-tools",
    title: "Deterministic tools",
    description:
      "Interaction-checker / calculator result card with the source monograph slice anchored beneath.",
    scenarios: [S8_DDI, S8_U500],
  },
  {
    id: "s9-persistent-context",
    title: "Persistent drug context",
    description:
      "One multi-turn sequence: the card updates in place, then a second drug joins with a Compare chip.",
    scenarios: [S9_THREAD],
  },
];

export function getScenarioById(id: string): DrugScenario | undefined {
  for (const group of DRUG_SCENARIO_GROUPS) {
    const hit = group.scenarios.find((s) => s.id === id);
    if (hit) return hit;
  }
  return undefined;
}

// ─── Condition article (S7) ──────────────────────────────────────────────────

export const t2dmConditionArticle: ConditionArticle = {
  title: "Type 2 Diabetes Mellitus",
  subtitle: "Treatment & Management — summary",
  source: {
    label: "Medscape Condition Article",
    section: "Type 2 Diabetes Mellitus > Treatment & Management",
    url: "https://emedicine.medscape.com/article/117853-treatment",
  },
  sections: [
    {
      title: "Treatment approach",
      body: [
        "Lifestyle modification (medical nutrition therapy, physical activity, weight management) is foundational at every stage.",
        "Metformin remains a common first-line agent; therapy is individualized by comorbidity — ASCVD, heart failure, CKD, and obesity each steer agent selection.",
        "Glycemic targets are individualized; A1c <7% is typical for most nonpregnant adults.",
      ],
    },
    {
      title: "Medication classes",
      body: [
        "GLP-1 receptor agonists and dual GIP/GLP-1 agonists offer high glycemic efficacy with weight loss and CV benefit in selected populations.",
        "Insulin is indicated for severe hyperglycemia, catabolic features, or when noninsulin agents fail to reach targets.",
        "Tap a drug below to open its canonical monograph card in this thread.",
      ],
    },
  ],
  drugPills: [
    { drugId: "semaglutide", label: "Semaglutide" },
    { drugId: "tirzepatide", label: "Tirzepatide" },
    { drugId: "liraglutide", label: "Liraglutide" },
    { drugId: "insulin-regular-human", label: "Insulin (regular)" },
  ],
};
