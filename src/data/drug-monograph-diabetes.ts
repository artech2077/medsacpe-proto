// Diabetes & GLP-1 drug monographs — semaglutide, tirzepatide, liraglutide, insulin regular human.
// Content sourced from Medscape reference monographs (captured 2026-06-11).
// All Concept prototypes consume DrugMonograph from src/data/drug-monograph.ts types.

import type { DrugMonograph } from "./drug-monograph";

const medscapeRef = (section: string, url: string) => ({
  label: "Medscape Drug Reference",
  section,
  url,
});

const SEMA_URL = "https://reference.medscape.com/drug/ozempic-rybelsus-wegovy-semaglutide-1000174";
const TIRZ_URL = "https://reference.medscape.com/drug/mounjaro-zepbound-tirzepatide-4000264";
const LIRA_URL = "https://reference.medscape.com/drug/victoza-saxenda-liraglutide-999449";
const INSR_URL = "https://reference.medscape.com/drug/humulin-r-novolin-r-insulin-regular-human-999007";

// ─── Semaglutide (Ozempic / Rybelsus / Wegovy) ───────────────────────────────

export const semaglutideMonograph: DrugMonograph = {
  blackBoxWarnings: [
    {
      id: "bbw_thyroid_mtc",
      source: medscapeRef("Boxed Warning", SEMA_URL),
      text: "In rodents, semaglutide causes dose-dependent and treatment-duration-dependent thyroid C-cell tumors at clinically relevant exposures. Whether semaglutide causes thyroid C-cell tumors, including medullary thyroid carcinoma (MTC), in humans is unknown. Contraindicated in patients with a personal or family history of MTC or with multiple endocrine neoplasia syndrome type 2 (MEN2).",
    },
  ],

  drug: {
    drugClass: "GLP-1 receptor agonist",
    id: "semaglutide",
    name: "Semaglutide",
  },

  keyFields: [
    { label: "T2DM Starting Dose (SC)", subfieldId: "dosing.t2dm_sc" },
    { label: "Weight Management Dose", subfieldId: "dosing.weight_sc" },
    { label: "Contraindications", subfieldId: "safety.contraindications" },
    { label: "Hypoglycemia Risk", subfieldId: "safety.hypoglycemia_risk" },
  ],

  sections: [
    {
      id: "dosing",
      lengthEstimate: "long",
      title: "Dosing & Uses",
      subfields: [
        {
          id: "dosing.t2dm_sc",
          title: "Type 2 Diabetes — Ozempic SC",
          population: "adult",
          summary: "Start 0.25 mg SC qWeek × 4 wks (initiation only), then 0.5 mg; increase by 0.5-mg steps q4wk to max 2 mg/week",
          body: [
            "Initiate at 0.25 mg SC once weekly for 4 weeks. This dose is not effective for glycemic control — it serves only to reduce GI adverse effects.",
            "After 4 weeks, increase to 0.5 mg SC once weekly (first therapeutic dose).",
            "If additional glycemic control is needed after ≥4 weeks at each dose: increase 0.5 mg → 1 mg → 2 mg/week (maximum recommended).",
            "Indications: adjunct to diet and exercise to improve glycemic control in adults with T2DM; reduce risk of MACE (CV death, nonfatal MI, nonfatal stroke) in adults with T2DM at high CV risk; reduce risk of sustained eGFR decline, ESKD, or CV death in adults with T2DM and CKD.",
          ],
          source: medscapeRef("Dosing > Type 2 Diabetes Mellitus (SC)", SEMA_URL),
        },
        {
          id: "dosing.t2dm_po",
          title: "Type 2 Diabetes — Rybelsus Oral",
          population: "adult",
          summary: "3 mg PO qDay × 30 days (initiation only), then 7 mg/day; may increase to 14 mg/day",
          body: [
            "Days 1–30 (initiation): 3 mg PO once daily — not effective for glycemic control; reduces GI adverse effects.",
            "Days 31–60: increase to 7 mg PO once daily.",
            "Day 61+: maintain at 7 mg/day, or increase to 14 mg/day if additional control is needed.",
            "Administration: take on an empty stomach in the morning with up to 4 oz of water only. Wait ≥30 minutes before eating, drinking, or taking other oral medications.",
            "Note: Rybelsus and Ozempic oral tablets are not interchangeable on a mg-per-mg basis.",
          ],
          source: medscapeRef("Dosing > Type 2 Diabetes Mellitus (Oral)", SEMA_URL),
        },
        {
          id: "dosing.weight_sc",
          title: "Weight Management — Wegovy SC",
          population: "adult",
          summary: "Escalate: 0.25 mg (Wks 1–4) → 0.5 mg → 1 mg → 1.7 mg → 2.4 mg (Wk 17+) SC qWeek; max 7.2 mg/week",
          body: [
            "Indicated (in combination with reduced-calorie diet and increased physical activity) for chronic weight management in adults with BMI ≥30 kg/m² or BMI ≥27 kg/m² with ≥1 weight-related comorbidity. Also indicated to reduce CV events in adults with established CV disease and obesity/overweight.",
            "Escalation schedule: Weeks 1–4: 0.25 mg SC qWeek; Weeks 5–8: 0.5 mg; Weeks 9–12: 1 mg; Weeks 13–16: 1.7 mg; Week 17+: 2.4 mg (maintenance).",
            "If a dose is not tolerated during escalation, consider delaying escalation; if >2 consecutive doses missed, consider reinitiating dose escalation.",
            "Patients tolerating 2.4 mg for ≥4 weeks who need additional weight reduction may increase to 7.2 mg SC qWeek (Wegovy HD maximum).",
          ],
          source: medscapeRef("Dosing > Weight Management (SC)", SEMA_URL),
        },
        {
          id: "dosing.t2dm_pediatric",
          title: "Type 2 Diabetes — Pediatric",
          population: "pediatric",
          summary: "Safety and efficacy of Ozempic SC and Rybelsus oral not established in patients <18 years with T2DM",
          body: [
            "Safety and efficacy of semaglutide (Ozempic SC or Rybelsus oral) for the treatment of type 2 diabetes mellitus have not been established in pediatric patients younger than 18 years.",
            "Do not use Ozempic or Rybelsus for glycemic control in pediatric patients outside of a clinical trial.",
          ],
          source: medscapeRef("Dosing > Type 2 Diabetes Mellitus, Pediatric", SEMA_URL),
        },
        {
          id: "dosing.weight_sc_pediatric",
          title: "Weight Management — Wegovy SC (Pediatric)",
          population: "pediatric",
          summary: "Ages ≥12 y with obesity (BMI ≥95th percentile): same 0.25 → 2.4 mg SC qWeek escalation as adults",
          body: [
            "Indicated (in combination with reduced-calorie diet and increased physical activity) for chronic weight management in adolescents ≥12 years of age with obesity (BMI at or above the 95th percentile for age and sex).",
            "Escalation schedule is identical to adults: Weeks 1–4: 0.25 mg SC qWeek; Weeks 5–8: 0.5 mg; Weeks 9–12: 1 mg; Weeks 13–16: 1.7 mg; Week 17+: 2.4 mg SC qWeek (maintenance). Dosing is fixed, not weight-based.",
            "The 7.2 mg/week (Wegovy HD) dose has not been studied in pediatric patients — do not escalate beyond 2.4 mg/week in adolescents.",
            "Safety and effectiveness for chronic weight management have not been established in patients younger than 12 years of age.",
          ],
          source: medscapeRef("Dosing > Weight Management, Pediatric (SC)", SEMA_URL),
        },
        {
          id: "dosing.renal_hepatic",
          title: "Renal & Hepatic Impairment",
          summary: "No dose adjustment required for any degree of renal or hepatic impairment",
          body: [
            "Renal impairment — all severities including ESRD: no dosage adjustment necessary.",
            "Hepatic impairment — all severities: no dosage adjustment necessary.",
            "Monitor renal function in patients reporting severe GI adverse reactions (nausea, vomiting, diarrhea leading to dehydration) — acute kidney injury has been reported postmarketing.",
          ],
          source: medscapeRef("Dosing > Dosage Modifications", SEMA_URL),
        },
      ],
    },
    {
      id: "safety",
      lengthEstimate: "short",
      title: "Safety & Warnings",
      subfields: [
        {
          id: "safety.contraindications",
          title: "Contraindications",
          summary: "Personal/family history of MTC or MEN2; known hypersensitivity to semaglutide",
          body: [
            "Personal or family history of medullary thyroid carcinoma (MTC) or multiple endocrine neoplasia syndrome type 2 (MEN2).",
            "Known hypersensitivity to semaglutide or any product component (anaphylaxis and angioedema reported).",
            "Not a substitute for insulin; not indicated for type 1 diabetes mellitus or diabetic ketoacidosis.",
            "Wegovy: should not be coadministered with other semaglutide-containing products or any GLP-1 receptor agonist.",
          ],
          source: medscapeRef("Contraindications", SEMA_URL),
        },
        {
          id: "safety.hypoglycemia_risk",
          title: "Hypoglycemia Risk",
          summary: "Alone: low risk. With insulin or sulfonylureas: significant risk — consider dose reduction of concomitant agents",
          body: [
            "Semaglutide alone rarely causes hypoglycemia. Risk increases significantly when combined with insulin secretagogues (eg, sulfonylureas) or insulin.",
            "In Ozempic adjunctive therapy trials, documented symptomatic hypoglycemia (≤70 mg/dL) occurred in 16.7–29.8% of patients.",
            "Consider lowering the insulin or secretagogue dose when initiating semaglutide to reduce hypoglycemia risk.",
            "In patients with T2DM using Wegovy for weight management, monitor blood glucose before initiating and during treatment.",
          ],
          source: medscapeRef("Warnings > Hypoglycemia Risk", SEMA_URL),
        },
        {
          id: "safety.pancreatitis_thyroid",
          title: "Pancreatitis & Thyroid Risk",
          summary: "Monitor for pancreatitis; thyroid C-cell tumor risk (boxed warning); not recommended in severe gastroparesis",
          body: [
            "Acute pancreatitis — including fatal hemorrhagic or necrotizing pancreatitis — observed with GLP-1 receptor agonists. Monitor for persistent severe abdominal pain (may radiate to back).",
            "Thyroid C-cell tumors in rodents at clinically relevant exposures; human relevance unknown. Contraindicated with personal/family history of MTC or MEN2.",
            "Not recommended in patients with severe gastroparesis; GI adverse reactions can be severe.",
            "Rapid improvement in glucose control may temporarily worsen diabetic retinopathy; monitor patients with a history.",
            "Instruct patients to notify healthcare providers before elective surgery — delayed gastric emptying creates aspiration risk under anesthesia.",
          ],
          source: medscapeRef("Warnings & Precautions", SEMA_URL),
        },
        {
          id: "safety.periop_aspiration",
          title: "Perioperative — Pulmonary Aspiration",
          summary: "Rare postmarketing aspiration reports under general anesthesia/deep sedation; data insufficient for hold recommendations",
          body: [
            "There have been rare postmarketing reports of pulmonary aspiration in patients receiving GLP-1 receptor agonists undergoing elective surgeries or procedures requiring general anesthesia or deep sedation who had residual gastric contents despite reported adherence to preoperative fasting recommendations.",
            "Available data are insufficient to inform recommendations to mitigate risk of pulmonary aspiration during general anesthesia or deep sedation in patients receiving therapy, including whether modifying preoperative fasting recommendations or temporarily discontinuing therapy could reduce incidence of retained gastric contents.",
            "Instruct patients to inform healthcare providers prior to any planned surgeries or procedures if they are receiving this therapy.",
          ],
          source: medscapeRef("Warnings > Pulmonary Aspiration", SEMA_URL),
        },
      ],
    },
    {
      id: "administration",
      lengthEstimate: "long",
      title: "Administration",
      subfields: [
        {
          id: "administration.missed_dose",
          title: "Missed Dose — Ozempic & Wegovy",
          summary: "Ozempic: ≤5 days → administer ASAP; >5 days → skip. Wegovy: next dose >48 h away → take ASAP; <48 h → skip",
          body: [
            "Missed SC dose (Ozempic): if missed dose is ≤5 days, administer dose as soon as possible. If missed dose >5 days, skip missed dose and administer next dose on regularly scheduled day; patients can then resume their regular once weekly dosing schedule.",
            "Missed SC dose (Wegovy): if 1 dose is missed and next scheduled dose is >2 days away (48 hr), administer missed dose as soon as possible. If next scheduled dose is <2 days away (48 hr), do not administer; resume dosing on regularly scheduled day of the week.",
            "Wegovy: if >2 consecutive doses are missed, resume dosing as scheduled or, if needed, reinitiate and follow dose escalation schedule, which may reduce occurrence of GI symptoms associated with reinitiating treatment.",
            "Day of weekly administration can be changed if necessary as long as time between 2 doses is at least 2 days (>48 hours).",
          ],
          source: medscapeRef("Administration > Missed Dose", SEMA_URL),
        },
        {
          id: "administration.oral_rybelsus",
          title: "Oral Administration — Rybelsus",
          summary: "Empty stomach in AM with ≤4 oz water only; wait ≥30 min before food/other meds; swallow whole; missed dose → skip",
          body: [
            "Take on an empty stomach in the morning with water (up to 4 oz); do not take with other liquids besides water.",
            "After administration, wait at least 30 minutes before eating food, drinking beverages, or taking other oral medications.",
            "Swallow tablets whole; do not split, crush, or chew.",
            "Missed oral dose: skip missed dose and take next dose the following day.",
          ],
          source: medscapeRef("Administration > Oral Administration", SEMA_URL),
        },
        {
          id: "administration.storage",
          title: "Storage",
          summary: "Refrigerate unused pens 36–46ºF; do not freeze and do not use if frozen; after first use, room temp or refrigerated up to 56 days",
          body: [
            "Unused SC pens: refrigerate at 36–46ºF (2–8ºC). Do not store in freezer or directly adjacent to the refrigerator cooling element.",
            "Do not freeze and do not use semaglutide if it has been frozen.",
            "After first SC use: store at room temperature, 59–86°F (15–30°C), or refrigerate at 36–46ºF (2–8ºC) for up to 56 days.",
          ],
          source: medscapeRef("Administration > Storage", SEMA_URL),
        },
      ],
    },
    {
      id: "pregnancy",
      lengthEstimate: "short",
      title: "Pregnancy & Lactation",
      subfields: [
        {
          id: "pregnancy.planning",
          title: "Pregnancy Planning & Washout",
          summary: "Discontinue ≥2 months before planned pregnancy (long half-life); weight loss offers no benefit in pregnancy and may cause fetal harm",
          body: [
            "Because of the potential for fetal harm, discontinue therapy in patients at least 2 months before they plan to become pregnant to account for the long half-life of semaglutide.",
            "Weight loss offers no benefit to a pregnant patient and may cause fetal harm; when a pregnancy is recognized, advise the pregnant patient of the risk to a fetus. Discontinue therapy in pregnant patients who are using it for weight reduction.",
            "A pregnancy exposure registry monitors pregnancy outcomes in women exposed to semaglutide during pregnancy (Novo Nordisk, 1-877-390-2760).",
            "Based on animal reproduction studies, there may be potential risks to the fetus from exposure to semaglutide during pregnancy; available data are insufficient to establish a drug-associated risk of major birth defects or miscarriage.",
          ],
          source: medscapeRef("Pregnancy & Lactation > Pregnancy", SEMA_URL),
        },
      ],
    },
    {
      id: "pharmacology",
      lengthEstimate: "short",
      title: "Pharmacology",
      subfields: [
        {
          id: "pharmacology.moa",
          title: "Mechanism of Action",
          summary: "GLP-1 receptor agonist — glucose-dependent insulin secretion, glucagon suppression, slowed gastric emptying, appetite regulation",
          body: [
            "Glucagon-like peptide-1 (GLP-1) agonist.",
            "Diabetes type 2: incretins, such as GLP-1, enhance glucose-dependent insulin secretion by pancreatic beta-cells, suppress inappropriately elevated glucagon secretion, and slow gastric emptying.",
            "Weight management: GLP-1 is a physiological regulator of appetite and caloric intake, and the GLP-1 receptor is present in several areas of the brain involved in appetite regulation.",
          ],
          source: medscapeRef("Pharmacology > Mechanism of Action", SEMA_URL),
        },
      ],
    },
    {
      id: "interactions",
      lengthEstimate: "short",
      title: "Drug Interactions",
      subfields: [
        {
          id: "interactions.insulin_secretagogues",
          title: "Insulin & Secretagogues",
          summary: "Additive hypoglycemia — Modify Therapy/Monitor Closely; consider lowering insulin or secretagogue dose",
          body: [
            "All insulin formulations: Modify Therapy/Monitor Closely — coadministration increases hypoglycemia risk; lowering insulin dose may be needed.",
            "Sulfonylureas (glimepiride, glipizide, glyburide) and meglitinides (nateglinide, repaglinide): Modify Therapy/Monitor Closely — consider lowering secretagogue dose.",
            "Metformin: Use Caution/Monitor — additive antidiabetic effect; dosage adjustment may be required.",
          ],
          source: medscapeRef("Drug Interactions > Insulin & Secretagogues", SEMA_URL),
        },
        {
          id: "interactions.oral_absorption",
          title: "Oral Drug Absorption",
          summary: "Delayed gastric emptying may reduce absorption of oral medications — caution with narrow TI drugs and oral contraceptives",
          body: [
            "Semaglutide delays gastric emptying, potentially reducing absorption of oral medications — the effect is largest after the first dose and diminishes over time.",
            "Exercise caution with oral medications having narrow therapeutic indexes (warfarin, digoxin, immunosuppressants) or requiring threshold concentrations for efficacy.",
            "Oral hormonal contraceptives: advise patients to switch to a non-oral method or add a barrier method for 4 weeks after initiation and after each dose escalation.",
          ],
          source: medscapeRef("Drug Interactions > Oral Absorption / Contraceptives", SEMA_URL),
        },
        {
          id: "interactions.gh_analogs",
          title: "Growth Hormone Analogs",
          summary: "Somatropin, somapacitan, somatrogon decrease semaglutide effect — Modify Therapy; antidiabetic dose may need adjustment",
          body: [
            "Growth hormone analogs (somatropin, somapacitan, somatrogon, lonapegsomatropin) decrease the effect of semaglutide by pharmacodynamic antagonism.",
            "Rated Modify Therapy/Monitor Closely — GH analogs decrease insulin sensitivity, especially at higher doses. Antidiabetic agent dose adjustment may be required.",
          ],
          source: medscapeRef("Drug Interactions > Growth Hormone Analogs", SEMA_URL),
        },
      ],
    },
    {
      id: "adverse",
      lengthEstimate: "short",
      title: "Adverse Effects",
      subfields: [
        {
          id: "adverse.gi",
          title: "GI Adverse Effects",
          summary: "Most common: nausea (44% Wegovy SC), diarrhea (30%), vomiting (24%), constipation (24%), abdominal pain (20%)",
          body: [
            "GI adverse effects are the most common with semaglutide and drive the gradual dose escalation schedules.",
            "Wegovy SC (>10%): nausea (44%), diarrhea (30%), vomiting (24%), constipation (24%), abdominal pain (20%), headache (14%), fatigue (11%).",
            "Ozempic SC (>10%): nausea (15.8–20.3%); symptomatic hypoglycemia common as adjunctive therapy.",
            "Rybelsus PO (>10%): nausea (11–20%), abdominal pain (10–11%).",
            "Postmarketing (serious): acute pancreatitis (sometimes fatal), intestinal obstruction, ileus, severe constipation, fecal impaction.",
          ],
          source: medscapeRef("Adverse Reactions > GI", SEMA_URL),
        },
        {
          id: "adverse.serious",
          title: "Serious Adverse Effects",
          summary: "Pancreatitis, acute kidney injury, cholelithiasis/cholecystitis, hypersensitivity reactions, retinal disorders",
          body: [
            "Pancreatitis — acute, sometimes fatal hemorrhagic or necrotizing — reported postmarketing with GLP-1 agonists.",
            "Acute kidney injury — mostly secondary to GI-induced dehydration; may require hemodialysis.",
            "Cholelithiasis (1.6% Wegovy SC) and cholecystitis reported; gallbladder studies indicated if suspected.",
            "Serious hypersensitivity reactions (anaphylaxis, angioedema, rash, urticaria) reported.",
            "Retinal disorders: 6.9% in Wegovy SC trials; rapid glucose improvement may temporarily worsen diabetic retinopathy.",
          ],
          source: medscapeRef("Adverse Reactions > Serious", SEMA_URL),
        },
      ],
    },
  ],

  synthesizedAnswers: {
    "t2dm-dose-sc": {
      citations: [{ anchor: "dosing.t2dm_sc", marker: 1 }],
      followUpQuestions: [
        "What's the dosing for oral semaglutide (Rybelsus)?",
        "Should I lower the patient's insulin or sulfonylurea when starting?",
        "What are the most common side effects?",
      ],
      text: "For type 2 diabetes, initiate Ozempic (semaglutide SC) at 0.25 mg once weekly for 4 weeks — this dose is for tolerability only and does not improve glycemic control [1]. After 4 weeks, increase to 0.5 mg/week (first therapeutic dose). If additional control is needed, increase in 0.5-mg steps every 4 weeks to a maximum of 2 mg/week [1].",
    },
    "t2dm-dose-po": {
      citations: [{ anchor: "dosing.t2dm_po", marker: 1 }],
      followUpQuestions: [
        "Can I switch between Rybelsus and Ozempic tablets?",
        "What's the difference between Rybelsus and Ozempic oral?",
        "What about drug interactions with oral semaglutide?",
      ],
      text: "For oral semaglutide (Rybelsus), start with 3 mg PO once daily for 30 days — this initiation dose is not effective for glycemic control [1]. On Day 31, increase to 7 mg/day; if additional control is needed from Day 61, increase to 14 mg/day [1]. Rybelsus must be taken on an empty stomach in the morning with up to 4 oz water; wait ≥30 minutes before eating or taking other medications [1].",
    },
    "weight-dose": {
      citations: [{ anchor: "dosing.weight_sc", marker: 1 }],
      followUpQuestions: [
        "Is there an oral option for weight management?",
        "What GI side effects should I warn patients about?",
        "What if the patient has T2DM — does the target dose differ?",
      ],
      text: "For weight management, Wegovy follows a 16-week SC escalation schedule: 0.25 mg/week (Weeks 1–4), then 0.5 mg, 1 mg, 1.7 mg, reaching 2.4 mg/week as the maintenance dose at Week 17 [1]. If a dose is not tolerated, delay escalation. Patients tolerating 2.4 mg for ≥4 weeks who need additional weight loss may increase to 7.2 mg/week (Wegovy HD) [1].",
    },
    "hypoglycemia": {
      citations: [
        { anchor: "safety.hypoglycemia_risk", marker: 1 },
        { anchor: "interactions.insulin_secretagogues", marker: 2 },
      ],
      followUpQuestions: [
        "What's the starting dose for T2DM?",
        "What are the main drug interactions?",
        "Does renal impairment affect dosing?",
      ],
      text: "Semaglutide alone rarely causes hypoglycemia. Risk increases significantly when combined with insulin or insulin secretagogues (eg, sulfonylureas) [1]. Documented symptomatic hypoglycemia occurred in 16.7–29.8% of patients on Ozempic as add-on therapy [1]. When initiating semaglutide, consider lowering the dose of concomitant insulin or secretagogues [2].",
    },
    "gi-effects": {
      citations: [
        { anchor: "adverse.gi", marker: 1 },
        { anchor: "adverse.serious", marker: 2 },
      ],
      followUpQuestions: [
        "How should I escalate the dose to minimize GI effects?",
        "What serious adverse effects should I watch for?",
        "When is semaglutide contraindicated?",
      ],
      text: "GI adverse effects are the most common side effects of semaglutide and the reason for gradual dose escalation [1]. With Wegovy SC, nausea affects 44% of patients, diarrhea 30%, vomiting 24%, and constipation 24%. Ozempic causes nausea in 15.8–20.3% of patients [1]. Serious postmarketing reports include acute pancreatitis, intestinal obstruction, and ileus [2].",
    },
    "contraindications": {
      citations: [{ anchor: "safety.contraindications", marker: 1 }],
      followUpQuestions: [
        "What's the thyroid tumor risk?",
        "What about pancreatitis history?",
        "What are the main drug interactions?",
      ],
      text: "Semaglutide is contraindicated in patients with a personal or family history of medullary thyroid carcinoma (MTC) or multiple endocrine neoplasia syndrome type 2 (MEN2) [1]. It is also contraindicated with known hypersensitivity to semaglutide. It is not indicated for type 1 diabetes or diabetic ketoacidosis [1].",
    },
    "renal-hepatic": {
      citations: [{ anchor: "dosing.renal_hepatic", marker: 1 }],
      followUpQuestions: [
        "What are the key drug interactions?",
        "What about pancreatitis risk?",
        "What GI side effects can affect renal function?",
      ],
      text: "No dose adjustment is required for semaglutide in any degree of renal or hepatic impairment [1]. However, GI-related dehydration from nausea, vomiting, or diarrhea can trigger acute kidney injury; monitor renal function in patients reporting severe GI adverse reactions [1].",
    },
    "interactions-insulin": {
      citations: [
        { anchor: "interactions.insulin_secretagogues", marker: 1 },
        { anchor: "interactions.oral_absorption", marker: 2 },
      ],
      followUpQuestions: [
        "How do I manage hypoglycemia risk?",
        "What about oral hormonal contraceptives?",
        "Does renal impairment affect dosing?",
      ],
      text: "Semaglutide combined with insulin or sulfonylureas increases hypoglycemia risk — all insulin formulations and sulfonylureas are rated Modify Therapy/Monitor Closely; consider lowering the concomitant dose [1]. Because semaglutide delays gastric emptying, oral medications with narrow therapeutic indexes (warfarin, digoxin) may have reduced absorption; exercise caution [2]. Patients on oral hormonal contraceptives should switch to a non-oral method or add a barrier method for 4 weeks after initiation or each dose escalation [2].",
    },
    "missed-dose": {
      citations: [{ anchor: "administration.missed_dose", marker: 1 }],
      followUpQuestions: [
        "Can the patient change their weekly injection day?",
        "What if more than 2 Wegovy doses are missed?",
        "What's the missed-dose rule for oral semaglutide?",
      ],
      text: "A dose missed by 3 days falls within the Ozempic 5-day window: administer the missed dose as soon as possible, then resume the regular once-weekly schedule [1]. Only if more than 5 days have passed should the missed dose be skipped, with the next dose given on the regularly scheduled day [1].",
    },
    "pregnancy-washout": {
      citations: [{ anchor: "pregnancy.planning", marker: 1 }],
      followUpQuestions: [
        "What are the alternatives during pregnancy?",
        "Does this apply to oral semaglutide too?",
        "What if the patient becomes pregnant on therapy?",
      ],
      text: "Discontinue semaglutide at least 2 months before a planned pregnancy — the washout reflects its long half-life and the potential for fetal harm [1]. If a pregnancy is recognized during weight-management therapy, discontinue and advise the patient of the risk to the fetus [1].",
    },
  },

  taskChips: [
    {
      id: "t2dm-dosing",
      label: "T2DM dosing",
      subfieldIds: ["dosing.t2dm_sc", "dosing.t2dm_po"],
    },
    {
      id: "weight-dosing",
      label: "Weight management",
      subfieldIds: ["dosing.weight_sc"],
    },
    {
      id: "hypoglycemia",
      label: "Hypoglycemia risk",
      subfieldIds: ["safety.hypoglycemia_risk", "interactions.insulin_secretagogues"],
    },
    {
      id: "gi-effects",
      label: "GI side effects",
      subfieldIds: ["adverse.gi"],
    },
    {
      id: "interactions",
      label: "Drug interactions",
      subfieldIds: ["interactions.insulin_secretagogues", "interactions.oral_absorption"],
    },
  ],
};

// ─── Tirzepatide (Mounjaro / Zepbound) ───────────────────────────────────────

export const tirzepatideMonograph: DrugMonograph = {
  blackBoxWarnings: [
    {
      id: "bbw_thyroid_mtc",
      source: medscapeRef("Boxed Warning", TIRZ_URL),
      text: "In rodents, tirzepatide causes dose-dependent and treatment-duration-dependent thyroid C-cell tumors at clinically relevant exposures. Whether tirzepatide causes thyroid C-cell tumors, including medullary thyroid carcinoma (MTC), in humans is unknown. Contraindicated in patients with a personal or family history of MTC or with multiple endocrine neoplasia syndrome type 2 (MEN2).",
    },
  ],

  drug: {
    drugClass: "Dual GIP/GLP-1 receptor agonist",
    id: "tirzepatide",
    name: "Tirzepatide",
  },

  keyFields: [
    { label: "T2DM Starting Dose", subfieldId: "dosing.t2dm" },
    { label: "Weight Management Dose", subfieldId: "dosing.weight" },
    { label: "Contraindications", subfieldId: "safety.contraindications" },
    { label: "Hypoglycemia Risk", subfieldId: "safety.hypoglycemia_risk" },
  ],

  sections: [
    {
      id: "dosing",
      lengthEstimate: "long",
      title: "Dosing & Uses",
      subfields: [
        {
          id: "dosing.t2dm",
          title: "Type 2 Diabetes — Mounjaro",
          summary: "Start 2.5 mg SC qWeek × 4 wks (initiation only), then 5 mg; increase by 2.5-mg steps q4wk to max 15 mg/week (adults) or 10 mg/week (pediatric ≥10 y)",
          body: [
            "Initiate at 2.5 mg SC once weekly for 4 weeks. This dose is intended for treatment initiation and is NOT effective for glycemic control.",
            "After 4 weeks, increase to 5 mg SC once weekly (first therapeutic dose).",
            "If additional glycemic control needed, increase by 2.5-mg increments after at least 4 weeks at each dose.",
            "Maximum dose: 15 mg SC once weekly (adults); 10 mg SC once weekly (pediatric patients ≥10 years).",
            "Indicated as adjunct to diet and exercise to improve glycemic control in adults and pediatric patients ≥10 years with T2DM.",
          ],
          source: medscapeRef("Dosing > Type 2 Diabetes Mellitus", TIRZ_URL),
        },
        {
          id: "dosing.weight",
          title: "Weight Management — Zepbound",
          summary: "Start 2.5 mg SC qWeek × 4 wks, then increase by 2.5-mg steps q4wk; maintenance 5, 10, or 15 mg/week",
          body: [
            "Initiate at 2.5 mg SC qWeek × 4 weeks to minimize GI adverse reactions. This initiation dose is not for chronic weight management.",
            "After 4 weeks, increase to 5 mg SC qWeek; may increase in 2.5-mg increments after ≥4 weeks on each dose.",
            "Recommended maintenance dosages: 5 mg, 10 mg, or 15 mg SC qWeek — select based on treatment response and tolerability.",
            "If a maintenance dosage is not tolerated, consider reducing to a lower maintenance dose.",
            "Indicated in combination with reduced-calorie diet and increased physical activity for chronic weight management in adults with BMI ≥30 kg/m² or BMI ≥27 kg/m² with ≥1 weight-related comorbidity.",
            "Do not coadminister with other tirzepatide-containing products or with any GLP-1 receptor agonist.",
          ],
          source: medscapeRef("Dosing > Weight Management", TIRZ_URL),
        },
        {
          id: "dosing.sleep_apnea",
          title: "Obstructive Sleep Apnea — Zepbound",
          summary: "10–15 mg SC once weekly for moderate-to-severe OSA in adults with obesity",
          body: [
            "Indicated to treat moderate-to-severe obstructive sleep apnea (OSA) in adults with obesity.",
            "Dose: 10–15 mg SC once weekly.",
            "Follow the same gradual dose escalation approach as for weight management to minimize GI adverse reactions before reaching the target dose.",
          ],
          source: medscapeRef("Dosing > Obstructive Sleep Apnea", TIRZ_URL),
        },
        {
          id: "dosing.renal_hepatic",
          title: "Renal & Hepatic Impairment",
          summary: "No dose adjustment required for any stage of renal or hepatic impairment, including ESRD",
          body: [
            "Renal impairment — any stage including end-stage renal disease: no dosage adjustment required.",
            "Hepatic impairment — any stage: no dosage adjustment required.",
            "Monitor renal function in patients reporting severe adverse GI reactions that may lead to dehydration — acute kidney injury has been reported.",
          ],
          source: medscapeRef("Dosing > Dosage Modifications", TIRZ_URL),
        },
      ],
    },
    {
      id: "safety",
      lengthEstimate: "short",
      title: "Safety & Warnings",
      subfields: [
        {
          id: "safety.contraindications",
          title: "Contraindications",
          summary: "Personal/family history of MTC or MEN2; known hypersensitivity to tirzepatide",
          body: [
            "Personal or family history of medullary thyroid carcinoma (MTC) or multiple endocrine neoplasia syndrome type 2 (MEN2).",
            "Known hypersensitivity to tirzepatide or any product component.",
            "Zepbound: do not coadminister with other tirzepatide-containing products or any GLP-1 receptor agonist.",
          ],
          source: medscapeRef("Contraindications", TIRZ_URL),
        },
        {
          id: "safety.hypoglycemia_risk",
          title: "Hypoglycemia Risk",
          summary: "Higher risk vs other GLP-1 agonists when combined with insulin — Modify Therapy/Monitor Closely; blood glucose <54 mg/dL in 14–19% on basal insulin",
          body: [
            "Tirzepatide combined with insulin secretagogues (eg, sulfonylureas) or insulin increases hypoglycemia risk — consider lowering the secretagogue or insulin dose.",
            "In Mounjaro trials (added to basal insulin): blood glucose <54 mg/dL occurred in 14–19% of patients. Severe hypoglycemia (added to basal insulin) occurred in 1–2%.",
            "All insulin formulations are rated Modify Therapy/Monitor Closely with tirzepatide.",
            "In Zepbound trials: hypoglycemia in T2DM patients occurred in 4.2%.",
          ],
          source: medscapeRef("Warnings > Hypoglycemia", TIRZ_URL),
        },
        {
          id: "safety.pancreatitis_gi",
          title: "GI & Pancreatitis Risk",
          summary: "Severe GI reactions reported; not studied in severe gastroparesis; monitor for pancreatitis; pulmonary aspiration risk with anesthesia",
          body: [
            "Severe GI adverse reactions reported; tirzepatide has not been studied in patients with severe GI disease, including severe gastroparesis, and is not recommended in these patients.",
            "Acute pancreatitis — including fatal and nonfatal hemorrhagic or necrotizing — observed with GLP-1 receptor agonists. Monitor for persistent severe abdominal pain.",
            "Acute gallbladder disease (cholelithiasis 1.1%, cholecystitis 0.7%) reported; gallbladder studies indicated if suspected.",
            "Tirzepatide delays gastric emptying — rare postmarketing reports of pulmonary aspiration during general anesthesia despite fasting. Instruct patients to notify providers before elective surgery.",
          ],
          source: medscapeRef("Warnings & Precautions", TIRZ_URL),
        },
        {
          id: "safety.periop_aspiration",
          title: "Perioperative — Pulmonary Aspiration",
          summary: "Rare postmarketing aspiration reports under general anesthesia/deep sedation; data insufficient for hold recommendations",
          body: [
            "Therapy delays gastric emptying; there have been rare postmarketing reports of pulmonary aspiration in patients receiving GLP-1 receptor agonists undergoing elective surgeries or procedures requiring general anesthesia or deep sedation who had residual gastric contents despite reported adherence to preoperative fasting recommendations.",
            "Available data are insufficient to inform recommendations to mitigate risk of pulmonary aspiration during general anesthesia or deep sedation in patients receiving therapy, including whether modifying preoperative fasting recommendations or temporarily discontinuing therapy could reduce incidence of retained gastric contents.",
            "Instruct patients to inform healthcare providers prior to any planned surgeries or procedures if they are receiving this therapy.",
          ],
          source: medscapeRef("Warnings > Pulmonary Aspiration", TIRZ_URL),
        },
      ],
    },
    {
      id: "administration",
      lengthEstimate: "short",
      title: "Administration",
      subfields: [
        {
          id: "administration.missed_dose",
          title: "Missed Dose & Day Change",
          summary: "Within 4 days (96 hr) → administer ASAP; >4 days → skip. Weekly day change allowed if ≥3 days (72 hr) between doses",
          body: [
            "Missed dose: within 4 days (96 hr), administer as soon as possible after missed dose. If >4 days, skip missed dose and administer next dose on regularly scheduled day. In each case, patients can resume their regular once weekly dosing schedule.",
            "Change day of weekly administration: may be changed, if necessary, as long as time between 2 doses is at least 3 days (72 hr).",
            "Administer SC in abdomen, thigh, or upper arm; rotate injection site with each dose. Administer once weekly, at any time of day, with or without meals.",
          ],
          source: medscapeRef("Administration > SC Administration", TIRZ_URL),
        },
        {
          id: "administration.storage",
          title: "Storage",
          summary: "Refrigerate 2–8ºC; up to 21 days unrefrigerated (≤30ºC); do not freeze — do NOT use if frozen (discard)",
          body: [
            "All formulations: refrigerate at 2–8ºC (36–46ºF).",
            "If needed, each single-dose pen can be stored unrefrigerated at temperatures not to exceed 30ºC (86ºF) for up to 21 days.",
            "Do not freeze; do NOT use if frozen (discard). Protect from light.",
          ],
          source: medscapeRef("Administration > Storage", TIRZ_URL),
        },
      ],
    },
    {
      id: "pregnancy",
      lengthEstimate: "short",
      title: "Pregnancy & Lactation",
      subfields: [
        {
          id: "pregnancy.planning",
          title: "Pregnancy",
          summary: "Mounjaro: use only if benefit justifies fetal risk. Zepbound: weight loss offers no benefit in pregnancy and may cause fetal harm",
          body: [
            "Data are insufficient regarding use in pregnant females to evaluate for a drug-associated risk of major birth defects, miscarriage, or other adverse maternal or fetal outcomes. Based on animal reproduction studies, there may be risks to the fetus from tirzepatide exposure during pregnancy.",
            "Mounjaro: use during pregnancy only if potential benefit justifies the potential risk to the fetus.",
            "Zepbound: weight loss offers no benefit to pregnant females and may cause fetal harm.",
            "Contraception: tirzepatide may reduce efficacy of oral hormonal contraceptives owing to delayed gastric emptying; the delay is largest after the first dose and diminishes over time.",
          ],
          source: medscapeRef("Pregnancy & Lactation > Pregnancy", TIRZ_URL),
        },
      ],
    },
    {
      id: "pharmacology",
      lengthEstimate: "short",
      title: "Pharmacology",
      subfields: [
        {
          id: "pharmacology.moa",
          title: "Mechanism of Action",
          summary: "Dual GIP + GLP-1 receptor agonist — glucose-dependent insulin secretion, postprandial glucagon suppression, delayed gastric emptying",
          body: [
            "Dual glucose-dependent insulinotropic polypeptide (GIP) and glucagon-like peptide-1 (GLP-1) receptor agonist.",
            "GIP is an incretin hormone that induces insulin secretion in response to a meal to facilitate the metabolism of carbohydrates, fats, and proteins.",
            "GLP-1 receptor agonists increase insulin secretion in the presence of elevated blood glucose, suppress glucagon postprandially, delay gastric emptying to decrease postprandial glucose, and decrease glucagon secretion.",
            "Pharmacodynamic effects include lower fasting and postprandial glucose concentration, decreased food intake, and reduced body weight. Delays gastric emptying; delay is largest after first dose and diminishes over time.",
          ],
          source: medscapeRef("Pharmacology > Mechanism of Action", TIRZ_URL),
        },
      ],
    },
    {
      id: "interactions",
      lengthEstimate: "short",
      title: "Drug Interactions",
      subfields: [
        {
          id: "interactions.insulin",
          title: "Insulin & Secretagogues",
          summary: "All insulins and sulfonylureas: Modify Therapy/Monitor Closely — increased hypoglycemia risk; lower concomitant dose",
          body: [
            "All insulin formulations: Modify Therapy/Monitor Closely — coadministration increases hypoglycemia risk; lowering insulin dose recommended.",
            "Insulin secretagogues (glimepiride, glipizide, glyburide): Modify Therapy/Monitor Closely — increased hypoglycemia risk; consider lowering secretagogue dose.",
            "Metformin: Use Caution/Monitor — additive antidiabetic effect; dosage adjustments may be required.",
          ],
          source: medscapeRef("Drug Interactions > Insulin & Secretagogues", TIRZ_URL),
        },
        {
          id: "interactions.narrow_ti",
          title: "Narrow Therapeutic Index Drugs",
          summary: "Delayed gastric emptying reduces absorption of narrow TI oral drugs (warfarin, digoxin, immunosuppressants) — monitor closely",
          body: [
            "Tirzepatide delays gastric emptying, potentially impacting absorption of oral medications — the delay is largest after the first dose and diminishes over time.",
            "Monitor narrow therapeutic index drugs closely: warfarin, digoxin, phenytoin, valproic acid/divalproex sodium, lithium, cyclosporine, sirolimus, tacrolimus, theophylline, procainamide, quinidine.",
            "Oral hormonal contraceptives: advise patients to switch to a non-oral method or add a barrier method for 4 weeks after initiation and for 4 weeks after each dose escalation.",
          ],
          source: medscapeRef("Drug Interactions > Oral Medications / Narrow TI", TIRZ_URL),
        },
        {
          id: "interactions.gh_analogs",
          title: "Growth Hormone Analogs",
          summary: "GH analogs decrease tirzepatide effect — Modify Therapy; antidiabetic dose adjustment may be needed",
          body: [
            "Growth hormone analogs (somatropin, somapacitan, somatrogon, lonapegsomatropin) decrease the effect of tirzepatide by pharmacodynamic antagonism.",
            "Rated Modify Therapy/Monitor Closely — GH analogs decrease insulin sensitivity; antidiabetic dose adjustment may be required after initiating growth hormone.",
          ],
          source: medscapeRef("Drug Interactions > Growth Hormone Analogs", TIRZ_URL),
        },
      ],
    },
    {
      id: "adverse",
      lengthEstimate: "short",
      title: "Adverse Effects",
      subfields: [
        {
          id: "adverse.gi",
          title: "GI Adverse Effects",
          summary: "Mounjaro: nausea 12–18%, diarrhea 12–17%. Zepbound: nausea 25–29%, diarrhea 19–23%, constipation 11–17%, vomiting 8–13%",
          body: [
            "GI adverse effects are the most common and drive the dose escalation approach.",
            "Mounjaro (>10%): blood glucose <54 mg/dL on basal insulin (14–19%), nausea (12–18%), diarrhea (12–17%).",
            "Zepbound (>10%): serum lipase increased (28–35%), nausea (25–29%), amylase increased (20–25%), diarrhea (19–23%), constipation (11–17%), vomiting (8–13%).",
            "Zepbound (1–10%): abdominal pain (9–10%), dyspepsia (9–10%), fatigue (5–7%), eructation (4–5%), hair loss (4–5%), GERD (4–5%), dizziness (4–5%).",
            "Postmarketing: hypersensitivity (anaphylaxis, angioedema), ileus, pulmonary aspiration.",
          ],
          source: medscapeRef("Adverse Reactions", TIRZ_URL),
        },
        {
          id: "adverse.lipase_gallbladder",
          title: "Lipase, Gallbladder & Serious Reactions",
          summary: "Serum lipase increased 28–35% (Zepbound); cholelithiasis 1.1%; acute kidney injury 0.5%; hypersensitivity reactions",
          body: [
            "Serum lipase increased in 28–35% of Zepbound patients and amylase in 20–25% — clinical significance unclear; monitor for pancreatitis symptoms.",
            "Cholelithiasis (1.1%) and cholecystitis (0.7%) reported with Zepbound; gallbladder studies indicated if gallbladder disease suspected.",
            "Acute kidney injury (0.5% Zepbound) — mostly secondary to dehydration from GI adverse reactions.",
            "Serious hypersensitivity reactions (anaphylaxis, angioedema) reported; discontinue and treat promptly if reactions occur.",
          ],
          source: medscapeRef("Adverse Reactions > Serious", TIRZ_URL),
        },
      ],
    },
  ],

  synthesizedAnswers: {
    "t2dm-dose": {
      citations: [{ anchor: "dosing.t2dm", marker: 1 }],
      followUpQuestions: [
        "What is the maximum dose for adults?",
        "How does the dose differ for weight management?",
        "What's the hypoglycemia risk with concomitant insulin?",
      ],
      text: "For type 2 diabetes, initiate Mounjaro (tirzepatide) at 2.5 mg SC once weekly for 4 weeks — this dose is for treatment initiation only and is not effective for glycemic control [1]. After 4 weeks, increase to 5 mg/week (first therapeutic dose). If additional control is needed, increase in 2.5-mg increments every 4 weeks, up to a maximum of 15 mg/week [1].",
    },
    "weight-dose": {
      citations: [{ anchor: "dosing.weight", marker: 1 }],
      followUpQuestions: [
        "What's the starting dose for T2DM?",
        "What GI side effects should I warn patients about?",
        "Is tirzepatide approved for sleep apnea?",
      ],
      text: "For weight management with Zepbound (tirzepatide), initiate at 2.5 mg SC qWeek × 4 weeks to minimize GI side effects, then increase to 5 mg/week [1]. Continue increasing in 2.5-mg steps every ≥4 weeks as tolerated. The recommended maintenance dosages are 5 mg, 10 mg, or 15 mg once weekly, selected based on response and tolerability [1].",
    },
    "pregnancy": {
      citations: [{ anchor: "pregnancy.planning", marker: 1 }],
      followUpQuestions: [
        "Does tirzepatide affect oral contraceptives?",
        "How does this compare with semaglutide in pregnancy?",
        "What are the animal reproduction data?",
      ],
      text: "Tirzepatide has no defined pre-pregnancy washout period, unlike semaglutide. Data in pregnant females are insufficient, and animal studies suggest possible fetal risk [1]. Mounjaro should be used in pregnancy only if the potential benefit justifies the fetal risk; Zepbound should be discontinued — weight loss offers no benefit in pregnancy and may cause fetal harm [1]. Note that tirzepatide may also reduce oral contraceptive efficacy after initiation and dose escalations [1].",
    },
    "hypoglycemia": {
      citations: [
        { anchor: "safety.hypoglycemia_risk", marker: 1 },
        { anchor: "interactions.insulin", marker: 2 },
      ],
      followUpQuestions: [
        "Which insulins require dose modification?",
        "What's the starting dose for T2DM?",
        "What are the main GI side effects?",
      ],
      text: "Tirzepatide combined with insulin or insulin secretagogues significantly increases hypoglycemia risk [1]. In Mounjaro trials added to basal insulin, blood glucose <54 mg/dL occurred in 14–19% of patients [1]. All insulin formulations are rated Modify Therapy/Monitor Closely — consider reducing the insulin or sulfonylurea dose when initiating tirzepatide [2].",
    },
    "gi-effects": {
      citations: [
        { anchor: "adverse.gi", marker: 1 },
        { anchor: "adverse.lipase_gallbladder", marker: 2 },
      ],
      followUpQuestions: [
        "How does the dose escalation minimize GI effects?",
        "What's the significance of elevated lipase?",
        "When is tirzepatide contraindicated?",
      ],
      text: "GI adverse effects are the most common with tirzepatide and drive the gradual escalation [1]. With Zepbound (weight management): nausea 25–29%, diarrhea 19–23%, constipation 11–17%, vomiting 8–13%; with Mounjaro: nausea 12–18%, diarrhea 12–17% [1]. Serum lipase increases in 28–35% of Zepbound patients (with amylase in 20–25%); monitor for pancreatitis symptoms [2].",
    },
    "contraindications": {
      citations: [{ anchor: "safety.contraindications", marker: 1 }],
      followUpQuestions: [
        "What's the thyroid tumor risk?",
        "What about severe GI disease — can I still use it?",
        "What are the key drug interactions?",
      ],
      text: "Tirzepatide is contraindicated in patients with a personal or family history of medullary thyroid carcinoma (MTC) or multiple endocrine neoplasia syndrome type 2 (MEN2) [1]. It is also contraindicated with known hypersensitivity to tirzepatide or any product component [1]. Zepbound should not be coadministered with other tirzepatide-containing products or any GLP-1 receptor agonist [1].",
    },
    "interactions-insulin": {
      citations: [
        { anchor: "interactions.insulin", marker: 1 },
        { anchor: "interactions.narrow_ti", marker: 2 },
      ],
      followUpQuestions: [
        "How do I monitor for hypoglycemia?",
        "What about oral hormonal contraceptives?",
        "Does renal impairment affect dosing?",
      ],
      text: "All insulin formulations and sulfonylureas are rated Modify Therapy/Monitor Closely with tirzepatide — increased hypoglycemia risk; consider lowering the concomitant dose [1]. Tirzepatide delays gastric emptying, reducing oral drug absorption — monitor narrow therapeutic index drugs (warfarin, digoxin, phenytoin, immunosuppressants) and advise oral contraceptive users to switch to a non-oral method for 4 weeks after initiation or each dose escalation [2].",
    },
  },

  taskChips: [
    {
      id: "t2dm-dosing",
      label: "T2DM dosing",
      subfieldIds: ["dosing.t2dm"],
    },
    {
      id: "weight-dosing",
      label: "Weight management",
      subfieldIds: ["dosing.weight"],
    },
    {
      id: "hypoglycemia",
      label: "Hypoglycemia risk",
      subfieldIds: ["safety.hypoglycemia_risk", "interactions.insulin"],
    },
    {
      id: "gi-effects",
      label: "GI side effects",
      subfieldIds: ["adverse.gi", "adverse.lipase_gallbladder"],
    },
    {
      id: "interactions",
      label: "Drug interactions",
      subfieldIds: ["interactions.insulin", "interactions.narrow_ti"],
    },
  ],
};

// ─── Liraglutide (Victoza / Saxenda) ─────────────────────────────────────────

export const liraglutideMonograph: DrugMonograph = {
  blackBoxWarnings: [
    {
      id: "bbw_thyroid_mtc",
      source: medscapeRef("Boxed Warning", LIRA_URL),
      text: "Liraglutide causes thyroid C-cell tumors in rodents; human risk could not be determined. Contraindicated in patients with a personal or family history of medullary thyroid carcinoma (MTC) or in patients with multiple endocrine neoplasia syndrome type 2 (MEN2). Routine monitoring of serum calcitonin or thyroid ultrasound is of uncertain value for early detection of MTC.",
    },
  ],

  drug: {
    drugClass: "GLP-1 receptor agonist",
    id: "liraglutide",
    name: "Liraglutide",
  },

  keyFields: [
    { label: "T2DM Dose (Victoza)", subfieldId: "dosing.t2dm_victoza" },
    { label: "Obesity Dose (Saxenda)", subfieldId: "dosing.obesity_saxenda" },
    { label: "Contraindications", subfieldId: "safety.contraindications" },
    { label: "Key Drug Interactions", subfieldId: "interactions.sulfonylureas_insulin" },
  ],

  sections: [
    {
      id: "dosing",
      lengthEstimate: "long",
      title: "Dosing & Uses",
      subfields: [
        {
          id: "dosing.t2dm_victoza",
          title: "Type 2 Diabetes — Victoza",
          summary: "0.6 mg SC qDay × 1 wk (initiation only), then 1.2 mg/day; if needed, increase to 1.8 mg/day",
          body: [
            "Initiate at 0.6 mg SC once daily for 1 week. This dose does not provide glycemic control — it is used only to decrease GI adverse effects.",
            "After 1 week, increase to 1.2 mg SC once daily (first therapeutic dose).",
            "If glycemic control is not achieved at 1.2 mg, increase to 1.8 mg SC once daily (maximum dose).",
            "Indications: adjunct to diet and exercise to improve glycemic control in adults with T2DM; reduce risk of MACE (CV death, nonfatal MI, nonfatal stroke) in adults with T2DM and established CV disease.",
            "Not for type 1 diabetes mellitus or diabetic ketoacidosis. Not studied in combination with prandial insulin.",
          ],
          source: medscapeRef("Dosing > Type 2 Diabetes Mellitus (Adult)", LIRA_URL),
        },
        {
          id: "dosing.obesity_saxenda",
          title: "Obesity / Weight Management — Saxenda",
          summary: "Escalate from 0.6 mg SC qDay in weekly 0.6-mg steps to target 3 mg/day; discontinue if <4% weight loss at 16 weeks",
          body: [
            "For chronic weight management in adults with BMI ≥30 kg/m² (obese) or BMI ≥27 kg/m² (overweight) with ≥1 weight-related condition (hypertension, T2DM, dyslipidemia).",
            "Initiate at 0.6 mg SC qDay for 1 week; increase by 0.6 mg/day in weekly intervals until reaching 3 mg/day target dose.",
            "If a patient cannot tolerate an increased dose during escalation, consider delaying escalation by ~1 additional week.",
            "Discontinue if a patient cannot tolerate the 3-mg dose — efficacy has not been established at lower doses.",
            "Evaluate weight change after 16 weeks on therapy. Discontinue if the patient has not lost ≥4% of baseline body weight.",
            "Saxenda and Victoza both contain liraglutide — do not use together or with any other GLP-1 receptor agonist.",
          ],
          source: medscapeRef("Dosing > Obesity (Adult)", LIRA_URL),
        },
        {
          id: "dosing.pediatric",
          title: "Pediatric — Saxenda ≥12 Years",
          summary: "Adolescents ≥12 y, weight >60 kg, BMI ≥30 kg/m² (adult cutoff): 0.6 mg SC qDay, escalate weekly to 3 mg/day; escalation may take up to 8 weeks",
          body: [
            "Saxenda only: adjunctive therapy to a reduced-calorie diet and increased physical activity for chronic weight management in adolescents aged ≥12 years with weight >60 kg and an initial body mass index (BMI) corresponding to ≥30 kg/m² for adults (obese) by international cutoffs.",
            "Initiate at 0.6 mg SC qDay for 1 week; increase by 0.6 mg/day in weekly intervals until a dose of 3 mg/day is achieved.",
            "Recommended maintenance dose is 3 mg/day; if unable to tolerate, may reduce to 2.4 mg/day; discontinue if 2.4 mg not tolerated.",
            "If pediatric patients do not tolerate an increased dose during dose escalation, may lower dose to previous level; dose escalation for pediatric patients may take up to 8 weeks.",
            "Evaluate change in BMI after 12 weeks on maintenance dose. Discontinue Saxenda if the patient has not reduced BMI by at least 1% from baseline.",
          ],
          source: medscapeRef("Dosing > Pediatric (Saxenda)", LIRA_URL),
        },
        {
          id: "dosing.renal_hepatic",
          title: "Renal & Hepatic Impairment",
          summary: "Victoza: no adjustment (mild–severe); Saxenda: use caution — limited experience in both renal and hepatic impairment",
          body: [
            "Victoza — Renal: mild-to-severe impairment including ESRD: no dosage adjustment necessary. Use caution in dehydrated patients (postmarketing AKI reports).",
            "Victoza — Hepatic: mild-to-severe impairment: limited experience; no dosage adjustment necessary.",
            "Saxenda — Renal: mild-to-severe including ESRD: limited experience; use with caution. Postmarketing reports of acute renal failure and worsening chronic renal failure, sometimes requiring hemodialysis.",
            "Saxenda — Hepatic: mild-to-severe: use caution; limited experience.",
            "Saxenda slows gastric emptying; has not been studied in patients with pre-existing gastroparesis.",
          ],
          source: medscapeRef("Dosing > Dosage Modifications", LIRA_URL),
        },
      ],
    },
    {
      id: "safety",
      lengthEstimate: "short",
      title: "Safety & Warnings",
      subfields: [
        {
          id: "safety.contraindications",
          title: "Contraindications",
          summary: "Personal/family history of MTC or MEN2; hypersensitivity to liraglutide",
          body: [
            "Personal or family history of medullary thyroid carcinoma (MTC) or multiple endocrine neoplasia syndrome type 2 (MEN2).",
            "Hypersensitivity to liraglutide or any excipient (anaphylaxis and angioedema reported postmarketing).",
            "Saxenda: not indicated for treatment of T2DM. Should not be used with Victoza or any other GLP-1 receptor agonist.",
            "Victoza: not for treatment of type 1 DM or diabetic ketoacidosis.",
          ],
          source: medscapeRef("Contraindications", LIRA_URL),
        },
        {
          id: "safety.aki_hr",
          title: "Acute Kidney Injury & Heart Rate",
          summary: "Postmarketing AKI — often secondary to dehydration; Saxenda may increase resting HR by 2–20 bpm",
          body: [
            "Acute renal failure and worsening of chronic renal failure reported postmarketing, sometimes requiring hemodialysis. Majority occurred in patients with nausea, vomiting, diarrhea, or dehydration.",
            "Liraglutide is not directly nephrotoxic — renal effects appear secondary to dehydration. Use caution when initiating or escalating doses in patients with renal impairment.",
            "Saxenda only: resting heart rate may increase by 2–3 bpm; increases up to 10–20 bpm have also been reported.",
            "Pancreatitis — including fatal hemorrhagic or necrotizing — has been observed; monitor for persistent severe abdominal pain.",
          ],
          source: medscapeRef("Warnings & Precautions", LIRA_URL),
        },
        {
          id: "safety.pancreatitis_gallbladder",
          title: "Pancreatitis & Gallbladder Disease",
          summary: "Acute pancreatitis reported; acute gallbladder disease (cholelithiasis, cholecystitis) reported with GLP-1 agonists",
          body: [
            "Acute pancreatitis — including fatal and nonfatal hemorrhagic or necrotizing — has been observed with liraglutide; studied in a limited number of patients with history of pancreatitis.",
            "Acute gallbladder disease (cholelithiasis or cholecystitis) reported in GLP-1 receptor agonist trials and postmarketing; gallbladder studies and appropriate clinical follow-up indicated if suspected.",
            "Severe GI adverse reactions are more frequent than with placebo; not recommended in patients with severe gastroparesis.",
          ],
          source: medscapeRef("Warnings > Pancreatitis & Gallbladder", LIRA_URL),
        },
      ],
    },
    {
      id: "interactions",
      lengthEstimate: "short",
      title: "Drug Interactions",
      subfields: [
        {
          id: "interactions.sulfonylureas_insulin",
          title: "Sulfonylureas & Insulin",
          summary: "Serious hypoglycemia risk with concomitant sulfonylureas — consider reducing secretagogue dose by ~50%; monitor glucose",
          body: [
            "Sulfonylureas (glimepiride, glipizide, glyburide): Either increases effects of the other — Use Caution/Monitor. Serious hypoglycemia may occur; consider lowering the sulfonylurea dose.",
            "Saxenda: when initiating in patients on insulin or insulin secretagogues, consider reducing the secretagogue dose by approximately one-half and monitor blood glucose.",
            "Conversely, if discontinuing Saxenda in patients with T2DM, monitor for an increase in blood glucose.",
            "All insulin formulations: Use Caution/Monitor — additive hypoglycemic effects; dosage adjustments may be required.",
          ],
          source: medscapeRef("Drug Interactions > Sulfonylureas & Insulin", LIRA_URL),
        },
        {
          id: "interactions.antipsychotics_corticosteroids",
          title: "Antipsychotics & Corticosteroids",
          summary: "Atypical antipsychotics may increase blood glucose; corticosteroids may decrease liraglutide effect — monitor glycemia",
          body: [
            "Atypical antipsychotics (aripiprazole, olanzapine, quetiapine, risperidone, clozapine, lurasidone, paliperidone, ziprasidone, asenapine): Use Caution/Monitor — associated with hyperglycemia; monitor blood glucose closely.",
            "Corticosteroids (betamethasone, dexamethasone, hydrocortisone, methylprednisolone, prednisone, prednisolone, cortisone, fludrocortisone, triamcinolone): Use Caution/Monitor — may diminish hypoglycemic effect.",
            "Thiazide diuretics: Use Caution/Monitor — may decrease insulin sensitivity; monitor glycemic control when initiating, discontinuing, or changing dose.",
            "ACE inhibitors and ARBs: Use Caution/Monitor — may enhance hypoglycemic effects; monitor, especially in the first month of ACE inhibitor therapy.",
          ],
          source: medscapeRef("Drug Interactions > Antipsychotics & Corticosteroids", LIRA_URL),
        },
        {
          id: "interactions.gastric_emptying",
          title: "Gastric Emptying & Oral Absorption",
          summary: "Liraglutide delays gastric emptying — may decrease Cmax and delay Tmax of concomitant oral drugs (eg, atorvastatin Cmax reduced 38%)",
          body: [
            "Liraglutide delays gastric emptying and has the potential to impact the absorption of concomitantly administered oral medications — exercise caution.",
            "Atorvastatin: Use Caution/Monitor — liraglutide decreased atorvastatin Cmax by 38% and delayed median Tmax from 1 h to 3 h; AUC unaffected.",
            "Acetaminophen (minor interaction): liraglutide decreased levels; clinical significance unknown.",
            "Digoxin and lovastatin: minor decrease in levels.",
          ],
          source: medscapeRef("Drug Interactions > Gastric Emptying", LIRA_URL),
        },
      ],
    },
    {
      id: "adverse",
      lengthEstimate: "short",
      title: "Adverse Effects",
      subfields: [
        {
          id: "adverse.gi",
          title: "GI Adverse Effects",
          summary: "Victoza: nausea (26%), diarrhea (17%), vomiting (11%). Saxenda: nausea (39%), diarrhea (21%), constipation (19%), vomiting (16%)",
          body: [
            "Victoza (>10%): nausea (26%), diarrhea (17%), vomiting (11%).",
            "Victoza (1–10%): constipation (10%), headache (9%), anti-liraglutide antibodies (7%), injection-site reactions (2%).",
            "Saxenda (>10%): nausea (39.3%), hypoglycemia in T2DM (23%), diarrhea (20.9%), constipation (19.4%), vomiting (15.7%), headache (13.6%).",
            "Saxenda (1–10%): decreased appetite (10%), dyspepsia (9.6%), fatigue (7.5%), dizziness (6.9%), abdominal pain (5.4%), increased lipase (5.3%), GERD (4.7%), anxiety (2%).",
            "Postmarketing: dehydration from GI effects, AKI, anaphylaxis/angioedema, acute pancreatitis, breast cancer, colorectal neoplasms, hepatobiliary disorders, intestinal obstruction, pulmonary aspiration.",
          ],
          source: medscapeRef("Adverse Reactions", LIRA_URL),
        },
        {
          id: "adverse.thyroid_renal",
          title: "Thyroid & Renal Adverse Effects",
          summary: "Thyroid C-cell tumors (rodents), papillary thyroid carcinoma (<1%, Victoza); AKI — secondary to dehydration",
          body: [
            "Victoza (<1%): papillary thyroid carcinoma, thyroid C-cell hyperplasia, pancreatitis, urticaria, upper respiratory tract infection, UTI, back pain.",
            "Acute renal failure and worsening of chronic renal failure — reported postmarketing, sometimes requiring hemodialysis; largely secondary to dehydration from GI adverse effects.",
            "Hepatobiliary disorders (postmarketing): hyperbilirubinemia, elevated liver enzymes, cholestasis, hepatitis, cholelithiasis requiring cholecystectomy.",
            "Cutaneous amyloidosis at injection sites reported postmarketing.",
          ],
          source: medscapeRef("Adverse Reactions > Thyroid & Renal", LIRA_URL),
        },
      ],
    },
    {
      id: "pregnancy",
      lengthEstimate: "short",
      title: "Pregnancy & Lactation",
      subfields: [
        {
          id: "pregnancy.planning",
          title: "Pregnancy",
          summary: "Use only if benefit justifies fetal risk; Saxenda: discontinue when pregnancy is recognized — weight loss offers no benefit",
          body: [
            "Based on animal reproduction studies, there may be risks to the fetus from exposure during pregnancy. Use during pregnancy only if the potential benefit justifies the potential risk to the fetus.",
            "Saxenda: weight loss offers no benefit to pregnant patients and may cause fetal harm; discontinue when pregnancy is recognized and advise patients of fetal risk.",
            "Animal data: liraglutide exposure was associated with early embryonic deaths and an imbalance in some fetal abnormalities in pregnant rats at doses approximating clinical exposures at the maximum recommended human dose of 1.8 mg/day.",
          ],
          source: medscapeRef("Pregnancy & Lactation > Pregnancy", LIRA_URL),
        },
      ],
    },
    {
      id: "pharmacology",
      lengthEstimate: "short",
      title: "Pharmacology",
      subfields: [
        {
          id: "pharmacology.moa",
          title: "Mechanism of Action",
          summary: "GLP-1 analogue/receptor agonist — glucose-dependent insulin secretion, delayed gastric emptying, decreased glucagon secretion",
          body: [
            "Incretin mimetic; analogue of human glucagon-like peptide-1 (GLP-1).",
            "Acts as a GLP-1 receptor agonist to increase insulin secretion in the presence of elevated blood glucose; delays gastric emptying to decrease postprandial glucose; also decreases glucagon secretion.",
          ],
          source: medscapeRef("Pharmacology > Mechanism of Action", LIRA_URL),
        },
      ],
    },
  ],

  synthesizedAnswers: {
    "t2dm-dose-victoza": {
      citations: [{ anchor: "dosing.t2dm_victoza", marker: 1 }],
      followUpQuestions: [
        "What's the dose for obesity management (Saxenda)?",
        "When should I consider reducing the sulfonylurea dose?",
        "What are the main adverse effects?",
      ],
      text: "For type 2 diabetes with Victoza (liraglutide SC), initiate at 0.6 mg once daily for 1 week — this dose is for GI tolerability only and does not improve glycemic control [1]. After 1 week, increase to 1.2 mg/day (first therapeutic dose). If glycemic control is inadequate, increase to 1.8 mg/day (maximum) [1].",
    },
    "saxenda-dose": {
      citations: [{ anchor: "dosing.obesity_saxenda", marker: 1 }],
      followUpQuestions: [
        "What if the patient can't tolerate 3 mg?",
        "How do I monitor weight loss response?",
        "What's the heart rate effect?",
      ],
      text: "For obesity management with Saxenda (liraglutide SC), initiate at 0.6 mg/day for 1 week, then increase by 0.6 mg/day each week until reaching the target dose of 3 mg/day [1]. If a patient cannot tolerate an increase, delay escalation by ~1 week. If the patient cannot tolerate 3 mg, discontinue — efficacy has not been established at lower doses [1]. At 16 weeks, assess weight loss; discontinue if <4% of baseline body weight has been lost [1].",
    },
    "saxenda-peds": {
      citations: [{ anchor: "dosing.pediatric", marker: 1 }],
      followUpQuestions: [
        "How long can pediatric dose escalation take?",
        "When should Saxenda be discontinued in adolescents?",
        "What adverse effects are most common in adolescents?",
      ],
      text: "Yes — Saxenda (liraglutide) is indicated for chronic weight management in adolescents aged ≥12 years with body weight >60 kg and an initial BMI corresponding to ≥30 kg/m² for adults [1]. Initiate at 0.6 mg SC daily and escalate by 0.6 mg weekly toward the 3 mg/day maintenance dose; pediatric escalation may take up to 8 weeks, and the dose may be reduced to 2.4 mg/day if 3 mg is not tolerated [1].",
    },
    "hypoglycemia": {
      citations: [
        { anchor: "interactions.sulfonylureas_insulin", marker: 1 },
        { anchor: "adverse.gi", marker: 2 },
      ],
      followUpQuestions: [
        "What's the Victoza starting dose?",
        "What about corticosteroid interactions?",
        "Can I use liraglutide with insulin?",
      ],
      text: "With concurrent sulfonylureas, serious hypoglycemia may occur [1]. When initiating Saxenda in patients already on insulin or insulin secretagogues, consider reducing the secretagogue dose by approximately one-half and monitor blood glucose closely [1]. With Saxenda, hypoglycemia in T2DM patients occurred in 23% of patients in trials [2].",
    },
    "gi-effects": {
      citations: [{ anchor: "adverse.gi", marker: 1 }],
      followUpQuestions: [
        "How does gradual dose escalation help with GI effects?",
        "What serious adverse effects should I watch for?",
        "What are the contraindications?",
      ],
      text: "GI adverse effects are the most common with liraglutide [1]. Victoza causes nausea in 26% of patients, diarrhea in 17%, and vomiting in 11%. Saxenda causes even higher rates: nausea 39.3%, diarrhea 20.9%, constipation 19.4%, vomiting 15.7% [1]. The weekly escalation schedule minimizes these effects. Postmarketing reports include acute pancreatitis (sometimes fatal) and intestinal obstruction [1].",
    },
    "contraindications": {
      citations: [{ anchor: "safety.contraindications", marker: 1 }],
      followUpQuestions: [
        "What about pancreatitis history?",
        "What is the kidney injury risk?",
        "What are the key drug interactions?",
      ],
      text: "Liraglutide is contraindicated in patients with a personal or family history of medullary thyroid carcinoma (MTC) or multiple endocrine neoplasia syndrome type 2 (MEN2) [1]. It is also contraindicated with hypersensitivity to liraglutide. Saxenda should not be used together with Victoza or any other GLP-1 receptor agonist [1].",
    },
    "renal-hepatic": {
      citations: [{ anchor: "dosing.renal_hepatic", marker: 1 }],
      followUpQuestions: [
        "What about the acute kidney injury risk?",
        "Are the renal recommendations different for Victoza vs Saxenda?",
        "What GI side effects can affect renal function?",
      ],
      text: "For Victoza (T2DM), no dosage adjustment is required for mild-to-severe renal impairment, but use caution in dehydrated patients given postmarketing reports of AKI [1]. For Saxenda (obesity), experience in renal or hepatic impairment is limited — use with caution, as postmarketing reports describe AKI and worsening chronic renal failure sometimes requiring hemodialysis [1].",
    },
    "interactions-sfu": {
      citations: [
        { anchor: "interactions.sulfonylureas_insulin", marker: 1 },
        { anchor: "interactions.antipsychotics_corticosteroids", marker: 2 },
      ],
      followUpQuestions: [
        "What about the gastric emptying interaction?",
        "How do I manage the hypoglycemia risk?",
        "What are the serious adverse effects?",
      ],
      text: "Sulfonylureas combined with liraglutide increase hypoglycemia risk — consider lowering the sulfonylurea dose by approximately one-half when adding Saxenda [1]. Atypical antipsychotics may increase blood glucose and should be monitored closely [2]. Corticosteroids decrease liraglutide's hypoglycemic effect — monitor glycemic control [2]. Liraglutide also delays gastric emptying — atorvastatin Cmax was reduced 38% in pharmacokinetic studies [3].",
    },
  },

  taskChips: [
    {
      id: "t2dm-dosing",
      label: "T2DM dosing (Victoza)",
      subfieldIds: ["dosing.t2dm_victoza"],
    },
    {
      id: "weight-dosing",
      label: "Saxenda dosing",
      subfieldIds: ["dosing.obesity_saxenda"],
    },
    {
      id: "hypoglycemia",
      label: "Hypoglycemia risk",
      subfieldIds: ["interactions.sulfonylureas_insulin"],
    },
    {
      id: "gi-effects",
      label: "GI adverse effects",
      subfieldIds: ["adverse.gi"],
    },
    {
      id: "interactions",
      label: "Drug interactions",
      subfieldIds: ["interactions.sulfonylureas_insulin", "interactions.antipsychotics_corticosteroids"],
    },
  ],
};

// ─── Insulin Regular Human (Humulin R / Novolin R) ───────────────────────────

export const insulinRegularHumanMonograph: DrugMonograph = {
  blackBoxWarnings: [],

  drug: {
    drugClass: "Short-acting insulin",
    id: "insulin-regular-human",
    name: "Insulin Regular Human",
  },

  keyFields: [
    { label: "T2DM Starting Dose", subfieldId: "dosing.t2dm_sc" },
    { label: "DKA Protocol (IV)", subfieldId: "dosing.dka" },
    { label: "Contraindications", subfieldId: "safety.contraindications" },
    { label: "Hypoglycemia Risk", subfieldId: "safety.hypoglycemia" },
  ],

  sections: [
    {
      id: "dosing",
      lengthEstimate: "long",
      title: "Dosing & Uses",
      subfields: [
        {
          id: "dosing.t1dm_sc",
          title: "Type 1 Diabetes — SC",
          summary: "Initial 0.2–0.4 units/kg/day SC divided q8hr; maintenance 0.5–1 unit/kg/day; 50–75% as intermediate/long-acting",
          body: [
            "Initial SC dose: 0.2–0.4 units/kg/day divided q8hr or more frequently.",
            "Maintenance SC dose: 0.5–1 unit/kg/day divided q8hr or more frequently. Insulin-resistant patients (eg, obesity) may require substantially higher daily doses.",
            "Approximately 50–75% of total daily insulin is given as intermediate- or long-acting insulin in 1–2 injections; regular insulin is used before or at mealtimes for the remainder.",
            "Inject SC ~30 minutes before meals into the thigh, upper arm, abdomen, or buttocks. Rotate injection sites within the same region.",
            "Adolescents may require up to 1.5 units/kg/day during puberty; average prepubertal requirements vary from 0.7–1 unit/kg/day.",
          ],
          source: medscapeRef("Dosing > Type 1 Diabetes Mellitus (SC)", INSR_URL),
        },
        {
          id: "dosing.t2dm_sc",
          title: "Type 2 Diabetes — SC",
          summary: "Suggested start: 10 units/day SC (or 0.1–0.2 units/kg/day) in evening or divided q12hr",
          body: [
            "Suggested beginning dose: 10 units/day SC (or 0.1–0.2 unit/kg/day) in the evening or divided q12hr.",
            "Morning dose: give two thirds of the daily insulin requirement; ratio of regular insulin to NPH insulin = 1:2.",
            "Evening dose: give one third of the daily insulin requirement; ratio of regular insulin to NPH insulin = 1:1.",
            "Dosage adjustment guidelines: look for consistent pattern in blood sugars for >3 days; adjust only 1 insulin dose at a time; correct hypoglycemia first; correct highest blood sugars next; change insulin doses in small increments (2–3 units for T2DM).",
          ],
          source: medscapeRef("Dosing > Type 2 Diabetes Mellitus (SC)", INSR_URL),
        },
        {
          id: "dosing.dka",
          title: "DKA / Severe Hyperglycemia (Off-label, IV)",
          summary: "IV: 0.1 unit/kg bolus, then 0.1 unit/kg/hr infusion; reduce to 0.05–0.1 unit/kg/hr when glucose reaches 250 mg/dL",
          body: [
            "IV regular insulin is recommended over SC administration for severe hyperglycemia and DKA.",
            "Adults: 0.1 unit/kg IV bolus (some guidelines argue against bolus), then 0.1 unit/kg/hr IV continuous infusion.",
            "If serum glucose does not fall by ≥50 mg/dL in the first hour, check hydration status; if adequate, double the insulin infusion hourly until glucose falls at 50–75 mg/dL/hr.",
            "Reduce infusion to 0.05–0.1 unit/kg/hr when blood glucose reaches 250 mg/dL.",
            "Pediatric: administer 0.05–0.1 units/kg/hr IV until resolution of ketoacidosis (pH >7.3, bicarbonate >15 mEq/L and/or closure of anion gap).",
            "Add dextrose (5%) to IV fluid when serum glucose reaches 250–300 mg/dL (sooner if precipitous fall) to prevent hypoglycemia.",
          ],
          source: medscapeRef("Dosing > DKA / Severe Hyperglycemia (Off-label)", INSR_URL),
        },
        {
          id: "dosing.hyperkalemia",
          title: "Hyperkalemia Treatment (Off-label, IV)",
          summary: "5–10 units IV in 50 mL D50W over 15–30 min (adults); 0.1 unit/kg with 400 mg/kg glucose (pediatric)",
          body: [
            "Adults: 5–10 units IV regular insulin administered in 50 mL D50W (25 g glucose) infused over 15–30 minutes.",
            "Pediatric: 0.1 unit/kg insulin with 400 mg/kg of glucose IV (ratio: 1 unit insulin per 4 g glucose).",
            "Monitor serum glucose closely after administration; onset of potassium-lowering effect is ~15–30 minutes; duration ~4–6 hours.",
          ],
          source: medscapeRef("Dosing > Hyperkalemia (Off-label)", INSR_URL),
        },
      ],
    },
    {
      id: "safety",
      lengthEstimate: "short",
      title: "Safety & Warnings",
      subfields: [
        {
          id: "safety.contraindications",
          title: "Contraindications",
          summary: "Hypoglycemia; hypersensitivity to human insulin or product excipients",
          body: [
            "Active hypoglycemia — do not administer insulin during a hypoglycemic episode.",
            "Hypersensitivity to human insulin or any product excipient (severe generalized allergy including anaphylaxis can occur).",
            "Not for mixing with any insulin for IV use or with insulins other than NPH insulin for SC use.",
          ],
          source: medscapeRef("Contraindications", INSR_URL),
        },
        {
          id: "safety.hypoglycemia",
          title: "Hypoglycemia",
          summary: "Most common adverse effect; can be life-threatening; risk increased with dose changes, missed meals, exercise, renal/hepatic impairment",
          body: [
            "Hypoglycemia is the most common and clinically significant adverse effect of insulin regular human.",
            "Severe hypoglycemia can cause seizures, unconsciousness, and death; can impair concentration and reaction time — risk for driving/operating machinery.",
            "Risk factors: excessive insulin dose, delayed or missed meals, increased physical activity, renal impairment (decreased insulin clearance), hepatic impairment, concomitant hypoglycemic medications.",
            "Rapid changes in serum glucose may induce hypoglycemia symptoms; increase monitoring with insulin dose changes, changes in co-administered medications, or meal pattern changes.",
            "Educate patients and caregivers on recognition and management of hypoglycemia; self-monitoring of blood glucose is essential.",
          ],
          source: medscapeRef("Warnings > Hypoglycemia", INSR_URL),
        },
        {
          id: "safety.u500_errors",
          title: "U-500 Medication Errors",
          summary: "Prescribed dose must always be expressed in units, NOT volume; U-500 is 5× more concentrated than U-100 — dose errors can cause hypoglycemia or death",
          body: [
            "Humulin R U-500 is 5× more concentrated than U-100 (500 units/mL vs 100 units/mL).",
            "Prescribed dose must always be expressed in actual units of insulin and NOT volume.",
            "Reports of hyperglycemia, hypoglycemia, and death from U-500 dose errors — majority due to dispensing, prescribing, or administration errors from confusion with U-100 syringe markings.",
            "Prescribe U-500 with dedicated U-500 syringes to avoid conversion errors with U-100 syringes.",
            "Instruct patients to always check insulin label before each injection.",
          ],
          source: medscapeRef("Warnings > U-500 Medication Errors", INSR_URL),
        },
        {
          id: "safety.hypokalemia",
          title: "Hypokalemia",
          summary: "Insulin shifts potassium into cells — can cause hypokalemia, especially with IV use; monitor potassium in at-risk patients",
          body: [
            "Insulin causes a shift in potassium from the extracellular to intracellular space, possibly leading to hypokalemia.",
            "Use caution when coadministered with potassium-lowering drugs or in patients with conditions predisposing to hypokalemia.",
            "Untreated hypokalemia can cause respiratory paralysis, ventricular arrhythmia, and death.",
            "Administer IV insulin under medical supervision with close monitoring of blood glucose and potassium levels.",
          ],
          source: medscapeRef("Warnings > Hypokalemia", INSR_URL),
        },
      ],
    },
    {
      id: "interactions",
      lengthEstimate: "long",
      title: "Drug Interactions",
      subfields: [
        {
          id: "interactions.contraindicated_serious",
          title: "Contraindicated & Serious Interactions",
          summary: "Pramlintide: contraindicated (administer separately). Ethanol: serious — unpredictable effect; avoid or use alternate. Macimorelin: serious — interferes with GH test",
          body: [
            "Pramlintide (Contraindicated): insulin regular human and pramlintide must be administered separately — must not be mixed.",
            "Ethanol (Serious — Avoid or Use Alternate Drug): alcohol may either increase or decrease the blood glucose-lowering effect; may decrease endogenous glucose production (increased hypoglycemia risk) or worsen glycemic control by adding calories.",
            "Macimorelin (Serious — Avoid or Use Alternate Drug): insulin may transiently elevate growth hormone concentrations, impacting the accuracy of the macimorelin GH diagnostic test; allow sufficient washout time.",
          ],
          source: medscapeRef("Drug Interactions > Contraindicated & Serious", INSR_URL),
        },
        {
          id: "interactions.glp1_agents",
          title: "GLP-1 Agonists & Other Antidiabetics",
          summary: "GLP-1 agonists (semaglutide, tirzepatide, liraglutide, etc.) increase hypoglycemia risk — Modify Therapy; consider lowering insulin dose",
          body: [
            "GLP-1 receptor agonists combined with insulin increase hypoglycemia risk — Modify Therapy/Monitor Closely for semaglutide, tirzepatide, exenatide, dulaglutide, orforglipron.",
            "Lowering the insulin dose may reduce hypoglycemia risk when initiating or escalating a GLP-1 agonist.",
            "All other antidiabetic agents (metformin, sulfonylureas, SGLT2 inhibitors, DPP-4 inhibitors, pioglitazone, etc.): Use Caution/Monitor or Modify Therapy — dosage adjustments may be required when initiating or discontinuing.",
            "SGLT2 inhibitors (canagliflozin, dapagliflozin, empagliflozin, ertugliflozin, sotagliflozin): Modify Therapy/Monitor Closely — consider lower insulin dose to avoid hypoglycemia.",
          ],
          source: medscapeRef("Drug Interactions > GLP-1 Agonists & Antidiabetics", INSR_URL),
        },
        {
          id: "interactions.potentiators_antagonists",
          title: "Hypoglycemia Potentiators & Antagonists",
          summary: "Beta-blockers mask hypoglycemia symptoms; salicylates (high-dose), ACE inhibitors increase hypoglycemia risk; corticosteroids, thiazides, antipsychotics decrease insulin effect",
          body: [
            "Non-selective beta-blockers (nadolol, pindolol, propranolol, timolol): delay recovery from insulin-induced hypoglycemia; mask tachycardia symptom; inhibit insulin secretion long-term; may induce hypertension during hypoglycemia. Monitor closely.",
            "High-dose salicylates (≥3 g/day aspirin, magnesium salicylate, salsalate): Modify Therapy/Monitor Closely — increase hypoglycemia risk.",
            "ACE inhibitors: enhance hypoglycemic effect — monitor blood glucose, especially during the first month of ACE inhibitor therapy.",
            "Corticosteroids (pharmacodynamic antagonism): decrease insulin effect — dose adjustment and increased monitoring required.",
            "Thiazide diuretics (>50 mg/day): decrease insulin sensitivity — monitor glycemic control.",
            "Atypical antipsychotics (olanzapine, quetiapine, risperidone, etc.): associated with hyperglycemia — monitor glucose closely.",
            "Sympathomimetics (pseudoephedrine): decrease insulin effect — may increase hepatic glucose production; Modify Therapy/Monitor Closely.",
          ],
          source: medscapeRef("Drug Interactions > Potentiators & Antagonists", INSR_URL),
        },
      ],
    },
    {
      id: "adverse",
      lengthEstimate: "short",
      title: "Adverse Effects",
      subfields: [
        {
          id: "adverse.hypoglycemia_hypokalemia",
          title: "Hypoglycemia & Hypokalemia",
          summary: "Most clinically significant adverse effects; hypoglycemia most common; hypokalemia risk with IV use",
          body: [
            "Hypoglycemia: most common adverse effect of insulin. Severe hypoglycemia can cause seizures, unconsciousness, and death.",
            "Symptoms include headache, tachycardia, diaphoresis, tremor — may be attenuated in longstanding diabetes, diabetic neuropathy, patients on beta-blockers, or those with recurrent hypoglycemia.",
            "Hypokalemia: insulin shifts potassium intracellularly. Particularly relevant with IV insulin administration (DKA protocol, hyperkalemia treatment). Monitor potassium closely.",
            "Peripheral edema and weight gain can occur — attributed to anabolic effects of insulin and sodium retention.",
          ],
          source: medscapeRef("Adverse Reactions > Hypoglycemia & Hypokalemia", INSR_URL),
        },
        {
          id: "adverse.injection_other",
          title: "Injection Site Reactions & Other",
          summary: "Lipodystrophy, localized cutaneous amyloidosis at injection sites; immunogenicity; diabetic retinopathy worsening with rapid glucose improvement",
          body: [
            "Injection site reactions (postmarketing): localized cutaneous amyloidosis at repeated injection sites.",
            "Repeated injection into areas of lipodystrophy or cutaneous amyloidosis can cause hyperglycemia; changing to unaffected areas can cause hypoglycemia — rotate sites and monitor carefully.",
            "Rapid improvement in glucose control can cause transitory, reversible ophthalmologic refraction disorders and worsening of diabetic retinopathy.",
            "Severe, life-threatening generalized allergy including anaphylaxis can occur — discontinue therapy if indicated.",
            "Thiazolidinediones combined with insulin may increase fluid retention and heart failure risk; monitor for signs and symptoms.",
          ],
          source: medscapeRef("Adverse Reactions > Other", INSR_URL),
        },
      ],
    },
  ],

  synthesizedAnswers: {
    "t2dm-dose": {
      citations: [{ anchor: "dosing.t2dm_sc", marker: 1 }],
      followUpQuestions: [
        "How do I adjust the dose over time?",
        "What's the risk of hypoglycemia?",
        "What other antidiabetics can be combined with insulin?",
      ],
      text: "For type 2 diabetes inadequately controlled by diet, exercise, or oral medications, the suggested starting SC dose is 10 units/day (or 0.1–0.2 units/kg/day) in the evening or divided q12hr [1]. Morning dose: two-thirds of total daily requirement with a regular:NPH ratio of 1:2; evening dose: one-third with a 1:1 ratio [1]. Adjust only one insulin at a time, correcting hypoglycemia first, then the highest blood sugars, in increments of 2–3 units.",
    },
    "t1dm-dose": {
      citations: [{ anchor: "dosing.t1dm_sc", marker: 1 }],
      followUpQuestions: [
        "How much should be given as basal insulin?",
        "When should I give regular insulin relative to meals?",
        "What's the DKA management protocol?",
      ],
      text: "For type 1 diabetes, the initial SC dose is 0.2–0.4 units/kg/day divided q8hr or more frequently [1]. Maintenance is 0.5–1 unit/kg/day, with approximately 50–75% given as intermediate- or long-acting insulin. Regular insulin should be administered ~30 minutes before meals [1]. Inject SC in the thigh, upper arm, abdomen, or buttocks, rotating sites within the same region [1].",
    },
    "dka-protocol": {
      citations: [{ anchor: "dosing.dka", marker: 1 }],
      followUpQuestions: [
        "When do I add dextrose to the IV fluid?",
        "What's the pediatric DKA protocol?",
        "What are the risks of IV insulin?",
      ],
      text: "For DKA or severe hyperglycemia, IV regular insulin is preferred. Start with a 0.1 unit/kg IV bolus (optional per institutional protocol), then a continuous infusion at 0.1 unit/kg/hr [1]. If glucose does not fall by ≥50 mg/dL in the first hour, double the infusion rate hourly. Once glucose reaches 250 mg/dL, reduce the infusion to 0.05–0.1 unit/kg/hr and add dextrose to IV fluids to prevent hypoglycemia [1].",
    },
    "hypoglycemia": {
      citations: [
        { anchor: "safety.hypoglycemia", marker: 1 },
        { anchor: "interactions.potentiators_antagonists", marker: 2 },
      ],
      followUpQuestions: [
        "How do beta-blockers affect hypoglycemia recognition?",
        "What medications increase hypoglycemia risk?",
        "How should I adjust the dose to prevent hypoglycemia?",
      ],
      text: "Hypoglycemia is the most clinically significant adverse effect of insulin regular human and can be life-threatening [1]. Risk is increased by excessive dosing, missed meals, increased activity, renal or hepatic impairment, and concomitant hypoglycemic drugs. High-dose salicylates, ACE inhibitors, and GLP-1 agonists increase hypoglycemia risk [2]. Non-selective beta-blockers mask tachycardia symptoms of hypoglycemia and delay glucose recovery — monitor closely [2].",
    },
    "glp1-combination": {
      citations: [
        { anchor: "interactions.glp1_agents", marker: 1 },
        { anchor: "safety.hypoglycemia", marker: 2 },
      ],
      followUpQuestions: [
        "Which GLP-1 agonists require dose modification?",
        "How much should I reduce the insulin dose?",
        "What's the DKA protocol?",
      ],
      text: "Combining insulin regular human with GLP-1 receptor agonists (semaglutide, tirzepatide, liraglutide, dulaglutide, exenatide) significantly increases hypoglycemia risk — all are rated Modify Therapy/Monitor Closely [1]. Lowering the insulin dose when initiating or escalating a GLP-1 agonist reduces this risk [1]. Monitor blood glucose closely during the initiation period and educate patients on hypoglycemia recognition [2].",
    },
    "interactions-overview": {
      citations: [
        { anchor: "interactions.contraindicated_serious", marker: 1 },
        { anchor: "interactions.potentiators_antagonists", marker: 2 },
      ],
      followUpQuestions: [
        "How do GLP-1 agonists interact with insulin?",
        "What about beta-blockers?",
        "What medications decrease insulin effect?",
      ],
      text: "Pramlintide is contraindicated with insulin regular human — must be administered separately [1]. Ethanol should be avoided or an alternate used due to unpredictable effects on blood glucose [1]. Non-selective beta-blockers mask hypoglycemia symptoms (particularly tachycardia) and delay glucose recovery — monitor closely [2]. High-dose salicylates and ACE inhibitors increase hypoglycemia risk; corticosteroids and thiazide diuretics decrease insulin's hypoglycemic effect [2].",
    },
    "u500-errors": {
      citations: [{ anchor: "safety.u500_errors", marker: 1 }],
      followUpQuestions: [
        "How do I prescribe U-500 safely?",
        "What syringes should be used with U-500?",
        "What are the signs of hypoglycemia?",
      ],
      text: "Humulin R U-500 is 5× more concentrated than U-100 (500 vs 100 units/mL) — dose must always be expressed in units, not volume [1]. Prescribe with dedicated U-500 syringes to avoid errors from confusion with U-100 syringe markings. Dispensing and administration errors with U-500 have caused hypoglycemia, hyperglycemia, and death [1].",
    },
  },

  taskChips: [
    {
      id: "t2dm-dosing",
      label: "T2DM dosing",
      subfieldIds: ["dosing.t2dm_sc"],
    },
    {
      id: "dka-protocol",
      label: "DKA protocol (IV)",
      subfieldIds: ["dosing.dka"],
    },
    {
      id: "hypoglycemia",
      label: "Hypoglycemia risk",
      subfieldIds: ["safety.hypoglycemia", "interactions.potentiators_antagonists"],
    },
    {
      id: "glp1-combo",
      label: "GLP-1 combination",
      subfieldIds: ["interactions.glp1_agents"],
    },
    {
      id: "interactions",
      label: "Drug interactions",
      subfieldIds: ["interactions.contraindicated_serious", "interactions.potentiators_antagonists"],
    },
  ],
};
