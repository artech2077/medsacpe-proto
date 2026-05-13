import type { AiAnswerReference } from "@/data/ai-response";

export const paidAdsHantavirusInitialQuestion =
  "How to manage possible hantavirus exposure?";

export const paidAdsHantavirusSummary =
  "Immediate management of possible hantavirus exposure is risk assessment, symptom monitoring, and urgent evaluation if compatible symptoms develop.";

export const paidAdsHantavirusShortAnswer = [
  "Key Points",
  "- Zoonosis via rodent urine/droppings; Andes virus rare human-human",
  "- Incubation typically ~2-6 weeks",
  "- No vaccine or specific antiviral; supportive ICU care only",
  "- Monitor for early flu-like symptoms that can rapidly progress",
  "- Seek urgent care for febrile respiratory illness after high-risk exposure",
  "",
  "For a possible hantavirus exposure, management is primarily risk assessment, education, and symptom monitoring. Most infections follow inhalation of aerosolized rodent urine or droppings; Andes virus is the notable exception with rare person-to-person spread after close, prolonged contact.",
  "",
  "Clarify the exposure: direct contact with rodents or nests, sweeping or cleaning enclosed contaminated spaces, travel or residence in an endemic area, or close contact with a confirmed Andes-virus case. If exposure was minimal or uncertain, reassure the patient while still giving clear return precautions.",
  "",
  "Monitor for symptoms for about 6 weeks after exposure, with a slightly longer window reasonable for Andes-virus-linked exposures. Early illness is nonspecific, including fever, headache, myalgias, malaise, and sometimes gastrointestinal symptoms.",
  "",
  "The key safety message is escalation. Same-day evaluation is warranted for fever plus cough, dyspnea, chest tightness, or worsening systemic symptoms during the monitoring window. Emergency evaluation is needed for rapidly progressive dyspnea, hypotension, or shock because hantavirus cardiopulmonary syndrome can deteriorate abruptly.",
  "",
  "There is no approved post-exposure prophylaxis, vaccine, or proven targeted antiviral treatment. Once symptomatic disease is suspected, management is supportive and often ICU-level, with respiratory and hemodynamic support as needed.",
].join("\n");

export const paidAdsHantavirusKeyPoints = [
  "Zoonosis via rodent urine/droppings; Andes virus rare human–human",
  "Incubation typically ~2–6 weeks",
  "No vaccine or specific antiviral; supportive ICU care only",
  "Monitor for early flu-like → rapidly progressive respiratory/cardiovascular compromise",
  "Seek urgent care with febrile respiratory illness after high‑risk exposure/travel",
];

export const paidAdsHantavirusFollowUpQuestions = [
  "When should hantavirus be suspected?",
  "How long should hantavirus symptoms be monitored?",
  "When is Andes virus contagious?",
  "When should suspected HCPS be hospitalized?",
];

export const paidAdsHantavirusFollowUpQuestionRedirectUrls = {
  "When should hantavirus be suspected?":
    "https://www.medscape.com/ai-search?query=When%20should%20hantavirus%20be%20suspected%3F",
  "How long should hantavirus symptoms be monitored?":
    "https://www.medscape.com/ai-search?query=How%20long%20should%20hantavirus%20symptoms%20be%20monitored%3F",
  "When is Andes virus contagious?":
    "https://www.medscape.com/ai-search?query=When%20is%20Andes%20virus%20contagious%3F",
  "When should suspected HCPS be hospitalized?":
    "https://www.medscape.com/ai-search?query=When%20should%20suspected%20HCPS%20be%20hospitalized%3F",
};

export const paidAdsHantavirusFollowUpAnswerPreviews = {
  "When should hantavirus be suspected?":
    "Hantavirus infection should be suspected when a compatible exposure history (rodents, endemic travel, or contact with a case) coincides with a characteristic febrile illness that rapidly evolves into severe pulmonary or renal failure.",
  "How long should hantavirus symptoms be monitored?":
    'antavirus infections should be clinically "on the radar" for roughly 6 weeks after a plausible exposure, with very low threshold for urgent review if systemic or respiratory symptoms evolve.',
  "When is Andes virus contagious?":
    "In practice, Andes virus appears most contagious during the acute symptomatic phase, especially in patients with high viral loads.",
  "When should suspected HCPS be hospitalized?":
    "In patient with suspected Hantavirus Cardiopulmonary Syndrome (HCPS) should be hospitalised early, typically to at least a monitored setting, given the risk of abrupt progression to respiratory failure and shock.",
};

export const paidAdsHantavirusFluComparisonInitialQuestion =
  "How do early hantavirus symptoms compare with severe influenza?";

export const paidAdsHantavirusFluComparisonAnswer = [
  "Key Points",
  "- Hantavirus prodrome: 3-7 d nonspecific F, GI, myalgia before shock/ARDS",
  "- Flu: abrupt FLI (fever, cough, myalgia, URT) during community activity",
  "- Early overlap: fever, headache, myalgia, cough, malaise, N/V/D",
  "- Hantavirus: rapid progression to hypotension, noncardiogenic pulmonary edema, HCPS; high mortality",
  "- Severe flu: pneumonia, ARDS, multiorgan complications; lower mortality but major ICU burden",
  "",
  "Both early stages, Hantavirus Cardiopulmonary Syndrome (HCPS) and severe influenza can look similar (febrile, flu-like illness), but the pattern and trajectory differ.",
  "",
  "Early clinical picture: overlap",
  "",
  "Hantavirus (HCPS and HFRS spectrum)",
  "- Prodrome typically lasts up to about a week with nonspecific symptoms: fever, chills, fatigue, headache, myalgias, nausea, vomiting, and diarrhea.[1][2]",
  "- Respiratory symptoms (cough, chest tightness, dyspnea) may start in the prodrome but herald transition to cardiopulmonary involvement and impending respiratory failure/shock.[1][3]",
  "- Incubation is prolonged (6-39 days, median ~18), so onset is remote from exposure.[2]",
  "",
  "Seasonal influenza (including severe cases)",
  "- Uncomplicated flu is defined by abrupt onset of fever, chills, malaise, fatigue, headache, myalgia/arthralgia, and nonproductive cough, with sore throat, nasal congestion, and rhinorrhea.[4]",
  "- Gastrointestinal symptoms (abdominal pain, diarrhea, vomiting) occur, especially in children, but are not as defining as respiratory symptoms.[4]",
  "",
  "Progression to severe disease",
  "",
  "Hantavirus (HCPS)",
  "- After the prodrome, patients can rapidly progress to hypotension, noncardiogenic pulmonary edema, and ARDS due to capillary leak and endothelial injury, with high mortality (e.g., Andes virus up to ~45%).[1][5][2]",
  "",
  "Severe influenza",
  "- Severe/complicated flu presents with pneumonia, respiratory failure, shock, or exacerbations of underlying cardiopulmonary disease, and may cause myocarditis, encephalitis, rhabdomyolysis, and shock.[4]",
  "- Respiratory involvement is usually present from early illness (acute respiratory symptoms with or without fever), then worsens.[4]",
  "",
  "Key practical distinctions",
  "",
  "- Tempo: influenza has abrupt onset of FLI; hantavirus has a several-day prodrome before sudden decompensation.[1][4]",
  "- Trajectory: hantavirus more characteristically shows precipitous transition from nonspecific febrile illness to shock and noncardiogenic pulmonary edema; severe flu more often evolves from prominent respiratory illness and/or known community flu activity.[1][4][2]",
].join("\n");

export const paidAdsHantavirusFluComparisonCompactAnswer = [
  "Key Points",
  "- Hantavirus prodrome: 3-7 d nonspecific F, GI, myalgia before shock/ARDS",
  "- Flu: abrupt FLI (fever, cough, myalgia, URT) during community activity",
  "- Early overlap: fever, headache, myalgia, cough, malaise, N/V/D",
  "- Hantavirus: rapid progression to hypotension, noncardiogenic pulmonary edema, HCPS; high mortality",
  "- Severe flu: pneumonia, ARDS, multiorgan complications; lower mortality but major ICU burden",
  "",
  "Both early HCPS and severe influenza can present as febrile, flu-like illness. The useful distinction is less the first symptom and more the onset pattern, exposure context, and trajectory.",
  "",
  "Early clinical picture",
  "- Hantavirus usually has a several-day prodrome with fever, chills, fatigue, headache, myalgias, and gastrointestinal symptoms before cardiopulmonary decompensation.[1][2]",
  "- Influenza more often begins abruptly with fever, cough, myalgias, malaise, sore throat, congestion, and rhinorrhea during community flu activity.[4]",
  "- Early overlap includes fever, headache, myalgia, cough, malaise, nausea, vomiting, and diarrhea.",
  "",
  "Progression",
  "- Hantavirus can rapidly transition to hypotension, noncardiogenic pulmonary edema, ARDS, and HCPS after the prodrome.[1][2][5]",
  "- Severe influenza can cause pneumonia, ARDS, shock, myocarditis, encephalitis, rhabdomyolysis, and multiorgan complications, usually with respiratory symptoms present early.[4]",
  "",
  "Practical distinction: influenza is typically abrupt and respiratory-predominant from the start; hantavirus is more concerning when a nonspecific prodrome after a plausible exposure suddenly progresses to dyspnea, hypotension, or pulmonary edema.[1][4]",
].join("\n");

export const paidAdsHantavirusFluComparisonKeyPoints = [
  "Hantavirus prodrome: 3-7 d nonspecific F, GI, myalgia before shock/ARDS",
  "Flu: abrupt FLI (fever, cough, myalgia, URT) during community activity",
  "Early overlap: fever, headache, myalgia, cough, malaise, N/V/D",
  "Hantavirus: rapid progression to hypotension, noncardiogenic pulmonary edema, HCPS; high mortality",
  "Severe flu: pneumonia, ARDS, multiorgan complications; lower mortality but major ICU burden",
];

export const paidAdsHantavirusFluComparisonFollowUpQuestions = [
  "When should I test for hantavirus?",
  "When should I test for influenza?",
  "Which symptoms suggest severe HCPS?",
  "How long after exposure can hantavirus appear?",
];

export const paidAdsHantavirusFluComparisonFollowUpQuestionRedirectUrls = {
  "When should I test for hantavirus?":
    "https://www.medscape.com/ai-search?query=When%20should%20I%20test%20for%20hantavirus%3F",
  "When should I test for influenza?":
    "https://www.medscape.com/ai-search?query=When%20should%20I%20test%20for%20influenza%3F",
  "Which symptoms suggest severe HCPS?":
    "https://www.medscape.com/ai-search?query=Which%20symptoms%20suggest%20severe%20HCPS%3F",
  "How long after exposure can hantavirus appear?":
    "https://www.medscape.com/ai-search?query=How%20long%20after%20exposure%20can%20hantavirus%20appear%3F",
};

export const paidAdsHantavirusFluComparisonFollowUpAnswerPreviews = {
  "When should I test for hantavirus?":
    "In practice, test for hantavirus when a compatible clinical syndrome aligns with rodent/Andes-virus exposure or close contact with a confirmed case.",
  "When should I test for influenza?":
    "Testing is generally indicated whenever you clinically suspect Influenza, with specific timing and strategy driven by severity and risk.",
  "Which symptoms suggest severe HCPS?":
    "In severe Hantavirus Cardiopulmonary Syndrome (HCPS), clinical severity is driven by capillary leak with rapid development of noncardiogenic pulmonary edema, acute respiratory distress syndrome (ARDS), respiratory failure, and shock.",
  "How long after exposure can hantavirus appear?":
    "After exposure, hantavirus symptoms usually appear about 2-6 weeks later.",
};

export const paidAdsHantavirusFluComparisonReferences: AiAnswerReference[] = [
  {
    detail: "News & Perspectives.",
    id: 1,
    publishedAt: "May 08, 2026",
    source: "News & Perspectives",
    sourceLabel: "Medscape",
    tags: ["News"],
    title: "Hung Up on Hantavirus? How to Answer If Patients Are Asking.",
    url: "https://www.medscape.com/viewarticle/hung-hantavirus-how-answer-if-patients-are-asking-2026a1000eut",
  },
  {
    detail: "Review.",
    id: 2,
    publishedAt: "2021/12/01",
    source: "Seminars in respiratory and critical care medicine",
    sourceLabel: "PubMed",
    tags: ["Review"],
    title: "Hantavirus.",
    url: "https://pubmed.ncbi.nlm.nih.gov/34918323/",
  },
  {
    detail: "Case report.",
    id: 3,
    publishedAt: "2024/06/01",
    source: "The Pediatric infectious disease journal",
    sourceLabel: "PubMed",
    tags: ["Case Report"],
    title: "Hantavirus Pulmonary Syndrome in an Adolescent from North Dakota.",
    url: "https://pubmed.ncbi.nlm.nih.gov/38451883/",
  },
  {
    detail: "Clinical guidance.",
    id: 4,
    publishedAt: "2026",
    source: "Reference",
    sourceLabel: "Medscape",
    tags: ["Clinical Reference"],
    title: "Diagnosis and Management of Seasonal Flu.",
    url: "https://reference.medscape.com/cc2/p10/diagnosis-and-management-seasonal-flu-2026a10009qp",
  },
  {
    detail: "News & Perspectives.",
    id: 5,
    publishedAt: "May 11, 2026",
    source: "News & Perspectives",
    sourceLabel: "Medscape",
    tags: ["News"],
    title: "Cruise Ship Outbreak Raises Andes Virus Spread Concerns.",
    url: "https://www.medscape.com/viewarticle/cruise-ship-outbreak-raises-andes-virus-spread-concerns-2026a1000f0e",
  },
];
