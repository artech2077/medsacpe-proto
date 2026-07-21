// Drug Response Contract — typed mock data for drug concept prototypes.
// Exports apixaban monograph plus a DRUG_MONOGRAPH_REGISTRY for multi-drug support.
// Do NOT inline drug strings in screen or component files.

export type DrugMonographSource = {
  label: string;
  section: string;
  url: string;
};

export type DrugSubfield = {
  body: string[];
  id: string;
  /** Restricts the subfield to an Adult/Pediatric toggle (Concept J). Omit for
   * subfields that apply to both populations — they show under either tab. */
  population?: "adult" | "pediatric";
  source: DrugMonographSource;
  summary: string;
  title: string;
};

export type DrugSection = {
  id: string;
  lengthEstimate: "long" | "short";
  subfields: DrugSubfield[];
  title: string;
};

export type DrugBlackBoxWarning = {
  id: string;
  source: DrugMonographSource;
  text: string;
};

// Concept F: compact default card
export type DrugKeyField = {
  label: string;
  subfieldId: string;
};

// Concept D: task chip → subfield mapping
export type DrugTaskChip = {
  id: string;
  label: string;
  subfieldIds: string[];
};

export type DrugSynthesizedAnswer = {
  citations: { anchor: string; marker: number }[];
  followUpQuestions?: string[];
  text: string;
};

export type DrugMonograph = {
  blackBoxWarnings: DrugBlackBoxWarning[];
  drug: {
    drugClass: string;
    id: string;
    name: string;
    /** Live reference.medscape.com monograph URL — "Full X in monograph"
     * links open this in a new tab when present. */
    referenceUrl?: string;
  };
  keyFields: DrugKeyField[];
  sections: DrugSection[];
  synthesizedAnswers: Record<string, DrugSynthesizedAnswer>;
  taskChips: DrugTaskChip[];
};

const drugRefSource = (section: string): DrugMonographSource => ({
  label: "Drug Reference",
  section,
  url: "#drug-reference",
});

export const apixabanMonograph: DrugMonograph = {
  blackBoxWarnings: [
    {
      id: "bbw_premature_discontinuation",
      source: drugRefSource("Boxed Warning"),
      text: "Premature discontinuation of any oral anticoagulant, including apixaban, increases the risk of thrombotic events. If apixaban is discontinued for a reason other than pathological bleeding or completion of a course of therapy, consider coverage with another anticoagulant.",
    },
  ],

  drug: {
    drugClass: "Factor Xa inhibitor",
    id: "apixaban",
    name: "Apixaban",
  },

  keyFields: [
    { label: "Standard AFib Dose", subfieldId: "dosing.afib" },
    { label: "Contraindications", subfieldId: "safety.contraindications" },
    { label: "Key Interactions", subfieldId: "interactions.cyp3a4_pgp" },
    { label: "Bleeding Risk", subfieldId: "safety.bleeding_risk" },
  ],

  sections: [
    {
      id: "dosing",
      lengthEstimate: "long",
      subfields: [
        {
          body: [
            "Standard dose: 5 mg PO BID.",
            "Dose reduction to 2.5 mg PO BID is required in patients with nonvalvular AF who have at least 2 of the following characteristics: age ≥80 years, body weight ≤60 kg, or serum creatinine ≥1.5 mg/dL.",
            "Duration: continue indefinitely in patients with persistent AF unless contraindicated.",
          ],
          id: "dosing.afib",
          source: drugRefSource("Dosing > Nonvalvular Atrial Fibrillation"),
          summary: "5 mg PO BID (standard); reduce to 2.5 mg BID if ≥2 of: age ≥80, wt ≤60 kg, SCr ≥1.5",
          title: "Nonvalvular Atrial Fibrillation",
        },
        {
          body: [
            "Reduce dose to 2.5 mg PO BID when the patient meets at least 2 of the following 3 criteria:",
            "1. Age ≥80 years",
            "2. Body weight ≤60 kg",
            "3. Serum creatinine ≥1.5 mg/dL (133 micromol/L)",
            "Apply only ONE dose reduction criterion at a time regardless of how many criteria are met beyond 2.",
          ],
          id: "dosing.dose_reduction",
          source: drugRefSource("Dosing > Dose Reduction Criteria"),
          summary: "Reduce to 2.5 mg BID if ≥2 of: age ≥80 y, weight ≤60 kg, SCr ≥1.5 mg/dL",
          title: "2.5 mg BID Dose-Reduction Criteria",
        },
        {
          body: [
            "DVT/PE treatment: 10 mg PO BID for 7 days, then 5 mg PO BID.",
            "Reduction of recurrence risk (after ≥6 months treatment): 2.5 mg PO BID.",
            "Prophylaxis following hip or knee replacement surgery: 2.5 mg PO BID; start 12–24 hours post-surgery.",
          ],
          id: "dosing.dvt_pe",
          source: drugRefSource("Dosing > DVT/PE"),
          summary: "10 mg PO BID × 7 days, then 5 mg PO BID; recurrence prevention 2.5 mg PO BID",
          title: "DVT / PE Treatment",
        },
        {
          body: [
            "No dose adjustment is recommended based on renal function alone in patients with nonvalvular AF, unless the patient meets the dose-reduction criteria (age, weight, SCr).",
            "Serum creatinine ≥1.5 mg/dL qualifies as one of the three dose-reduction criteria for AF; it does not mandate a standalone renal adjustment.",
            "Avoid use in patients with CrCl <15 mL/min or those on dialysis; clinical data are limited in this population.",
            "For DVT/PE: no specific renal dose adjustment; avoid if CrCl <15 mL/min.",
          ],
          id: "dosing.renal_adjustment",
          source: drugRefSource("Dosing > Renal Impairment"),
          summary: "No standalone renal adjustment for AFib; avoid if CrCl <15 mL/min or dialysis",
          title: "Renal Impairment",
        },
        {
          body: [
            "Mild-to-moderate hepatic impairment (Child-Pugh A or B): use with caution; no dose adjustment required.",
            "Severe hepatic impairment (Child-Pugh C): avoid use. Apixaban is contraindicated due to coagulopathy and increased bleeding risk.",
            "Patients with hepatic impairment have not been adequately studied in clinical trials.",
          ],
          id: "dosing.hepatic",
          source: drugRefSource("Dosing > Hepatic Impairment"),
          summary: "Avoid in severe hepatic impairment (Child-Pugh C); use with caution in mild–moderate",
          title: "Hepatic Impairment",
        },
        {
          body: [
            "Perioperative bridging is generally NOT recommended; apixaban has a predictable offset.",
            "For procedures with low bleeding risk: stop apixaban ≥24 hours before procedure.",
            "For procedures with high bleeding risk or spinal/epidural anesthesia: stop apixaban ≥48 hours before procedure.",
            "Restart as soon as hemostasis is achieved and the clinical situation allows.",
          ],
          id: "dosing.perioperative",
          source: drugRefSource("Dosing > Perioperative Management"),
          summary: "Stop ≥24 h before low-risk or ≥48 h before high-risk procedures; no bridging needed",
          title: "Perioperative Management",
        },
        {
          body: [
            "Administer with or without food.",
            "Tablets may be crushed and suspended in water, apple juice, or apple puree for patients unable to swallow whole tablets.",
            "If a dose is missed, take it as soon as possible on the same day. Do not double the dose.",
          ],
          id: "dosing.administration",
          source: drugRefSource("Dosing > Administration"),
          summary: "Take with or without food; tablets may be crushed",
          title: "Administration",
        },
      ],
      title: "Dosing & Administration",
    },
    {
      id: "safety",
      lengthEstimate: "short",
      subfields: [
        {
          body: [
            "Active pathological bleeding (e.g., peptic ulcer, intracranial hemorrhage).",
            "Severe hypersensitivity reaction to apixaban (e.g., anaphylaxis).",
          ],
          id: "safety.contraindications",
          source: drugRefSource("Contraindications"),
          summary: "Active pathological bleeding; severe hypersensitivity to apixaban",
          title: "Contraindications",
        },
        {
          body: [
            "Apixaban increases bleeding risk. Concomitant use of drugs affecting hemostasis (antiplatelets, NSAIDs, SSRIs, SNRIs) increases bleeding risk further.",
            "Monitor patients for signs and symptoms of bleeding. Discontinue apixaban in patients with active pathological hemorrhage.",
            "Andexanet alfa (Andexxa) is an FDA-approved reversal agent for apixaban.",
          ],
          id: "safety.bleeding_risk",
          source: drugRefSource("Warnings > Bleeding Risk"),
          summary: "Increased bleeding risk; andexanet alfa is available for reversal",
          title: "Bleeding Risk",
        },
        {
          body: [
            "Serum creatinine ≥1.5 mg/dL is one of three dose-reduction criteria for nonvalvular AF dosing.",
            "Renal function does not independently drive dose adjustment outside of the three-criterion rule.",
            "Avoid if CrCl <15 mL/min; clinical data are insufficient to recommend use in end-stage renal disease or dialysis.",
          ],
          id: "safety.renal_risk",
          source: drugRefSource("Warnings > Renal Impairment"),
          summary: "SCr ≥1.5 mg/dL is a dose-reduction criterion; avoid if CrCl <15 mL/min",
          title: "Renal Risk Considerations",
        },
      ],
      title: "Safety & Warnings",
    },
    {
      id: "interactions",
      lengthEstimate: "long",
      subfields: [
        {
          body: [
            "Concomitant use with other anticoagulants (unfractionated heparin, enoxaparin, warfarin, rivaroxaban) is generally avoided due to additive bleeding risk.",
            "Exception: use of unfractionated heparin at doses necessary to maintain patency of a central venous or arterial catheter is acceptable.",
          ],
          id: "interactions.anticoagulants",
          source: drugRefSource("Drug Interactions > Anticoagulants"),
          summary: "Avoid combination with other anticoagulants; additive bleeding risk",
          title: "Anticoagulant Combinations",
        },
        {
          body: [
            "Combined P-gp and strong CYP3A4 inhibitors (e.g., ritonavir, ketoconazole, itraconazole, clarithromycin): AVOID combination for atrial fibrillation indication.",
            "For DVT/PE: use with caution; reduce dose if necessary.",
            "Combined P-gp and strong CYP3A4 inducers (e.g., rifampin, carbamazepine, phenytoin, St. John's Wort): AVOID combination; significantly reduced apixaban exposure.",
          ],
          id: "interactions.cyp3a4_pgp",
          source: drugRefSource("Drug Interactions > CYP3A4 / P-gp"),
          summary: "Avoid combined P-gp + strong CYP3A4 inhibitors (ritonavir) or inducers (rifampin)",
          title: "CYP3A4 / P-gp Inhibitors & Inducers",
        },
        {
          body: [
            "Concomitant use of aspirin, clopidogrel, NSAIDs, or SSRIs/SNRIs increases bleeding risk.",
            "Use with aspirin 81 mg/day is common in AF patients; risk of major bleeding is increased compared to apixaban alone.",
            "Avoid NSAIDs unless benefit outweighs bleeding risk. Use lowest effective dose for shortest duration.",
          ],
          id: "interactions.nsaids",
          source: drugRefSource("Drug Interactions > Antiplatelets / NSAIDs"),
          summary: "NSAIDs, aspirin, antiplatelets increase bleeding risk; use with caution",
          title: "NSAIDs & Antiplatelets",
        },
      ],
      title: "Drug Interactions",
    },
    {
      id: "renal_hepatic",
      lengthEstimate: "short",
      subfields: [
        {
          body: [
            "No standalone dose adjustment required for mild-to-moderate renal impairment (CrCl 15–79 mL/min).",
            "Apixaban is approximately 27% renally cleared; moderate renal impairment does not materially alter drug exposure.",
          ],
          id: "renal.mild_moderate",
          source: drugRefSource("Special Populations > Renal Impairment"),
          summary: "CrCl 15–79 mL/min: no standalone dose adjustment needed",
          title: "Mild–Moderate Renal Impairment (CrCl 15–79)",
        },
        {
          body: [
            "CrCl <15 mL/min or dialysis-dependent: avoid use. There are insufficient clinical data to support a dosing recommendation.",
            "Apixaban is NOT significantly removed by hemodialysis.",
          ],
          id: "renal.severe",
          source: drugRefSource("Special Populations > Severe Renal Impairment"),
          summary: "CrCl <15 mL/min or dialysis: use not recommended",
          title: "Severe Renal Impairment (CrCl <15 / Dialysis)",
        },
        {
          body: [
            "Child-Pugh A or B: use with caution; no specific dose adjustment established.",
            "Child-Pugh C: contraindicated due to high risk of coagulopathy and bleeding.",
          ],
          id: "hepatic.impairment",
          source: drugRefSource("Special Populations > Hepatic Impairment"),
          summary: "Child-Pugh A/B: use with caution; Child-Pugh C: contraindicated",
          title: "Hepatic Impairment",
        },
      ],
      title: "Renal & Hepatic Dosing",
    },
    {
      id: "adverse",
      lengthEstimate: "short",
      subfields: [
        {
          body: [
            "Bleeding is the most clinically significant adverse effect. Major bleeding rate in ARISTOTLE: 2.13%/year (vs. warfarin 3.09%/year).",
            "Fatal bleeding rate was significantly lower than warfarin.",
            "Most common bleeding sites: gastrointestinal, urogenital, and soft tissue.",
          ],
          id: "adverse.bleeding",
          source: drugRefSource("Adverse Reactions > Bleeding"),
          summary: "Most common AE; major bleeding ~2.1%/year (lower than warfarin)",
          title: "Bleeding",
        },
        {
          body: [
            "Nausea (3%), anemia (<1%).",
            "Rare: hypersensitivity reactions including anaphylaxis, angioedema, and rash.",
            "Elevated liver enzymes reported; consider hepatic monitoring in at-risk patients.",
          ],
          id: "adverse.other",
          source: drugRefSource("Adverse Reactions > Other"),
          summary: "Nausea 3%; rare hypersensitivity; elevated liver enzymes reported",
          title: "Other Adverse Effects",
        },
      ],
      title: "Adverse Effects",
    },
  ],

  synthesizedAnswers: {
    "afib-dose": {
      citations: [
        { anchor: "dosing.afib", marker: 1 },
        { anchor: "dosing.dose_reduction", marker: 2 },
      ],
      followUpQuestions: [
        "How should the dose be adjusted for renal impairment?",
        "What about hepatic impairment?",
        "How do I manage it perioperatively?",
      ],
      text: "Standard apixaban dosing for nonvalvular atrial fibrillation is 5 mg PO BID [1]. Dose reduction to 2.5 mg BID is required when the patient meets at least 2 of 3 criteria: age ≥80 years, weight ≤60 kg, or serum creatinine ≥1.5 mg/dL [2].",
    },
    "renal-dose-gfr35": {
      citations: [
        { anchor: "dosing.renal_adjustment", marker: 1 },
        { anchor: "dosing.dose_reduction", marker: 2 },
      ],
      followUpQuestions: [
        "Does hepatic impairment also affect dosing?",
        "What are the key drug interactions?",
        "What are the contraindications?",
      ],
      text: "At an eGFR of approximately 35 mL/min, apixaban does not require a dose adjustment based on renal function alone for the atrial fibrillation indication [1]. The dose-reduction rule (to 2.5 mg BID) is triggered by meeting at least 2 of 3 criteria — age ≥80 y, weight ≤60 kg, or serum creatinine ≥1.5 mg/dL — so the creatinine value alone does not mandate reduction [2]. Avoid apixaban if CrCl falls below 15 mL/min or the patient is on dialysis [1].",
    },
    "hepatic": {
      citations: [
        { anchor: "dosing.hepatic", marker: 1 },
        { anchor: "hepatic.impairment", marker: 2 },
      ],
      followUpQuestions: [
        "What about renal impairment?",
        "What are the contraindications?",
        "How does ketoconazole affect apixaban levels?",
      ],
      text: "For hepatic impairment, apixaban can be used with caution in Child-Pugh A or B — no dose adjustment is established [1]. However, it is contraindicated in severe hepatic impairment (Child-Pugh C) due to the high risk of coagulopathy and bleeding [2].",
    },
    "perioperative": {
      citations: [
        { anchor: "dosing.perioperative", marker: 1 },
      ],
      followUpQuestions: [
        "What's the standard AFib dose to restart?",
        "What are the bleeding risk considerations?",
        "Are there any drug interactions to watch post-op?",
      ],
      text: "Perioperative bridging is generally NOT recommended for apixaban given its predictable pharmacokinetic offset [1]. Stop apixaban ≥24 hours before low-risk procedures, or ≥48 hours before high-risk procedures or those involving spinal/epidural anesthesia [1]. Restart as soon as adequate hemostasis is confirmed.",
    },
    "interactions-cyp3a4": {
      citations: [
        { anchor: "interactions.cyp3a4_pgp", marker: 1 },
        { anchor: "interactions.nsaids", marker: 2 },
      ],
      followUpQuestions: [
        "What about anticoagulant combinations?",
        "How does this affect AFib dosing?",
        "What are the bleeding risk considerations?",
      ],
      text: "Avoid combined P-gp and strong CYP3A4 inhibitors — such as ketoconazole, ritonavir, itraconazole, or clarithromycin — when using apixaban for atrial fibrillation [1]. Concurrent NSAIDs, aspirin, or antiplatelet agents significantly increase bleeding risk and should be used with caution or avoided where possible [2].",
    },
    "bleeding": {
      citations: [
        { anchor: "safety.bleeding_risk", marker: 1 },
        { anchor: "adverse.bleeding", marker: 2 },
      ],
      followUpQuestions: [
        "What are the contraindications?",
        "How do I manage perioperative risk?",
        "Which drug interactions increase bleeding?",
      ],
      text: "Apixaban increases bleeding risk, particularly when combined with antiplatelet agents, NSAIDs, SSRIs, or SNRIs [1]. In the ARISTOTLE trial, major bleeding occurred at 2.13%/year — significantly lower than warfarin (3.09%/year) [2]. Andexanet alfa (Andexxa) is FDA-approved for reversal when clinically needed [1].",
    },
    "contraindications": {
      citations: [
        { anchor: "safety.contraindications", marker: 1 },
        { anchor: "dosing.hepatic", marker: 2 },
      ],
      followUpQuestions: [
        "What are the bleeding risk warnings?",
        "What about renal impairment?",
        "What's the standard dosing for AFib?",
      ],
      text: "Apixaban is contraindicated in patients with active pathological bleeding (e.g., peptic ulcer, intracranial hemorrhage) or a severe hypersensitivity reaction to the drug [1]. It is also contraindicated in severe hepatic impairment (Child-Pugh C) due to coagulopathy risk [2].",
    },
    "dvt-pe": {
      citations: [
        { anchor: "dosing.dvt_pe", marker: 1 },
      ],
      followUpQuestions: [
        "What about renal impairment in DVT treatment?",
        "How does the dose differ from AFib dosing?",
        "What are the key drug interactions?",
      ],
      text: "For acute DVT or PE treatment, the standard regimen is 10 mg PO BID for 7 days, then 5 mg PO BID for at least 3 months [1]. To reduce the risk of recurrent VTE after ≥6 months of treatment, the dose may be reduced to 2.5 mg PO BID [1].",
    },
    "dose-reduction": {
      citations: [
        { anchor: "dosing.dose_reduction", marker: 1 },
        { anchor: "dosing.afib", marker: 2 },
      ],
      followUpQuestions: [
        "How does renal impairment fit into this?",
        "What's the DVT/PE dosing by comparison?",
        "What about hepatic impairment?",
      ],
      text: "The dose-reduction rule for apixaban in nonvalvular AF requires meeting at least 2 of 3 criteria: age ≥80 years, weight ≤60 kg, or serum creatinine ≥1.5 mg/dL [1]. When the threshold is met, reduce from 5 mg PO BID to 2.5 mg PO BID [2]. Apply only one reduction level regardless of how many criteria are met beyond two [1].",
    },
  },

  taskChips: [
    {
      id: "afib-dosing",
      label: "AFib dosing",
      subfieldIds: ["dosing.afib", "dosing.dose_reduction"],
    },
    {
      id: "dvt-pe",
      label: "DVT / PE treatment",
      subfieldIds: ["dosing.dvt_pe"],
    },
    {
      id: "renal-dosing",
      label: "Renal dosing",
      subfieldIds: ["dosing.renal_adjustment", "dosing.dose_reduction", "safety.renal_risk"],
    },
    {
      id: "interactions",
      label: "Interactions",
      subfieldIds: ["interactions.cyp3a4_pgp", "interactions.anticoagulants", "interactions.nsaids"],
    },
    {
      id: "perioperative",
      label: "Perioperative",
      subfieldIds: ["dosing.perioperative"],
    },
  ],
};

// ─── Multi-drug registry ──────────────────────────────────────────────────────
// Populated lazily via re-exports in drug-monograph-registry.ts to avoid
// circular imports. Concept I and other multi-drug prototypes import from there.
// ─────────────────────────────────────────────────────────────────────────────

export function getSubfieldById(
  monograph: DrugMonograph,
  subfieldId: string,
): DrugSubfield | undefined {
  for (const section of monograph.sections) {
    const found = section.subfields.find((sf) => sf.id === subfieldId);
    if (found) return found;
  }
  return undefined;
}

export function getSectionBySubfieldId(
  monograph: DrugMonograph,
  subfieldId: string,
): DrugSection | undefined {
  return monograph.sections.find((s) => s.subfields.some((sf) => sf.id === subfieldId));
}

// Concept D: maps free-text queries directly to a task chip id for auto-routing.
// Evaluated before QUERY_KEYWORD_MAP so perioperative beats generic "procedure" hits in the subfield map.
const QUERY_TO_TASK_CHIP: { chipId: string; keywords: string[] }[] = [
  { chipId: "renal-dosing", keywords: ["renal", "kidney", "gfr", "crcl", "creatinine", "dialysis", "egfr"] },
  { chipId: "perioperative", keywords: ["perioperative", "surgery", "procedure", "bridge", "bridging", "peri-op", "periop"] },
  { chipId: "dvt-pe", keywords: ["dvt", "pe ", "pulmonary embolism", "deep vein", "venous thromboembolism", "vte"] },
  { chipId: "interactions", keywords: ["interaction", "ritonavir", "ketoconazole", "rifampin", "cyp3a4", "p-gp", "inhibitor", "inducer", "nsaid"] },
  { chipId: "afib-dosing", keywords: ["afib", "atrial fibrillation", "af dose", "afib dose", "dose reduction", "2.5 mg"] },
];

export function getMatchedTaskChipId(query: string): string | undefined {
  const lower = query.toLowerCase();
  for (const { chipId, keywords } of QUERY_TO_TASK_CHIP) {
    if (keywords.some((kw) => lower.includes(kw))) return chipId;
  }
  return undefined;
}

const QUERY_KEYWORD_MAP: { keywords: string[]; subfieldId: string }[] = [
  { keywords: ["renal", "kidney", "gfr", "crcl", "creatinine", "dialysis", "egfr"], subfieldId: "dosing.renal_adjustment" },
  { keywords: ["perioperative", "surgery", "procedure", "bridge", "bridging", "peri-op", "periop"], subfieldId: "dosing.perioperative" },
  { keywords: ["afib", "atrial fibrillation", "af dose", "afib dose"], subfieldId: "dosing.afib" },
  { keywords: ["dvt", "pe ", "pulmonary embolism", "deep vein", "venous thromboembolism", "vte"], subfieldId: "dosing.dvt_pe" },
  { keywords: ["dose reduction", "2.5 mg", "2.5mg", "dose-reduction", "weight", "reduce dose"], subfieldId: "dosing.dose_reduction" },
  { keywords: ["hepatic", "liver", "child-pugh", "cirrhosis"], subfieldId: "dosing.hepatic" },
  { keywords: ["ritonavir", "ketoconazole", "rifampin", "cyp3a4", "p-gp", "inhibitor", "inducer", "interaction"], subfieldId: "interactions.cyp3a4_pgp" },
  { keywords: ["bleed", "bleeding", "hemorrhage", "reversal", "andexanet"], subfieldId: "safety.bleeding_risk" },
  { keywords: ["contraindication", "contraindicated"], subfieldId: "safety.contraindications" },
  { keywords: ["adverse", "side effect", "nausea", "nausea"], subfieldId: "adverse.bleeding" },
];

export function getMatchedSubfieldId(query: string): string | undefined {
  const lower = query.toLowerCase();
  for (const { keywords, subfieldId } of QUERY_KEYWORD_MAP) {
    if (keywords.some((kw) => lower.includes(kw))) return subfieldId;
  }
  return undefined;
}

// Concept G: maps free-text queries to a synthesized answer key.
const SYNTHESIZED_ANSWER_KEY_MAP: { key: string; keywords: string[] }[] = [
  { key: "renal-dose-gfr35", keywords: ["renal", "kidney", "gfr", "crcl", "creatinine", "dialysis", "egfr"] },
  { key: "hepatic", keywords: ["hepatic", "liver", "child-pugh", "cirrhosis"] },
  { key: "perioperative", keywords: ["perioperative", "surgery", "procedure", "bridge", "bridging", "peri-op", "periop"] },
  { key: "dvt-pe", keywords: ["dvt", "pulmonary embolism", "deep vein", "venous thromboembolism", "vte"] },
  { key: "interactions-cyp3a4", keywords: ["ketoconazole", "ritonavir", "rifampin", "cyp3a4", "p-gp", "inhibitor", "inducer", "interaction"] },
  { key: "bleeding", keywords: ["bleed", "bleeding", "hemorrhage", "reversal", "andexanet"] },
  { key: "contraindications", keywords: ["contraindication", "contraindicated"] },
  { key: "dose-reduction", keywords: ["dose reduction", "2.5 mg", "2.5mg", "dose-reduction", "reduce"] },
  { key: "afib-dose", keywords: ["afib", "atrial fibrillation", "af ", "standard dose", "dose for"] },
];

export function getSynthesizedAnswerForQuestion(
  query: string,
  monograph: DrugMonograph,
): DrugSynthesizedAnswer {
  const lower = query.toLowerCase();
  for (const { key, keywords } of SYNTHESIZED_ANSWER_KEY_MAP) {
    if (keywords.some((kw) => lower.includes(kw))) {
      const answer = monograph.synthesizedAnswers[key];
      if (answer) return answer;
    }
  }
  return monograph.synthesizedAnswers["afib-dose"]!;
}
