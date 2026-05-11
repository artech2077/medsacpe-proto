export type DrugAiTablesPrompt = {
  id: string;
  label: string;
};

export type DrugAiTablesContentSection = {
  body?: string[];
  heading: string;
  subsections?: {
    body?: string[];
    heading: string;
    items?: string[];
  }[];
};

export type DrugAiTablesInteractionGroup = {
  count: number;
  items: string[];
  severity: "contraindicated" | "serious" | "monitor" | "minor";
  title: string;
};

export const drugAiTablesPrompts: DrugAiTablesPrompt[] = [
  {
    id: "renal-dosing",
    label: "Renal dosing: CrCl adjustment cutoffs?",
  },
  {
    id: "qt-risk",
    label: "High-dose QT prolongation risk?",
  },
];

export const drugAiTablesContentSections: DrugAiTablesContentSection[] = [
  {
    heading: "Dosage Forms & Strengths",
    subsections: [
      {
        heading: "oral solution",
        items: ["125mg/5mL", "200mg/5mL", "250mg/5mL", "400mg/5mL"],
      },
    ],
  },
  {
    heading: "Ear, Nose, & Throat Infections",
    subsections: [
      {
        heading: "Mild to moderate infections",
        items: ["500 mg PO q12hr or 250 mg PO q8hr for 10-14 days"],
      },
      {
        heading: "Severe infections",
        items: ["875 mg PO q12hr or 500 mg PO q8hr for 10-14 days"],
      },
    ],
  },
  {
    heading: "Genitourinary Tract Infections",
    subsections: [
      {
        heading: "Mild to moderate infections",
        items: ["500 mg PO q12hr or 250 mg PO q8hr"],
      },
      {
        heading: "Severe infections",
        items: ["875 mg PO q12hr or 500 mg PO q8hr"],
      },
      {
        heading: "Spectrum of action",
        items: ["E coli, P mirabilis, or E faecalis"],
      },
    ],
  },
  {
    heading: "Skin & Skin Structure Infections",
    subsections: [
      {
        heading: "Mild to moderate infections",
        items: ["500 mg PO q12hr or 250 mg PO q8hr"],
      },
      {
        heading: "Severe infections",
        items: ["875 mg PO q12hr or 500 mg PO q8hr"],
      },
    ],
  },
  {
    body: ["875 mg PO q12hr or 500 mg PO q8hr for 10-14 days"],
    heading: "Lower Respiratory Tract Infections",
  },
  {
    body: ["H pylori infection and active or 1-year history of duodenal ulcer"],
    heading: "Helicobacter Pylori",
    subsections: [
      {
        heading: "Triple therapy",
        items: [
          "1 g PO q12hr for 14 days with lansoprazole (30 mg) and clarithromycin (500 mg)",
        ],
      },
      {
        heading: "Dual therapy",
        items: [
          "1 g PO q8hr for 14 days with lansoprazole (30 mg) in patients intolerant of, or resistant to, clarithromycin",
        ],
      },
    ],
  },
  {
    body: ["Postexposure inhalational prophylaxis", "500 mg PO q8hr"],
    heading: "Anthrax",
  },
  {
    body: ["Prophylaxis", "2 g PO 30-60 min before procedure"],
    heading: "Infective Endocarditis",
  },
  {
    body: [
      "Erythema migrans and other symptoms of early dissemination",
      "500 mg PO q8hr depending on size of patient for 3-4 weeks",
      "50 mg/kg/day q8hr in divided doses; maximum 500 mg/dose",
    ],
    heading: "Lyme Disease (Off-label)",
  },
  {
    body: ["First trimester: 500 mg PO q8hr for 7 days"],
    heading: "Chlamydial Infection in Pregnant Women (Off-label)",
  },
  {
    heading: "Dosage Modifications",
    subsections: [
      {
        heading: "Renal impairment",
        items: [
          "Mild-to moderate (CrCl >=30 mL/min): No dosage adjustment necessary",
          "Severe (CrCl 10-30 mL/min): 250-500 mg q12hr, depending on severity of infection; should not receive 875 mg",
          "Severe (CrCl <10 mL/min) or patients on hemodialysis: 250-500 mg q24hr, depending on severity of infection; patients on hemodialysis should receive an additional dose both during and at the end of dialysis",
        ],
      },
    ],
  },
];

export const drugAiTablesInteractionGroups: DrugAiTablesInteractionGroup[] = [
  {
    count: 0,
    items: [],
    severity: "contraindicated",
    title: "Contraindicated",
  },
  {
    count: 14,
    items: [
      "BCG vaccine live",
      "cholera vaccine",
      "demeclocycline",
      "doxycycline",
      "eravacycline",
      "microbiota oral",
      "minocycline",
      "mycophenolate",
      "omadacycline",
      "pexidartinib",
      "pretomanid",
      "sarecycline",
      "tetracycline",
      "typhoid vaccine live",
    ],
    severity: "serious",
    title: "Serious",
  },
  {
    count: 26,
    items: [
      "acyclovir",
      "allopurinol",
      "aspirin",
      "aspirin rectal",
      "aspirin/citric acid/sodium bicarbonate",
      "bazedoxifene/conjugated estrogens",
      "bendroflumethiazide",
      "chlorothiazide",
      "choline magnesium trisalicylate",
      "cyclopenthiazide",
      "dienogest/estradiol valerate",
      "estradiol",
      "ethinylestradiol",
      "hydrochlorothiazide",
      "levonorgestrel oral/ethinylestradiol/ferrous bisglycinate",
      "mestranol",
      "methotrexate",
      "methyclothiazide",
      "metolazone",
      "rose hips",
      "salicylates (non-asa)",
      "salsalate",
      "sodium phenylacetate",
      "sodium picosulfate/magnesium oxide/anhydrous citric acid",
      "sulfasalazine",
      "willow bark",
    ],
    severity: "monitor",
    title: "Monitor Closely",
  },
  {
    count: 11,
    items: [
      "amiloride",
      "azithromycin",
      "aztreonam",
      "chloramphenicol",
      "clarithromycin",
      "erythromycin base",
      "erythromycin ethylsuccinate",
      "erythromycin lactobionate",
      "erythromycin stearate",
      "patiromer",
      "pyridoxine (Antidote)",
    ],
    severity: "minor",
    title: "Minor",
  },
];
