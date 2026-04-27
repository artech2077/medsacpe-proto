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
    "- **Loading dose decisions** should be separated from post-dialysis maintenance dosing.",
    "- **A common starting range** for serious infection is 20-25 mg/kg actual body weight.",
    "- **Maintenance dosing** is typically given after hemodialysis and adjusted using serum levels.",
    "- **Monitoring priorities** include pre-dialysis levels, dialysis schedule changes, residual kidney function, and clinical response.",
    "",
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
        "Apply changing dialysis schedule",
        "Adjust post-HD dosing",
        "Account for residual kidney function",
        "Translate AUC targets clinically",
      ],
      references: buildReferenceList([
        {
          detail: "Rybak MJ, Le J, Lodise TP, et al.",
          doi: "doi: 10.1093/ajhp/zxaa036.",
          publishedAt: "Mar 19, 2020",
          source: "American Journal of Health-System Pharmacy",
          sourceLabel: "AJHP",
          tags: ["Guideline"],
          title:
            "Therapeutic monitoring of vancomycin for serious methicillin-resistant Staphylococcus aureus infections: a revised consensus guideline.",
        },
        {
          detail: "Pai AB, Pai MP.",
          publishedAt: "Jul 01, 2004",
          source: "Seminars in Dialysis",
          sourceLabel: "Seminars in Dialysis",
          tags: ["Review"],
          title: "Vancomycin dosing considerations in high-flux hemodialysis.",
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
