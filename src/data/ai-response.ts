export type PromptSectionId =
  | "drug-info"
  | "challenging-questions"
  | "patient-workup"
  | "treatment-options"
  | "recent-research"
  | "lab-findings";

export type PromptSection = {
  id: PromptSectionId;
  title: string;
  prompts: string[];
};

export type SidebarHistoryItem = {
  id: string;
  question: string;
};

export type SidebarHistoryGroup = {
  id: string;
  items: SidebarHistoryItem[];
  label: string;
};

export const aiResponseAssets = {
  composerIcons: {
    scrollDown: "/assets/arrow-down.svg?v=2",
    send: "/assets/arrow-up.svg",
    stop: "/assets/circle-arrow-up.svg",
  },
  landingLogo: "/assets/Medscape AI Logo Slogan.svg",
  logoAssets: {
    medscapeAi: "/assets/medscape-ai.svg",
    medscapeMini: "/assets/Medscape-mini.svg",
    promptAnimation: "/assets/prompt-animation.gif",
  },
  menuIcon: "/assets/kebab-menu.svg",
  microphoneIcon: "/assets/Microphone.svg",
  promptSectionIcons: {
    "challenging-questions": "/assets/Ask challenging questions.svg",
    "drug-info": "/assets/Check drug info.svg",
    "lab-findings": "/assets/Interpret lab findings.svg",
    "patient-workup": "/assets/Work up a patient.svg",
    "recent-research": "/assets/Summarize recent research.svg",
    "treatment-options": "/assets/Review treatment options.svg",
  } satisfies Record<PromptSectionId, string>,
  uiIcons: {
    copy: "/assets/duplicate.svg",
    dislike: "/assets/dislike.svg",
    dislikeFilled: "/assets/dislike filled.svg",
    download: "/assets/Download.svg",
    history: "/assets/history.svg",
    followUpQuestions: "/assets/fwp.svg",
    like: "/assets/like.svg",
    likeFilled: "/assets/like filled.svg",
    newChat: "/assets/new-chat.svg",
    pencil: "/assets/pencil.svg",
    references: "/assets/references.svg",
    settings: "/assets/settings.svg",
    share: "/assets/Share.svg",
    trash: "/assets/trash.svg",
  },
} as const;

export const promptSections: PromptSection[] = [
  {
    id: "drug-info",
    title: "Check drug info",
    prompts: [
      "How would you adjust vancomycin dosing (loading and interval) in a 70 kg patient on intermittent hemodialysis?",
      "How should phenytoin dosing be altered in an elderly patient with hypoalbuminemia (albumin 2.0 g/dL)?",
      "A patient on warfarin is started on trimethoprim-sulfamethoxazole. How does this alter INR, and what dose changes or monitoring schedule do you recommend?",
    ],
  },
  {
    id: "challenging-questions",
    title: "Ask challenging questions",
    prompts: [
      "In a patient with septic shock and atrial fibrillation, how would you balance vasopressor choice with rate control strategy during the first 6 hours?",
      "How do you distinguish immune checkpoint inhibitor pneumonitis from infectious pneumonia when both CT findings and symptoms overlap?",
      "What evidence would make you favor early combination therapy over stepwise escalation in newly diagnosed pulmonary arterial hypertension?",
    ],
  },
  {
    id: "patient-workup",
    title: "Work up a patient",
    prompts: [
      "Outline an evidence-based workup for new-onset microcytic anemia in a 63-year-old adult with fatigue and unintentional weight loss.",
      "What is the initial diagnostic approach to persistent transaminitis in a patient with obesity, diabetes, and no alcohol use?",
      "Build a first-pass evaluation plan for syncope in a patient with exertional symptoms and a family history of sudden cardiac death.",
    ],
  },
  {
    id: "treatment-options",
    title: "Review treatment options",
    prompts: [
      "Compare GLP-1 receptor agonists and SGLT2 inhibitors for a patient with type 2 diabetes, obesity, and established cardiovascular disease.",
      "What are the main treatment pathways for moderate plaque psoriasis when topical therapy is no longer controlling symptoms?",
      "Review first-line and escalation options for heart failure with preserved ejection fraction in a patient with recurrent volume overload.",
    ],
  },
  {
    id: "recent-research",
    title: "Summarize recent research",
    prompts: [
      "Summarize the most practice-changing evidence on obesity pharmacotherapy and cardiovascular outcomes.",
      "What recent data should clinicians know about adjuvant immunotherapy in resected non-small cell lung cancer?",
      "Give me a concise update on current trial trends in Alzheimer disease disease-modifying therapies.",
    ],
  },
  {
    id: "lab-findings",
    title: "Interpret lab findings",
    prompts: [
      "Interpret a BMP showing sodium 126, serum osmolality 268, urine sodium 54, and urine osmolality 512 in a euvolemic patient.",
      "How would you explain an isolated alkaline phosphatase elevation with normal AST, ALT, and bilirubin?",
      "What is the differential and next-step evaluation for normocytic anemia with low reticulocyte count and elevated ferritin?",
    ],
  },
];

const rawSidebarHistoryGroups = [
  {
    label: "This month",
    items: ["What are the symptoms of afebrile pneumonia"],
  },
  {
    label: "February 2026",
    items: [
      "What are the treatment options for type 2 diabetes",
      "What are traditional risk factors for CVD?",
      "How does HDL cholesterol affect heart disease risk?",
    ],
  },
  {
    label: "January 2026",
    items: [
      "What are the treatment options for type 2 diabetes",
      "What are traditional risk factors for CVD?",
      "How does HDL cholesterol affect heart disease risk?",
      "What are the treatment options for type 2 diabetes",
      "What are traditional risk factors for CVD?",
    ],
  },
  {
    label: "December 2025",
    items: [
      "What are the treatment options for type 2 diabetes",
      "What are traditional risk factors for CVD?",
      "How does HDL cholesterol affect heart disease risk?",
    ],
  },
] as const;

export function createInitialSidebarHistoryGroups(): SidebarHistoryGroup[] {
  return rawSidebarHistoryGroups.map((group, groupIndex) => ({
    id: `group-${groupIndex}`,
    items: group.items.map((question, itemIndex) => ({
      id: `group-${groupIndex}-item-${itemIndex}`,
      question,
    })),
    label: group.label,
  }));
}

export const defaultInitialQuestion = promptSections[0].prompts[0];

export type AiAnswerReference = {
  detail: string;
  doi?: string;
  id: number;
  publishedAt?: string;
  source: string;
  sourceLabel: string;
  tags?: string[];
  title: string;
  url?: string;
};

export type AiAnswerSupportingContent = {
  followUpQuestions: string[];
  references: AiAnswerReference[];
};

function buildReferenceList(
  references: Omit<AiAnswerReference, "id">[],
): AiAnswerReference[] {
  return references.map((reference, index) => ({
    ...reference,
    id: index + 1,
  }));
}

function buildGenericSupportingContent(question: string): AiAnswerSupportingContent {
  return {
    followUpQuestions: [
      "Tailor to patient profile",
      "Identify key red flags",
      "Build a focused workup",
      "Draft patient counseling language",
    ],
    references: buildReferenceList([
      {
        detail: "Guideline-informed demonstration source for prototype content.",
        publishedAt: "Apr 16, 2026",
        source: "Prototype Clinical Summary",
        sourceLabel: "Prototype",
        tags: ["Prototype"],
        title: `Guideline-informed clinical summary for: ${question}`,
      },
      {
        detail: "Evidence synthesis content should be replaced with source-linked references in production.",
        publishedAt: "Apr 16, 2026",
        source: "Prototype Evidence Note",
        sourceLabel: "Prototype",
        tags: ["Demo Only"],
        title: "Implementation note for evidence synthesis and source linking",
      },
    ]),
  };
}

const osteoporosisAnswer = [
  "Patients with osteoporosis should maintain adequate daily intakes of elemental calcium and vitamin D, preferably through diet but supplemented as needed.",
  "",
  "Calcium Intake",
  "- Younger adults (age 19-50 years): 1,000 mg elemental calcium daily.",
  "- Women >= 51 years and men >= 71 years: 1,200 mg elemental calcium daily.",
  "- Men age 51-70 years: 1,000 mg elemental calcium daily.",
  "- Upper intake level for older adults: 2,000 mg/day to avoid potential adverse effects.",
  "",
  "Common oral supplements",
  "- Calcium carbonate (40% elemental calcium): first-line; better absorbed with meals and requires fewer tablets.",
  "- Calcium citrate (21% elemental calcium): useful in achlorhydria or with acid-suppressing therapy.",
  "",
  "Vitamin D Intake",
  "- Adults age 51-70 years: 600 IU daily.",
  "- Adults > 70 years: 800 IU daily.",
  "- Many patients with osteoporosis require 800-1,000 IU cholecalciferol daily to maintain adequate 25-hydroxyvitamin D levels.",
  "- Typical upper level: 4,000 IU/day unless a specialist is directing higher replacement.",
  "",
  "Clinical takeaway",
  "- Aim to meet intake goals primarily through diet, then add supplements to close the gap.",
  "- Reassess renal function, history of nephrolithiasis, and concomitant osteoporosis therapy before finalizing the plan.",
].join("\n");

function buildVancomycinAnswer() {
  return [
    "Key Points",
    "- Treat as **functionally anephric** for dosing",
    "- **Loading ≈15 mg/kg** (≈1 g for 70 kg)",
    "- **Maintenance ~1.9 mg/kg/24 hr** (≈130 mg/day)",
    "- Adjust using **troughs**; serious infections trough **15-20 mg/L**",
    "- Monitor **renal function**, especially if residual urine output",
    "",
    "In a 70-kg adult on intermittent hemodialysis, use **functionally anephric dosing principles** with a **15 mg/kg load** and **trough-guided maintenance**.",
    "",
    "Initial (loading) dose",
    "- For adults with renal impairment, the initial daily dose should be **no less than 15 mg/kg IV**.[1]",
    "- In **functionally anephric patients**, the recommended initial dose is **15 mg/kg** to rapidly achieve therapeutic serum concentrations.[1]",
    "- For a 70-kg patient: **15 mg/kg ≈ 1,050 mg**, typically rounded to **1 g IV**, infused over **≥60 minutes** (**≤10 mg/min**).[1][2]",
    "",
    "Maintenance dose and interval (functionally anephric)",
    "- For functionally anephric adults, after the **15 mg/kg load**, labeling suggests starting at **1.9 mg/kg/24 hr**.[1]",
    "- For 70 kg: **1.9 mg/kg ≈ 130 mg per 24 hours IV** as an initial maintenance estimate.[1]",
    "",
    "Therapeutic drug monitoring and adjustment",
    "- In renal impairment, measure **trough serum concentrations** to guide therapy, especially in seriously ill patients or with changing renal function.[1]",
    "- Conventional target peak **18-26 mg/L**; trough **5-10 mg/L**, but IDSA and other guidelines urge troughs **15-20 mg/L for serious infections**.[1]",
    "- Adjust the **post-dialysis supplemental dose** and **effective interval** based on measured troughs and **clinical response**, as labeling emphasizes individualized dosing in renal dysfunction.[1]",
    "",
    "Would you like a focused outline of trough timing and dose adjustment steps around each hemodialysis session?",
  ].join("\n");
}

function buildPhenytoinAnswer() {
  return [
    "In an elderly patient with hypoalbuminemia, total phenytoin levels can be misleading because the free fraction rises as albumin falls.",
    "",
    "How to interpret the level",
    "- Use a corrected phenytoin concentration or, preferably, obtain a free phenytoin level if available.",
    "- With albumin around 2.0 g/dL, a 'therapeutic' total level may already represent excessive active drug exposure.",
    "",
    "Dosing implications",
    "- Avoid reflexive dose escalation based only on the total level.",
    "- If the patient has toxicity features such as nystagmus, ataxia, or confusion, consider dose reduction even when the total level appears acceptable.",
    "",
    "Practical approach",
    "- Confirm adherence, interacting drugs, and renal function.",
    "- Base adjustments on free level, corrected level, seizure control, and adverse effects rather than total level alone.",
    "- Make small maintenance adjustments because phenytoin exhibits nonlinear kinetics.",
  ].join("\n");
}

function buildWarfarinAnswer() {
  return [
    "Trimethoprim-sulfamethoxazole commonly increases warfarin exposure and can produce a clinically significant INR rise within a few days.",
    "",
    "Expected interaction",
    "- INR often increases because sulfamethoxazole inhibits warfarin metabolism and can intensify anticoagulant effect.",
    "- The interaction is strong enough that many clinicians proactively adjust the warfarin plan rather than waiting for a supratherapeutic INR.",
    "",
    "Prototype management approach",
    "- Consider an empiric warfarin dose reduction when TMP-SMX is started, especially if bleeding risk is high.",
    "- Recheck INR early after initiation and again based on the first result and treatment duration.",
    "",
    "Monitoring priorities",
    "- Counsel on bleeding symptoms and verify the indication, target INR, and baseline stability.",
    "- Plan another INR reassessment after the antibiotic is stopped because warfarin requirements may rebound toward baseline.",
  ].join("\n");
}

function buildOmegaAnswer() {
  return [
    "Key Points",
    "- No guideline-endorsed cardioprotective omega-3 dose",
    "- Most outcome RCTs: high-dose 4 g/day EPA+DHA",
    "- PISCES (hemodialysis): 4 g/day lowered serious CV events (HR 0.57)",
    "- STRENGTH (high-risk, non-dialysis): 4 g/day neutral for MACE",
    "- Labelled use: 4 g/day for severe hypertriglyceridemia, CV benefit not established",
    "",
    "The best-studied dose for cardiovascular outcomes is 4 g/day of prescription-strength omega-3, but results are population- and trial-dependent.",
    "",
    "Clinical interpretation",
    "- Do not treat omega-3 dosing as a general cardioprotective substitute for guideline-directed therapy.",
    "- Separate triglyceride lowering from proven event reduction when counseling patients.",
    "- Consider formulation, EPA-only versus mixed EPA/DHA, baseline risk, dialysis status, and concurrent statin therapy before applying trial results.",
  ].join("\n");
}

function buildGlp1Answer() {
  return [
    "Key Points",
    "- **GLP-1 receptor agonists like dulaglutide (Trulicity)** are prescribed to improve glycemic control in adults with type 2 diabetes.",
    "- **Common side effects** include nausea, diarrhea, vomiting, and abdominal pain.",
    "- **Serious risks** include pancreatitis, severe gastrointestinal disease, and potential cardiovascular events requiring close monitoring.",
    "- **Management strategies** involve gradual dose escalation, hydration, small frequent meals, and regular consultation with healthcare providers.",
    "",
    "GLP-1 receptor agonists, such as dulaglutide (Trulicity), are used to improve glycemic control in adults with type 2 diabetes mellitus. However, they come with potential risks and side effects.",
    "",
    "Common Side Effects:",
    "- Gastrointestinal symptoms are the most frequent, especially nausea, diarrhea, vomiting, constipation, and abdominal discomfort.",
    "- Symptoms are often dose-related and may lessen after gradual titration.",
    "",
    "Serious Risks:",
    "- Pancreatitis symptoms such as persistent severe abdominal pain, sometimes radiating to the back, require urgent evaluation.",
    "- Hypersensitivity reactions can occur and may include rash, swelling, breathing difficulty, or injection-site reactions.",
    "- Patients with severe gastrointestinal disease, dehydration risk, kidney disease, or complex cardiovascular histories may need closer monitoring.",
    "",
    "Practical Management:",
    "- Start with the recommended titration schedule and avoid rapid escalation when gastrointestinal symptoms are limiting.",
    "- Encourage hydration, smaller meals, and follow-up when symptoms are persistent, severe, or worsening.",
    "- Review contraindications, concurrent diabetes medications, and patient-specific risks before continuing therapy.",
  ].join("\n");
}

function buildHypertensionGuidelineAnswer() {
  return [
    "Key Points",
    "- BP **134/84 mmHg** is **stage 1 hypertension** under the 2025 ACC/AHA guideline.",
    "- Start medication **now** if cardiovascular risk is high or if CVD, diabetes, CKD, or organ damage is present.",
    "- If risk is lower, use intensive lifestyle therapy and home BP monitoring for **3-6 months**.",
    "- If BP remains **>=130/80 mmHg** after lifestyle therapy, start or consider antihypertensive medication.",
    "",
    "For a patient with BP 134/84 mmHg, 2025 guidelines start drugs immediately if cardiovascular risk is high; otherwise after 3-6 months of unsuccessful lifestyle therapy while BP remains >=130/80.",
    "",
    "Classification and overall targets",
    "A BP of 134/84 mmHg is stage 1 Hypertension in the 2025 ACC/AHA guideline (130-139/80-89 mmHg).[1]",
    "The universal treatment goal for most adults is <130/80 mmHg, with encouragement toward <120/80 mmHg when tolerated.[2][3]",
    "",
    "When to start medication at 134/84 mmHg",
    "Immediate pharmacologic therapy (in addition to lifestyle) is recommended if any of the following are present, with BP >=130/80 mmHg:[2][1][3][4]",
    "- Established clinical CVD (e.g., prior MI, stroke, heart failure)",
    "- Diabetes mellitus",
    "- Chronic kidney disease or hypertension-mediated organ damage (e.g., albuminuria)",
    "- 10-year ASCVD risk >=7.5-10%, now estimated with the PREVENT calculator[2][1][3]",
    "",
    "In such patients, your 134/84 mmHg patient should start antihypertensive medication now.",
    "",
    "Lower-risk patients",
    "For lower-risk stage 1 patients with no CVD, diabetes, CKD, and 10-year risk <7.5-10%:",
    "- Implement intensive lifestyle measures (DASH diet, sodium restriction, weight loss, physical activity, no alcohol) and home BP monitoring for 3-6 months.[2][1][3]",
    "- If BP remains >=130/80 mmHg after 3-6 months, initiation of pharmacologic therapy is recommended or considered reasonable even in these lower-risk individuals.[2][1][4]",
    "",
    "So at 134/84 mmHg, drug therapy timing hinges on the patient's ASCVD risk profile and presence of CVD/DM/CKD.",
    "",
    "Would you like a succinct first-line drug selection and titration plan for a stage-1 patient at 134/84 mmHg?",
  ].join("\n");
}

function buildHantavirusExposureAnswer() {
  return [
    "Key Points",
    "- Zoonosis via rodent urine/droppings; Andes virus rare human–human",
    "- Incubation typically ~2–6 weeks",
    "- No vaccine or specific antiviral; supportive ICU care only",
    "- Monitor for early flu-like → rapidly progressive respiratory/cardiovascular compromise",
    "- Seek urgent care with febrile respiratory illness after high‑risk exposure/travel",
    "",
    "For a possible hantavirus exposure, management is mainly risk stratification, symptom vigilance over several weeks, and early evaluation for any febrile respiratory illness after exposure.",
    "",
    "Exposure risk and incubation",
    "",
    "Transmission source",
    "- Most hantaviruses are transmitted via inhalation of aerosolized rodent urine and droppings; human infection is overall rare.[1]",
    "- The Andes virus is the key exception with documented limited human-to-human spread during close, prolonged contact; main reservoir is long-tailed pygmy rice rats in Argentina/Chile.[1][2]",
    "- A systematic review concluded that, overall, comparative data do not robustly support human-to-human transmission, even for Andes virus, though rare events are possible.[3]",
    "",
    "Incubation window",
    "- For hantavirus cardiopulmonary syndrome (HCPS), incubation is long: 6-39 days (median ~18).[4]",
    "- For Andes virus, incubation may rarely extend up to ~42 days.[2]",
    "",
    "Post-exposure management steps",
    "",
    "1. Immediate actions",
    "- There is no approved vaccine or targeted antiviral; management is expectant with education on symptom surveillance.[1][4]",
    "- Reassure that, even after credible exposure, absolute risk of disease is low in most settings, especially outside endemic rodent habitats.[1]",
    "",
    "2. Symptom monitoring (up to 6 weeks; consider 7 weeks for Andes-virus-linked exposures)",
    "",
    "Advise patients to self-monitor daily for:",
    "- Early prodrome: fever, headache, myalgias, malaise, +/- GI symptoms.[1][2][4]",
    "- Progressive features of Hantavirus Cardiopulmonary Syndrome (HCPS): dyspnea, noncardiogenic pulmonary edema/ARDS, shock.[4][5]",
    "",
    "3. When to seek care",
    "- Same-day urgent evaluation for any febrile illness with respiratory symptoms (cough, dyspnea, chest tightness) in the monitoring window after high-risk rodent exposure or close contact with a confirmed Andes-virus HCPS case.[1][2][5]",
    "- Emergency care/ED transfer if rapidly progressive dyspnea, hypotension, or signs of shock develop, given the potential for abrupt progression to respiratory failure and hemodynamic collapse.[4][5]",
    "",
    "Evaluation and follow-up once symptomatic",
    "- Diagnosis is based on epidemiologic risk plus compatible syndrome; progression to severe respiratory compromise with noncardiogenic pulmonary edema and shock is characteristic of HCPS.[4][5]",
    "- Management is high-quality supportive care (ICU, advanced respiratory support as needed); no specific antiviral has proven benefit.[1][4]",
    "",
    "Public health and contact considerations",
    "- For Andes-virus clusters (e.g., cruise ship outbreak), authorities recommend rapid case identification, isolation, contact tracing, and active symptom monitoring of close contacts for several weeks, but not blanket quarantine of all low-risk contacts.[1][2]",
    "",
    "Would you like a concise checklist you can use to counsel patients and plan monitoring after suspected hantavirus exposure?",
  ].join("\n");
}

function buildResearchAnswer(question: string) {
  return [
    `Here is a prototype research summary for: ${question}`,
    "",
    "What to focus on",
    "- Identify whether the newest data changed outcomes that matter clinically: mortality, major morbidity, hospitalization, function, or quality of life.",
    "- Separate surrogate endpoint wins from evidence that should actually change practice.",
    "",
    "How to synthesize it",
    "- Start with patient population and inclusion criteria.",
    "- Note absolute benefit, major harms, and whether the intervention meaningfully shifts first-line care or only affects a narrow subgroup.",
    "",
    "Prototype takeaway",
    "- The most actionable summaries explain who the data applies to, what changed versus standard care, and what would still make a clinician hesitate.",
  ].join("\n");
}

function buildGenericAnswer(question: string) {
  return [
    `Here is a prototype clinical answer for: ${question}`,
    "",
    "Assessment",
    "- Confirm the core clinical problem, urgency, and the highest-risk diagnoses that must be addressed first.",
    "- Anchor the plan to the patient's comorbidities, current medications, and objective findings before recommending treatment changes.",
    "",
    "Initial approach",
    "- Clarify the decision point: diagnosis, medication adjustment, treatment comparison, or interpretation of new evidence.",
    "- Prioritize tests or actions that would materially change management in the next step.",
    "- Reassess for safety issues, contraindications, and specialist escalation triggers.",
    "",
    "Clinical cautions",
    "- This prototype is meant to demonstrate the streaming interaction rather than provide patient-specific medical advice.",
    "- Final management should still depend on the full clinical picture, local guidance, and professional judgment.",
  ].join("\n");
}

const LEADING_KEY_POINTS_PATTERN = /^\s*Key Points\s*\n/i;

function isHeadingLine(line: string) {
  return (
    /^[A-Z][A-Za-z0-9\s&/:-]+$/.test(line) &&
    line.length <= 40 &&
    !line.endsWith(".")
  );
}

function deriveKeyPoints(answer: string) {
  const lines = answer
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const listItems = lines
    .filter((line) => line.startsWith("- "))
    .map((line) => line.replace(/^- /, ""));
  const summaryLines = lines.filter(
    (line) => !line.startsWith("- ") && !isHeadingLine(line),
  );
  const candidates = [...listItems, ...summaryLines];
  const seen = new Set<string>();
  const keyPoints: string[] = [];

  for (const candidate of candidates) {
    if (seen.has(candidate)) {
      continue;
    }

    seen.add(candidate);
    keyPoints.push(candidate);

    if (keyPoints.length === 4) {
      break;
    }
  }

  return keyPoints.length > 0
    ? keyPoints
    : ["Review the answer details below for the full clinical context."];
}

function ensureLeadingKeyPoints(answer: string) {
  if (LEADING_KEY_POINTS_PATTERN.test(answer)) {
    return answer;
  }

  return [
    "Key Points",
    ...deriveKeyPoints(answer).map((keyPoint) => `- ${keyPoint}`),
    "",
    answer,
  ].join("\n");
}

export function buildMockAnswer(question: string) {
  const normalized = question.toLowerCase();
  let answer: string;

  if (
    normalized.includes("osteoporosis") ||
    normalized.includes("vitamin d") ||
    normalized.includes("calcium")
  ) {
    answer = osteoporosisAnswer;
  } else if (normalized.includes("vancomycin")) {
    answer = buildVancomycinAnswer();
  } else if (normalized.includes("phenytoin")) {
    answer = buildPhenytoinAnswer();
  } else if (
    normalized.includes("warfarin") ||
    normalized.includes("trimethoprim") ||
    normalized.includes("sulfamethoxazole")
  ) {
    answer = buildWarfarinAnswer();
  } else if (normalized.includes("omega-3") || normalized.includes("omega 3")) {
    answer = buildOmegaAnswer();
  } else if (
    normalized.includes("glp-1") ||
    normalized.includes("glp1") ||
    normalized.includes("dulaglutide") ||
    normalized.includes("trulicity")
  ) {
    answer = buildGlp1Answer();
  } else if (
    normalized.includes("hypertension") ||
    normalized.includes("bp 134/84") ||
    normalized.includes("134/84")
  ) {
    answer = buildHypertensionGuidelineAnswer();
  } else if (
    normalized.includes("hantavirus") ||
    normalized.includes("hcps") ||
    normalized.includes("andes virus")
  ) {
    answer = buildHantavirusExposureAnswer();
  } else if (
    normalized.includes("research") ||
    normalized.includes("evidence") ||
    normalized.includes("trial") ||
    normalized.includes("study")
  ) {
    answer = buildResearchAnswer(question);
  } else {
    answer = buildGenericAnswer(question);
  }

  return ensureLeadingKeyPoints(answer);
}

export function buildMockAnswerSupportingContent(
  question: string,
): AiAnswerSupportingContent {
  const normalized = question.toLowerCase();

  if (normalized.includes("vancomycin")) {
    return {
      followUpQuestions: [
        "Check vancomycin drug interactions",
        "Monitor for nephrotoxicity symptoms",
        "Review hemodialysis dosing literature",
        "Confirm post-dialysis trough timing",
      ],
      references: buildReferenceList([
        {
          detail: "Adult dosing and renal impairment guidance for vancomycin.",
          publishedAt: "November 18, 2025",
          source: "Drugs",
          sourceLabel: "Medscape",
          tags: ["Drug Reference"],
          title: "Vancomycin (Vancocin) - Adult Dosing & Uses.",
          url: "http://reference.medscape.com/drug/firvanq-vancocin-vancomycin-342573#0",
        },
        {
          detail: "Administration guidance, including infusion rate considerations.",
          publishedAt: "November 18, 2025",
          source: "Drugs",
          sourceLabel: "Medscape",
          tags: ["Drug Reference"],
          title: "Vancomycin (Vancocin) - Administration.",
          url: "http://reference.medscape.com/drug/firvanq-vancocin-vancomycin-342573#11",
        },
      ]),
    };
  }

  if (
    normalized.includes("glp-1") ||
    normalized.includes("glp1") ||
    normalized.includes("dulaglutide") ||
    normalized.includes("trulicity")
  ) {
    return {
      followUpQuestions: [
        "Screen for serious warnings",
        "Reduce GI side effects",
        "Stratify GLP-1 risk",
        "Plan renal monitoring",
        "Draft injection counseling",
      ],
      references: buildReferenceList([
        {
          detail: "Living standards update.",
          publishedAt: "Jan 01, 2026",
          source: "Diabetes Care",
          sourceLabel: "ADA",
          tags: ["Guideline"],
          title: "American Diabetes Association. Standards of Care in Diabetes.",
        },
        {
          detail: "Prescribing information.",
          publishedAt: "Sep 01, 2025",
          source: "Eli Lilly and Company",
          sourceLabel: "Trulicity",
          tags: ["Label"],
          title: "Trulicity (dulaglutide) prescribing information.",
        },
        {
          detail: "Clinical practice guidance for pharmacologic management of type 2 diabetes.",
          publishedAt: "May 10, 2024",
          source: "AACE",
          sourceLabel: "AACE",
          tags: ["Guideline"],
          title: "AACE clinical practice guidance for pharmacologic management of type 2 diabetes.",
        },
      ]),
    };
  }

  if (
    normalized.includes("hypertension") ||
    normalized.includes("bp 134/84") ||
    normalized.includes("134/84")
  ) {
    return {
      followUpQuestions: [
        "Treat stage 1 HTN with diabetes?",
        "Choose first-line stage 1 HTN drug",
        "Order labs for new hypertension",
        "Confirm hypertension with home BP",
      ],
      references: buildReferenceList([
        {
          detail: "Commentary overview for primary care clinicians on the 2025 blood pressure guideline.",
          publishedAt: "January 07, 2026",
          source: "Commentary",
          sourceLabel: "Medscape",
          tags: ["Guideline", "Commentary"],
          title: "What PCPs Need to Know About the New Blood Pressure Guidelines.",
          url: "https://www.medscape.com/viewarticle/what-pcps-need-know-about-new-blood-pressure-guidelines-2025a1000t8x",
        },
        {
          detail: "News coverage of medication-initiation recommendations in the new ACC/AHA guideline.",
          publishedAt: "August 19, 2025",
          source: "News & Perspectives",
          sourceLabel: "Medscape",
          tags: ["Guideline", "News"],
          title: "BP Meds Should Begin Promptly, New ACC/AHA Guidelines Say.",
          url: "https://www.medscape.com/viewarticle/bp-meds-should-begin-promptly-new-acc-aha-guidelines-say-2025a1000lms",
        },
        {
          detail:
            "Guideline comparison from American, European, UK, and global hypertension guidance.",
          publishedAt: "June 05, 2025",
          source:
            "Guidelines - Guidelines Summary - American Heart Association,American College of Cardiology,European Society of Cardiology,European Society of Hypertension,International Society of Hypertension,National Institute for Health and Care Excellence,World Health Organization,Dr Shouvik Haldar",
          sourceLabel: "Medscape",
          tags: ["Guideline"],
          title: "Hypertension: Comparison of Global Guidance for Cardiologists.",
          url: "https://reference.medscape.com/cc2/p10/guideline-essentials-hypertension-comparison-uk-european-us-2024a1000k63",
        },
        {
          detail: "Kanbay Mehmet, Copur Sidar, Sarafidis Pantelis, Ferro Charles J et al.",
          doi: "10.1093/ndt/gfag055",
          publishedAt: "2026/03/10",
          source:
            "doi: 10.1093/ndt/gfag055. Kanbay Mehmet, Copur Sidar, Sarafidis Pantelis, Ferro Charles J et al.",
          sourceLabel:
            "Nephrology, dialysis, transplantation : official publication of the European Dialysis and Transplant Association - European Renal Association.",
          tags: ["Guideline", "Commentary"],
          title:
            "2025\u00a0AHA/ACC/AANP/AAPA/ABC/ACCP/ACPM/AGS/AMA/ASPC/NMA/PCNA/SGIM Guideline...",
          url: "https://pubmed.ncbi.nlm.nih.gov/41805831/",
        },
      ]),
    };
  }

  if (
    normalized.includes("hantavirus") ||
    normalized.includes("hcps") ||
    normalized.includes("andes virus")
  ) {
    return {
      followUpQuestions: [
        "When should hantavirus be suspected?",
        "How long should hantavirus symptoms be monitored?",
        "When is Andes virus contagious?",
        "When should suspected HCPS be hospitalized?",
      ],
      references: buildReferenceList([
        {
          detail: "News & Perspectives.",
          publishedAt: "May 08, 2026",
          source: "News & Perspectives",
          sourceLabel: "Medscape",
          tags: ["News"],
          title: "Hung Up on Hantavirus? How to Answer If Patients Are Asking.",
          url: "https://www.medscape.com/viewarticle/hung-hantavirus-how-answer-if-patients-are-asking-2026a1000eut",
        },
        {
          detail: "News & Perspectives.",
          publishedAt: "May 11, 2026",
          source: "News & Perspectives",
          sourceLabel: "Medscape",
          tags: ["News"],
          title: "Cruise Ship Outbreak Raises Andes Virus Spread Concerns.",
          url: "https://www.medscape.com/viewarticle/cruise-ship-outbreak-raises-andes-virus-spread-concerns-2026a1000f0e",
        },
        {
          detail: "Systematic review.",
          publishedAt: "2021/09/14",
          source: "PubMed",
          sourceLabel: "PubMed",
          tags: ["Systematic Review"],
          title: "Evidence for Human-to-Human Transmission of Hantavirus: A Systematic Review.",
          url: "https://pubmed.ncbi.nlm.nih.gov/34515290/",
        },
        {
          detail: "Riquelme Raul.",
          doi: "10.1055/s-0041-1733803",
          publishedAt: "2021/12/01",
          source: "Seminars in respiratory and critical care medicine",
          sourceLabel: "Seminars in respiratory and critical care medicine",
          tags: ["Review"],
          title: "Hantavirus.",
          url: "https://pubmed.ncbi.nlm.nih.gov/34918323/",
        },
        {
          detail: "Hall Ashton D, Fayad Danielle, Staat Mary A.",
          doi: "10.1097/INF.0000000000004284",
          publishedAt: "2024/06/01",
          source: "The Pediatric infectious disease journal",
          sourceLabel: "The Pediatric infectious disease journal",
          tags: ["Case Report"],
          title: "Hantavirus Pulmonary Syndrome in an Adolescent from North Dakota.",
          url: "https://pubmed.ncbi.nlm.nih.gov/38451883/",
        },
      ]),
    };
  }

  if (normalized.includes("omega-3") || normalized.includes("omega 3")) {
    return {
      followUpQuestions: [
        "Match the right CV population",
        "Compare EPA and EPA/DHA",
        "Separate TG and CV goals",
        "Plan high-dose monitoring",
      ],
      references: buildReferenceList([
        {
          detail: "Nicholls SJ, Lincoff AM, Garcia M, et al.",
          publishedAt: "Nov 15, 2020",
          source: "JAMA",
          sourceLabel: "JAMA",
          tags: ["RCT"],
          title: "STRENGTH trial.",
        },
        {
          detail: "Kalstad AA, Myhre PL, Laake K, et al.",
          publishedAt: "Jun 29, 2021",
          source: "Circulation",
          sourceLabel: "Circulation",
          tags: ["RCT"],
          title: "OMEMI trial.",
        },
        {
          detail: "Dialysis population summary included for prototype illustration.",
          publishedAt: "Apr 16, 2026",
          source: "Prototype Trial Summary",
          sourceLabel: "Prototype",
          tags: ["Demo Only"],
          title: "Clinical trial summary referenced in this prototype answer for dialysis populations.",
        },
      ]),
    };
  }

  if (
    normalized.includes("research") ||
    normalized.includes("evidence") ||
    normalized.includes("trial") ||
    normalized.includes("study")
  ) {
    return {
      followUpQuestions: [
        "Extract practice-changing outcomes",
        "Frame benefit and harm",
        "Check patient applicability",
        "Reassess first-line management",
      ],
      references: buildReferenceList([
        {
          detail: "Demonstration literature summary for prototype behavior.",
          publishedAt: "Apr 16, 2026",
          source: "Prototype Research Summary",
          sourceLabel: "Prototype",
          tags: ["Demo Only"],
          title: "Summary of recent trial literature relevant to the question.",
        },
        {
          detail: "Supporting guideline and review sources should be linked in production.",
          publishedAt: "Apr 16, 2026",
          source: "Prototype Evidence Note",
          sourceLabel: "Prototype",
          tags: ["Demo Only"],
          title: "Supporting guideline and review sources to add in production.",
        },
      ]),
    };
  }

  return buildGenericSupportingContent(question);
}
