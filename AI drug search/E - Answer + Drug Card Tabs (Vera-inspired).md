# Concept E — Answer + Drug Card Tabs (Vera Health–inspired) ⭐

> Read `00 - Index & Shared Architecture.md` first. This file specifies only what is different for Concept E.

## 1. Summary

Each assistant reply carries **top-of-message tabs: Answer · Drug Information · References** (plus **Steps** for multi-part reasoning). "Answer" is a concise, AI-synthesized response to the exact query with **inline numbered citation chips**. "Drug Information" toggles to the **structured monograph card** (sub-tabs Overview / Dosing / Safety / Clinical / References) with the **Black Box Warning pinned at top**. The bet: a cited synthesized answer is fastest for a specific question, and physicians will trust it because the canonical card is one tab away. This mirrors the Vera Health pattern the team liked.

## 2. Detailed description

- Physician asks `apixaban renal dose at GFR 35`. The reply opens on the **Answer** tab: 2–4 sentences ("At eGFR ~35, apixaban is dosed at the standard regimen for the indication and is not reduced for renal function alone…") with citation chips `[1]`, `[2]`.
- A **Drug Information** tab shows the canonical monograph card; **References** lists sources; **Steps** (when present) shows the reasoning trail.
- Tapping a citation chip jumps to that source — either the References list or the exact sub-field in Drug Information.
- Follow-up box continues the thread; each follow-up is its own tabbed reply.

## 3. Story map

**Backbone:** Ask a specific question → Read the cited answer → Verify against canonical → Go deeper if needed → Follow up.

| Activity | Steps | User stories |
|---|---|---|
| Ask | Type a specific question | R1: I ask a precise dosing question and get a precise answer. |
| Read answer | Read synthesized text + chips | R1: I get a 2–4 sentence answer with citations, fast. |
| Verify | Tap a citation / Drug Info tab | R1: I tap [1] and land on the exact monograph field it came from. |
| Go deeper | Browse Drug Information sub-tabs | R1: I open Dosing sub-tab for the full canonical detail. |
| Follow up | Ask next question | Later: follow-ups keep the tabbed format and drug context. |

**Round-1 slice:** Answer tab with citations + Drug Information card with sub-tabs + References + citation→source jump + pinned BBW.
**Later slice:** Steps tab, comparative answers (apixaban vs rivaroxaban), saved answers.

## 4. Handling long sections (≥2 viewports)

- The **Answer tab is itself the long-section solution for the asked question**: instead of showing a 2+ viewport Dosing block, it returns the synthesized 2–4 sentence answer to *exactly* what was asked, grounded and cited.
- The **Drug Information → Dosing sub-tab** still contains the long canonical content; there it uses a **sticky sub-field tab strip** (AFib · 2.5 mg criteria · DVT/PE · Renal · Hepatic) inside the card so the long body is navigable, not a blind scroll.
- Citation chips deep-link into the specific sub-field, so verification lands on ~1 viewport, not the top of a long section.
- BBW pinned above the sub-tabs, always eager.

## 5. LangGraph implementation

- **Nodes:** `router` → `intent_parse` → `monograph_retrieve` → **`synthesize` ON** → `response_builder`.
- `synthesize` is hard-constrained: prompt receives **only** the retrieved sub-fields as context; it must answer in ≤4 sentences and attach a `citations[]` array mapping each marker to a `subfield anchor`. A post-synthesis **grounding check** (verify every claim maps to a retrieved field; reject/he-generate if not) is required given this is the highest-synthesis concept that the remit flags.
- `response_builder` emits `answer` (text + citations) **and** the full `sections` tree for the Drug Information tab. References tab is derived from the union of cited sources.
- Thread state retains `drug_id` + context so follow-ups synthesize in context.
- **Frontend:** tabbed message component; citation chips carry anchors that switch to Drug Information and scroll to the sub-field.

## 6. Assumptions to test

| # | Assumption | How to validate | Keep signal |
|---|---|---|---|
| E1 | A cited synthesized answer is the fastest path to a specific answer. | Time-to-answer vs all concepts on contextual tasks (#2, #4, #6). | E fastest on specific questions. |
| E2 | Physicians TRUST the synthesized answer because the card is one tab away. | Trust rating; citation click-through; "would you act on this?" | Trust ≥ deterministic concepts; citations checked then trusted. |
| E3 | The synthesis/reference separation (tabs) reads as safe, not as "AI making things up." | Probe on perceived trustworthiness vs a single blended answer. | Tab separation rated reassuring. |
| E4 | Grounding is tight enough that no answer contains an un-cited or wrong fact. | Expert review of generated answers across the task battery. | Zero ungrounded clinical claims. |
| E5 | The Dosing sub-tab's sub-field strip tames the long section. | Scroll/time within Drug Information on dosing tasks. | Navigable, low scroll. |

## 7. Risks & open questions

- **Highest trust risk in the set** — it synthesizes drug facts, the exact thing the remit says to handle carefully. Grounding check + visible citations + one-tap canonical card are the mitigations; E4 is the make-or-break assumption.
- Latency: synthesis + grounding adds time vs deterministic concepts — measure it.
- Liability/compliance review of generated dosing text is required before any real-content build.
- This is the direct parity test vs Vera Health / OpenEvidence / Doximity — treat it as the benchmark concept.
