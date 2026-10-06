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
