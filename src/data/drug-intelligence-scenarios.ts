// Drug Intelligence V2 — scripted scenario data for /ai-drug-mono-v2.
// Implements the Connected Drug Intelligence prototype prompt (2026-07-16) and
// the 2026-07-23 Final Drug Intelligence Prototype Plan: one connected
// bevacizumab journey (change alert + indication-aware answer → dose calculator
// → comparison + peer context → regimen risk check). The focused regimen-check and
// monograph-change entries remain available as direct prototype deep links.
//
// Trust model: clinical facts stay in the typed monograph fixtures and are
// referenced here by anchor wherever possible. AI's role is limited to intent
// recognition and value extraction; criteria matching, interactions, and diffs
// are deterministic. Peer-context and change-alert data are MOCKED prototype
// fixtures, labeled as such in the UI.

import type { DrugToolResult } from "@/data/drug-concept-i-scenarios";

// ─── Scenario picker ────────────────────────────────────────────────────────────

export type DrugIntelligenceScenarioId =
  | "connected-bevacizumab"
  | "bevacizumab-regimen-check"
  | "bevacizumab-monograph-update";

export type DrugIntelligenceScenario = {
  description: string;
  group: string;
  id: DrugIntelligenceScenarioId;
  /** The physician turn that starts the scenario. */
  startingQuestion: string;
  title: string;
};

export const DRUG_INTELLIGENCE_SCENARIOS: DrugIntelligenceScenario[] = [
  {
    description:
      "One stakeholder walkthrough: indication-aware answer, weight-based dosing, ramucirumab comparison, oncology peer-search context, and a regimen risk check — all in one cumulative thread.",
    group: "Primary",
    id: "connected-bevacizumab",
    startingQuestion:
      "What is the recommended dosing for bevacizumab for metastatic colorectal cancer with FOLFOX4?",
    title: "Complete drug-intelligence walkthrough",
  },
  {
    description:
      "Paste an oncology regimen, confirm the drugs AI extracted, then review regimen-specific risk considerations grouped by severity.",
    group: "Regimen",
    startingQuestion:
      "Review this regimen: bevacizumab, amlodipine, and atezolizumab.",
    title: "Check a medication regimen",
    id: "bevacizumab-regimen-check",
  },
  {
    description:
      "Return to a frequently viewed drug, see which sections changed since your last visit, and jump to the updated content.",
    group: "Updates",
    id: "bevacizumab-monograph-update",
    startingQuestion: "Open bevacizumab — what changed since I last viewed it?",
    title: "See what changed in a monograph",
  },
];

export function getDrugIntelligenceScenarioById(
  id: string,
): DrugIntelligenceScenario | undefined {
  return DRUG_INTELLIGENCE_SCENARIOS.find((s) => s.id === id);
}

// ─── Moment 1 — exact answer ────────────────────────────────────────────────────

export const CONNECTED_JOURNEY = {
  drugId: "bevacizumab",
  question:
    "What is the recommended dosing for bevacizumab for metastatic colorectal cancer with FOLFOX4?",
  /** The source row directly answers the selected labeled indication. */
  exactAnswerLine:
    "FOLFOX4 (ie, oxaliplatin, 5-FU, leucovorin): 10 mg/kg IV q2Weeks",
  anchor:
    "adult-dosing-uses.in-combination-with-fluorouracil-based-chemotherapy",
  aiAnswer:
    "For metastatic colorectal carcinoma in combination with FOLFOX4, the POC monograph lists bevacizumab 10 mg/kg IV every 2 weeks [1]. For an 80 kg patient, that regimen calculates to 800 mg per infusion; use the calculator to review the arithmetic for a selected listed regimen.",
  citations: [
    {
      anchor:
        "adult-dosing-uses.in-combination-with-fluorouracil-based-chemotherapy",
      marker: 1,
    },
  ],
  actions: {
    applyPatientContext: "Add patient details",
    checkInteractions: "Check interactions",
    compare: "Compare with ramucirumab",
  },
  patientContextQuestion: "Calculate the bevacizumab dose for an 80 kg patient with metastatic colorectal cancer receiving FOLFOX4.",
  compareQuestion: "Compare bevacizumab with ramucirumab for metastatic colorectal cancer.",
} as const;

// ─── Moment 2 — patient context ─────────────────────────────────────────────────

export type PatientContextField = {
  id: string;
  label: string;
  /** Prefilled scripted value (editable in the panel). */
  value: string;
  unit?: string;
  /** Plausibility bounds for inline validation (numeric fields only). */
  min?: number;
  max?: number;
  /** Copy shown when the value fails validation. */
  validationMessage?: string;
};

/** POC-backed inputs for the shared patient-context calculator in V2. */
export const ONCOLOGY_DOSE_CONTEXT = {
  calculationLabel: "80 kg × 10 mg/kg",
  confirmPrompt:
    "Confirm the patient details used for this labeled oncology-dose calculation.",
  doseLine: "10 mg/kg IV q2Weeks with FOLFOX4",
  fields: [
    {
      id: "weight",
      label: "Body weight",
      max: 350,
      min: 25,
      unit: "kg",
      validationMessage: "Enter a body weight between 25 and 350 kg.",
      value: "80",
    },
    {
      id: "regimen",
      label: "Labeled regimen",
      value: "mCRC with FOLFOX4",
    },
  ] satisfies PatientContextField[],
  mgPerKg: 10,
  resultLabel: "Calculated labeled dose",
  sourceAnchor:
    "adult-dosing-uses.in-combination-with-fluorouracil-based-chemotherapy",
  sourceLine:
    "FOLFOX4 (ie, oxaliplatin, 5-FU, leucovorin): 10 mg/kg IV q2Weeks",
  summary: "The displayed amount is based on the confirmed body weight and the selected POC monograph row.",
} as const;

export type PatientCriterionRow = {
  /** Published criterion, verbatim threshold. */
  criterion: string;
  /** The confirmed patient value shown against it. */
  patientValue: string;
  /** Deterministic match verdict for the scripted values. */
  matches: boolean;
};

export const PATIENT_CONTEXT = {
  confirmPrompt: "Confirm the patient details used for this criteria check.",
  /** Clarify-style prompt shown above the composer once the first answer has
   * fully rendered — the physician enters values for THIS check only. */
  promptTitle: "Apply patient details to run the 2.5 mg BID criteria check?",
  promptHint:
    "Values are used for this check only and are not saved for later questions.",
  fields: [
    {
      id: "age",
      label: "Age",
      max: 120,
      min: 18,
      unit: "years",
      validationMessage: "Enter an age between 18 and 120 years.",
      value: "82",
    },
    {
      id: "weight",
      label: "Weight",
      max: 350,
      min: 25,
      unit: "kg",
      validationMessage: "Enter a weight between 25 and 350 kg.",
      value: "58",
    },
    {
      id: "scr",
      label: "Serum creatinine",
      max: 20,
      min: 0.2,
      unit: "mg/dL",
      validationMessage: "Enter a serum creatinine between 0.2 and 20 mg/dL.",
      value: "1.6",
    },
    {
      id: "crcl",
      label: "CrCl",
      max: 200,
      min: 1,
      unit: "mL/min",
      validationMessage: "Enter a CrCl between 1 and 200 mL/min.",
      value: "24",
    },
    {
      id: "indication",
      label: "Indication",
      value: "Nonvalvular atrial fibrillation",
    },
  ] satisfies PatientContextField[],
  /** Field ids required for the 2-of-3 criteria check. */
  requiredCriteriaFieldIds: ["age", "weight", "scr"],
  missingInputTitle: "More information needed",
  missingInputBody:
    "The 2.5 mg BID dose-reduction check needs at least two of: age, body weight, or serum creatinine. Add the missing values to run the published criteria match.",
  crclOnlyNote:
    "CrCl alone does not determine the AF dose-reduction criteria — the published rule is based on age, body weight, and serum creatinine.",
  result: {
    label: "Published criteria match",
    /** Verbatim monograph dose line (POC: Nonvalvular Atrial Fibrillation row). */
    doseLine:
      "Decrease dose to 2.5 mg PO BID in patients with any 2 of the following characteristics:",
    /** Verbatim standard dose (POC: Stroke Prophylaxis With Atrial Fibrillation
     * row) — shown when the rule is NOT met. */
    standardDoseLine: "5 mg PO BID.",
    notMetNote:
      "Fewer than 2 of the 3 dose-reduction characteristics are met — the standard dose applies.",
    summary: "3 of 3 dose-reduction characteristics matched",
    criteria: [
      { criterion: "Age ≥80 years", matches: true, patientValue: "82 years" },
      { criterion: "Weight ≤60 kg", matches: true, patientValue: "58 kg" },
      {
        criterion: "Serum creatinine ≥1.5 mg/dL",
        matches: true,
        patientValue: "1.6 mg/dL",
      },
    ] satisfies PatientCriterionRow[],
    renalGuidance: {
      patientValue: "CrCl 24 mL/min",
      /** Canonical guidance from the POC Renal impairment row — mild-to-moderate
       * renal impairment requires no adjustment by itself; SCr ≥1.5 mg/dL
       * counts toward the any-2 rule instead. */
      note: "Renal function alone does not set the AF dose: mild-to-moderate renal impairment requires no dosage adjustment. Serum creatinine ≥1.5 mg/dL counts toward the any-2-characteristics dose-reduction rule instead.",
      anchor: "adult-dosing-uses.renal-impairment",
    },
    trace: {
      rule: "Decrease dose to 2.5 mg PO BID when any 2 of 3 characteristics are met (age ≥80 y, weight ≤60 kg, SCr ≥1.5 mg/dL).",
      sourceAnchors: [
        "adult-dosing-uses.nonvalvular-atrial-fibrillation",
        "adult-dosing-uses.renal-impairment",
      ],
    },
  },
  actions: {
    cancel: "Cancel",
    clear: "Clear patient context",
    confirm: "Confirm and apply",
    edit: "Edit patient details",
    editValues: "Edit values",
    openSources: "Open source rows",
  },
  scopeNote: "Patient details apply to this task only and are cleared on reset.",
};

// Clarifying-question steps for the patient-details composer state — one
// compact question at a time (Vera-style), rendered INSIDE the input field.
// Value steps reuse the same plausibility bounds as PATIENT_CONTEXT.fields.
export type PatientClarifyStep =
  | {
      id: string;
      kind: "value";
      question: string;
      unit?: string;
      min?: number;
      max?: number;
      validationMessage?: string;
      optional?: boolean;
    }
  | {
      id: string;
      kind: "options";
      question: string;
      options: string[];
      /** Adds a "Something else" row that opens an inline free-text input. */
      allowOther?: boolean;
    };

function clarifyValueStep(
  fieldId: string,
  question: string,
  optional = false,
): PatientClarifyStep {
  const field = PATIENT_CONTEXT.fields.find((f) => f.id === fieldId)!;
  return {
    id: field.id,
    kind: "value",
    max: field.max,
    min: field.min,
    optional,
    question,
    unit: field.unit,
    validationMessage: field.validationMessage,
  };
}

export const PATIENT_CLARIFY_STEPS: PatientClarifyStep[] = [
  clarifyValueStep("age", "Patient age?"),
  clarifyValueStep("weight", "Patient weight?"),
  clarifyValueStep("scr", "Serum creatinine?"),
  clarifyValueStep("crcl", "Creatinine clearance? (optional)", true),
  {
    allowOther: true,
    id: "indication",
    kind: "options",
    options: ["Nonvalvular atrial fibrillation", "DVT / PE treatment"],
    question: "Indication?",
  },
];

export const ONCOLOGY_DOSE_CLARIFY_STEPS: PatientClarifyStep[] = [
  {
    id: "weight",
    kind: "value",
    max: 350,
    min: 25,
    question: "Patient body weight?",
    unit: "kg",
    validationMessage: "Enter a body weight between 25 and 350 kg.",
  },
  {
    id: "regimen",
    kind: "options",
    options: ["mCRC with FOLFOX4"],
    question: "Confirm the labeled regimen",
  },
];

// Deterministic criteria evaluation — canonical thresholds from the POC
// Nonvalvular Atrial Fibrillation row (any 2 of: age ≥80 y, weight ≤60 kg,
// SCr ≥1.5 mg/dL) and the Renal impairment row (DVT/PE not studied below
// CrCl 15 mL/min). No
// LLM, no scoring: plain threshold comparison so edited values re-run the rule.
export type PatientCriteriaEvaluation = {
  criteria: PatientCriterionRow[];
  knownCount: number;
  matchedCount: number;
  /** True when the any-2-of-3 dose-reduction rule is met. */
  reductionApplies: boolean;
  /** True when CrCl is below 15 mL/min — the range the monograph marks as not
   * studied (DVT/PE); ESRD-on-hemodialysis dosing applies for AF. */
  crclBelowStudiedThreshold: boolean;
  summary: string;
};

export function evaluateDoseReductionCriteria(values: {
  age?: number;
  weight?: number;
  scr?: number;
  crcl?: number;
}): PatientCriteriaEvaluation {
  const rows: PatientCriterionRow[] = [];
  let known = 0;
  const push = (criterion: string, value: number | undefined, unit: string, matches: boolean) => {
    if (value === undefined || Number.isNaN(value)) {
      rows.push({ criterion, matches: false, patientValue: "Not provided" });
      return;
    }
    known += 1;
    rows.push({ criterion, matches, patientValue: `${value} ${unit}` });
  };
  push("Age ≥80 years", values.age, "years", (values.age ?? 0) >= 80);
  push("Weight ≤60 kg", values.weight, "kg", (values.weight ?? Infinity) <= 60);
  push("Serum creatinine ≥1.5 mg/dL", values.scr, "mg/dL", (values.scr ?? 0) >= 1.5);
  const matched = rows.filter((r) => r.matches).length;
  return {
    criteria: rows,
    crclBelowStudiedThreshold: values.crcl !== undefined && values.crcl < 15,
    knownCount: known,
    matchedCount: matched,
    reductionApplies: matched >= 2,
    summary: `${matched} of 3 dose-reduction characteristics matched`,
  };
}

// ─── Moment 3 — comparison ──────────────────────────────────────────────────────

export type ComparisonCell = {
  /** Monograph subfield anchor whose complete body is shown. */
  anchor: string;
  /** Optional deterministic patient-context applicability note (canonical
   * thresholds applied to the confirmed values — not a recommendation). */
  patientNote?: string;
  /** Set when the fixture lacks the field — cell renders "Not stated in this monograph". */
  notStated?: boolean;
};

export type ComparisonTopic = {
  id: string;
  title: string;
  cells: {
    left: ComparisonCell;
    right: ComparisonCell;
  };
};

export const COMPARISON = {
  drugIds: { left: "bevacizumab", right: "ramucirumab" },
  intro: {
    description:
      "Compare the two anti-angiogenic therapies below in the metastatic colorectal cancer context. Full prescribing information is available after the comparison table.",
    question: "Compare bevacizumab with ramucirumab for metastatic colorectal cancer",
  },
  topics: [
    {
      cells: {
        left: {
          anchor:
            "adult-dosing-uses.in-combination-with-fluorouracil-based-chemotherapy",
        },
        right: { anchor: "adult-dosing-uses.colorectal-cancer" },
      },
      id: "mcrc-dosing",
      title: "mCRC setting and dose",
    },
    {
      cells: {
        left: { anchor: "contraindications-cautions.cautions" },
        right: { anchor: "warnings.cautions" },
      },
      id: "hemorrhage",
      title: "Hemorrhage risk",
    },
    {
      cells: {
        left: { anchor: "contraindications-cautions.wound-healing" },
        right: { anchor: "adult-dosing-uses.wound-healing" },
      },
      id: "wound-healing",
      title: "Surgery and wound healing",
    },
    {
      cells: {
        left: { anchor: "drug-interactions.monitor-closely" },
        right: { anchor: "warnings.cautions", notStated: true },
      },
      id: "interaction-information",
      title: "Interaction information",
    },
  ] satisfies ComparisonTopic[],
};

// ─── Moment 4 — peer-search context (MOCKED) ────────────────────────────────────

export type PeerContextTopic = {
  /** Comparison topic id this chip moves the table to. */
  comparisonTopicId: string;
  id: string;
  label: string;
  /** Illustrative rank within the prototype cohort. */
  rank: number;
};

export type PeerComparedAlternative = {
  drugClass: string;
  id: string;
  name: string;
  /** Illustrative rank within the prototype cohort. */
  rank: number;
};

export const PEER_CONTEXT = {
  header: "Commonly reviewed by oncology clinicians",
  behaviorLabel: "Aggregated peer search behavior",
  body: "Based on aggregated Medscape searches and monograph views from the past 90 days, these are the topics oncology clinicians most often review when comparing VEGF-pathway therapies.",
  explanation:
    "This reflects aggregated Medscape search and monograph-view activity. It does not report prescribing behavior or drug preference.",
  topics: [
    {
      comparisonTopicId: "mcrc-dosing",
      id: "treatment-setting",
      label: "Treatment setting and dose",
      rank: 1,
    },
    {
      comparisonTopicId: "hemorrhage",
      id: "hemorrhage-risk",
      label: "Hemorrhage risk",
      rank: 2,
    },
    { comparisonTopicId: "wound-healing", id: "wound-healing", label: "Wound healing", rank: 3 },
  ] satisfies PeerContextTopic[],
  alternativesHeader: "Frequently compared alternatives",
  alternativesDescription:
    "Other oncology therapies that appear in comparison searches for this treatment context. Order indicates search frequency, not clinical preference.",
  alternatives: [
    {
      drugClass: "VEGFR2 antagonist",
      id: "ramucirumab",
      name: "Ramucirumab",
      rank: 1,
    },
    {
      drugClass: "VEGF trap",
      id: "ziv-aflibercept",
      name: "Ziv-aflibercept",
      rank: 2,
    },
    {
      drugClass: "VEGFR inhibitor",
      id: "fruquintinib",
      name: "Fruquintinib",
      rank: 3,
    },
  ] satisfies PeerComparedAlternative[],
};

// ─── Scenario 2 — regimen interaction check ─────────────────────────────────────

export type RegimenDrugChip = {
  id: string;
  /** Normalized canonical name shown on the chip. */
  name: string;
  /** Raw text AI extracted the drug from. */
  rawText: string;
  /** Registry drug id when a monograph exists (links the chip to a card). */
  drugId?: string;
  /** Ambiguous extraction — the physician must pick a resolution. */
  ambiguousOptions?: string[];
  /** Duplicate of another entry — merged with a visible notice. */
  duplicateOf?: string;
};

export type RegimenPairResult = {
  /** Severity group heading for the prototype's deterministic risk display. */
  severity: "Contraindicated" | "Serious" | "Monitor Closely" | "Minor";
  tool: DrugToolResult;
  /** Monograph source anchor for the interaction statement. */
  source: { drugId: string; anchor: string };
};

export const REGIMEN_CHECK = {
  question:
    "Review this regimen: bevacizumab, amlodipine, and atezolizumab.",
  recognizedLabel: "3 medications recognized",
  severityDisclaimer: "Prototype — regimen-risk review; not a substitute for oncology/pharmacy review",
  drugs: [
    { drugId: "bevacizumab", id: "bevacizumab", name: "Bevacizumab", rawText: "bevacizumab" },
    { id: "amlodipine", name: "Amlodipine", rawText: "amlodipine" },
    { id: "atezolizumab", name: "Atezolizumab", rawText: "atezolizumab" },
  ] satisfies RegimenDrugChip[],
  /** Extra chips demonstrating the required edge states when the physician
   * edits the list ("add a drug" flow). */
  ambiguousCandidate: {
    ambiguousOptions: ["Capecitabine (Xeloda)", "Carboplatin (Paraplatin)"],
    id: "cap-ambiguous",
    name: "“cap”",
    rawText: "cap",
  } satisfies RegimenDrugChip,
  duplicateCandidate: {
    duplicateOf: "bevacizumab",
    id: "avastin-duplicate",
    name: "Avastin",
    rawText: "Avastin",
  } satisfies RegimenDrugChip,
  duplicateNotice:
    "Avastin is a brand name for bevacizumab, which is already on the list — the two entries were merged.",
  pairs: [
    {
      severity: "Monitor Closely",
      source: { anchor: "drug-interactions.monitor-closely", drugId: "bevacizumab" },
      tool: {
        kind: "interaction",
        lines: [
          "Amlodipine: Monitor BP.",
          "The POC monograph also advises monitoring blood pressure and treating hypertension during bevacizumab therapy.",
        ],
        pair: ["Bevacizumab", "Amlodipine"],
        severity: "Monitor Closely",
        summary:
          "Monitor blood pressure for this POC-listed combination.",
        title: "Regimen risk check",
      },
    },
    {
      severity: "Minor",
      source: { anchor: "adult-dosing-uses.hepatocellular-carcinoma", drugId: "bevacizumab" },
      tool: {
        kind: "interaction",
        lines: [
          "For unresectable or metastatic hepatocellular carcinoma, the POC monograph lists bevacizumab with atezolizumab for patients without prior systemic therapy.",
          "The listed regimen gives bevacizumab on Day 1 after atezolizumab and repeats every 3 weeks.",
        ],
        pair: ["Bevacizumab", "Atezolizumab"],
        severity: "Minor",
        summary:
          "This is a labeled oncology combination for a specific HCC indication, not a general interaction clearance.",
        title: "Protocol context",
      },
    },
  ] satisfies RegimenPairResult[],
  noInteractionNote:
    "No known interactions were found for the remaining pairs in this list.",
};

// ─── Scenario 3 — monograph change alert (MOCKED versions) ──────────────────────

export type MonographDiffLine = {
  kind: "added" | "removed";
  text: string;
};

export type MonographChangeSection = {
  anchor: string;
  /** Focused old-versus-current diff. Current lines must match the fixture. */
  diff: MonographDiffLine[];
  sectionTitle: string;
};

export const MONOGRAPH_UPDATE = {
  drugId: "bevacizumab",
  badge: "Updated since you last viewed",
  changedSectionsLabel: "2 sections changed",
  lastViewedDate: "Jun 4, 2026 (prototype date)",
  actions: {
    dismiss: "Dismiss",
    openMonograph: "Open current monograph",
    review: "See what changed",
  },
  sections: [
    {
      anchor: "contraindications-cautions.wound-healing",
      diff: [
        {
          kind: "removed",
          text: "Hold bevacizumab around surgery according to the prior local protocol.",
        },
        {
          kind: "added",
          text: "Withhold for at least 28 days prior to elective surgery. Do not administer for at least 28 days following surgery and until the wound is fully healed.",
        },
      ],
      sectionTitle: "Contraindications & Cautions — Wound healing",
    },
    {
      anchor: "contraindications-cautions.cautions",
      diff: [
        {
          kind: "removed",
          text: "Monitor blood pressure during therapy.",
        },
        {
          kind: "added",
          text: "Monitor blood pressure and treat hypertension; increased risk for severe hypertension; temporarily suspend treatment; discontinue if hypertensive crisis or hypertensive encephalopathy.",
        },
      ],
      sectionTitle: "Contraindications & Cautions — Cautions",
    },
  ] satisfies MonographChangeSection[],
};

// ─── Composer matching ──────────────────────────────────────────────────────────
// The prototype is scripted: free text either advances the connected journey,
// starts a scenario, or falls through to the "preset scenarios" notice.

export type ScriptedUtterance =
  | { kind: "start-scenario"; scenarioId: DrugIntelligenceScenarioId }
  | { kind: "patient-context" }
  | { kind: "compare" };

export function matchDrugIntelligenceUtterance(query: string): ScriptedUtterance | undefined {
  const lower = query.toLowerCase();
  const hits = (...terms: string[]) => terms.every((t) => lower.includes(t));
  if (hits("bevacizumab") || hits("avastin") || hits("folfox")) {
    return { kind: "start-scenario", scenarioId: "connected-bevacizumab" };
  }
  if (hits("medication list") || hits("interactions:") || hits("regimen")) {
    return { kind: "start-scenario", scenarioId: "bevacizumab-regimen-check" };
  }
  if (hits("changed") || hits("what changed") || hits("update")) {
    return { kind: "start-scenario", scenarioId: "bevacizumab-monograph-update" };
  }
  if (hits("patient") && (hits("weight") || hits("folfox") || hits("mcrc"))) {
    return { kind: "patient-context" };
  }
  if (hits("compare") || hits("ramucirumab")) {
    return { kind: "compare" };
  }
  return undefined;
}

export const SCRIPTED_FALLBACK_NOTICE =
  "This prototype plays preset drug-intelligence scenarios. Choose Scenarios in the header to explore another path.";
