// A real historical label update. Viewing history is simulated; clinical
// content is source-backed. This is not a live Medscape update feed.
export type DrugMonographUpdateSection = {
  anchor: string;
  sectionTitle: string;
  whatChanged: string;
  whyItMatters: string;
  source: { label: string; url: string };
};

export type DrugUpdatePresentation = "summary" | "takeaway" | "editorial";

export type DrugMonographUpdate = {
  badge: string;
  changedSectionsLabel: string;
  drugId: string;
  drugName: string;
  updatedDate: string;
  summary: string;
  clinicalTakeaway: string;
  editorial: {
    headline: string;
    audienceTitle: string;
    changeTitle: string;
    clinicalRelevanceTitle: string;
    sourcesTitle: string;
    audience: string;
    whatChanged: string;
    clinicalRelevance: string;
  };
  sections: DrugMonographUpdateSection[];
};

export const OZEMPIC_LABEL_URL =
  "https://www.accessdata.fda.gov/drugsatfda_docs/label/2025/209637s035,209637s037lbl.pdf";

export const OZEMPIC_UPDATE: DrugMonographUpdate = {
  badge: "Ozempic drug update",
  changedSectionsLabel: "Indication & dosing",
  drugName: "Ozempic",
  drugId: "semaglutide",
  updatedDate: "Jan 28, 2025 · U.S. label",
  summary:
    "Ozempic gained a kidney risk reduction indication for adults with type 2 diabetes and chronic kidney disease, with a specific maintenance dose.",
  clinicalTakeaway:
    "For adults with type 2 diabetes and CKD, the kidney indication specifies a 1 mg weekly maintenance dose after titration.",
  editorial: {
    headline: "Ozempic (semaglutide): Updated Renal Indication in Type 2 Diabetes and CKD",
    audienceTitle: "Indicated Patient Population",
    changeTitle: "U.S. Prescribing Information Update",
    clinicalRelevanceTitle: "Clinical Implications",
    sourcesTitle: "Supporting References",
    audience: "Adults with type 2 diabetes and chronic kidney disease receiving Ozempic injection.",
    whatChanged:
      "The January 2025 U.S. label added kidney risk reduction and a 1 mg weekly maintenance dose after the recommended titration.",
    clinicalRelevance:
      "Kidney outcomes now have a labeled role alongside glucose control. The kidney indication specifies 1 mg weekly; escalation to 2 mg is an option for additional glycemic control. Review the indication-specific dose when selecting treatment.",
  },
  sections: [
    {
      anchor: "dosing.t2dm_sc",
      sectionTitle: "Kidney risk reduction indication",
      whatChanged:
        "The FDA approved Ozempic injection to reduce sustained eGFR decline, end-stage kidney disease, and cardiovascular death in adults with type 2 diabetes and CKD.",
      whyItMatters:
        "Kidney outcomes now have a labeled role in treatment decisions for this population, alongside glucose control. In FLOW, semaglutide reduced the hazard of the composite kidney/CV-death outcome by 24% versus placebo (HR 0.76; 95% CI 0.66–0.88).",
      source: {
        label: "Approval announcement & FLOW evidence",
        url: "https://www.ozempic.com/content/dam/diabetes-patient/ozempic/pdfs/Ozempic_CKD_sNDA_Press_Release_January_28_2025.pdf",
      },
    },
    {
      anchor: "dosing.t2dm_sc",
      sectionTitle: "Maintenance dose for T2D with CKD",
      whatChanged:
        "For this indication, increase to 1 mg subcutaneously once weekly after at least 4 weeks at 0.5 mg. Start with the usual 0.25 mg weekly initiation for 4 weeks.",
      whyItMatters:
        "The kidney indication has a defined 1 mg maintenance dose. It should be distinguished from dose escalation up to 2 mg for additional glucose control.",
      source: { label: "FDA prescribing information · Sections 1, 2.2 & 14.3", url: OZEMPIC_LABEL_URL },
    },
  ] satisfies DrugMonographUpdateSection[],
};

// Mounjaro (tirzepatide) — FDA approval letter for NDA 215866 S-044 and S-045,
// signed 08/27/2026. Content limited to the verified FDA passages in
// older-verified-updates.csv; clinical relevance is editorial interpretation.
export const MOUNJARO_APPROVAL_LETTER_URL =
  "https://www.accessdata.fda.gov/drugsatfda_docs/appletter/2026/215866Orig1s044%2C215866Orig1s045ltr.pdf";
export const MOUNJARO_LABEL_URL =
  "https://www.accessdata.fda.gov/drugsatfda_docs/label/2026/215866s044s045lbl.pdf";
export const ZEPBOUND_LABEL_URL =
  "https://www.accessdata.fda.gov/drugsatfda_docs/label/2026/217806s041lbl.pdf";

export const MOUNJARO_UPDATE: DrugMonographUpdate = {
  badge: "Mounjaro drug update",
  changedSectionsLabel: "Indication & dosing",
  drugName: "Mounjaro",
  drugId: "tirzepatide",
  updatedDate: "Aug 27, 2026 · U.S. label",
  summary:
    "Mounjaro gained a cardiovascular risk reduction indication for high-risk adults with type 2 diabetes, and the 2.5 mg weekly dose can now be used for ongoing glycemic control.",
  clinicalTakeaway:
    "Mounjaro 2.5 mg once weekly is no longer initiation-only; it can be continued for glycemic control in type 2 diabetes.",
  editorial: {
    headline: "Mounjaro (tirzepatide): New Cardiovascular Indication and 2.5 mg Maintenance Option in Type 2 Diabetes",
    audienceTitle: "Indicated Patient Population",
    changeTitle: "U.S. Prescribing Information Update",
    clinicalRelevanceTitle: "Clinical Implications",
    sourcesTitle: "Supporting References",
    audience:
      "Adults with type 2 diabetes at high risk for major adverse cardiovascular events, and patients with type 2 diabetes treated with Mounjaro. The label also covers patients 10 years and older, with age-specific maximum doses.",
    whatChanged:
      "The August 2026 U.S. label (S-044 and S-045) added an indication to reduce the risk of cardiovascular death, nonfatal myocardial infarction, or nonfatal stroke in high-risk adults with type 2 diabetes. It also states that the 2.5 mg once-weekly dose can be used for ongoing glycemic control. The same supplement revised the diabetic retinopathy warning information.",
    clinicalRelevance:
      "Cardiovascular risk reduction now has a labeled role for Mounjaro in high-risk adults with type 2 diabetes. An ongoing 2.5 mg weekly regimen is no longer outside the label’s dosing intent. These changes apply to Mounjaro only: they do not give Zepbound a cardiovascular indication, and the Zepbound label still describes 2.5 mg as an initiation dose.",
  },
  sections: [
    {
      anchor: "dosing.t2dm",
      sectionTitle: "Cardiovascular risk reduction indication",
      whatChanged:
        "The FDA approved Mounjaro to reduce the risk of major adverse cardiovascular events (CV death, nonfatal myocardial infarction, or nonfatal stroke) in adults with type 2 diabetes who are at high risk for these events.",
      whyItMatters:
        "Adds an FDA-approved cardiovascular risk reduction use to a diabetes product. It does not establish that Zepbound has this indication.",
      source: { label: "FDA approval letter · NDA 215866 S-044 & S-045", url: MOUNJARO_APPROVAL_LETTER_URL },
    },
    {
      anchor: "dosing.t2dm",
      sectionTitle: "2.5 mg dose for ongoing glycemic control",
      whatChanged:
        "The 2.5 mg once-weekly dose can now be used for ongoing glycemic control in type 2 diabetes. The prior label described it only as a starting dose not intended for glycemic control.",
      whyItMatters:
        "When reviewing an ongoing 2.5 mg Mounjaro regimen, do not apply the older statement that it is solely an initiation dose. Zepbound still describes 2.5 mg as initiation-only.",
      source: { label: "FDA prescribing information · Mounjaro (Aug 2026)", url: MOUNJARO_LABEL_URL },
    },
  ] satisfies DrugMonographUpdateSection[],
};
