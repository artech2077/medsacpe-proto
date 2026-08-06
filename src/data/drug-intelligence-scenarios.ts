// Drug Intelligence V2 — scripted scenario data for /ai-drug-mono-v2.
// Implements the Connected Drug Intelligence prototype prompt (2026-07-16) and
// the 2026-07-23 Final Drug Intelligence Prototype Plan: one connected apixaban
// journey (change alert + exact answer → patient context → comparison + peer
// context → regimen interaction check). The focused regimen-check and
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
  | "connected-apixaban"
  | "regimen-check"
  | "monograph-update";

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
      "One stakeholder walkthrough: monograph update alert, exact 2.5 mg BID criteria, patient context, rivaroxaban comparison, peer-search context, and a regimen interaction check — all in one cumulative thread.",
    group: "Primary",
    id: "connected-apixaban",
    startingQuestion: "What are the apixaban 2.5 mg twice-daily criteria?",
    title: "Complete drug-intelligence walkthrough",
  },
  {
    description:
      "Paste a medication list, confirm the drugs AI extracted, then review DIMS-backed interactions grouped by severity.",
    group: "Regimen",
    id: "regimen-check",
    startingQuestion:
      "Check this medication list for interactions: apixaban, ketoconazole, lisinopril, sertraline, and ibuprofen.",
    title: "Check a medication regimen",
  },
  {
    description:
      "Return to a frequently viewed drug, see which sections changed since your last visit, and jump to the updated content.",
    group: "Updates",
    id: "monograph-update",
    startingQuestion: "Open apixaban — what changed since I last viewed it?",
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
  drugId: "apixaban",
  question: "What are the apixaban 2.5 mg twice-daily criteria?",
  /** Verbatim condensation of the Nonvalvular Atrial Fibrillation dosing body
   * (POC anchor below) — words and numbers unchanged, labeled "From the
   * Medscape monograph" in the UI. */
  exactAnswerLine:
    "Decrease dose to 2.5 mg PO BID in patients with any 2 of the following characteristics: Age ≥80 years, Weight ≤60 kg, Serum creatinine ≥1.5 mg/dL.",
  // POC anchors (drug-monograph-poc-scenarios.ts): the any-2 criteria live in
  // the Nonvalvular Atrial Fibrillation dosing row; renal guidance in the
  // Renal impairment row.
  anchor: "adult-dosing-uses.nonvalvular-atrial-fibrillation",
  renalAnchor: "adult-dosing-uses.renal-impairment",
  /** Complementary AI synthesis shown (labeled) below the canonical card; [n]
   * markers cite the anchors below. Kept from the scripted flow; re-cited to
   * the POC rows. */
  aiAnswer:
    "For nonvalvular AF, decrease the apixaban dose to 2.5 mg PO BID in patients with any 2 of the following characteristics: age ≥80 years, weight ≤60 kg, or serum creatinine ≥1.5 mg/dL [1]. The standard dose is otherwise 5 mg PO BID [2].",
  citations: [
    { anchor: "adult-dosing-uses.nonvalvular-atrial-fibrillation", marker: 1 },
    { anchor: "adult-dosing-uses.stroke-prophylaxis-with-atrial-fibrillation", marker: 2 },
  ],
  actions: {
    applyPatientContext: "Apply patient details",
    checkInteractions: "Check interactions",
    compare: "Compare with rivaroxaban",
  },
  patientContextQuestion:
    "My patient is 82, weighs 58 kg, serum creatinine is 1.6 mg/dL, and CrCl is 24 mL/min.",
  compareQuestion: "Compare this with rivaroxaban.",
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
    apixaban: ComparisonCell;
    rivaroxaban: ComparisonCell;
  };
};

export const COMPARISON = {
  drugIds: { left: "apixaban", right: "rivaroxaban" },
  intro: {
    description:
      "Check the comparison between the two drugs below. Full drug information can be found after the comparison table for apixaban and rivaroxaban.",
    question: "Compare apixaban with rivaroxaban",
  },
  topics: [
    {
      cells: {
        apixaban: { anchor: "adult-dosing-uses.stroke-prophylaxis-with-atrial-fibrillation" },
        rivaroxaban: { anchor: "adult-dosing-uses.stroke-prophylaxis-with-atrial-fibrillation" },
      },
      id: "afib-dosing",
      title: "AFib dosing",
    },
    {
      cells: {
        apixaban: {
          anchor: "adult-dosing-uses.renal-impairment",
          patientNote:
            "Confirmed CrCl 24 mL/min — mild-to-moderate impairment requires no dosage adjustment by itself; the dose is set by the any-2-characteristics rule.",
        },
        rivaroxaban: {
          anchor: "adult-dosing-uses.renal-impairment",
          patientNote:
            "Confirmed CrCl 24 mL/min falls in the published 15–50 mL/min band (15 mg once daily with the evening meal).",
        },
      },
      id: "renal-adjustment",
      title: "Renal adjustment",
    },
    {
      cells: {
        apixaban: { anchor: "warnings.contraindications" },
        rivaroxaban: { anchor: "warnings.contraindications" },
      },
      id: "contraindications",
      title: "Contraindications / major warnings",
    },
    {
      cells: {
        apixaban: { anchor: "adult-dosing-uses.coadministration-with-dual-inhibitors-of-cyp3a4-and-p-gp" },
        rivaroxaban: { anchor: "adult-dosing-uses.use-with-p-gp-and-strong-cyp3a4-inhibitors-and-inducers" },
      },
      id: "interactions",
      title: "Important interactions",
    },
    {
      cells: {
        apixaban: { anchor: "warnings.reversing-apixaban-effect" },
        rivaroxaban: { anchor: "warnings.reversing-anticoagulant-effect" },
      },
      id: "reversal",
      title: "Reversal",
    },
    {
      cells: {
        apixaban: { anchor: "adverse-effects.adults" },
        rivaroxaban: { anchor: "adverse-effects.major-bleeding" },
      },
      id: "adverse-effects",
      title: "Major adverse effects",
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
  header: "Commonly reviewed by cardiologists",
  behaviorLabel: "Aggregated peer search behavior",
  body: "Based on aggregated Medscape searches and monograph views from the past 90 days, these are the topics cardiologists most often review when comparing oral anticoagulants.",
  explanation:
    "This reflects aggregated Medscape search and monograph-view activity. It does not report prescribing behavior or drug preference.",
  topics: [
    {
      comparisonTopicId: "renal-adjustment",
      id: "renal-dosing",
      label: "Renal dosing",
      rank: 1,
    },
    {
      comparisonTopicId: "adverse-effects",
      id: "bleeding-risk",
      label: "Bleeding risk",
      rank: 2,
    },
    { comparisonTopicId: "reversal", id: "reversal", label: "Reversal", rank: 3 },
  ] satisfies PeerContextTopic[],
  alternativesHeader: "Frequently compared alternatives",
  alternativesDescription:
    "Other anticoagulants that appear in comparison searches for this class. Order indicates search frequency, not clinical preference.",
  alternatives: [
    {
      drugClass: "Direct thrombin inhibitor",
      id: "dabigatran",
      name: "Dabigatran",
      rank: 1,
    },
    {
      drugClass: "Factor Xa inhibitor",
      id: "edoxaban",
      name: "Edoxaban",
      rank: 2,
    },
    {
      drugClass: "Vitamin K antagonist",
      id: "warfarin",
      name: "Warfarin",
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
  /** Severity group heading (provisional DIMS tiers). */
  severity: "Contraindicated" | "Serious" | "Monitor Closely" | "Minor";
  tool: DrugToolResult;
  /** Monograph source anchor for the interaction statement. */
  source: { drugId: string; anchor: string };
};

export const REGIMEN_CHECK = {
  question:
    "Check this medication list for interactions: apixaban, ketoconazole, lisinopril, sertraline, and ibuprofen.",
  recognizedLabel: "5 medications recognized",
  severityDisclaimer: "Prototype — provisional DIMS tiers",
  drugs: [
    { drugId: "apixaban", id: "apixaban", name: "Apixaban", rawText: "apixaban" },
    { id: "ketoconazole", name: "Ketoconazole", rawText: "ketoconazole" },
    { id: "lisinopril", name: "Lisinopril", rawText: "lisinopril" },
    { id: "sertraline", name: "Sertraline", rawText: "sertraline" },
    { id: "ibuprofen", name: "Ibuprofen", rawText: "ibuprofen" },
  ] satisfies RegimenDrugChip[],
  /** Extra chips demonstrating the required edge states when the physician
   * edits the list ("add a drug" flow). */
  ambiguousCandidate: {
    ambiguousOptions: ["Diltiazem (Cardizem)", "Diazepam (Valium)"],
    id: "dilt-ambiguous",
    name: "“dilt”",
    rawText: "dilt",
  } satisfies RegimenDrugChip,
  duplicateCandidate: {
    duplicateOf: "apixaban",
    id: "eliquis-duplicate",
    name: "Eliquis",
    rawText: "Eliquis",
  } satisfies RegimenDrugChip,
  duplicateNotice:
    "Eliquis is the brand name for apixaban, which is already on the list — the two entries were merged.",
  pairs: [
    {
      severity: "Serious",
      source: {
        anchor: "adult-dosing-uses.coadministration-with-dual-inhibitors-of-cyp3a4-and-p-gp",
        drugId: "apixaban",
      },
      tool: {
        kind: "interaction",
        lines: [
          "Ketoconazole is a strong dual inhibitor of CYP3A4 and P-gp.",
          "If taking >2.5 mg PO BID, decrease apixaban dose by 50%.",
          "If taking 2.5 mg BID, avoid coadministration with strong dual inhibitors.",
        ],
        pair: ["Apixaban", "Ketoconazole"],
        severity: "Serious",
        summary:
          "Strong dual CYP3A4 and P-gp inhibition increases apixaban exposure and bleeding risk — dose modification or avoidance required.",
        title: "Interaction check",
      },
    },
    {
      severity: "Monitor Closely",
      source: { anchor: "warnings.cautions", drugId: "apixaban" },
      tool: {
        kind: "interaction",
        lines: [
          "SSRIs are among the drugs affecting hemostasis that increase bleeding risk with apixaban.",
          "Advise patients of signs and symptoms of blood loss and to report them immediately.",
        ],
        pair: ["Apixaban", "Sertraline"],
        severity: "Monitor Closely",
        summary:
          "Concomitant SSRIs increase bleeding risk with apixaban; monitor for signs of blood loss.",
        title: "Interaction check",
      },
    },
    {
      severity: "Monitor Closely",
      source: { anchor: "warnings.cautions", drugId: "apixaban" },
      tool: {
        kind: "interaction",
        lines: [
          "NSAIDs are among the drugs affecting hemostasis that increase bleeding risk with apixaban.",
          "Advise patients of signs and symptoms of blood loss and to report them immediately.",
        ],
        pair: ["Apixaban", "Ibuprofen"],
        severity: "Monitor Closely",
        summary:
          "Coadministration with NSAIDs increases bleeding risk; monitor for signs of blood loss.",
        title: "Interaction check",
      },
    },
    {
      severity: "Minor",
      source: { anchor: "warnings.cautions", drugId: "apixaban" },
      tool: {
        kind: "interaction",
        lines: [
          "NSAIDs may blunt the antihypertensive effect of ACE inhibitors.",
          "Monitor blood pressure and renal function with sustained combined use.",
        ],
        pair: ["Lisinopril", "Ibuprofen"],
        severity: "Minor",
        summary:
          "NSAIDs can reduce the antihypertensive effect of lisinopril and affect renal function.",
        title: "Interaction check",
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
  drugId: "apixaban",
  badge: "Updated since you last viewed",
  changedSectionsLabel: "2 sections changed",
  /** Clearly mocked last-view date; the Andexxa change is the real December
   * 2025 monograph update, so the mocked last view predates it. */
  lastViewedDate: "Nov 3, 2025 (prototype date)",
  actions: {
    dismiss: "Dismiss",
    openMonograph: "Open current monograph",
    review: "See what changed",
  },
  sections: [
    {
      anchor: "warnings.reversing-apixaban-effect",
      diff: [
        {
          kind: "removed",
          text: "Coagulation factor Xa, recombinant (Andexxa) is an FDA-approved reversal agent for apixaban.",
        },
        {
          kind: "added",
          text: "Coagulation factor Xa, recombinant (Andexxa) is no longer available for reversal of anticoagulation in patients taking apixaban owing to postmarketing safety data on thromboembolic events (December 2025).",
        },
      ],
      sectionTitle: "Safety & Warnings — Bleeding Risk & Reversal",
    },
    {
      anchor: "adult-dosing-uses.renal-impairment",
      diff: [
        {
          kind: "removed",
          text: "Use in patients with ESRD has not been studied; no dosing recommendation can be made.",
        },
        {
          kind: "added",
          text: "ESRD maintained on hemodialysis: 5 mg BID; decrease dose to 2.5 mg BID if 1 additional characteristic of age ≥80 years or weight ≤60 kg is present.",
        },
      ],
      sectionTitle: "Dosing & Uses — Renal Impairment",
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
  if (hits("2.5") || hits("criteria") || hits("apixaban", "twice")) {
    return { kind: "start-scenario", scenarioId: "connected-apixaban" };
  }
  if (hits("medication list") || hits("interactions:") || hits("regimen")) {
    return { kind: "start-scenario", scenarioId: "regimen-check" };
  }
  if (hits("changed") || hits("what changed") || hits("update")) {
    return { kind: "start-scenario", scenarioId: "monograph-update" };
  }
  if (hits("patient") && (hits("82") || hits("weighs") || hits("creatinine"))) {
    return { kind: "patient-context" };
  }
  if (hits("compare") || hits("rivaroxaban")) {
    return { kind: "compare" };
  }
  return undefined;
}

export const SCRIPTED_FALLBACK_NOTICE =
  "This prototype plays preset drug-intelligence scenarios. Choose Scenarios in the header to explore another path.";
