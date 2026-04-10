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
    like: "/assets/like.svg",
    likeFilled: "/assets/like filled.svg",
    newChat: "/assets/new-chat.svg",
    pencil: "/assets/pencil.svg",
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
    "For a 70 kg patient on intermittent hemodialysis, start by separating the loading dose decision from the post-dialysis maintenance strategy.",
    "",
    "Initial dosing approach",
    "- Loading dose: 20-25 mg/kg actual body weight is a common starting range for serious infection.",
    "- For 70 kg, that typically lands around 1.5 g as an initial dose, with severity of illness and residual renal function guiding the final choice.",
    "",
    "Maintenance after dialysis",
    "- Redose after hemodialysis rather than on a fixed every-12-hour or every-24-hour interval.",
    "- A common prototype approach is 500-750 mg after each dialysis session, then individualize using serum levels and infection severity.",
    "",
    "Monitoring",
    "- Check a pre-dialysis level before the next session and trend toward the program's target, often aligned with AUC-based monitoring where available.",
    "- Reassess after schedule changes, missed dialysis, changes in residual kidney function, or signs of inadequate response.",
    "",
    "Clinical cautions",
    "- Larger post-dialysis doses may be needed for deep-seated infection, obesity, or incomplete clinical response.",
    "- Coordination with nephrology and pharmacy is important because dialysis modality and filter characteristics materially change drug clearance.",
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

export function buildMockAnswer(question: string) {
  const normalized = question.toLowerCase();

  if (
    normalized.includes("osteoporosis") ||
    normalized.includes("vitamin d") ||
    normalized.includes("calcium")
  ) {
    return osteoporosisAnswer;
  }

  if (normalized.includes("vancomycin")) {
    return buildVancomycinAnswer();
  }

  if (normalized.includes("phenytoin")) {
    return buildPhenytoinAnswer();
  }

  if (
    normalized.includes("warfarin") ||
    normalized.includes("trimethoprim") ||
    normalized.includes("sulfamethoxazole")
  ) {
    return buildWarfarinAnswer();
  }

  if (
    normalized.includes("research") ||
    normalized.includes("evidence") ||
    normalized.includes("trial") ||
    normalized.includes("study")
  ) {
    return buildResearchAnswer(question);
  }

  return buildGenericAnswer(question);
}
