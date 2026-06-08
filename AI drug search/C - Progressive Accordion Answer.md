# Concept C — Progressive Accordion Answer

> Read `00 - Index & Shared Architecture.md` first. This file specifies only what is different for Concept C.

## 1. Summary

The reply is a **single chat message that is a nested accordion**: top-level sections collapsed to scannable summary rows, expanding to sub-fields, expanding to verbatim canonical text. A sticky jump bar sits at the top of the message. Deterministic. The bet: layered disclosure inside one message reduces cognitive load without removing content or leaving the thread.

## 2. Detailed description

- Physician asks; the reply is one tall-but-collapsed message: header (drug + BBW) and a list of section rows (Dosing, Safety, Interactions, Renal/Hepatic, Adverse effects), each showing a one-line summary.
- Tapping a section row expands to its **sub-field rows** (each a one-liner); tapping a sub-field expands to the **verbatim body**.
- A sticky jump bar (chips: Dosing / Safety / Interactions / Renal) scrolls the message to that section.
- Context-aware: a renal query auto-expands Dosing → Renal impairment on first render.

## 3. Story map

**Backbone:** Ask → Skim the outline → Drill to the level you need → Read canonical text → Follow up.

| Activity | Steps | User stories |
|---|---|---|
| Ask | Type query | R1: I ask and get a compact, skimmable outline, not full text. |
| Skim | Read section summaries | R1: I see all sections in ~one screen and pick one. |
| Drill | Expand section → sub-field | R1: I open Dosing, see sub-fields, open just "renal." |
| Read | Verbatim body + source | R1: The expanded body is the exact monograph text with a source link. |
| Follow up | Jump bar or new question | Later: jump bar lets me hop to Interactions without collapsing first. |

**Round-1 slice:** two-level accordion + summaries + sticky jump bar + context auto-expand + source on bodies.
**Later slice:** remembering expand state across follow-ups, "expand all in section."

## 4. Handling long sections (≥2 viewports)

- This concept's core mechanic *is* the long-section solution: a long Dosing section is **never a single scroll** — it's decomposed into sub-field rows, each individually expandable.
- The user expands only the one sub-field they need (e.g., "2.5 mg BID criteria"), so they read ~1 viewport, not 2+.
- Sticky jump bar prevents losing place in a long expanded message.
- Eager-render rule: BBW and contraindication rows are **expanded by default** and pinned; only non-critical bodies start collapsed.

## 5. LangGraph implementation

- **Nodes:** `router` → `intent_parse` → `monograph_retrieve` → `response_builder`. **`synthesize` OFF.**
- Payload carries the full section→sub-field tree with `summary` for every node; `body` is lazy-loaded per sub-field on expand (scoped `monograph_retrieve`).
- `matched_intent` tells the builder which node to mark `default_expanded: true`.
- **Frontend:** accordion state is client-side; only deep body expansion calls back to the graph. One message, no re-render of the thread.

## 6. Assumptions to test

| # | Assumption | How to validate | Keep signal |
|---|---|---|---|
| C1 | Collapse-by-default speeds people up vs a flat long answer. | Time-to-answer vs Control. | Faster, lower reported load. |
| C2 | Collapsing does NOT cause people to miss safety info. | Comprehension check on warnings task (#5); eye on whether they expand it. | No missed BBW/warnings. |
| C3 | Two levels of nesting is the right depth (not too many taps). | Tap count to answer; frustration probe. | ≤2 taps to most answers. |
| C4 | The sticky jump bar is used and reduces scroll. | Jump-bar usage rate. | Used on multi-section tasks. |
| C5 | Auto-expanding the matched sub-field helps rather than confuses. | Compare auto-expand vs all-collapsed variant. | Auto-expand wins on time, no confusion. |

## 7. Risks & open questions

- Over-collapsing can bury critical info — the eager-render rule for safety must be airtight.
- A fully expanded accordion can still be a long message; jump bar mitigates but test it.
- Extra taps may annoy expert users who'd prefer everything open (offer "expand all"?).
