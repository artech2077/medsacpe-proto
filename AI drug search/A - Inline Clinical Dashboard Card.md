# Concept A — Inline Clinical Dashboard Card

> Read `00 - Index & Shared Architecture.md` first. This file specifies only what is different for Concept A.

## 1. Summary

The assistant's reply to a drug query renders as a **rich dashboard card embedded in the chat bubble** — a compact grid of clinical zones (Dosing · Safety/Warnings · Interactions · Renal/Hepatic · Adverse effects), each showing the single highest-value sub-field verbatim. Tapping a zone expands it in place. Deterministic; no synthesized prose. The bet: physicians scan a structured card faster than they navigate or read an answer.

## 2. Detailed description

- Physician types `apixaban` (or a contextual query) into Medscape AI.
- The reply message contains a header (drug name, class, pinned Black Box Warning) and a 4–6 tile grid. Each tile = a clinical zone with its top sub-field summary (e.g., Dosing tile → "AFib: 5 mg PO BID").
- Tapping a tile expands it **inside the same chat message** to reveal the zone's sub-fields; the conversation continues below the card.
- If the query had context (`apixaban renal dose`), the relevant tile is **pre-expanded and visually promoted** to the top of the grid.
- A persistent "Open full monograph" link is always present.

## 3. Story map

**Backbone (left → right):** Ask about a drug → Orient on the card → Find the specific field → Verify the source → Act / ask follow-up.

| Activity | Steps | User stories (Round 1 = R1) |
|---|---|---|
| Ask | Type drug name or question | R1: As a physician, I type "apixaban" and get a structured card, not a wall of text. |
| Orient | Scan zone tiles; see BBW | R1: I see dosing, safety, interactions, renal at a glance without scrolling past one screen. |
| Find field | Tap/expand the relevant tile | R1: I tap "Renal" and see GFR-based guidance immediately. R1: If I asked a renal question, that tile is already open. |
| Verify | See source label on the field | R1: Each fact shows it came from Drug Reference with a link to the exact section. |
| Act / follow up | Ask next question in thread | Later: I ask "and with ketoconazole?" and the Interactions tile updates in a new reply. |

**Round-1 slice:** header + BBW + 5 tiles + tap-to-expand + context pre-expansion + source labels.
**Later slice:** follow-up re-rendering, personalization of tile order, multi-drug cards.

## 4. Handling long sections (≥2 viewports)

- Tiles never show a full long section — they show the **sub-field `summary`** only.
- On expand, the tile reveals the **sub-field list of that section as a mini table-of-contents** (e.g., Dosing → AFib · 2.5 mg criteria · DVT/PE · Renal · Hepatic · Administration), each a one-line summary that expands to verbatim `body` on a second tap (lazy-loaded).
- So a 2+ viewport Dosing section becomes: tile (1 line) → sub-field list (≈6 lines) → the one sub-field body the user wants. The user never scrolls a long block blind.
- BBW and contraindications render in the header, outside any collapse.

## 5. LangGraph implementation

- **Nodes:** `router` → `intent_parse` → `monograph_retrieve` → `response_builder`. **`synthesize` is OFF.**
- `intent_parse` sets `matched_intent` so `response_builder` can flag which tile to pre-expand/promote.
- `monograph_retrieve` returns all top-level sections with each sub-field's `summary` populated, but **bodies fetched lazily**: initial payload carries summaries; full `body` is pulled via a follow-up retrieve call (a `monograph_retrieve` invocation scoped to one `subfield_id`) when the user expands. This keeps the first message light.
- `response_builder` emits the full Drug Response Contract minus `answer`. Frontend renders the grid from `sections[].subfields[].summary`.
- **Frontend:** stateless re-render per tap; expansion state can be client-side only (no new graph turn) for summaries already in payload; deep body expansion triggers a scoped retrieve.

## 6. Assumptions to test

| # | Assumption | How to validate | Keep signal |
|---|---|---|---|
| A1 | A zone grid is faster to scan than reading a synthesized answer. | Time-to-answer vs Control and vs Concept E. | A beats Control by ≥30% on field-lookup tasks. |
| A2 | Physicians correctly predict which tile holds their answer. | First-tap accuracy per task. | ≥80% first-tap hit rate. |
| A3 | Context pre-expansion (renal query → renal tile open) reduces taps without feeling presumptuous. | Tap count + post-task comment. | Fewer taps, no trust complaints. |
| A4 | The mini-ToC inside an expanded tile prevents the "long Dosing" scroll problem. | Observe scrolling within expanded Dosing; ask perceived load. | No blind scrolling; load rated low. |
| A5 | Deterministic-only (no answer text) still feels complete. | Confidence rating; "did you want a written answer?" probe. | Confidence ≥ Control. |

## 7. Risks & open questions

- Card density can feel cramped in a narrow chat column (esp. mobile) — may need fewer tiles on mobile.
- Which 5 zones make the default grid? A field outside the grid is harder to reach.
- Lazy body-loading adds a small latency on expand — acceptable?
