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

// Content transcribed from the Medscape apixaban (Eliquis) monograph —
// reference.medscape.com/drug/eliquis-apixaban-999805, captured 2026-07-23.
// Reference copy: AI drug search/Misc/Reference Data/Reference_Monographs/apixaban-eliquis.md
export const apixabanMonograph: DrugMonograph = {
  blackBoxWarnings: [
    {
      id: "bbw_premature_discontinuation",
      source: drugRefSource("Warnings > Black Box Warnings"),
      text: "Premature anticoagulant discontinuation: Discontinuing oral anticoagulants prematurely increases risk of thrombotic events. Consider coverage with another anticoagulant if apixaban is stopped for any reason other than pathological bleeding or completion of a course of therapy.",
    },
    {
      id: "bbw_spinal_hematoma",
      source: drugRefSource("Warnings > Black Box Warnings"),
      text: "Spinal/epidural hematoma: Patients receiving neuraxial anesthesia or undergoing spinal puncture are at risk for epidural or spinal hematoma development. These hematomas may result in long-term or permanent paralysis. Consider hematoma risk factors when scheduling patients for spinal procedures.",
    },
  ],

  drug: {
    drugClass: "Factor Xa inhibitor",
    id: "apixaban",
    name: "Apixaban",
    referenceUrl: "https://reference.medscape.com/drug/eliquis-apixaban-999805",
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
            "To prevent stroke and systemic embolism in nonvalvular atrial fibrillation.",
            "5 mg PO BID.",
            "Decrease dose to 2.5 mg PO BID in patients with any 2 of the following characteristics: age ≥80 years, weight ≤60 kg, serum creatinine ≥1.5 mg/dL.",
          ],
          id: "dosing.afib",
          population: "adult",
          source: drugRefSource("Dosing & Uses > Stroke Prophylaxis with Atrial Fibrillation"),
          summary: "5 mg PO BID; decrease to 2.5 mg BID with any 2 of: age ≥80 y, weight ≤60 kg, SCr ≥1.5 mg/dL",
          title: "Stroke Prophylaxis with Atrial Fibrillation",
        },
        {
          body: [
            "Decrease dose to 2.5 mg PO BID in patients with any 2 of the following characteristics:",
            "1. Age ≥80 years",
            "2. Weight ≤60 kg",
            "3. Serum creatinine ≥1.5 mg/dL",
          ],
          id: "dosing.dose_reduction",
          population: "adult",
          source: drugRefSource("Dosing & Uses > Dosage Modifications > Nonvalvular Atrial Fibrillation"),
          summary: "2.5 mg BID with any 2 of: age ≥80 y, weight ≤60 kg, SCr ≥1.5 mg/dL",
          title: "2.5 mg BID Dose-Reduction Criteria",
        },
        {
          body: [
            "DVT or PE treatment: 10 mg PO BID x 7 days, then 5 mg BID.",
            "Reduce risk for recurrent DVT or PE (following initial 6 months treatment for DVT and/or PE): 2.5 mg PO BID.",
            "Postoperative prophylaxis following hip or knee replacement surgery — initial: 2.5 mg PO 12-24 hr after surgery; duration: 2.5 mg PO BID for 35 days (hip replacement) or 12 days (knee replacement).",
          ],
          id: "dosing.dvt_pe",
          population: "adult",
          source: drugRefSource("Dosing & Uses > DVT or PE Treatment"),
          summary: "10 mg PO BID × 7 days, then 5 mg BID; recurrence reduction 2.5 mg PO BID",
          title: "DVT / PE Treatment",
        },
        {
          body: [
            "Indicated for treatment of venous thromboembolism (VTE) and for reduction in risk of recurrent VTE in pediatric patients aged from birth and older after at least 5 days of initial anticoagulant treatment.",
            "Dosage based on patient weight; adjust dose according to weight-tier as treatment progresses. Use not studied in patients weighing <2.6 kg.",
            "2.6 to <4 kg (sprinkle capsules): 0.3 mg PO twice daily on Days 1-7, then 0.15 mg twice daily on Days ≥8.",
            "4 to <6 kg: 1 mg then 0.5 mg · 6 to <9 kg: 2 mg then 1 mg · 9 to <12 kg: 3 mg then 1.5 mg · 12 to <18 kg: 4 mg then 2 mg · 18 to <25 kg: 6 mg then 3 mg · 25 to <35 kg: 8 mg then 4 mg (PO twice daily; Days 1-7, then Days ≥8; tablets for oral suspension).",
            "≥35 kg (tablets): 10 mg PO twice daily on Days 1-7, then 5 mg twice daily on Days ≥8.",
            "Renal impairment (≥2 years): eGFR <30 mL/min/1.73 m²: not recommended.",
          ],
          id: "dosing.pediatric_vte",
          population: "pediatric",
          source: drugRefSource("Dosing & Uses > Pediatric > Venous Thromboembolism (VTE)"),
          summary: "Weight-tiered PO BID dosing from birth; ≥35 kg: 10 mg BID Days 1-7, then 5 mg BID",
          title: "Venous Thromboembolism (VTE) — Pediatric",
        },
        {
          body: [
            "Nonvalvular atrial fibrillation — mild-to-moderate renal impairment: no dosage adjustment required.",
            "Serum creatinine ≥1.5 mg/dL: decrease dose to 2.5 mg BID if patient has 1 additional characteristic of age ≥80 years or weight ≤60 kg.",
            "ESRD maintained on hemodialysis: 5 mg BID; decrease dose to 2.5 mg BID if 1 additional characteristic of age ≥80 years or weight ≤60 kg is present.",
            "DVT/PE: no dose adjustment recommended; not studied in ESRD on dialysis or patients with a CrCl <15 mL/min; dosing recommendations based on pharmacokinetic and pharmacodynamic (anti-FXa activity) data in study subjects with ESRD maintained on dialysis.",
          ],
          id: "dosing.renal_adjustment",
          population: "adult",
          source: drugRefSource("Dosing & Uses > Renal Impairment"),
          summary: "AF: no adjustment for mild-moderate; SCr ≥1.5 counts toward the 2.5 mg BID rule; ESRD on HD: 5 mg BID",
          title: "Renal Impairment",
        },
        {
          body: [
            "Mild: no dosage adjustment required.",
            "Moderate: patients may have intrinsic coagulation abnormalities; data are limited and no recommendations are available.",
            "Severe: not recommended.",
          ],
          id: "dosing.hepatic",
          population: "adult",
          source: drugRefSource("Dosing & Uses > Dosage Modifications > Hepatic Impairment"),
          summary: "Mild: no adjustment; moderate: limited data, no recommendations; severe: not recommended",
          title: "Hepatic Impairment",
        },
        {
          body: [
            "Discontinue at least 48 hr before elective surgery or invasive procedures with a moderate or high risk of unacceptable or clinically significant bleeding.",
            "Discontinue at least 24 hr before elective surgery or invasive procedures with low risk of unacceptable bleeding or where bleeding would be noncritical in location and easily controlled.",
          ],
          id: "dosing.perioperative",
          population: "adult",
          source: drugRefSource("Dosing & Uses > Dosing Considerations > Surgery/procedures"),
          summary: "Stop ≥48 h before moderate/high bleeding-risk procedures; ≥24 h before low-risk procedures",
          title: "Surgery / Procedures",
        },
        {
          body: [
            "Tablets (adults and pediatric patients ≥35 kg): swallow whole; may also crush tablets and suspend in water, 5% dextrose in water (D5W), or apple juice, or mix with applesauce in patients unable to swallow whole tablets.",
            "Missed dose: take as soon as possible on same day, then resume twice-daily administration; do not take double dose to make up for missed dose.",
            "NG tube: crush and suspend in 60 mL of water or D5W; promptly administer through 12 French NG tube.",
            "Storage: 20-25ºC (68-77ºF); administer crushed tablet suspension/mixture within 4 hr of crushing.",
          ],
          id: "dosing.administration",
          source: drugRefSource("Administration > Oral Administration"),
          summary: "Swallow whole or crush and suspend; missed dose same day, never doubled",
          title: "Administration",
        },
      ],
      title: "Dosing & Administration",
    },
    {
      id: "safety",
      lengthEstimate: "long",
      subfields: [
        {
          body: [
            "Severe hypersensitivity (eg, anaphylaxis) to product.",
            "Active pathological bleeding.",
          ],
          id: "safety.contraindications",
          source: drugRefSource("Warnings > Contraindications"),
          summary: "Severe hypersensitivity (eg, anaphylaxis); active pathological bleeding",
          title: "Contraindications",
        },
        {
          body: [
            "Increases the risk of bleeding and can cause serious, potentially fatal, bleeding; advise patients of signs and symptoms of blood loss and to report them immediately; discontinue therapy in patients with active pathological hemorrhage.",
            "Coadministration with other drugs that affect hemostasis increases bleeding risk (eg, aspirin and other antiplatelet agents, other anticoagulants, heparin, thrombolytic agents, SSRIs, SNRIs, NSAIDs).",
            "Reversal: anticoagulant effect expected to persist for ~24 hr after last dose (~2 half-lives); use of procoagulant reversal agents (eg, prothrombin complex concentrate) may be considered.",
            "Coagulation factor Xa, recombinant (Andexxa) is no longer available for reversal of anticoagulation in patients taking apixaban owing to postmarketing safety data on thromboembolic events (December 2025).",
          ],
          id: "safety.bleeding_risk",
          source: drugRefSource("Warnings > Cautions / Reversing apixaban effect"),
          summary: "Serious bleeding risk; PCC may be considered for reversal — Andexxa no longer available (Dec 2025)",
          title: "Bleeding Risk & Reversal",
        },
        {
          body: [
            "Patients receiving neuraxial anesthesia or undergoing spinal puncture are at risk for epidural or spinal hematoma development; these hematomas may result in long-term or permanent paralysis.",
            "Do not remove indwelling epidural or intrathecal catheters earlier than 24 hr after last apixaban administration; next apixaban dose should not be administered earlier than 5 hr after catheter removal.",
            "If traumatic puncture occurs, delay apixaban administration for 48 hr.",
          ],
          id: "safety.spinal_hematoma",
          source: drugRefSource("Warnings > Spinal/epidural anesthesia or puncture"),
          summary: "Epidural/spinal hematoma risk with neuraxial procedures; catheter timing rules apply",
          title: "Spinal / Epidural Hematoma",
        },
        {
          body: [
            "Serum creatinine ≥1.5 mg/dL is one of the characteristics in the 2.5 mg BID dose-reduction rule for nonvalvular AF (with age ≥80 years and weight ≤60 kg).",
            "Mild-to-moderate renal impairment: no dosage adjustment required for nonvalvular AF.",
            "DVT/PE: not studied in ESRD on dialysis or patients with a CrCl <15 mL/min.",
          ],
          id: "safety.renal_risk",
          source: drugRefSource("Dosing & Uses > Renal Impairment"),
          summary: "SCr ≥1.5 mg/dL counts toward dose reduction; DVT/PE not studied at CrCl <15 mL/min",
          title: "Renal Risk Considerations",
        },
        {
          body: [
            "Safety and efficacy not studied in patients with prosthetic heart valves; use not recommended in these patients.",
            "Direct-acting oral anticoagulants (DOACs) are not recommended for use in patients with triple-positive antiphospholipid syndrome (APS).",
            "Increased rate of stroke observed during transition from apixaban to warfarin in patients with atrial fibrillation in clinical trials.",
            "Not recommended as an alternative to unfractionated heparin for the initial treatment of PE in patients who present with hemodynamic instability or who may receive thrombolysis or pulmonary embolectomy.",
          ],
          id: "safety.cautions",
          source: drugRefSource("Warnings > Cautions"),
          summary: "Not recommended: prosthetic heart valves, triple-positive APS, unstable PE",
          title: "Other Cautions",
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
            "Coadministration with other anticoagulants, heparin, or thrombolytic agents increases bleeding risk.",
            "Switching between apixaban and anticoagulants other than warfarin: discontinue one being taken, and begin the other at the next scheduled dose.",
            "Switching from warfarin to apixaban: discontinue warfarin and initiate apixaban when INR <2.0.",
          ],
          id: "interactions.anticoagulants",
          source: drugRefSource("Warnings > Cautions / Dosing Considerations"),
          summary: "Other anticoagulants increase bleeding risk; switching rules apply",
          title: "Anticoagulant Combinations & Switching",
        },
        {
          body: [
            "Coadministration with dual inhibitors of CYP3A4 and P-gp: if taking >2.5 mg PO BID, decrease dose by 50%.",
            "If taking 2.5 mg BID, avoid coadministration with strong dual inhibitors.",
            "Avoid coadministration with strong dual inducers of CYP3A4 and P-gp; such drugs decrease apixaban's systemic exposure.",
          ],
          id: "interactions.cyp3a4_pgp",
          source: drugRefSource("Dosing & Uses > Dosage Modifications / Warnings > Cautions"),
          summary: "Strong dual CYP3A4 + P-gp inhibitors: halve dose or avoid; avoid strong dual inducers",
          title: "CYP3A4 / P-gp Inhibitors & Inducers",
        },
        {
          body: [
            "Coadministration with aspirin and other antiplatelet agents, NSAIDs, SSRIs, or SNRIs increases bleeding risk.",
            "Advise patients of signs and symptoms of blood loss and to report them immediately.",
          ],
          id: "interactions.nsaids",
          source: drugRefSource("Warnings > Cautions"),
          summary: "Antiplatelets, NSAIDs, SSRIs, SNRIs increase bleeding risk",
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
            "Nonvalvular AF — mild-to-moderate renal impairment: no dosage adjustment required.",
            "Serum creatinine ≥1.5 mg/dL: decrease dose to 2.5 mg BID if patient has 1 additional characteristic of age ≥80 years or weight ≤60 kg.",
          ],
          id: "renal.mild_moderate",
          source: drugRefSource("Dosing & Uses > Renal Impairment"),
          summary: "Mild-to-moderate: no adjustment; SCr ≥1.5 mg/dL counts toward the dose-reduction rule",
          title: "Mild–Moderate Renal Impairment",
        },
        {
          body: [
            "ESRD maintained on hemodialysis (nonvalvular AF): 5 mg BID; decrease dose to 2.5 mg BID if 1 additional characteristic of age ≥80 years or weight ≤60 kg is present.",
            "DVT/PE: no dose adjustment recommended; not studied in ESRD on dialysis or patients with a CrCl <15 mL/min; dosing recommendations based on pharmacokinetic and pharmacodynamic (anti-FXa activity) data in study subjects with ESRD maintained on dialysis.",
          ],
          id: "renal.severe",
          source: drugRefSource("Dosing & Uses > Renal Impairment"),
          summary: "ESRD on hemodialysis (AF): 5 mg BID; DVT/PE not studied at CrCl <15 mL/min",
          title: "Severe Renal Impairment / ESRD",
        },
        {
          body: [
            "Mild: no dosage adjustment required.",
            "Moderate: patients may have intrinsic coagulation abnormalities; data are limited and no recommendations are available.",
            "Severe: not recommended.",
          ],
          id: "hepatic.impairment",
          source: drugRefSource("Dosing & Uses > Dosage Modifications > Hepatic Impairment"),
          summary: "Mild: no adjustment; moderate: no recommendations available; severe: not recommended",
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
            "Hemorrhage is the most clinically significant adverse effect: ≤15% in adults (major hemorrhage ≤2.13%); 36.2% in pediatric patients.",
            "Bleeding-related events (adults, 1-10%): epistaxis (≤3.6%), contusion (1.4-2.2%), hematuria (≤2.1%), hematoma (1.3-2%), menorrhagia (1.4%), gingival bleeding (≤1.4%), hemoptysis (≤1.2%), rectal hemorrhage (≤1%).",
            "Other clinically significant bleeding (<1%): GI hemorrhage (eg, hematemesis, melena), intracranial/eye/muscle/wound hemorrhage, ecchymosis, petechiae.",
          ],
          id: "adverse.bleeding",
          source: drugRefSource("Adverse Effects"),
          summary: "Hemorrhage ≤15% in adults (major ≤2.13%); 36.2% in pediatric patients",
          title: "Bleeding",
        },
        {
          body: [
            "Adults (1-10%): nausea (2.6%), anemia (2.6%).",
            "Pediatric patients (>10%): headache (16.4%), vomiting (13.8%).",
            "Adults (<1%): AST/transaminase increased, gamma glutamyltransferase increased, hypersensitivity, postprocedural hemorrhage.",
          ],
          id: "adverse.other",
          source: drugRefSource("Adverse Effects"),
          summary: "Nausea 2.6%, anemia 2.6%; rare hypersensitivity and transaminase elevations",
          title: "Other Adverse Effects",
        },
      ],
      title: "Adverse Effects",
    },
    {
      id: "pregnancy",
      lengthEstimate: "short",
      subfields: [
        {
          body: [
            "There are no adequate and well-controlled studies in pregnant women; treatment is likely to increase the risk of hemorrhage during pregnancy and delivery.",
            "Therapy should be administered during pregnancy only if the potential benefit outweighs the potential risk to the mother and fetus.",
            "Labor and delivery: use in women receiving neuraxial anesthesia may result in epidural or spinal hematomas; consider use of a shorter acting anticoagulant as delivery approaches.",
          ],
          id: "pregnancy.pregnancy",
          source: drugRefSource("Pregnancy & Lactation > Pregnancy"),
          summary: "No controlled studies; hemorrhage risk — use only if benefit outweighs risk",
          title: "Pregnancy",
        },
        {
          body: [
            "There are no data on presence of drug metabolites in human milk, effects on breastfed child, or effects on milk production; rats excrete apixaban in milk (12% of the maternal dose).",
            "Because human exposure through milk is unknown, instruct women to either discontinue breastfeeding or to discontinue apixaban therapy, taking into account the importance of the drug to the mother.",
          ],
          id: "pregnancy.lactation",
          source: drugRefSource("Pregnancy & Lactation > Lactation"),
          summary: "Human milk exposure unknown — discontinue breastfeeding or the drug",
          title: "Lactation",
        },
      ],
      title: "Pregnancy & Lactation",
    },
    {
      id: "pharmacology",
      lengthEstimate: "short",
      subfields: [
        {
          body: [
            "Factor Xa inhibitor that inhibits platelet activation by selectively and reversibly blocking the active site of factor Xa without requiring a cofactor (eg, antithrombin III) for activity.",
            "Inhibits free and clot-bound factor Xa, and prothrombinase activity; no direct effect on platelet aggregation, but indirectly inhibits platelet aggregation induced by thrombin.",
          ],
          id: "pharmacology.moa",
          source: drugRefSource("Pharmacology > Mechanism of Action"),
          summary: "Selective, reversible factor Xa inhibitor — no cofactor required",
          title: "Mechanism of Action",
        },
        {
          body: [
            "Bioavailability 50%; Tmax 3-4 hr (adults); protein binding 87%; Vd 21 L.",
            "Metabolized primarily via CYP3A4 with minor contributions from CYP1A2, 2C8, 2C9, 2C19, and 2J2; no active circulating metabolites.",
            "Half-life ~12 hr; clearance 3.3 L/hr (adults); urine and feces: 27% recovered as metabolites.",
          ],
          id: "pharmacology.pk",
          source: drugRefSource("Pharmacology > Absorption / Metabolism / Elimination"),
          summary: "Bioavailability 50%; CYP3A4 metabolism; half-life ~12 hr",
          title: "Pharmacokinetics",
        },
      ],
      title: "Pharmacology",
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
      text: "Standard apixaban dosing to prevent stroke and systemic embolism in nonvalvular atrial fibrillation is 5 mg PO BID [1]. Decrease the dose to 2.5 mg BID in patients with any 2 of the following characteristics: age ≥80 years, weight ≤60 kg, or serum creatinine ≥1.5 mg/dL [2].",
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
      text: "For nonvalvular atrial fibrillation, mild-to-moderate renal impairment requires no dosage adjustment on its own [1]. Serum creatinine ≥1.5 mg/dL counts toward the dose-reduction rule — decrease to 2.5 mg BID when any 2 of age ≥80 years, weight ≤60 kg, or SCr ≥1.5 mg/dL are present [2]. Patients with ESRD maintained on hemodialysis receive 5 mg BID, reduced to 2.5 mg BID with 1 additional characteristic [1].",
    },
    "hepatic": {
      citations: [
        { anchor: "dosing.hepatic", marker: 1 },
        { anchor: "hepatic.impairment", marker: 2 },
      ],
      followUpQuestions: [
        "What about renal impairment?",
        "What are the contraindications?",
        "How do CYP3A4 inhibitors affect apixaban?",
      ],
      text: "In mild hepatic impairment, no dosage adjustment is required [1]. In moderate impairment, patients may have intrinsic coagulation abnormalities — data are limited and no recommendations are available [1]. In severe hepatic impairment, apixaban is not recommended [2].",
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
      text: "Discontinue apixaban at least 48 hours before elective surgery or invasive procedures with a moderate or high risk of unacceptable or clinically significant bleeding [1]. For procedures with low bleeding risk, or where bleeding would be noncritical in location and easily controlled, discontinue at least 24 hours before [1].",
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
      text: "With dual inhibitors of CYP3A4 and P-gp, decrease the apixaban dose by 50% if taking more than 2.5 mg PO BID; patients already taking 2.5 mg BID should avoid coadministration with strong dual inhibitors [1]. Avoid strong dual inducers, which decrease apixaban's systemic exposure [1]. Aspirin and other antiplatelet agents, NSAIDs, SSRIs, and SNRIs increase bleeding risk [2].",
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
      text: "Apixaban increases the risk of bleeding and can cause serious, potentially fatal, bleeding — particularly with other drugs that affect hemostasis (antiplatelets, other anticoagulants, SSRIs, SNRIs, NSAIDs) [1]. In adults, hemorrhage occurs in up to 15% of patients, with major hemorrhage in up to 2.13% [2]. For reversal, procoagulant agents such as prothrombin complex concentrate may be considered; Andexxa (coagulation factor Xa, recombinant) is no longer available as of December 2025 [1].",
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
      text: "Apixaban is contraindicated in patients with severe hypersensitivity to the product (eg, anaphylaxis) or active pathological bleeding [1]. It is also not recommended in severe hepatic impairment [2].",
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
      text: "For DVT or PE treatment, the regimen is 10 mg PO BID for 7 days, then 5 mg BID [1]. To reduce the risk of recurrent DVT or PE following the initial 6 months of treatment, the dose is 2.5 mg PO BID [1].",
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
      text: "For nonvalvular AF, decrease the apixaban dose to 2.5 mg PO BID in patients with any 2 of the following characteristics: age ≥80 years, weight ≤60 kg, or serum creatinine ≥1.5 mg/dL [1]. The standard dose is otherwise 5 mg PO BID [2].",
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
