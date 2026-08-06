// Rivaroxaban (Xarelto) monograph fixture — same DrugMonograph contract as
// apixaban, with mirrored section/subfield ids so the V2 comparison table can
// pair anchors across the two drugs.
//
// ⚠️ CLINICAL REVIEW PENDING: content is drafted from the FDA label / standard
// monograph facts and must be verified against the reviewed Medscape
// rivaroxaban monograph before this prototype is used in moderated research
// (per the Connected Drug Intelligence prototype prompt, §6 canonical fixtures).

import type { DrugMonograph, DrugMonographSource } from "./drug-monograph";

const drugRefSource = (section: string): DrugMonographSource => ({
  label: "Drug Reference",
  section,
  url: "#drug-reference",
});

export const rivaroxabanMonograph: DrugMonograph = {
  blackBoxWarnings: [
    {
      id: "bbw_premature_discontinuation",
      source: drugRefSource("Boxed Warning"),
      text: "Premature discontinuation of any oral anticoagulant, including rivaroxaban, increases the risk of thrombotic events. If rivaroxaban is discontinued for a reason other than pathological bleeding or completion of a course of therapy, consider coverage with another anticoagulant.",
    },
    {
      id: "bbw_spinal_hematoma",
      source: drugRefSource("Boxed Warning"),
      text: "Epidural or spinal hematomas may occur in patients treated with rivaroxaban who are receiving neuraxial anesthesia or undergoing spinal puncture. These hematomas may result in long-term or permanent paralysis. Consider these risks when scheduling patients for spinal procedures.",
    },
  ],

  drug: {
    drugClass: "Factor Xa inhibitor",
    id: "rivaroxaban",
    name: "Rivaroxaban",
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
            "Standard dose: 20 mg PO once daily with the evening meal (CrCl >50 mL/min).",
            "CrCl 15–50 mL/min: reduce to 15 mg PO once daily with the evening meal.",
            "CrCl <15 mL/min: avoid use; clinical data are insufficient in this population.",
          ],
          id: "dosing.afib",
          source: drugRefSource("Dosing > Nonvalvular Atrial Fibrillation"),
          summary:
            "20 mg once daily with the evening meal; 15 mg once daily if CrCl 15–50 mL/min",
          title: "Nonvalvular Atrial Fibrillation",
        },
        {
          body: [
            "DVT/PE treatment: 15 mg PO BID with food for 21 days, then 20 mg PO once daily with food.",
            "Reduction of recurrence risk (after ≥6 months treatment): 10 mg PO once daily.",
            "Prophylaxis following hip replacement: 10 mg PO once daily for 35 days; knee replacement: 10 mg PO once daily for 12 days.",
          ],
          id: "dosing.dvt_pe",
          source: drugRefSource("Dosing > DVT/PE"),
          summary: "15 mg PO BID × 21 days, then 20 mg once daily; recurrence prevention 10 mg once daily",
          title: "DVT / PE Treatment",
        },
        {
          body: [
            "Nonvalvular AF: renal function directly selects the dose — CrCl >50 mL/min: 20 mg once daily; CrCl 15–50 mL/min: 15 mg once daily; CrCl <15 mL/min: avoid use.",
            "Unlike apixaban, there is no multi-criterion (age/weight/creatinine) reduction rule — the AF dose is keyed to CrCl alone.",
            "DVT/PE: clinical data are limited when CrCl <30 mL/min; avoid use if CrCl <15 mL/min.",
            "Periodically assess renal function as clinically indicated and adjust therapy accordingly.",
          ],
          id: "dosing.renal_adjustment",
          source: drugRefSource("Dosing > Renal Impairment"),
          summary: "AF dose keyed to CrCl: >50 → 20 mg; 15–50 → 15 mg; <15 → avoid",
          title: "Renal Impairment",
        },
        {
          body: [
            "Mild hepatic impairment (Child-Pugh A): no dose adjustment required.",
            "Moderate-to-severe hepatic impairment (Child-Pugh B or C) or any hepatic disease associated with coagulopathy: avoid use.",
          ],
          id: "dosing.hepatic",
          source: drugRefSource("Dosing > Hepatic Impairment"),
          summary: "Avoid in Child-Pugh B/C or hepatic disease with coagulopathy",
          title: "Hepatic Impairment",
        },
        {
          body: [
            "Perioperative bridging is generally NOT recommended; rivaroxaban has a predictable offset.",
            "Stop rivaroxaban at least 24 hours before surgery or invasive procedures when possible.",
            "Restart after the procedure as soon as adequate hemostasis is established.",
          ],
          id: "dosing.perioperative",
          source: drugRefSource("Dosing > Perioperative Management"),
          summary: "Stop ≥24 h before procedures; restart once hemostasis is established",
          title: "Perioperative Management",
        },
        {
          body: [
            "15 mg and 20 mg tablets must be taken with food; the 10 mg tablet may be taken with or without food.",
            "Tablets may be crushed and mixed with applesauce immediately before use, or given via NG tube followed by enteral feeding.",
            "If a dose is missed on the 15 mg BID regimen, take immediately (may take two 15 mg tablets at once); otherwise take the missed dose as soon as possible on the same day.",
          ],
          id: "dosing.administration",
          source: drugRefSource("Dosing > Administration"),
          summary: "15/20 mg doses must be taken with food; tablets may be crushed",
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
            "Active pathological bleeding.",
            "Severe hypersensitivity reaction to rivaroxaban (e.g., anaphylaxis).",
          ],
          id: "safety.contraindications",
          source: drugRefSource("Contraindications"),
          summary: "Active pathological bleeding; severe hypersensitivity to rivaroxaban",
          title: "Contraindications",
        },
        {
          body: [
            "Rivaroxaban increases bleeding risk and can cause serious or fatal bleeding. Concomitant drugs affecting hemostasis (antiplatelets, NSAIDs, SSRIs, SNRIs, other anticoagulants) increase the risk further.",
            "Promptly evaluate any signs or symptoms of blood loss. Discontinue rivaroxaban in patients with active pathological hemorrhage.",
            "Coagulation factor Xa, recombinant (Andexxa) is no longer available for reversal of anticoagulation (December 2025 FDA safety update); procoagulant reversal agents (eg, prothrombin complex concentrate) may be considered.",
          ],
          id: "safety.bleeding_risk",
          source: drugRefSource("Warnings > Bleeding Risk"),
          summary: "Serious bleeding risk; andexanet alfa is available for reversal",
          title: "Bleeding Risk",
        },
        {
          body: [
            "Renal function determines the nonvalvular AF dose directly (see Renal Impairment).",
            "Avoid use if CrCl <15 mL/min; a declining renal function trend warrants dose reassessment.",
            "Patients with a prosthetic heart valve or antiphospholipid syndrome (triple-positive) should not receive rivaroxaban.",
          ],
          id: "safety.renal_risk",
          source: drugRefSource("Warnings > Renal Impairment"),
          summary: "CrCl drives the AF dose; avoid if CrCl <15 mL/min",
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
            "Concomitant use with other anticoagulants (unfractionated heparin, enoxaparin, warfarin, apixaban) is generally avoided due to additive bleeding risk.",
            "Exception: unfractionated heparin at doses necessary to maintain patency of a central venous or arterial catheter is acceptable.",
          ],
          id: "interactions.anticoagulants",
          source: drugRefSource("Drug Interactions > Anticoagulants"),
          summary: "Avoid combination with other anticoagulants; additive bleeding risk",
          title: "Anticoagulant Combinations",
        },
        {
          body: [
            "Combined P-gp and strong CYP3A4 inhibitors (e.g., ketoconazole, ritonavir, itraconazole, clarithromycin): AVOID combination; significantly increased rivaroxaban exposure and bleeding risk.",
            "Combined P-gp and strong CYP3A4 inducers (e.g., rifampin, carbamazepine, phenytoin, St. John's Wort): AVOID combination; significantly reduced rivaroxaban exposure.",
          ],
          id: "interactions.cyp3a4_pgp",
          source: drugRefSource("Drug Interactions > CYP3A4 / P-gp"),
          summary: "Avoid combined P-gp + strong CYP3A4 inhibitors (ketoconazole) or inducers (rifampin)",
          title: "CYP3A4 / P-gp Inhibitors & Inducers",
        },
        {
          body: [
            "Concomitant use of aspirin, clopidogrel, NSAIDs, or SSRIs/SNRIs increases bleeding risk.",
            "Avoid NSAIDs unless benefit outweighs bleeding risk; use the lowest effective dose for the shortest duration.",
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
            "CrCl 15–50 mL/min (nonvalvular AF): reduce to 15 mg once daily with the evening meal.",
            "Rivaroxaban is approximately 36% renally cleared as unchanged drug; exposure rises as renal function declines.",
          ],
          id: "renal.mild_moderate",
          source: drugRefSource("Special Populations > Renal Impairment"),
          summary: "CrCl 15–50 mL/min: 15 mg once daily for AF",
          title: "Mild–Moderate Renal Impairment (CrCl 15–50)",
        },
        {
          body: [
            "CrCl <15 mL/min or dialysis-dependent: avoid use; clinical data are insufficient to support a dosing recommendation.",
            "Rivaroxaban is NOT significantly removed by hemodialysis.",
          ],
          id: "renal.severe",
          source: drugRefSource("Special Populations > Severe Renal Impairment"),
          summary: "CrCl <15 mL/min or dialysis: use not recommended",
          title: "Severe Renal Impairment (CrCl <15 / Dialysis)",
        },
        {
          body: [
            "Child-Pugh A: no dose adjustment required.",
            "Child-Pugh B or C, or hepatic disease with coagulopathy: avoid use due to increased exposure and bleeding risk.",
          ],
          id: "hepatic.impairment",
          source: drugRefSource("Special Populations > Hepatic Impairment"),
          summary: "Child-Pugh A: no adjustment; Child-Pugh B/C or coagulopathy: avoid",
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
            "Bleeding is the most clinically significant adverse effect. Major bleeding rate in ROCKET AF: 3.6%/year (vs. warfarin 3.4%/year).",
            "Gastrointestinal bleeding occurred more frequently than with warfarin; intracranial hemorrhage occurred less frequently.",
            "Most common bleeding sites: gastrointestinal, urogenital, and soft tissue.",
          ],
          id: "adverse.bleeding",
          source: drugRefSource("Adverse Reactions > Bleeding"),
          summary: "Most common AE; major bleeding ~3.6%/year in ROCKET AF (GI bleeding > warfarin)",
          title: "Bleeding",
        },
        {
          body: [
            "Back pain (up to 3%), pruritus, wound secretion following orthopedic surgery.",
            "Rare: hypersensitivity reactions including anaphylaxis and angioedema.",
            "Elevated transaminases reported; consider hepatic monitoring in at-risk patients.",
          ],
          id: "adverse.other",
          source: drugRefSource("Adverse Reactions > Other"),
          summary: "Back pain, pruritus; rare hypersensitivity; elevated transaminases reported",
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
        { anchor: "dosing.renal_adjustment", marker: 2 },
      ],
      followUpQuestions: [
        "How is the dose adjusted for renal impairment?",
        "What are the key drug interactions?",
        "What are the boxed warnings?",
      ],
      text: "Standard rivaroxaban dosing for nonvalvular atrial fibrillation is 20 mg PO once daily with the evening meal [1]. When CrCl is 15–50 mL/min, reduce to 15 mg once daily; avoid use when CrCl falls below 15 mL/min [2].",
    },
  },

  taskChips: [
    {
      id: "afib-dosing",
      label: "AFib dosing",
      subfieldIds: ["dosing.afib", "dosing.renal_adjustment"],
    },
    {
      id: "dvt-pe",
      label: "DVT / PE treatment",
      subfieldIds: ["dosing.dvt_pe"],
    },
    {
      id: "renal-dosing",
      label: "Renal dosing",
      subfieldIds: ["dosing.renal_adjustment", "renal.severe"],
    },
    {
      id: "interactions",
      label: "Interactions",
      subfieldIds: ["interactions.cyp3a4_pgp", "interactions.anticoagulants", "interactions.nsaids"],
    },
  ],
};
