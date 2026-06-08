# Concept D — Workflow Mode (Intent Chips)

> Read `00 - Index & Shared Architecture.md` first. This file specifies only what is different for Concept D.

## 1. Summary

A bare drug query returns a high-confidence monograph card **with a row of task chips** in the message — AFib dosing, DVT/PE treatment, renal dosing, interactions, perioperative interruption. Tapping a chip (or having context in the query) **re-renders the in-thread response reorganized around that task**, surfacing only the relevant sub-fields first. Not a chatbot — canonical content is resequenced, not generated. The bet: physicians think in *tasks*, and task-framing beats field-framing.

## 2. Detailed description

- Physician types `apixaban`. The reply shows a compact monograph header + BBW and a horizontal row of **task chips** (suggested actions).
- Tapping "Renal dosing" re-renders the message focused on renal dosing: the relevant sub-fields promoted to top, supporting fields below, full monograph reachable.
- If the query already carried intent (`apixaban perioperative`), `intent_parse` routes directly — chips render as already-selected, no extra tap.
- Critically: the first render is **never a blank "choose your intent" gate** — it always shows a useful default card with chips optional on top.

## 3. Story map

**Backbone:** Ask → See a useful default + tasks → Pick the task → Get the task-shaped answer → Switch task or follow up.

| Activity | Steps | User stories |
|---|---|---|
| Ask | Type drug name / question | R1: I type "apixaban" and immediately see useful content + task options. |
| See tasks | Read chips | R1: Chips name real clinical tasks (AFib dosing, renal, peri-op). |
| Pick task | Tap a chip | R1: I tap "Renal dosing" and the answer reorganizes to that task. |
| Get answer | Read promoted sub-fields | R1: The renal dose + the dose-reduction criteria are top, in one screen. |
| Switch / follow up | Tap another chip / type | Later: I switch to "interactions" without retyping the drug. |

**Round-1 slice:** default card + chip row + chip-driven re-render + auto-routing from contextual queries + always-reachable full monograph.
**Later slice:** personalized chip ordering by specialty, multi-task compound views, learned default task.

## 4. Handling long sections (≥2 viewports)

- Workflow Mode is the **strongest answer to the long-section problem**: selecting a task means the orchestrator retrieves the **specific sub-fields for that task**, not the whole Dosing section.
- "Renal dosing" → returns `dosing.renal_adjustment` + `dosing.dose_reduction` only — ~1 viewport, not the full 2+ viewport Dosing block.
- The rest of the long section is available via "show full dosing," but is never the default payload.
- BBW always pinned regardless of selected task.

## 5. LangGraph implementation

- **Nodes:** `router` → `intent_parse` → `monograph_retrieve` → `response_builder`. **`synthesize` OFF** (AI is used for *routing*, not content).
- `intent_parse` is the heart of this concept: it maps free-text or chip taps to a **task → sub-field set** (a maintained mapping table, e.g. `task:renal_dosing → [dosing.renal_adjustment, dosing.dose_reduction, safety.renal_risk]`).
- A chip tap is sent back through the graph as a structured intent (not free text), so routing is deterministic and fast; thread state keeps `drug_id`.
- `monograph_retrieve` fetches only the task's sub-field set (plus header + BBW). `response_builder` orders them by the task template.
- **Frontend:** chips = suggested-action affordance; each tap = a new graph turn returning a re-shaped payload.

## 6. Assumptions to test

| # | Assumption | How to validate | Keep signal |
|---|---|---|---|
| D1 | Task-framing beats field-framing (vs Concept A). | Head-to-head time + preference on task battery. | D faster/preferred on multi-field tasks. |
| D2 | Chip-first does NOT add friction (no forced gate). | Observe hesitation at first screen; "did you feel forced to choose?" | No forced-choice complaints; default content used. |
| D3 | The task→sub-field mapping matches how physicians actually frame lookups. | Card-sort / probe whether chips match their mental model. | ≥80% find their task in the chips. |
| D4 | Auto-routing contextual queries (skip chips) feels accurate. | Routing accuracy on contextual queries. | High precision; few wrong-task re-renders. |
| D5 | Retrieving only task sub-fields solves the long-Dosing problem. | Scroll distance + time on renal/peri-op tasks. | Answer within ~1 viewport. |

## 7. Risks & open questions

- The task→sub-field mapping is content/governance work — who owns and maintains it, and does compliance accept the implied reordering?
- Chip set must cover the long tail without becoming a huge row; what's the default top-5 per drug class?
- Wrong auto-routing on ambiguous queries erodes trust — need a clear "not what you meant? pick a task" recovery.
