# Concept B — Expandable Monograph Canvas

> Read `00 - Index & Shared Architecture.md` first. This file specifies only what is different for Concept B.

## 1. Summary

The chat reply is a short in-thread answer plus an **"Open monograph" affordance** that launches a **side canvas/panel beside the conversation** (the artifact/canvas pattern used by modern AI chat tools). The canvas holds the full monograph with section nav, search-within-monograph, and a quick-reference rail; the chat stays live alongside, and in-thread answers deep-link to exact canvas anchors. The bet: the long monograph belongs in a dedicated surface, with chat as the entry point and the controller.

## 2. Detailed description

- Physician asks about the drug in chat. The reply gives a concise pointer ("Renal dosing is under Dosing → Renal impairment") and an **Open monograph** button.
- Clicking opens a canvas to the right (desktop) / full-screen sheet (mobile) **scrolled and highlighted to the exact sub-field** the query was about.
- Canvas chrome: left section nav, center content, right quick-reference rail (pinned BBW + key facts), and a search-within-monograph box.
- The chat thread remains usable: follow-ups in chat re-scroll/highlight the canvas to the new anchor instead of dumping text into the thread.

## 3. Story map

**Backbone:** Ask → Get pointed to the right place → Open the reference → Navigate within it → Keep asking from chat.

| Activity | Steps | User stories |
|---|---|---|
| Ask | Type query | R1: I ask and get a one-line pointer + Open monograph. |
| Get pointed | Read pointer + anchor | R1: The pointer names the exact section so I know where I'm going. |
| Open reference | Launch canvas at anchor | R1: Canvas opens already scrolled to renal dosing, highlighted. |
| Navigate | Section nav / search-within | R1: I jump to Interactions via nav or search within the monograph. |
| Keep asking | Follow-up in chat drives canvas | Later: "now perioperative" re-points the canvas without me scrolling. |

**Round-1 slice:** pointer + Open monograph + canvas with section nav + deep-link to anchor + search-within.
**Later slice:** chat-driven re-anchoring on follow-ups, multi-drug tabs in canvas, side-by-side compare.

## 4. Handling long sections (≥2 viewports)

- The canvas is the **natural home for long content** — long sections are fine here because they get a **sticky sub-section nav** and search-within, which a chat bubble can't offer.
- Deep-linking is essential: chat never says "scroll to dosing"; it lands the user on `dosing.renal_adjustment` exactly, highlighted, with the rest of Dosing scrollable above/below.
- The right rail keeps BBW + key facts visible no matter how far the user scrolls into a long section.

## 5. LangGraph implementation

- **Nodes:** `router` → `intent_parse` → `monograph_retrieve` → `synthesize` (light: just the pointer sentence, optional) → `response_builder`.
- `response_builder` emits two things: a small chat payload (`answer.text` = pointer + `target_anchor`) and a `canvas_manifest` (full section/sub-field tree with anchors). The canvas can lazy-load section bodies via scoped `monograph_retrieve` calls as the user navigates — it does not need the entire monograph body up front.
- Follow-ups: thread state holds the open `drug_id`; a follow-up runs `intent_parse` → returns a new `target_anchor`; the frontend re-points the existing canvas (no full reload).
- **Frontend:** canvas is a persistent component bound to the thread; chat messages carry anchors that drive it.

## 6. Assumptions to test

| # | Assumption | How to validate | Keep signal |
|---|---|---|---|
| B1 | Physicians accept a reference *beside* chat rather than inside the thread. | Preference vs in-thread concepts (A/E); observe whether they use the canvas. | ≥ parity preference; canvas actually used. |
| B2 | Deep-linking to the exact sub-field removes the long-scroll pain. | Time-to-answer on renal/peri-op tasks; scroll distance. | Lands on answer with minimal scroll. |
| B3 | Search-within-monograph is valued for deep tasks. | Usage rate of search; success on the compare task (#8). | Search used and helps. |
| B4 | The canvas does not feel like "being kicked back to the old website." | Trust/continuity probe. | Users describe it as part of the AI experience. |
| B5 | Works acceptably on mobile as a full-screen sheet. | Mobile task success vs desktop. | No major mobile regression. |

## 7. Risks & open questions

- **Least chat-native concept** — it's a panel, not a message. If physicians ignore the canvas and want answers in-thread, B loses.
- Mobile canvas is a full takeover; the "chat stays live alongside" benefit disappears on phone.
- Risk of perceived regression to the old standalone monograph page — framing/visual integration matters.
