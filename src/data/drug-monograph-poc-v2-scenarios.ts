import type {
  DrugMonograph,
  DrugSection,
  DrugSubfield,
} from "./drug-monograph";

type PocScenarioMonograph = DrugMonograph & {
  _meta?: {
    sourceUrl?: string;
  };
};

// Snapshot from the local Content API POC (data/monographs.json).
// Keep this static so the prototype stays self-contained while preserving POC content.
const RAW_POC_V2_SCENARIO_MONOGRAPHS = [
  {
    "blackBoxWarnings": [],
    "drug": {
      "drugClass": "Antineoplastics, Monoclonal Antibody, Antineoplastics, VEGF Inhibitors",
      "id": "bevacizumab",
      "name": "Bevacizumab"
    },
    "keyFields": [],
    "sections": [
      {
        "id": "adult-dosing-uses",
        "title": "Adult Dosing & Uses",
        "lengthEstimate": "long",
        "subfields": [
          {
            "id": "adult-dosing-uses.in-combination-with-fluorouracil-based-chemotherapy",
            "title": "In combination with fluorouracil-based chemotherapy",
            "summary": "First-line or second-line treatment for metastatic colorectal carcinoma (mCRC) in combination with fluorouracil (5-FU)-based chemotherapy",
            "body": [
              "First-line or second-line treatment for metastatic colorectal carcinoma (mCRC) in combination with fluorouracil (5-FU)-based chemotherapy",
              "{calc_weight_dosing}Bolus-IFL (ie, irinotecan, 5-FU, leucovorin): 5 mg/kg IV q2Weeks",
              "FOLFOX4 (ie, oxaliplatin, 5-FU, leucovorin): 10 mg/kg IV q2Weeks"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosing & Uses > In combination with fluorouracil-based chemotherapy",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "adult-dosing-uses.in-combination-with-a-fluoropyrimidine-plus-irinotecan-or-oxaliplatin-based-chemotherapy",
            "title": "In combination with a fluoropyrimidine plus irinotecan or oxaliplatin-based chemotherapy",
            "summary": "Second-line treatment of patients with mCRC who have progressed on a first-line bevacizumab-containing regimen",
            "body": [
              "Second-line treatment of patients with mCRC who have progressed on a first-line bevacizumab-containing regimen",
              "Use in combination with a fluoropyrimidine (eg, 5-FU, capecitabine) plus irinotecan or oxaliplatin-based chemotherapy",
              "5 mg/kg IV q2Weeks or 7.5 mg/kg IV q3Weeks"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosing & Uses > In combination with a fluoropyrimidine plus irinotecan or oxaliplatin-based chemotherapy",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "adult-dosing-uses.non-small-cell-lung-cancer",
            "title": "Non-Small Cell Lung Cancer",
            "summary": "Indicated for unresectable, locally advanced, recurrent or metastatic, nonsquamous non-small cell lung cancer (NSCLC) in combination with carboplatin and paclitaxel",
            "body": [
              "Indicated for unresectable, locally advanced, recurrent or metastatic, nonsquamous non-small cell lung cancer (NSCLC) in combination with carboplatin and paclitaxel",
              "{calc_weight_dosing}15 mg/kg IV q3Weeks"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosing & Uses > Non-Small Cell Lung Cancer",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "adult-dosing-uses.renal-cell-carcinoma",
            "title": "Renal Cell Carcinoma",
            "summary": "Indicated for metastatic renal cell carcinoma in combination with interferon alfa-2a",
            "body": [
              "Indicated for metastatic renal cell carcinoma in combination with interferon alfa-2a",
              "{calc_weight_dosing}10 mg/kg IV q2Weeks (Avastin may be used as monotherapy off-label)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosing & Uses > Renal Cell Carcinoma",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "adult-dosing-uses.cervical-cancer",
            "title": "Cervical Cancer",
            "summary": "Indicated, in combination with paclitaxel plus cisplatin or topotecan, for persistent, recurrent, or metastatic cervical cancer",
            "body": [
              "Indicated, in combination with paclitaxel plus cisplatin or topotecan, for persistent, recurrent, or metastatic cervical cancer",
              "{calc_weight_dosing}15 mg/kg IV q3Weeks in combination with 1 of the following chemotherapy regimens: paclitaxel and cisplatin, or paclitaxel and topotecan"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosing & Uses > Cervical Cancer",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "adult-dosing-uses.ovarian-fallopian-tube-or-peritoneal-cancer",
            "title": "Ovarian, Fallopian Tube, or Peritoneal Cancer",
            "summary": "Platinum-resistant",
            "body": [
              "Platinum-resistant",
              "Indicated in combination with paclitaxel, pegylated liposomal doxorubicin, or topotecan for adults with platinum-resistant recurrent epithelial ovarian, fallopian tube, or primary peritoneal cancer who received no more than 2 prior chemotherapy regimens",
              "Bevacizumab 10 mg/kg IV q2Weeks in combination with 1 of the following IV chemotherapy regimens: paclitaxel, pegylated liposomal doxorubicin, or topotecan weekly OR",
              "{calc_weight_dosing}Bevacizumab 15 mg/kg IV q3Weeks in combination with topotecan q3Weeks"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosing & Uses > Ovarian, Fallopian Tube, or Peritoneal Cancer",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "adult-dosing-uses.platinum-sensitive",
            "title": "Platinum-sensitive",
            "summary": "Indicated for women with platinum-sensitive recurrent epithelial ovarian, fallopian tube, or primary peritoneal cancer either in combination with carboplatin and paclitaxel or in combination with carboplatin and gemcitabine chemotherapy, followed by bevacizumab alone",
            "body": [
              "Indicated for women with platinum-sensitive recurrent epithelial ovarian, fallopian tube, or primary peritoneal cancer either in combination with carboplatin and paclitaxel or in combination with carboplatin and gemcitabine chemotherapy, followed by bevacizumab alone",
              "Adults are defined to be 'platinum-sensitive' if a relapse occurs ≥6 months following the last treatment with a platinum-based chemotherapy",
              "Bevacizumab 15 mg/kg IV q3Weeks in combination with carboplatin and paclitaxel for 6-8 cycles, OR",
              "Bevacizumab 15 mg/kg IV q3Weeks in combination with carboplatin and gemcitabine for 6-10 cycles, followed by",
              "Bevacizumab 15 mg/kg q3Weeks as a single agent until disease progression"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosing & Uses > Platinum-sensitive",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "adult-dosing-uses.treatment-of-stage-iii-or-iv-disease-following-initial-surgical-resection",
            "title": "Treatment of stage III or IV disease following initial surgical resection",
            "summary": "Indicated in combination with carboplatin and paclitaxel, followed by bevacizumab as a single agent, for patients with stage III or IV epithelial ovarian, fallopian tube, or primary peritoneal cancer following initial surgical resection",
            "body": [
              "Indicated in combination with carboplatin and paclitaxel, followed by bevacizumab as a single agent, for patients with stage III or IV epithelial ovarian, fallopian tube, or primary peritoneal cancer following initial surgical resection",
              "Bevacizumab 15 mg/kg IV q3Weeks in combination with carboplatin and paclitaxel for up to 6 cycles, followed by",
              "Bevacizumab 15 mg/kg IV q3Weeks as a single agent, for a total of up to 22 cycles or until disease progression, whichever occurs earlier"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosing & Uses > Treatment of stage III or IV disease following initial surgical resection",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "adult-dosing-uses.glioblastoma",
            "title": "Glioblastoma",
            "summary": "Indicated for treatment of recurrent glioblastoma",
            "body": [
              "Indicated for treatment of recurrent glioblastoma",
              "{calc_weight_dosing}10 mg/kg IV q2Weeks"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosing & Uses > Glioblastoma",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "adult-dosing-uses.breast-cancer",
            "title": "Breast Cancer",
            "summary": "Indication for metastatic breast cancer (HER2-negative) revoked by FDA in November 2011 due to failure to delay tumor growth or provide survival benefit",
            "body": [
              "Indication for metastatic breast cancer (HER2-negative) revoked by FDA in November 2011 due to failure to delay tumor growth or provide survival benefit"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosing & Uses > Breast Cancer",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "adult-dosing-uses.exudative-armd",
            "title": "Exudative ARMD (Off-label)",
            "summary": "Off-label indication for exudative age-related macular degeneration",
            "body": [
              "Off-label indication for exudative age-related macular degeneration",
              "Off-label: 1.25 mg (in 0.05mL of solution) administered by intravitreal injection once monthly",
              "Reference: CATT Research Group, N Engl J Med 2011;364:1897-1908",
              "The need to repackage the drug from the available size vial into a smaller doses increases risk for transmission of infection if improper aseptic technique occurs"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosing & Uses > Exudative ARMD (Off-label)",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "adult-dosing-uses.hepatocellular-carcinoma",
            "title": "Hepatocellular Carcinoma",
            "summary": "Avastin only",
            "body": [
              "Avastin only",
              "Indicated, in combination with atezolizumab, for unresectable or metastatic hepatocellular carcinoma (HCC) in patients who have not received prior systemic therapy",
              "Bevacizumab 15 mg/kg IV on Day 1 (after administration of atezolizumab), PLUS",
              "Atezolizumab 1,200 mg/kg IV on Day 1",
              "Repeat every 3 weeks",
              "Continue until disease progression or unacceptable toxicity",
              "Refer to prescribing information for atezolizumab for more information"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosing & Uses > Hepatocellular Carcinoma",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "adult-dosing-uses.discontinue-treatment",
            "title": "Discontinue treatment",
            "summary": "Gastrointestinal perforation, any grade",
            "body": [
              "Gastrointestinal perforation, any grade",
              "Tracheoesophageal fistula, any grade",
              "Grade 4 fistula",
              "Fistula formation involving any internal organ",
              "Necrotizing fasciitis",
              "Grade 3 or 4 hemorrhage",
              "Severe arterial thromboembolic events",
              "Grade 4 venous thromboembolic events, including pulmonary embolism",
              "Hypertensive crisis or hypertensive encephalopathy",
              "Posterior reversible encephalopathy syndrome (PRES)",
              "Nephrotic syndrome, any grade",
              "Congestive heart failure, any grade",
              "Severe infusion reactions"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosing & Uses > Discontinue treatment",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "adult-dosing-uses.withhold-treatment",
            "title": "Withhold treatment",
            "summary": "Any wound healing complications; resume after resolution of wound healing complications has not been established",
            "body": [
              "Any wound healing complications; resume after resolution of wound healing complications has not been established",
              "Recent history of hemoptysis ≥1/2 tsp (2.5 mL)",
              "Severe hypertension not controlled with medical management; resume once controlled",
              "Proteinuria ≥2 grams/24 hr in absence of nephrotic syndrome; withhold until proteinuria <2 grams/24 hr"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosing & Uses > Withhold treatment",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "adult-dosing-uses.infusion-reaction",
            "title": "Infusion reaction",
            "summary": "Mild, clinically significant: Decrease infusion rate",
            "body": [
              "Mild, clinically significant: Decrease infusion rate",
              "Clinically significant: Interrupt infusion; resume at a decreased rate of infusion after symptoms resolve"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosing & Uses > Infusion reaction",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "adult-dosing-uses.dosing-considerations",
            "title": "Dosing Considerations",
            "summary": "Withhold for at least 28 days before elective surgery",
            "body": [
              "Withhold for at least 28 days before elective surgery",
              "Do not administer until at least 28 days following major surgery and until adequate wound healing"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosing & Uses > Dosing Considerations",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "adult-dosing-uses.limitation-of-use",
            "title": "Limitation of use",
            "summary": "Avastin, Mvasi, Zirabev, Alymsys",
            "body": [
              "Avastin, Mvasi, Zirabev, Alymsys",
              "Colorectal cancer: Not indicated for adjuvant treatment of colon cancer"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosing & Uses > Limitation of use",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "adult-dosing-uses.orphan-designations",
            "title": "Orphan Designations",
            "summary": "Coadministration with platinum-based antineoplastic and fluorouracil or capecitabine for treatment of stomach cancer",
            "body": [
              "Coadministration with platinum-based antineoplastic and fluorouracil or capecitabine for treatment of stomach cancer",
              "Melanoma stages IIb-IV",
              "Hereditary hemorrhagic telangiectasia",
              "Pancreatic cancer",
              "Mesothelioma",
              "Coat disease"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosing & Uses > Orphan Designations",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "adult-dosing-uses.sponsor",
            "title": "Sponsor",
            "summary": "Genentech, Inc; 1 DNA Way; South San Francisco, CA 94080-4990",
            "body": [
              "Genentech, Inc; 1 DNA Way; South San Francisco, CA 94080-4990",
              "MicroSert, Ltd; Bar Yehuda Street; Nesher (Coat disease)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosing & Uses > Sponsor",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          }
        ]
      },
      {
        "id": "adult-dosage-f-s",
        "title": "Adult Dosage F&S",
        "lengthEstimate": "long",
        "subfields": [
          {
            "id": "adult-dosage-f-s.injectable-solution",
            "title": "injectable solution",
            "summary": "25mg/mL (4-mL, 16-mL single-dose vials)",
            "body": [
              "25mg/mL (4-mL, 16-mL single-dose vials)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosage F&S > injectable solution",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "adult-dosage-f-s.biosimilar-to-avastin",
            "title": "Biosimilar to Avastin",
            "summary": "Alymsys (bevacizumab-maly)",
            "body": [
              "Alymsys (bevacizumab-maly)",
              "Avzivi (bevacizumab-tnjn)",
              "Mvasi (bevacizumab-awwb)",
              "Vegzelma (bevacizumab-adcd)",
              "Zirabev (bevacizumab-bvzr)",
              "Jobevne (bevacizumab-nwgd)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosage F&S > Biosimilar to Avastin",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          }
        ]
      },
      {
        "id": "pediatric-dosing-uses",
        "title": "Pediatric Dosing & Uses",
        "lengthEstimate": "short",
        "subfields": [
          {
            "id": "pediatric-dosing-uses.all",
            "title": "Pediatric Dosing & Uses",
            "summary": "Safety and efficacy not established",
            "body": [
              "Safety and efficacy not established"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Pediatric Dosing & Uses",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          }
        ]
      },
      {
        "id": "adverse-effects",
        "title": "Adverse Effects",
        "lengthEstimate": "long",
        "subfields": [
          {
            "id": "adverse-effects.treatment-following-resection",
            "title": "Treatment following resection",
            "summary": "Fatigue (72-80%)",
            "body": [
              "Fatigue (72-80%)",
              "Nausea (53-58%)",
              "Arthralgia (33-41%)",
              "Diarrhea (38-40%)",
              "Headache (26-34%)",
              "Hypertension (24-32%)",
              "Epistaxis (30-31%)",
              "Dyspnea (26-28%)",
              "Stomatitis (19-25%)",
              "Pain in extremity (19-25%)",
              "Muscular weakness (13-15%)",
              "Dysarthria (10-12%)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adverse Effects > Treatment following resection",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "adverse-effects.platinum-resistant",
            "title": "Platinum-resistant",
            "summary": "Neutropenia, Grade 2-4 (31%)",
            "body": [
              "Neutropenia, Grade 2-4 (31%)",
              "Hypertension, Grade 2-4 (19%)",
              "Peripheral sensory neuropathy, Grade 2-4 (18%)",
              "Mucosal inflammation, Grade 2-4 (13%)",
              "Proteinuria, Grade 2-4 (12%)",
              "Infection, Grade 2-4 (11%)",
              "Palmar-plantar erythrodysesthesia, Grade 2-4 (11%)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adverse Effects > Platinum-resistant",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "adverse-effects.platinum-sensitive",
            "title": "Platinum-sensitive",
            "summary": "Fatigue (82%)",
            "body": [
              "Fatigue (82%)",
              "Nausea (72%)",
              "Thrombocytopenia (58%)",
              "Epistaxis (55%)",
              "Headache (49%)",
              "Hypertension (42%)",
              "Diarrhea (38-39%)",
              "Decreased appetite (35%)",
              "Abdominal pain, stomatitis, vomiting (33%)",
              "Hyperglycemia (31%)",
              "Dyspnea (30%)",
              "Arthralgia (28%)",
              "Hypomagnesemia (27%)",
              "Cough (26%)",
              "Insomnia, back pain (21%)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adverse Effects > Platinum-sensitive",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "adverse-effects.10",
            "title": ">10% (Metastatic Renal Cell Carcinoma)",
            "summary": "Decreased appetite (36%)",
            "body": [
              "Decreased appetite (36%)",
              "Fatigue (33%)",
              "Hypertension (28%)",
              "Epistaxis (27%)",
              "Headache (24%)",
              "Diarrhea (21%)",
              "Decreased weight (20%)",
              "Proteinuria (20%)",
              "Myalgia (19%)",
              "Back pain (12%)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adverse Effects > >10% (Metastatic Renal Cell Carcinoma)",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "adverse-effects.10",
            "title": ">10% (Metastatic Colorectal Cancer)",
            "summary": "Leukopenia (37%)",
            "body": [
              "Leukopenia (37%)",
              "Diarrhea (34%)",
              "Neutropenia (21%)",
              "Hypertension (12%)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adverse Effects > >10% (Metastatic Colorectal Cancer)",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "adverse-effects.10",
            "title": ">10% (HCC)",
            "summary": "Increased AST (86%)",
            "body": [
              "Increased AST (86%)",
              "Increased alkaline phosphatase (70%)",
              "Decreased platelet (68%)",
              "Decreased lymphocytes (62%)",
              "Increased ALT (62%)",
              "Decreased albumin (60%)",
              "Decreased hemoglobin (58%)",
              "Decreased sodium (54%)",
              "Increased glucose (48%)",
              "Decreased leukocytes (32%)",
              "Decreased calcium (30%)",
              "Hypertension (30%)",
              "Decreased phosphorus (26%)",
              "Fatigue/asthenia (26%)",
              "Decreased neutrophil (23%)",
              "Increased potassium (23%)",
              "Hypomagnesia (22%)",
              "Proteinuria (20%)",
              "Pruritus (19%)",
              "Diarrhea (19%)",
              "Decreased appetite (18%)",
              "Pyrexia (18%)",
              "Increased AST, Grade 3-4 (16%)",
              "Hypertension, Grade 3-4 (15%)",
              "Constipation (13%)",
              "Decreased lymphocytes, Grade 3-4 (13%)",
              "Decreased sodium, Grade 3-4 (13%)",
              "Abdominal pain (12%)",
              "Nausea (12%)",
              "Rash (12%)",
              "Cough (12%)",
              "Infusion-related reactions (11%)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adverse Effects > >10% (HCC)",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "adverse-effects.treatment-following-resection",
            "title": "Treatment following resection",
            "summary": "Nasal mucosal disorder (7-10%)",
            "body": [
              "Nasal mucosal disorder (7-10%)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adverse Effects > Treatment following resection",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "adverse-effects.platinum-resistant",
            "title": "Platinum resistant",
            "summary": "Epistaxis (5%)",
            "body": [
              "Epistaxis (5%)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adverse Effects > Platinum resistant",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "adverse-effects.platinum-sensitive",
            "title": "Platinum-sensitive",
            "summary": "Rhinorrhea (10%)",
            "body": [
              "Rhinorrhea (10%)",
              "Hyperkalemia (9%)",
              "Hemorrhoids (8%)",
              "Sinus congestion (8%)",
              "Gingival bleeding (7%)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adverse Effects > Platinum-sensitive",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "adverse-effects.1-10",
            "title": "1-10% (Metastatic Colorectal Cancer)",
            "summary": "Asthenia (10%)",
            "body": [
              "Asthenia (10%)",
              "Deep vein thrombosis (9%)",
              "Abdominal pain (8%)",
              "Pain (8%)",
              "Constipation (4%)",
              "Intra-abdominal thrombosis (3%)",
              "Syncope (3%)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adverse Effects > 1-10% (Metastatic Colorectal Cancer)",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "adverse-effects.1-10",
            "title": "1-10% (Metastatic Renal Cell Carcinoma)",
            "summary": "Dysphonia (5%)",
            "body": [
              "Dysphonia (5%)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adverse Effects > 1-10% (Metastatic Renal Cell Carcinoma)",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "adverse-effects.1-10",
            "title": "1-10% (HCC)",
            "summary": "Increased glucose, Grade 3-4 (9%)",
            "body": [
              "Increased glucose, Grade 3-4 (9%)",
              "Increased ALT, Grade 3-4 (8%)",
              "Increased bilirubin, Grade 3-4 (8%)",
              "Decreased phosphorus, Grade 3-4 (4.7%)",
              "Increased alkaline phosphatase, Grade 3-4 (4%)",
              "Increased leukocytes, Grade 3-4 (3.4%)",
              "Decreased hemoglobin, Grade 3-4 (3.1%)",
              "Proteinuria, Grade 3-4 (3%)",
              "Infusion-related reactions, Grade 3-4 (2.4%)",
              "Decreased neutrophils (2.3%)",
              "Fatigue/asthenia, Grade 3-4 (2%)",
              "Increased potassium, Grade 3-4 (1.9%)",
              "Diarrhea, Grade 3-4 (1.8%)",
              "Decreased albumin, Grade 3-4 (1.5%)",
              "Decreased appetite, Grade 3-4 (1.2%)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adverse Effects > 1-10% (HCC)",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "adverse-effects.1",
            "title": "<1% (HCC)",
            "summary": "Decreased calcium, Grade 3-4 (0.3%)",
            "body": [
              "Decreased calcium, Grade 3-4 (0.3%)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adverse Effects > <1% (HCC)",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "adverse-effects.postmarketing-reports",
            "title": "Postmarketing Reports",
            "summary": "Body as whole: Polyserositis",
            "body": [
              "Body as whole: Polyserositis",
              "Cardiovascular: Pulmonary hypertension, RPLS, mesenteric venous occlusion, arterial (including aortic) aneurysms, dissections, and rupture",
              "Osteonecrosis of the jaw",
              "Eye disorders (from unapproved intravitreal use for treatment of various ocular disorders): Permanent loss of vision, endophthalmitis (infectious and sterile), intraocular inflammation, retinal detachment, increased IOP, hemorrhage (including conjunctival, vitreous hemorrhage, or retinal hemorrhage), vitreous floaters, ocular hyperemia, ocular pain or discomfort",
              "Gastrointestinal: Gastrointestinal ulcer, intestinal necrosis, anastomotic ulceration",
              "Hemic and lymphatic: Pancytopenia",
              "Hepatobiliary disorders: Gallbladder perforation",
              "Infections and infestations: Necrotizing fasciitis, usually secondary to wound healing complications, gastrointestinal perforation or fistula formation",
              "Musculoskeletal: Osteonecrosis of the jaw",
              "Renal: Renal thrombotic microangiopathy",
              "Respiratory: Nasal septum perforation",
              "Dysphonia",
              "Persistent, recurrent, or metastatic carcinoma of the cervix",
              "Systemic events (from unapproved intravitreal use for treatment of various ocular disorders): Arterial thromboembolic events, hypertension, gastrointestinal perforation, hemorrhage",
              "Non-mandibular osteonecrosis and posterior reversible encephalopathy syndrome (PRES)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adverse Effects > Postmarketing Reports",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          }
        ]
      },
      {
        "id": "contraindications-cautions",
        "title": "Contraindications & Cautions",
        "lengthEstimate": "long",
        "subfields": [
          {
            "id": "contraindications-cautions.contraindications",
            "title": "Contraindications",
            "summary": "None",
            "body": [
              "None"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Contraindications & Cautions > Contraindications",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "contraindications-cautions.cautions",
            "title": "Cautions",
            "summary": "Bevacizumab products can result in minor hemorrhage, most commonly Grade 1 epistaxis; and serious, and in some cases fatal, hemorrhagic events",
            "body": [
              "Bevacizumab products can result in minor hemorrhage, most commonly Grade 1 epistaxis; and serious, and in some cases fatal, hemorrhagic events",
              "Serious, sometimes fatal, arterial thromboembolic events (ATE) including cerebral infarction, transient ischemic attacks, myocardial infarction, angina, and a variety of other ATE; discontinue bevacizumab for severe ATE",
              "Increased risk of venous thromboembolic events (VTE) reported in patients treated with bevacizumab for cervical cancer; discontinue bevacizumab for life-threatening VTE",
              "Monitor blood pressure and treat hypertension; increased risk for severe hypertension; temporarily suspend treatment; discontinue if hypertensive crisis or hypertensive encephalopathy",
              "Increased relative risk for heart failure has been associated with therapy",
              "Posterior reversible encephalopathy syndrome (PRES) reported (0.5%); discontinue if PRES develops",
              "Proteinuria reported; temporarily suspend treatment for ≥2 g proteinuria/24 hr; discontinue if nephrotic syndrome occurs (incidence <1%)",
              "Evaluation for presence of varices recommended within 6 months of initiation of HCC therapy; there is lack of clinical data to support safety in patients with variceal bleeding within 6 months prior to treatment, untreated or incompletely treated varices with bleeding, or high risk of bleeding because these patients were excluded from clinical trials in HCC",
              "Do not administer to patients with recent history of hemoptysis of 1/2 teaspoon or more of red blood; discontinue in patients who develop a Grades 3-4 hemorrhage",
              "Risk of ovarian failure reported especially in premenopausal women receiving bevacizumab in combination with mFOLFOX chemotherapy compared to mFOLFOX alone; inform females of reproductive potential of the risk of ovarian failure prior to starting treatment",
              "Based on its mechanism of action and findings from animal studies, may cause fetal harm when administered to pregnant women (see Pregnancy)",
              "Infusion-related reactions may occur and include hypertension, hypertensive crises associated with neurologic signs and symptoms, wheezing, oxygen desaturation, Grade 3 hypersensitivity, anaphylactoid/anaphylactic reactions, chest pain, headaches, rigors, and diaphoresis; stop infusion if severe and administer appropriate therapy",
              "Not indicated for use with anthracycline-based chemotherapy; incidence of Grade≥3 left ventricular dysfunction was 1% in patients receiving bevacizumab compared to 0.6% of patients receiving chemotherapy alone"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Contraindications & Cautions > Cautions",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "contraindications-cautions.wound-healing",
            "title": "Wound healing",
            "summary": "Impairs wound healing; discontinue before elected surgeries and do not initiate following surgery; withhold therapy until adequate wound healing",
            "body": [
              "Impairs wound healing; discontinue before elected surgeries and do not initiate following surgery; withhold therapy until adequate wound healing",
              "Discontinue treatment in patients with wound healing complications requiring medical intervention",
              "Withhold for at least 28 days prior to elective surgery",
              "Do not administer for at least 28 days following surgery and until the wound is fully healed",
              "Necrotizing fasciitis including fatal cases, has been reported, usually secondary to wound healing complications, gastrointestinal perforation or fistula formation",
              "Safety of resumption of bevacizumab products after resolution of wound healing complications has not been established"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Contraindications & Cautions > Wound healing",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "contraindications-cautions.gi-perforation-and-fistula-formation",
            "title": "GI perforation and fistula formation",
            "summary": "Serious and sometimes fatal GI perforation occurs",
            "body": [
              "Serious and sometimes fatal GI perforation occurs",
              "Serious and sometimes fatal fistula formation involving tracheoesophageal, bronchopleural, biliary, vaginal, renal and bladder sites occurs at a higher incidence in bevacizumab-treated patients compared to controls",
              "Patients who develop a gastrointestinal vaginal fistula may also have a bowel obstruction and require surgical intervention, as well as a diverting ostomy",
              "Avoid in patients with ovarian cancer who have evidence of recto-sigmoid involvement by pelvic examination or bowel involvement on CT scan or clinical symptoms of bowel obstruction"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Contraindications & Cautions > GI perforation and fistula formation",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          }
        ]
      },
      {
        "id": "pregnancy-lactation",
        "title": "Pregnancy & Lactation",
        "lengthEstimate": "long",
        "subfields": [
          {
            "id": "pregnancy-lactation.pregnancy",
            "title": "Pregnancy",
            "summary": "Based on findings from animal studies and its mechanism of action, drug may cause fetal harm in pregnant women",
            "body": [
              "Based on findings from animal studies and its mechanism of action, drug may cause fetal harm in pregnant women",
              "Limited postmarketing reports describe cases of fetal malformations with bevacizumab use in pregnancy; however, these reports are insufficient to determine drug associated risks"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Pregnancy & Lactation > Pregnancy",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "pregnancy-lactation.animal-data",
            "title": "Animal data",
            "summary": "In animal reproduction studies, IV administration of bevacizumab to pregnant rabbits every 3 days during organogenesis at doses ~1-10 times the clinical dose of 10 mg/kg produced fetal resorptions, decreased maternal and fetal weight gain and multiple congenital malformations including corneal opacities and abnormal ossification of the skull and skeleton including limb and phalangeal defects",
            "body": [
              "In animal reproduction studies, IV administration of bevacizumab to pregnant rabbits every 3 days during organogenesis at doses ~1-10 times the clinical dose of 10 mg/kg produced fetal resorptions, decreased maternal and fetal weight gain and multiple congenital malformations including corneal opacities and abnormal ossification of the skull and skeleton including limb and phalangeal defects",
              "Animal models link angiogenesis and VEGF and VEGF Receptor 2 (VEGFR2) to critical aspects of female reproduction, embryofetal development, and postnatal development"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Pregnancy & Lactation > Animal data",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "pregnancy-lactation.contraception",
            "title": "Contraception",
            "summary": "Advise pregnant women of the potential risk to a fetus",
            "body": [
              "Advise pregnant women of the potential risk to a fetus",
              "Advise female patients of reproductive potential to use effective contraception during treatment and for 6 months following the last dose of bevacizumab"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Pregnancy & Lactation > Contraception",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "pregnancy-lactation.infertility",
            "title": "Infertility",
            "summary": "Inform females of reproductive potential of the risk of ovarian failure prior to starting; long term effects of bevacizumab exposure on fertility are unknown",
            "body": [
              "Inform females of reproductive potential of the risk of ovarian failure prior to starting; long term effects of bevacizumab exposure on fertility are unknown"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Pregnancy & Lactation > Infertility",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "pregnancy-lactation.lactation",
            "title": "Lactation",
            "summary": "No data available on the presence of bevacizumab in human milk, the effects on the breast fed infant, or the effects on milk production",
            "body": [
              "No data available on the presence of bevacizumab in human milk, the effects on the breast fed infant, or the effects on milk production",
              "Human IgG is present in human milk, but published data suggest that breast milk antibodies do not enter the neonatal and infant circulation in substantial amounts",
              "Because of the potential for serious adverse reactions in breastfed infants, advise women not to breastfeed during treatment and for 6 months after last dose"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Pregnancy & Lactation > Lactation",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          }
        ]
      },
      {
        "id": "pharmacology",
        "title": "Pharmacology",
        "lengthEstimate": "short",
        "subfields": [
          {
            "id": "pharmacology.mechanism-of-action",
            "title": "Mechanism of Action",
            "summary": "Recombinant humanized monoclonal antibody to VEGF; blocks the angiogenic molecule VEGF thereby inhibiting tumor angiogenesis, starving tumor of blood and nutrients",
            "body": [
              "Recombinant humanized monoclonal antibody to VEGF; blocks the angiogenic molecule VEGF thereby inhibiting tumor angiogenesis, starving tumor of blood and nutrients"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Pharmacology > Mechanism of Action",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "pharmacology.absorption",
            "title": "Absorption",
            "summary": "Steady-state concentration is 84 days",
            "body": [
              "Steady-state concentration is 84 days",
              "Accumulation ratio: 2.8 (following 10 mg/kg dose)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Pharmacology > Absorption",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "pharmacology.distribution",
            "title": "Distribution",
            "summary": "Vd: 2.9 L (mean); 3.2 L (males); 2.7 L (females)",
            "body": [
              "Vd: 2.9 L (mean); 3.2 L (males); 2.7 L (females)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Pharmacology > Distribution",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "pharmacology.elimination",
            "title": "Elimination",
            "summary": "Clearance: 0.23 L/day (mean); 0.26 L/day (males); 0.21 L/day (women)",
            "body": [
              "Clearance: 0.23 L/day (mean); 0.26 L/day (males); 0.21 L/day (women)",
              "Half-life: 20 days"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Pharmacology > Elimination",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          }
        ]
      },
      {
        "id": "administration",
        "title": "Administration",
        "lengthEstimate": "long",
        "subfields": [
          {
            "id": "administration.iv-compatibilities",
            "title": "IV Compatibilities",
            "summary": "0.9% NaCl",
            "body": [
              "0.9% NaCl"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Administration > IV Compatibilities",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "administration.iv-incompatibilities",
            "title": "IV Incompatibilities",
            "summary": "D5W or any dextrose-containing solution",
            "body": [
              "D5W or any dextrose-containing solution"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Administration > IV Incompatibilities",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "administration.iv-preparation",
            "title": "IV Preparation",
            "summary": "Visually inspect for particulate matter and discoloration prior to administration",
            "body": [
              "Visually inspect for particulate matter and discoloration prior to administration",
              "Do not use vial if solution is cloudy, discolored, or contains particulate matter",
              "Aseptically withdraw necessary amount & dilute in a total volume of 100 mL NS",
              "Diluted solutions for infusion may be stored at 2-8°C for 8 hr",
              "Do not shake vials or diluted solutions"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Administration > IV Preparation",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "administration.iv-administration",
            "title": "IV Administration",
            "summary": "IV infusion only; do not administer as IV push or bolus",
            "body": [
              "IV infusion only; do not administer as IV push or bolus",
              "First infusion: Infuse over 90 min",
              "Second infusion: Infuse over 60 min if first infusion is tolerated",
              "Subsequent infusions: Infuse over 30 min if second infusion over 60 min is tolerated"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Administration > IV Administration",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "administration.elective-surgery",
            "title": "Elective surgery",
            "summary": "Withhold for at least 28 days before elective surgery",
            "body": [
              "Withhold for at least 28 days before elective surgery",
              "Do not administer until at least 28 days following surgery and until adequate wound healing"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Administration > Elective surgery",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "administration.storage",
            "title": "Storage",
            "summary": "Do not freeze",
            "body": [
              "Do not freeze",
              "Protect vials from light",
              "Unused vials: Refrigerate at 2-8°C (36-46°F)",
              "Diluted solutions: Refrigerate at 2-8°C (36-46°F) for up to 8 hours"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Administration > Storage",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          }
        ]
      },
      {
        "id": "drug-interactions",
        "title": "Drug Interactions",
        "lengthEstimate": "long",
        "subfields": [
          {
            "id": "drug-interactions.serious-use-alternative",
            "title": "Serious - Use Alternative",
            "summary": "4 interaction(s) — Serious - Use Alternative",
            "body": [
              "etrasimod: Risk of additive immune system effects with etrasimod has not been studied in combination with antineoplastic, immune-modulating, or noncorticosteroid immunosuppressive therapies. Avoid coadministration during and in the weeks following administration of etrasimod.",
              "palifermin: Palifermin should not be administered within 24 hr before, during infusion of, or within 24 hr after administration of antineoplastic agents. Coadministration of palifermin within 24 hr of chemotherapy resulted in increased severity and duration of oral mucositis.",
              "ropeginterferon alfa 2b: Myelosuppressive agents can produce additive myelosuppression. Avoid use and monitor patients receiving the combination for effects of excessive myelosuppression",
              "sunitinib: Coadministration of bevacizumab and sunitinib is not recommended. Cases of microangiopathic hemolytic anemia (MAHA) have been reported."
            ],
            "source": {
              "label": "Drug Interactions (DIMS)",
              "section": "Drug Interactions > Serious - Use Alternative",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          },
          {
            "id": "drug-interactions.monitor-closely",
            "title": "Monitor Closely",
            "summary": "20 interaction(s) — Monitor Closely",
            "body": [
              "amlodipine: Monitor BP",
              "cholera vaccine: Immunosuppressive therapies, including irradiation, antimetabolites, alkylating agents, cytotoxic drugs and corticosteroids (used in greater than physiologic doses), may reduce the immune response to cholera vaccine.",
              "daunorubicin: Potential for increased risk of cardiotoxicity (CHF). Caution is warranted.",
              "dengue vaccine: Immunosuppressive therapies (eg, irradiation, antimetabolites, alkylating agents, cytotoxic drugs, corticosteroids [greater than physiologic doses]) may reduce immune response to dengue vaccine.",
              "doxorubicin liposomal: Potential for increased risk of cardiotoxicity (CHF). Caution is warranted.",
              "doxorubicin: Potential for increased risk of cardiotoxicity (CHF). Caution is warranted.",
              "efgartigimod alfa: Coadministration of efgartigimod with medications that bind to the human neonatal Fc receptor may lower systemic exposures and effectiveness of such medications. Closely monitor for reduced effectiveness of medications that bind to the human neonatal Fc receptor. If long-term use of such medications is essential, consider discontinuing efgartigimod and using alternative therapies.",
              "efgartigimod/hyaluronidase: Coadministration of efgartigimod with medications that bind to the human neonatal Fc receptor may lower systemic exposures and effectiveness of such medications. Closely monitor for reduced effectiveness of medications that bind to the human neonatal Fc receptor. If long-term use of such medications is essential, consider discontinuing efgartigimod and using alternative therapies.",
              "epirubicin: Potential for increased risk of cardiotoxicity (CHF). Caution is warranted.",
              "idarubicin: Potential for increased risk of cardiotoxicity (CHF). Caution is warranted.",
              "irinotecan liposomal: Potential for increased risk of diarrhea and neutropenia during concomitant administration of  bevacizumab and irinotecan.",
              "irinotecan: Potential for increased risk of diarrhea and neutropenia during concomitant administration of  bevacizumab and irinotecan.",
              "nipocalimab: Coadministration of nipocalimab with medications that bind to the human neonatal Fc receptor may lower systemic exposures and effectiveness of such medications. Closely monitor for reduced effectiveness of medications that bind to the human neonatal Fc receptor. If long-term use of such medications is essential, consider discontinuing nipocalimab and using alternative therapies.",
              "paclitaxel protein bound: Possible decreased paclitaxel exposure after 4 treatment cycles of bevacizumab in combination with paclitaxel and carboplatin.",
              "paclitaxel: Possible decreased paclitaxel exposure after 4 treatment cycles of bevacizumab in combination with paclitaxel and carboplatin.",
              "ponesimod: Caution if coadministered because of additive immunosuppressive effects during such therapy and in the weeks following administration. When switching from drugs with prolonged immune effects, consider the half-life and mode of action of these drugs to avoid unintended additive immunosuppressive effects.",
              "rozanolixizumab: Coadministration of rozanolixizumab with medications that bind to the human neonatal Fc receptor may lower systemic exposures and effectiveness of such medications. Closely monitor for reduced effectiveness of medications that bind to the human neonatal Fc receptor. If long-term use of such medications is essential, consider discontinuing rozanolixizumab and using alternative therapies.",
              "siponimod: Caution if coadministered because of additive immunosuppressive effects during such therapy and in the weeks following administration. When switching from drugs with prolonged immune effects, consider the half-life and mode of action of these drugs to avoid unintended additive immunosuppressive effects.",
              "sorafenib: Monitor for development of hand-foot skin reactions during combination therapy.",
              "ublituximab: Owing to potential additive immunosuppressive effects, consider duration of effect and mechanism of action of these therapies if coadministered"
            ],
            "source": {
              "label": "Drug Interactions (DIMS)",
              "section": "Drug Interactions > Monitor Closely",
              "url": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257"
            }
          }
        ]
      }
    ],
    "synthesizedAnswers": {},
    "taskChips": [],
    "_meta": {
      "rootGuid": "201901000090",
      "sourceUrl": "https://reference.medscape.com/drug/avastin-mvasi-bevacizumab-342257",
      "contentVersion": "342257"
    }
  },
  {
    "blackBoxWarnings": [],
    "drug": {
      "drugClass": "Antineoplastics, VEGF Inhibitors",
      "id": "ramucirumab",
      "name": "Ramucirumab"
    },
    "keyFields": [],
    "sections": [
      {
        "id": "adult-dosing-uses",
        "title": "Adult Dosing & Uses",
        "lengthEstimate": "long",
        "subfields": [
          {
            "id": "adult-dosing-uses.combination-therapy-with-docetaxel",
            "title": "Combination therapy with docetaxel",
            "summary": "Indicated in combination with docetaxel for metastatic non-small cell lung cancer (NSCLC) with disease progression on or after platinum-based chemotherapy",
            "body": [
              "Indicated in combination with docetaxel for metastatic non-small cell lung cancer (NSCLC) with disease progression on or after platinum-based chemotherapy",
              "Patients with epidermal growth factor receptor (EGFR) or anaplastic lymphoma kinase (ALK) genomic tumor aberrations should have disease progression before receiving ramucirumab",
              "Ramucirumab 10 mg/kg IV on Day 1, PLUS",
              "Docetaxel 75 mg/m2 IV on Day 1",
              "Repeat cycle every 21 days",
              "Continue until disease progression or unacceptable toxicity"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosing & Uses > Combination therapy with docetaxel",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "adult-dosing-uses.combination-therapy-with-erlotinib",
            "title": "Combination therapy with erlotinib",
            "summary": "Indicated in combination with erlotinib, for first-line treatment of metastatic NSCLC in patients whose tumors have EGFR exon 19 deletions or exon 21 (L858R) substitution mutations",
            "body": [
              "Indicated in combination with erlotinib, for first-line treatment of metastatic NSCLC in patients whose tumors have EGFR exon 19 deletions or exon 21 (L858R) substitution mutations",
              "Ramucirumab 10 mg/kg IV every 2 weeks, PLUS",
              "Erlotinib 150 mg PO daily",
              "Continue until disease progression or unacceptable toxicity",
              "Refer to prescribing information for erlotinib for dosage information"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosing & Uses > Combination therapy with erlotinib",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "adult-dosing-uses.gastric-cancer",
            "title": "Gastric Cancer",
            "summary": "As a single agent or in combination with paclitaxel for advanced gastric or gastro-esophageal junction adenocarcinoma in patients with disease progression on or after prior fluoropyrimidine-or platinum-containing chemotherapy",
            "body": [
              "As a single agent or in combination with paclitaxel for advanced gastric or gastro-esophageal junction adenocarcinoma in patients with disease progression on or after prior fluoropyrimidine-or platinum-containing chemotherapy",
              "Single agent: Ramucirumab 8 mg/kg IV every 2 weeks"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosing & Uses > Gastric Cancer",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "adult-dosing-uses.combination-with-paclitaxel",
            "title": "Combination with paclitaxel",
            "summary": "Days 1 and 15: Ramucirumab 8 mg/kg IV",
            "body": [
              "Days 1 and 15: Ramucirumab 8 mg/kg IV",
              "Days 1, 8, and 15: Paclitaxel 80 mg/m2",
              "Repeat cycle every 28 days",
              "Continue until disease progression or unacceptable toxicity"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosing & Uses > Combination with paclitaxel",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "adult-dosing-uses.colorectal-cancer",
            "title": "Colorectal Cancer",
            "summary": "Indicated for use in combination with FOLFIRI for patients with metastatic colorectal cancer (mCRC) whose disease has progressed on a first-line bevacizumab-, oxaliplatin- and fluoropyrimidine-containing regimen",
            "body": [
              "Indicated for use in combination with FOLFIRI for patients with metastatic colorectal cancer (mCRC) whose disease has progressed on a first-line bevacizumab-, oxaliplatin- and fluoropyrimidine-containing regimen",
              "Ramucirumab 8 mg/kg IV every 2 weeks in combination with FOLFIRI",
              "Continue until disease progression or unacceptable toxicity"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosing & Uses > Colorectal Cancer",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "adult-dosing-uses.hepatocellular-carcinoma",
            "title": "Hepatocellular Carcinoma",
            "summary": "Indicated as a single agent for hepatocellular carcinoma (HCC) in patients with alpha fetoprotein (AFP) of ≥400 ng/mL who have been treated with sorafenib",
            "body": [
              "Indicated as a single agent for hepatocellular carcinoma (HCC) in patients with alpha fetoprotein (AFP) of ≥400 ng/mL who have been treated with sorafenib",
              "8 mg/kg IV every 2 weeks until disease progression or unacceptable toxicity"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosing & Uses > Hepatocellular Carcinoma",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "adult-dosing-uses.dosage-modifications",
            "title": "Dosage Modifications",
            "summary": "Posterior reversible encephalopathy syndrome (PRES), arterial thromboembolic events, GI perforation, or grade 3 or 4 hemorrhage: Permanently discontinue",
            "body": [
              "Posterior reversible encephalopathy syndrome (PRES), arterial thromboembolic events, GI perforation, or grade 3 or 4 hemorrhage: Permanently discontinue"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosing & Uses > Dosage Modifications",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "adult-dosing-uses.wound-healing",
            "title": "Wound healing (all grades)",
            "summary": "Withhold for 28 days before elective surgery; resume no sooner than 2 weeks after surgery and until adequate wound healing",
            "body": [
              "Withhold for 28 days before elective surgery; resume no sooner than 2 weeks after surgery and until adequate wound healing",
              "Safety of resumption of ramucirumab after resolution of wound healing complications has not been established"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosing & Uses > Wound healing (all grades)",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "adult-dosing-uses.infusion-related-reactions",
            "title": "Infusion-related reactions",
            "summary": "Grade 1 or 2: Reduce infusion rate by 50%",
            "body": [
              "Grade 1 or 2: Reduce infusion rate by 50%",
              "Grade 3 or 4: Permanently discontinue"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosing & Uses > Infusion-related reactions",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "adult-dosing-uses.hypertension",
            "title": "Hypertension",
            "summary": "Severe hypertension: Interrupt therapy until controlled with medical management",
            "body": [
              "Severe hypertension: Interrupt therapy until controlled with medical management",
              "Uncontrolled severe hypertension despite antihypertensive therapy: Permanently discontinue"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosing & Uses > Hypertension",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "adult-dosing-uses.proteinuria",
            "title": "Proteinuria",
            "summary": "First occurrence of increased urine protein levels ≥2 g/24 hr: Withhold dose until urine protein levels <2 g/24 hr; resume at reduced dose (eg, reduce 8 mg/kg to 6 mg/kg, 10 mg/kg to 8 mg/kg)",
            "body": [
              "First occurrence of increased urine protein levels ≥2 g/24 hr: Withhold dose until urine protein levels <2 g/24 hr; resume at reduced dose (eg, reduce 8 mg/kg to 6 mg/kg, 10 mg/kg to 8 mg/kg)",
              "Reoccurrence of protein level ≥2 g/24 hr: Withhold dose until urine protein <2 g/24 hr; resume at reduced dose (eg, reduce 6 mg/kg to 5 mg/kg, 8 mg/kg to 6 mg/kg)",
              "Urine protein level >3 g/24 hr or nephrotic syndrome: Permanently discontinue"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosing & Uses > Proteinuria",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "adult-dosing-uses.hepatic-impairment",
            "title": "Hepatic impairment",
            "summary": "Mild-to-moderate (total bilirubin ≤3x ULN and any AST): No dosage adjustment necessary",
            "body": [
              "Mild-to-moderate (total bilirubin ≤3x ULN and any AST): No dosage adjustment necessary",
              "Severe (total bilirubin >3x ULN and any AST): Pharmacokinetics unknown",
              "Clinical deterioration was reported in patients with Child-Pugh B or C cirrhosis who received single agent ramucirumab"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosing & Uses > Hepatic impairment",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "adult-dosing-uses.renal-impairment",
            "title": "Renal impairment",
            "summary": "Mild-to-severe (CrCl 15-89 mL/min): No clinically meaningful effect on pharmacokinetics",
            "body": [
              "Mild-to-severe (CrCl 15-89 mL/min): No clinically meaningful effect on pharmacokinetics"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosing & Uses > Renal impairment",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "adult-dosing-uses.dosing-considerations",
            "title": "Dosing Considerations",
            "summary": "Blood pressure should be controlled before initiating treatment and monitored every 2 weeks or more frequently if indicated",
            "body": [
              "Blood pressure should be controlled before initiating treatment and monitored every 2 weeks or more frequently if indicated"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosing & Uses > Dosing Considerations",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          }
        ]
      },
      {
        "id": "adult-dosage-f-s",
        "title": "Adult Dosage F&S",
        "lengthEstimate": "short",
        "subfields": [
          {
            "id": "adult-dosage-f-s.iv-solution",
            "title": "IV solution",
            "summary": "10mg/mL (10mL and 50mL vials)",
            "body": [
              "10mg/mL (10mL and 50mL vials)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adult Dosage F&S > IV solution",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          }
        ]
      },
      {
        "id": "pediatric-dosing-uses",
        "title": "Pediatric Dosing & Uses",
        "lengthEstimate": "short",
        "subfields": [
          {
            "id": "pediatric-dosing-uses.all",
            "title": "Pediatric Dosing & Uses",
            "summary": "Safety and efficacy not established",
            "body": [
              "Safety and efficacy not established"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Pediatric Dosing & Uses",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          }
        ]
      },
      {
        "id": "adverse-effects",
        "title": "Adverse Effects",
        "lengthEstimate": "long",
        "subfields": [
          {
            "id": "adverse-effects.overview",
            "title": "Adverse Effects",
            "summary": "All grades unless otherwise states",
            "body": [
              "All grades unless otherwise states"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adverse Effects",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "adverse-effects.single-agent",
            "title": "Single agent",
            "summary": "Hypertension (16%)",
            "body": [
              "Hypertension (16%)",
              "Diarrhea (14%)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adverse Effects > Single agent",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "adverse-effects.combination-therapy",
            "title": "Combination therapy",
            "summary": "Fatigue/asthenia (57%)",
            "body": [
              "Fatigue/asthenia (57%)",
              "Neutropenia (54%)",
              "Neutropenia, Grade 3-4 (41%)",
              "Diarrhea (32%)",
              "Epistaxis (31%)",
              "Peripheral edema (25%)",
              "Hypertension (25%)",
              "Stomatitis (20%)",
              "Proteinuria (17%)",
              "Hypertension, Grade 3-4 (15%)",
              "Thrombocytopenia (13%)",
              "Fatigue/asthenia, Grade 3-4 (12%)",
              "Hypoalbuminemia (11%)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adverse Effects > Combination therapy",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "adverse-effects.combination-with-erlotinib",
            "title": "Combination with erlotinib",
            "summary": "Infections (81%)",
            "body": [
              "Infections (81%)",
              "ALT increased (74%)",
              "AST increased (71%)",
              "Diarrhea (70%)",
              "Hypertension (45%)",
              "Anemia (42%)",
              "Stomatitis (42%)",
              "Thrombocytopenia (41%)",
              "Proteinuria (34%)",
              "Alopecia (34%)",
              "Epistaxis (34%)",
              "Neutropenia (33%)",
              "Alkaline phosphatase increased (25%)",
              "Hypokalemia (24%)",
              "Hypertension, Grade 3-4 (24%)",
              "Peripheral edema (23%)",
              "Infections, Grade 3-4 (17%)",
              "Headache (15%)",
              "ALT increased, Grade 3-4 (11%)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adverse Effects > Combination with erlotinib",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "adverse-effects.combination-with-docetaxel",
            "title": "Combination with docetaxel",
            "summary": "Neutropenia (55%)",
            "body": [
              "Neutropenia (55%)",
              "Fatigue/asthenia (55%)",
              "Neutropenia, Grade 3-4 (49%)",
              "Stomatitis/mucosal inflammation (37%)",
              "Epistaxis (19%)",
              "Febrile neutropenia (16%)",
              "Peripheral edema (16%)",
              "Fatigue/asthenia, Grade 3-4 (14%)",
              "Thrombocytopenia (13%)",
              "Lacrimation increased (13%)",
              "Hypertension (11%)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adverse Effects > Combination with docetaxel",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "adverse-effects.10",
            "title": ">10% (Hepatocellular Carcinoma)",
            "summary": "Thrombocytopenia (46%)",
            "body": [
              "Thrombocytopenia (46%)",
              "Fatigue (36%)",
              "Hypoalbuminemia (33%)",
              "Hyponatremia (32%)",
              "Peripheral edema (25%)",
              "Hypertension (25%)",
              "Abdominal pain (25%)",
              "Neutropenia (24%)",
              "Decreased appetite (23%)",
              "Proteinuria (20%)",
              "Nausea (19%)",
              "Ascites (18%)",
              "Hypocalcemia (16%)",
              "Hyponatremia, Grade 3-4 (16%)",
              "Headache (14%)",
              "Epistaxis (14%)",
              "Hypertension, Grade 3-4 (13%)",
              "Insomnia (11%)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adverse Effects > >10% (Hepatocellular Carcinoma)",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "adverse-effects.10",
            "title": ">10% (Colorectal Cancer)",
            "summary": "Diarrhea (60%)",
            "body": [
              "Diarrhea (60%)",
              "Neutropenia (59%)",
              "Decreased appetite (37%)",
              "Epistaxis (33%)",
              "Stomatitis (31%)",
              "Thrombocytopenia (28%)",
              "Hypertension (26%)",
              "Peripheral edema (20%)",
              "Proteinuria (17%)",
              "Palmoplantar erythrodysesthesia syndrome (13%)",
              "Gastrointestinal hemorrhage events (12%)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adverse Effects > >10% (Colorectal Cancer)",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "adverse-effects.single-agent",
            "title": "Single agent",
            "summary": "Headache (9%)",
            "body": [
              "Headache (9%)",
              "Proteinuria, Grade 3-4 (8%)",
              "Hypertension, Grade 3-4 (8%)",
              "Hyponatremia (6%)",
              "Neutropenia (4.7%)",
              "Epistaxis (4.7%)",
              "Rash (4.2%)",
              "Hyponatremia, Grade 3-4 (3%)",
              "Intestinal obstruction (2.1%)",
              "Arterial thromboembolic events (1.7%)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adverse Effects > Single agent",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "adverse-effects.combination-therapy",
            "title": "Combination therapy",
            "summary": "Gastrointestinal hemorrhage events (10%)",
            "body": [
              "Gastrointestinal hemorrhage events (10%)",
              "Diarrhea, Grade 3-4 (4%)",
              "Gastrointestinal hemorrhage events, Grade 3-4 (4%)",
              "Sepsis (3.1%)",
              "Peripheral edema, Grade 3-4 (2%)",
              "Thrombocytopenia, Grade 3-4 (2%)",
              "Gastrointestinal perforations (1.2%)",
              "Stomatitis, Grade 3-4 (1%)",
              "Proteinuria, Grade 3-4 (1%)",
              "Hypoalbuminemia, Grade 3-4 (1%)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adverse Effects > Combination therapy",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "adverse-effects.combination-with-erlotinib",
            "title": "Combination with erlotinib",
            "summary": "Gastrointestinal hemorrhage (10%)",
            "body": [
              "Gastrointestinal hemorrhage (10%)",
              "Gingival bleeding (9%)",
              "Pulmonary hemorrhage (7%)",
              "Diarrhea, Grade 3-4 (7%)",
              "Neutropenia, Grade 3-4 (7%)",
              "AST increased, Grade 3-4 (6%)",
              "Hypokalemia, Grade 3-4 (5%)",
              "Anemia, Grade 3-4 (5%)",
              "Thrombocytopenia, Grade 3-4 (3%)",
              "Proteinuria, Grade 3-4 (3%)",
              "Stomatitis, Grade 3-4 (2%)",
              "Gastrointestinal hemorrhage, Grade 3-4 (1%)",
              "Pneumonia (3.2%)",
              "Cellulitis (1.8%)",
              "Pneumothorax (1.8%)",
              "Increased ALT (1.4%)",
              "Paronychia (1.4%)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adverse Effects > Combination with erlotinib",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "adverse-effects.combination-with-docetaxel",
            "title": "Combination with docetaxel",
            "summary": "Stomatitis/mucosal inflammation, Grade 3-4 (7%)",
            "body": [
              "Stomatitis/mucosal inflammation, Grade 3-4 (7%)",
              "Hypoalbuminemia (6%)",
              "Hypertension, Grade 3-4 (6%)",
              "Hyponatremia (4.8%)",
              "Stomatitis, Grade 3-4 (4%)",
              "Proteinuria (3.3%)",
              "Thrombocytopenia, Grade 3-4 (3%)",
              "Decreased appetite, Grade 3-4 (2%)",
              "Gastrointestinal hemorrhage events, Grade 3-4 (2%)",
              "Palmoplantar erythrodysesthesia syndrome, Grade 3-4 (1%)",
              "Hypoalbuminemia, Grade 3-4 (1%)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adverse Effects > Combination with docetaxel",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "adverse-effects.1-10",
            "title": "1-10% (Hepatocellular Carcinoma)",
            "summary": "Pyrexia (10%)",
            "body": [
              "Pyrexia (10%)",
              "Vomiting (10%)",
              "Back pain (10%)",
              "Infusion-related reactions (9%)",
              "Thrombocytopenia, Grade 3-4 (8%)",
              "Neutropenia, Grade 3-4 (8%)",
              "Hepatic encephalopathy (5%)",
              "Fatigue, Grade 3-4 (5%)",
              "Ascites, Grade 3-4 (4%)",
              "Hypocalcemia, Grade 3-4 (2%)",
              "Hepatorenal syndrome (2%)",
              "Peripheral edema, Grade 3-4 (2%)",
              "Decreased appetite, Grade 3-4 (2%)",
              "Abdominal pain, Grade 3-4 (2%)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adverse Effects > 1-10% (Hepatocellular Carcinoma)",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "adverse-effects.single-agent",
            "title": "Single agent",
            "summary": "Gastrointestinal perforation, Grade 3-4 (0.8%)",
            "body": [
              "Gastrointestinal perforation, Grade 3-4 (0.8%)",
              "Infusion-related reactions, Grade 3-4 (0.4%)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adverse Effects > Single agent",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "adverse-effects.combination-with-erlotinib",
            "title": "Combination with erlotinib",
            "summary": "Alkaline phosphate increased, Grade 3-4 (<1%)",
            "body": [
              "Alkaline phosphate increased, Grade 3-4 (<1%)",
              "Pulmonary hemorrhage, Grade 3-4 (<1%)",
              "Peripheral edema, Grade 3-4 (<1%)",
              "Headache, Grade 3-4 (<1%)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adverse Effects > Combination with erlotinib",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "adverse-effects.combination-with-docetaxel",
            "title": "Combination with docetaxel",
            "summary": "Epistaxis, Grade 3-4 (<1%)",
            "body": [
              "Epistaxis, Grade 3-4 (<1%)",
              "Lacrimation increased, Grade 3-4 (<1%)"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adverse Effects > Combination with docetaxel",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "adverse-effects.1",
            "title": "<1% (Hepatocellular Carcinoma)",
            "summary": "Epistaxis, Grade 3-4 (<1%)",
            "body": [
              "Epistaxis, Grade 3-4 (<1%)",
              "Back pain, Grade 3-4 (<1%)",
              "Hypoalbuminemia, Grade 3-4 (<1%)",
              "Postmarketing Reports H3",
              "Blood and lymphatic system: Thrombotic microangiopathy",
              "Neoplasms benign, malignant and unspecified: Hemangioma",
              "Respiratory, thoracic, and mediastinal: Dysphonia"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adverse Effects > <1% (Hepatocellular Carcinoma)",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "adverse-effects.postmarketing-reports",
            "title": "Postmarketing Reports",
            "summary": "Blood and lymphatic system: Thrombotic microangiopathy",
            "body": [
              "Blood and lymphatic system: Thrombotic microangiopathy",
              "Neoplasms benign, malignant and unspecified: Hemangioma",
              "Respiratory, thoracic, and mediastinal: Dysphonia",
              "Vascular: Arterial (including aortic) aneurysms, dissections, and rupture",
              "Cardiac: Heart failure"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Adverse Effects > Postmarketing Reports",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          }
        ]
      },
      {
        "id": "warnings",
        "title": "Warnings",
        "lengthEstimate": "long",
        "subfields": [
          {
            "id": "warnings.contraindications",
            "title": "Contraindications",
            "summary": "None",
            "body": [
              "None"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Warnings > Contraindications",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "warnings.cautions",
            "title": "Cautions",
            "summary": "Increased risk of hemorrhage and GI hemorrhage, including severe and sometimes fatal hemorrhagic events; permanently discontinue in patients who experience severe bleeding",
            "body": [
              "Increased risk of hemorrhage and GI hemorrhage, including severe and sometimes fatal hemorrhagic events; permanently discontinue in patients who experience severe bleeding",
              "Serious, sometimes fatal, arterial thromboembolic events including myocardial infarction, cardiac arrest, cerebrovascular accident, and cerebral ischemia reported during clinical trials",
              "Increased incidence of severe hypertension reported; control hypertension before initiating treatment and monitor blood pressure q2weeks or more frequently as indicated; temporarily suspend therapy for severe hypertension",
              "Infusion-related reactions observed that include rigors/tremors, back pain/spasms, chest pain and/or tightness, chills, flushing, dyspnea, wheezing, hypoxia, and paresthesia; in severe cases, symptoms included bronchospasm, supraventricular tachycardia, and hypotension",
              "Ramucirumab is an antiangiogenic therapy that can increase the risk of GI perforation and affect wound healing; withhold prior to surgery; permanently discontinue ramucirumab in patients who experience a gastrointestinal perforation",
              "Impaired wound healing can occur with antibodies inhibiting the VEGF or VEGFR pathway; VEGFR2 antagonist has the potential to adversely affect wound healing; not studied in patients with serious or non-healing wounds",
              "Withhold for 28 days prior to elective surgery; do not administer for at least 2 weeks following a major surgical procedure and until adequate wound healing; safety of resumption after resolution of wound healing complications not established",
              "Clinical deterioration, manifested by new-onset or worsening encephalopathy, ascites, or hepatorenal syndrome, reported in patients with Child-Pugh B or C cirrhosis; use only if the benefits outweigh the risks",
              "Posterior reversible encephalopathy syndrome (PRES), also known as reversible posterior leukoencephalopathy syndrome (RPLS), reported; confirm diagnosis with magnetic resonance imaging; permanently discontinue in patients who develop PRES; symptoms may resolve or improve within days; some patients can experience ongoing neurologic sequelae or death",
              "Severe proteinuria, including nephrotic syndrome, reported, monitor proteinuria by urine dipstick and/or urinary protein creatinine ratio; if result of urine dipstick is 2+ or greater, perform a 24-hour urine collection for protein measurement; withhold drug for urine protein levels that are 2 or more grams over 24 hours; reinitiate drug at a reduced dose once urine protein level returns to < 2 grams over 24 hours; permanently discontinue therapy for urine protein levels > 3 grams over 24 hours or in setting of nephrotic syndrome",
              "May cause hypothyroidism; monitor thyroid function during treatment",
              "May cause fetal harm when administered to pregnant women"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Warnings > Cautions",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          }
        ]
      },
      {
        "id": "pregnancy-lactation",
        "title": "Pregnancy & Lactation",
        "lengthEstimate": "long",
        "subfields": [
          {
            "id": "pregnancy-lactation.pregnancy",
            "title": "Pregnancy",
            "summary": "Based on its mechanism of action, fetal harm may occur when administered to a pregnant woman",
            "body": [
              "Based on its mechanism of action, fetal harm may occur when administered to a pregnant woman",
              "There are no available data on use in pregnant women"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Pregnancy & Lactation > Pregnancy",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "pregnancy-lactation.animal-data",
            "title": "Animal data",
            "summary": "Animal models link angiogenesis, VEGF and VEGFR2 to critical aspects of female reproduction, embryo-fetal development, and postnatal development",
            "body": [
              "Animal models link angiogenesis, VEGF and VEGFR2 to critical aspects of female reproduction, embryo-fetal development, and postnatal development",
              "Advise a pregnant woman of the potential risk to a fetus"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Pregnancy & Lactation > Animal data",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "pregnancy-lactation.pregnancy-testing",
            "title": "Pregnancy testing",
            "summary": "Verify pregnancy status of females of reproductive potential before initiating therapy",
            "body": [
              "Verify pregnancy status of females of reproductive potential before initiating therapy"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Pregnancy & Lactation > Pregnancy testing",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "pregnancy-lactation.contraception",
            "title": "Contraception",
            "summary": "Females: Advise females of reproductive potential to use effective contraception during treatment and for 3 months after the last dose",
            "body": [
              "Females: Advise females of reproductive potential to use effective contraception during treatment and for 3 months after the last dose"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Pregnancy & Lactation > Contraception",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "pregnancy-lactation.infertility",
            "title": "Infertility",
            "summary": "Advise females of reproductive potential that based on animal data, fertility may be impaired",
            "body": [
              "Advise females of reproductive potential that based on animal data, fertility may be impaired"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Pregnancy & Lactation > Infertility",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "pregnancy-lactation.lactation",
            "title": "Lactation",
            "summary": "Unknown if distributed in human breast milk; a decision should be made whether to discontinue breastfeeding or discontinue the drug, taking into account the importance of the drug to the mother",
            "body": [
              "Unknown if distributed in human breast milk; a decision should be made whether to discontinue breastfeeding or discontinue the drug, taking into account the importance of the drug to the mother",
              "Human IgG is excreted in human milk, but published data suggest that breast milk antibodies do not enter the neonatal and infant circulation in substantial amounts"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Pregnancy & Lactation > Lactation",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          }
        ]
      },
      {
        "id": "pharmacology",
        "title": "Pharmacology",
        "lengthEstimate": "long",
        "subfields": [
          {
            "id": "pharmacology.mechanism-of-action",
            "title": "Mechanism of Action",
            "summary": "Vascular endothelial growth factor receptor 2 (VEGFR2) antagonist that specifically binds VEGF receptor 2 and blocks binding of VEGFR ligands, VEGF-A, VEGF-C, and VEGF-D",
            "body": [
              "Vascular endothelial growth factor receptor 2 (VEGFR2) antagonist that specifically binds VEGF receptor 2 and blocks binding of VEGFR ligands, VEGF-A, VEGF-C, and VEGF-D",
              "As a result, ramucirumab inhibits ligand-stimulated activation of VEGF2, thereby inhibiting ligand-induced proliferation, and migration of human endothelial cells"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Pharmacology > Mechanism of Action",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "pharmacology.absorption",
            "title": "Absorption",
            "summary": "Steady-state achieved at ~ 12 weeks",
            "body": [
              "Steady-state achieved at ~ 12 weeks"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Pharmacology > Absorption",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "pharmacology.distribution",
            "title": "Distribution",
            "summary": "Vd (steady-state): 5.4L",
            "body": [
              "Vd (steady-state): 5.4L"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Pharmacology > Distribution",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "pharmacology.elimination",
            "title": "Elimination",
            "summary": "Clearance: 0.015 L/hr",
            "body": [
              "Clearance: 0.015 L/hr",
              "Half-life: 14 days"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Pharmacology > Elimination",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "pharmacology.pharmacogenomics",
            "title": "Pharmacogenomics",
            "summary": "NSCLC: Patients with EGFR or ALK genomic tumor aberrations should have disease progression on FDA-approved therapy for these aberrations prior to receiving ramucirumab",
            "body": [
              "NSCLC: Patients with EGFR or ALK genomic tumor aberrations should have disease progression on FDA-approved therapy for these aberrations prior to receiving ramucirumab"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Pharmacology > Pharmacogenomics",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          }
        ]
      },
      {
        "id": "administration",
        "title": "Administration",
        "lengthEstimate": "long",
        "subfields": [
          {
            "id": "administration.iv-compatibilities",
            "title": "IV Compatibilities",
            "summary": "0.9% NaCl",
            "body": [
              "0.9% NaCl"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Administration > IV Compatibilities",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "administration.iv-incompatibilities",
            "title": "IV Incompatibilities",
            "summary": "Dextrose-containing solutions",
            "body": [
              "Dextrose-containing solutions"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Administration > IV Incompatibilities",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "administration.iv-preparation",
            "title": "IV Preparation",
            "summary": "Visually inspect vials for particulate matter and discoloration",
            "body": [
              "Visually inspect vials for particulate matter and discoloration",
              "Discard if particulate matter or discolorations identified",
              "Calculate dose and withdraw required volume",
              "Further dilute with only 0.9% NaCl in IV infusion container to final volume of 250 mL",
              "Do not shake; gently invert container to ensure adequate mixing",
              "Do not dilute with other solutions or infuse with other electrolytes or medications; do not freeze",
              "Discard any unused portion"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Administration > IV Preparation",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "administration.premedication",
            "title": "Premedication",
            "summary": "Before each infusion, premedicate all patients with an IV histamine-1 receptor antagonist (eg, diphenhydramine)",
            "body": [
              "Before each infusion, premedicate all patients with an IV histamine-1 receptor antagonist (eg, diphenhydramine)",
              "For patients who have experienced a grade 1 or 2 IRR, premedicate with a histamine-1 receptor antagonist, dexamethasone (or equivalent), and acetaminophen before each infusion"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Administration > Premedication",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "administration.iv-administration",
            "title": "IV Administration",
            "summary": "Visually inspect diluted solution for particulate matter and discoloration before administration",
            "body": [
              "Visually inspect diluted solution for particulate matter and discoloration before administration",
              "Discard if particulate matter or discolorations are identified; do not administer as an IV push or bolus",
              "Administer diluted solution via infusion pump through a separate infusion line; use a protein sparing 0.22 micron filter",
              "Infuse IV infusion over 60 min; if first infusion is tolerated, all subsequent infusion may be administered over 30 min",
              "When given in combination therapy, administer ramucirumab first 1 hr prior to other therapies (eg, paclitaxel, docetaxel, or FOLFIRI)",
              "Flush line with sterile 0.9% NaCl at the end of infusion"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Administration > IV Administration",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "administration.unopened-vials",
            "title": "Unopened vials",
            "summary": "Refrigerate at 2-8ºC (36-46ºF)",
            "body": [
              "Refrigerate at 2-8ºC (36-46ºF)",
              "Keep the vial in the outer carton to protect from light"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Administration > Unopened vials",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          },
          {
            "id": "administration.diluted-infusion",
            "title": "Diluted infusion",
            "summary": "Administer within 24 hr of dilution",
            "body": [
              "Administer within 24 hr of dilution",
              "Store refrigerated at 2-8ºC (36-46ºF) or 4 hr at room temperature (ie, below 25ºC [77ºF])",
              "Do not freeze",
              "Discard partially used vials"
            ],
            "source": {
              "label": "Drug Reference",
              "section": "Administration > Diluted infusion",
              "url": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926"
            }
          }
        ]
      }
    ],
    "synthesizedAnswers": {},
    "taskChips": [],
    "_meta": {
      "rootGuid": "2019010006mg",
      "sourceUrl": "https://reference.medscape.com/drug/cyramza-ramucirumab-999926",
      "contentVersion": "999926"
    }
  }
] as unknown as PocScenarioMonograph[];

function withPopulation(
  subfield: DrugSubfield,
  population: "adult" | "pediatric",
): DrugSubfield {
  return { ...subfield, population };
}

type DosingGroup = {
  id: string;
  nested: Array<{ id: string; title?: string }>;
  title: string;
};

const POC_SECTION_PRESENTATION: Array<{ id: string; title: string }> = [
  { id: "drug-interactions", title: "Interactions" },
  { id: "adverse-effects", title: "Adverse Effects" },
  { id: "contraindications-cautions", title: "Warnings" },
  { id: "pregnancy-lactation", title: "Pregnancy" },
  { id: "pharmacology", title: "Pharmacology" },
  { id: "administration", title: "Administration" },
];

const BEVACIZUMAB_DOSING_GROUPS: DosingGroup[] = [
  {
    id: "adult-dosing-uses.metastatic-colorectal-cancer",
    nested: [
      {
        id: "adult-dosing-uses.in-combination-with-fluorouracil-based-chemotherapy",
      },
      {
        id: "adult-dosing-uses.in-combination-with-a-fluoropyrimidine-plus-irinotecan-or-oxaliplatin-based-chemotherapy",
      },
    ],
    title: "Metastatic Colorectal Cancer",
  },
  {
    id: "adult-dosing-uses.ovarian-fallopian-tube-or-peritoneal-cancer-group",
    nested: [
      {
        id: "adult-dosing-uses.ovarian-fallopian-tube-or-peritoneal-cancer",
        title: "Platinum-resistant",
      },
      { id: "adult-dosing-uses.platinum-sensitive" },
      {
        id: "adult-dosing-uses.treatment-of-stage-iii-or-iv-disease-following-initial-surgical-resection",
      },
    ],
    title: "Ovarian, Fallopian Tube, or Peritoneal Cancer",
  },
  {
    id: "adult-dosing-uses.hepatocellular-carcinoma-group",
    nested: [
      {
        id: "adult-dosing-uses.hepatocellular-carcinoma",
        title: "Avastin only",
      },
    ],
    title: "Hepatocellular Carcinoma",
  },
  {
    id: "adult-dosing-uses.dosage-modifications",
    nested: [
      { id: "adult-dosing-uses.discontinue-treatment" },
      { id: "adult-dosing-uses.withhold-treatment" },
      { id: "adult-dosing-uses.infusion-reaction" },
    ],
    title: "Dosage Modifications",
  },
];

function groupBevacizumabDosingRows(
  subfields: DrugSubfield[],
): DrugSubfield[] {
  const byId = new Map(subfields.map((subfield) => [subfield.id, subfield]));
  const groupByFirstChildId = new Map(
    BEVACIZUMAB_DOSING_GROUPS.map((group) => [group.nested[0]!.id, group]),
  );
  const groupedChildIds = new Set(
    BEVACIZUMAB_DOSING_GROUPS.flatMap((group) =>
      group.nested.map((nested) => nested.id),
    ),
  );

  return subfields.flatMap((subfield) => {
    const group = groupByFirstChildId.get(subfield.id);
    if (group) {
      const subsections = group.nested.flatMap((nested) => {
        const child = byId.get(nested.id);
        return child
          ? [{ ...child, title: nested.title ?? child.title }]
          : [];
      });
      const firstChild = subsections[0]!;

      return [
        {
          body: [],
          id: group.id,
          source: firstChild.source,
          subsections,
          summary: subsections.map((nested) => nested.title).join(" · "),
          title: group.title,
        },
      ];
    }

    return groupedChildIds.has(subfield.id) ? [] : [subfield];
  });
}

// The Content API POC supplies these as separate top-level sections. The
// reference UI presents them as one Dosing & Uses section with population tabs,
// and nests the dosage-form rows under their black subsection heading.
function organizeDosingAndUses(monograph: DrugMonograph): DrugMonograph {
  const adultDosing = monograph.sections.find(
    (section) => section.id === "adult-dosing-uses",
  );
  const adultDosageForms = monograph.sections.find(
    (section) => section.id === "adult-dosage-f-s",
  );
  const pediatricDosing = monograph.sections.find(
    (section) => section.id === "pediatric-dosing-uses",
  );

  if (!adultDosing || !pediatricDosing) return monograph;

  const dosageForms: DrugSubfield | undefined = adultDosageForms
    ? {
        body: [],
        id: adultDosageForms.id,
        population: "adult",
        source: adultDosageForms.subfields[0]?.source ?? adultDosing.subfields[0]!.source,
        subsections: adultDosageForms.subfields.map((subfield) =>
          withPopulation(subfield, "adult"),
        ),
        summary: adultDosageForms.subfields.map((subfield) => subfield.title).join(" · "),
        title: "Dosage Forms & Strengths",
      }
    : undefined;

  const dosingAndUses: DrugSection = {
    id: "dosing",
    lengthEstimate: "long",
    subfields: [
      ...(dosageForms ? [dosageForms] : []),
      ...(monograph.drug.id === "bevacizumab"
        ? groupBevacizumabDosingRows(adultDosing.subfields)
        : adultDosing.subfields
      ).map((subfield) => withPopulation(subfield, "adult")),
      ...pediatricDosing.subfields.map((subfield) =>
        withPopulation(subfield, "pediatric"),
      ),
    ],
    title: "Dosing & Uses",
  };

  return {
    ...monograph,
    sections: [
      dosingAndUses,
      ...POC_SECTION_PRESENTATION.flatMap(({ id, title }) => {
        const section = monograph.sections.find((candidate) => candidate.id === id);
        return section ? [{ ...section, title }] : [];
      }),
    ],
  };
}

function uniquifySiblingIds(subfields: DrugSubfield[]): DrugSubfield[] {
  const seenIds = new Map<string, number>();

  return subfields.map((subfield) => {
    const occurrence = seenIds.get(subfield.id) ?? 0;
    seenIds.set(subfield.id, occurrence + 1);

    return {
      ...subfield,
      id: occurrence === 0 ? subfield.id : `${subfield.id}--${occurrence + 1}`,
      subsections: subfield.subsections
        ? uniquifySiblingIds(subfield.subsections)
        : undefined,
    };
  });
}

// The Content API POC can return repeated IDs within one section (for example,
// several adverse-effect frequency bands). React keys and accordion state need
// sibling-unique IDs, so preserve the first canonical ID and suffix later
// repeats only in this stored prototype snapshot.
function uniquifySubfieldIds(monograph: DrugMonograph): DrugMonograph {
  return {
    ...monograph,
    sections: monograph.sections.map((section) => ({
      ...section,
      subfields: uniquifySiblingIds(section.subfields),
    })),
  };
}

export const POC_V2_SCENARIO_MONOGRAPHS: DrugMonograph[] =
  RAW_POC_V2_SCENARIO_MONOGRAPHS.map(({ _meta, ...monograph }) => {
    const normalized = uniquifySubfieldIds(organizeDosingAndUses(monograph));

    return {
      ...normalized,
      drug: {
        ...normalized.drug,
        referenceUrl: _meta?.sourceUrl ?? normalized.drug.referenceUrl,
      },
    };
  });

const BY_ID = new Map(
  POC_V2_SCENARIO_MONOGRAPHS.map((monograph) => [monograph.drug.id, monograph]),
);

export function getPocV2ScenarioMonograph(
  id: string,
): DrugMonograph | undefined {
  return BY_ID.get(id);
}

export const bevacizumabPocScenarioMonograph = getPocV2ScenarioMonograph(
  "bevacizumab",
)!;

export const ramucirumabPocScenarioMonograph = getPocV2ScenarioMonograph(
  "ramucirumab",
)!;
