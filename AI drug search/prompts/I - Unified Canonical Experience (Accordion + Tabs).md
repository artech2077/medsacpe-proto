# Build Prompt — Concept I: Unified Canonical Experience (Accordion + Tabs)

> Prereq: `00 - Shared Prototype Shell & Tab Bar.md` must already be built (shell, concept tab bar,
> registry). This prompt adds a **ninth concept route** and describes only what is different for
> Concept I. Discovery source of truth: `AI drug search/03_Discovery_Research/Drug Question Use
> Case Taxonomy.md` in the PM workspace — its content (solution patterns, scenarios, decisions,
> canonical facts) is embedded below so this prompt is self-contained.

## 0. Mandatory first step

Invoke the **`medscape-component-reuse`** skill and inventory the library before coding. Produce a
reuse map. Reuse exactly; new components only for genuinely new functionality; register them.
Concepts C and E are the direct parents of this concept — reuse their components
(`DrugMonographAccordion`, `DrugAnswerTabs`) rather than rebuilding.

## 1. Goal

Concept I is the **leading candidate** that merges Concept C (progressive accordion) and Concept E
(message-level tabs): every assistant reply carries **Answer · Drug Information · References**
tabs, and the Drug Information tab renders the canonical monograph as a **two-level accordion**
(section → subfield → verbatim body) with black-box warnings pinned eagerly.

What is new versus C/E: Concept I must demonstrate the UX for **all drug-question use cases**, not
just single-drug lookup. The prototype is driven by a **grouped scenario picker** — a reviewer
selects a preset question and sees the scripted response pattern play out in the chat thread.
There is no real AI; every scenario is scripted, deterministic, and reads canonical facts from the
data layer.

## 2. Solution patterns to demonstrate (decided 2026-06-11)

| Code | Pattern | UX in Concept I |
| --- | --- | --- |
| S1 | Canonical card + AI tab | Reply opens on Drug Information (accordion, relevant section expanded); Answer tab holds a short complementary AI answer. |
| S2 | Canonical slice (deep link) | Same card, but auto-expanded two levels deep to the exact subfield (e.g. missed dose, pediatric); an "instant answer" line sits above the card for single facts. |
| S3 | Clarifying question first | Plan-mode style: assistant replies with an inline option card (e.g. Ozempic · Wegovy · Rybelsus); user picks; then S1 renders for the chosen variant. |
| S4 | Dual canonical view | Two (max three) monograph cards as side-by-side columns on desktop / swipeable stack on mobile, each opened to the same section; optional one-line AI synthesis above. |
| S5 | Composed canonical + AI synthesis | Answer tab leads with the synthesized answer; each claim carries a citation chip that deep-links into one of up to **3** monograph accordions stacked below. More than 3 drugs → fall back to S6. |
| S6 | AI answer + canonical source card | Answer tab is primary (clearly labeled AI-generated, off-label/outside-monograph badge where relevant); collapsed monograph card(s) below as supporting reference. |
| S7 | Condition article → drug handoff | Condition article card (Treatment/Medication sections) with drug pills; tapping a pill opens that drug's monograph card in the thread. |
| S8 | Deterministic tool | Interaction-checker or dose-calculator card rendered like canonical content (deterministic, not generated), with the source monograph slice anchored beneath. |
| S9 | Persistent drug context | The monograph card and its tab structure **persist across follow-ups**: same drug + new intent updates the card in place (animate to new section); new drug adds a second card and offers a "Compare" chip. |

## 3. Scenario picker — grouping and scripts

New component `DrugScenarioPicker`: a collapsible panel rendered between the concept tab bar and
the chat thread. It lists the scenario **groups** below as expandable rows (or chips on mobile);
each group contains its preset questions. Selecting a question clears/extends the thread and plays
the scripted exchange. The composer stays visible but scenarios drive the demo. Persist the active
scenario in the URL query (`?scenario=s3-semaglutide-dose`) so reviewers can deep-link.

Script every scenario below. Question text is clinician-voiced — keep verbatim.

### Group 1 — Single drug, direct answer (S1)
| id | Question | Script |
| --- | --- | --- |
| s1-dosing | What is the dosing for semaglutide (Ozempic)? | Card opens Drug Information → Dosing expanded; Answer tab has ≤3-sentence AI summary. |
| s1-adverse | What are the adverse effects of tirzepatide? | Card opens Adverse Effects, frequency-ranked; BBW pinned above. |

### Group 2 — Pinpoint slice (S2)
| id | Question | Script |
| --- | --- | --- |
| s2-missed | My patient missed their semaglutide injection by 3 days — how should they resume? | Instant answer line ("≤5 days: administer as soon as possible") + card auto-expanded to Administration → Missed dose. |
| s2-peds | Can I start liraglutide in a 14-year-old with obesity? | Card auto-expanded to Dosing → Pediatric. |
| s2-washout | How long before a planned pregnancy should semaglutide be discontinued? | Instant answer ("discontinue ≥2 months before planned pregnancy") + Pregnancy slice. |

### Group 3 — Needs clarification (S3)
| id | Question | Script |
| --- | --- | --- |
| s3-dose | What's the semaglutide dose? | Inline clarifying card: "Semaglutide has three products with different dosing — which one?" Options: Ozempic (T2DM SC) · Wegovy (weight mgmt) · Rybelsus (oral). Picking one renders the S1 dosing card for that product. |

### Group 4 — Comparison, ≤3 drugs (S4)
| id | Question | Script |
| --- | --- | --- |
| s4-dosing | How does semaglutide dosing compare with tirzepatide? | Two cards side by side, both opened to Dosing; one-line synthesis above ("both once-weekly SC with stepwise escalation; schedules differ"). |
| s4-moa | How does liraglutide's mechanism differ from tirzepatide's? | Two cards opened to Pharmacology → MOA. |

### Group 5 — Composed + AI synthesis (S5)
| id | Question | Script |
| --- | --- | --- |
| s5-switch | How do I transition a patient from liraglutide to semaglutide? | Answer tab leads (synthesized steps, "not covered by either monograph" note); citation chips deep-link into both Dosing accordions stacked below. |
| s5-bbw | Which GLP-1 agonists carry the thyroid C-cell black box warning? | Synthesized list (liraglutide, semaglutide, tirzepatide) with chips into each drug's Black Box slice — exactly 3 monographs, the cap. |

### Group 6 — Beyond the monograph (S6)
| id | Question | Script |
| --- | --- | --- |
| s6-periop | Should I hold my patient's GLP-1 before elective surgery? | AI answer labeled "AI-generated — guideline-based"; monograph aspiration caution anchored as collapsed card; note that the monograph states data are insufficient for hold recommendations. |
| s6-offlabel | Can semaglutide be used off-label in type 1 diabetes? | AI answer with off-label badge; monograph indications card collapsed below. |

### Group 7 — Condition-first (S7)
| id | Question | Script |
| --- | --- | --- |
| s7-t2dm | What are the treatment options for type 2 diabetes? | Condition article card (Treatment / Medication sections summarized) with drug pills (semaglutide, tirzepatide, liraglutide, insulin); tapping a pill inserts that monograph card. |

### Group 8 — Deterministic tools (S8)
| id | Question | Script |
| --- | --- | --- |
| s8-ddi | Can I add semaglutide for a patient already on insulin regular human? | Interaction-checker result card (severity: Monitor Closely — hypoglycemia risk; consider insulin dose reduction) + both Interactions slices anchored. |
| s8-u500 | My patient takes 300 units/day of Humulin R U-100 — how do I convert to U-500? | Calculator card (same total units, U-500 = 5× concentration → volume ÷5; emphasize U-500 syringe to avoid dosing errors) + monograph U-500 error-risk slice anchored. |

### Group 9 — Follow-up conversation (S9)
One scripted multi-turn sequence, played stepwise (each click advances one turn):
1. "What is the dosing for semaglutide (Ozempic)?" → S1 card.
2. "and in pregnancy?" → **same card updates in place** to Pregnancy & Lactation (tab structure persists; brief highlight animation).
3. "what about tirzepatide instead?" → second card added for tirzepatide (Pregnancy section); a "Compare semaglutide vs tirzepatide" chip appears → tapping it renders the S4 view.

## 4. Reuse map (must reuse, do not duplicate)

- **Shell + concept tab bar:** `DrugConceptShell` with `activeConcept="I"`. Extend the shared
  `DRUG_CONCEPTS` array with `I · Unified` → `/drug-concept-i` (tab bar + registry update together).
- **Message tabs:** `DrugAnswerTabs` (Concept E) for Answer / Drug Information / References.
- **Accordion card:** `DrugMonographAccordion` (Concept C) inside the Drug Information tab,
  parameterized by drug — it must accept any `DrugMonograph`, not only apixaban.
- **Chat chrome:** `AiResponseChatComposer`, `AiMobileTopRail`, `AiPreparingAnswerNotice`.
- **Answer text/citations/references:** `AiResponseAnswerContent`, `AiResponseAnswerActions`,
  `references.tsx` / `reference-card.tsx`.
- **Data shape:** the `DrugMonograph` types from `src/data/drug-monograph.ts`.

## 5. New components (only if not covered)

All under `src/components/medscape/drug-concepts/`, all registered in the gallery:

- `DrugScenarioPicker` — grouped scenario panel described in §3 (`navigation`).
- `DrugClarifyingQuestionCard` — S3 plan-mode option card (`content`).
- `DrugComparisonView` — S4 side-by-side/stacked layout for 2–3 monograph cards (`content`).
- `DrugToolResultCard` — S8 interaction-checker / calculator result card (`content`).
- `ConditionArticleCard` — S7 condition card with drug pills (`content`). Reuse existing article
  styling (`DrugAiTablesArticle` or closest match) before creating new markup.

## 6. Data — `src/data/drug-monographs-glp1.ts`

New typed module reusing the `DrugMonograph` types, exporting monographs for **semaglutide,
tirzepatide, liraglutide, insulin regular human**, plus a `t2dmConditionArticle` stub, the
scenario script table (`DRUG_SCENARIOS`, grouped), and the S8 tool mock results. Subfield `body`
text must be **verbatim canonical content** — copy from the PM workspace reference monographs
(`AI drug search/01_Context/Reference_Monographs/*.md`) if accessible; otherwise use the verified
facts below, never invented content:

- **semaglutide** (Ozempic / Wegovy / Rybelsus): BBW thyroid C-cell tumors. Missed dose (Ozempic):
  ≤5 days administer ASAP, >5 days skip. Missed dose (Wegovy): next dose >48 h away → take ASAP;
  <48 h → skip; >2 missed → consider re-escalation. Weekly day change allowed if ≥48 h between
  doses. Rybelsus: empty stomach, water ≤4 oz only, wait ≥30 min, swallow whole — no crush/split/
  chew. Do not freeze; do not use if frozen. Discontinue ≥2 months before planned pregnancy.
  Indications incl. T2DM, CV risk reduction, weight management, noncirrhotic MASH (F2–F3).
- **tirzepatide** (Mounjaro / Zepbound): BBW thyroid C-cell tumors; weekly day change requires
  ≥72 h between doses; do not freeze — discard if frozen.
- **liraglutide** (Victoza / Saxenda): BBW thyroid C-cell tumors; daily SC; Saxenda pediatric
  dosing for ≥12 y with obesity.
- **insulin regular human** (Humulin R U-100 / U-500): U-500 is 5× concentrated; medication-error
  cautions around U-100 vs U-500 syringe confusion; GLP-1 co-use → Monitor Closely (hypoglycemia;
  consider insulin dose reduction); rotate injection sites.
- **Perioperative (GLP-1 class):** monograph Warnings note rare postmarketing pulmonary aspiration
  reports under general anesthesia/deep sedation and state available data are **insufficient** for
  hold recommendations — the S6 answer must reflect that the rest comes from guidelines, not the
  monograph.

## 7. Long-section + safety rules

Same as C/E: never dump a full long section — summary first, verbatim body on demand; **BBW and
contraindications always eager, outside any collapse, in every card including comparison columns.**
S5/S6 AI-generated text must be visually distinct from canonical content (existing AI-answer
treatment) and capped at 3 anchored monographs per answer.

## 8. Route & registry

Screen `DrugConceptUnifiedScreen`; route `src/app/(prototypes)/drug-concept-i/page.tsx` renders it
only (logic-free per CLAUDE.md). Add Concept I to `DRUG_CONCEPTS`, `src/registry/prototypes.ts`
(`tags: ["medscape-ai", "drug-reference", "drug-concept"]`, status `active`), and the tab bar —
all driven from the shared array.

## 9. Acceptance

- `pnpm lint` + `pnpm build` pass; concept tab bar shows nine tabs with **I active** on
  `/drug-concept-i`; all tabs navigate.
- The scenario picker shows all nine groups; every scenario above plays its scripted pattern; the
  S9 sequence demonstrates in-place card update, second-card add, and the Compare chip; deep links
  via `?scenario=` work.
- All drug facts come from `drug-monographs-glp1.ts` (no inlined strings); BBW always visible;
  AI-labeled text clearly distinguished from canonical content.
- `DrugMonographAccordion` and `DrugAnswerTabs` were reused (parameterized), not forked; new
  components registered in the gallery.
