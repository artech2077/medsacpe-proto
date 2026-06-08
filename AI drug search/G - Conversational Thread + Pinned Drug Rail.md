# Concept G — Conversational Thread + Pinned Drug Rail

> Read `00 - Index & Shared Architecture.md` first. This file specifies only what is different for Concept G.

## 1. Summary

The most thread-like concept: a normal back-and-forth conversation, but with a **canonical drug card pinned alongside the thread** (right rail on desktop; sticky collapsible header on mobile) so the monograph never leaves the screen. Every claim in the conversation links into the pinned card. The bet: physicians want natural multi-step follow-up for drugs, and a continuously-visible canonical reference keeps that trustworthy.

## 2. Detailed description

- Physician asks about the drug. The answer appears as a chat message; simultaneously a **pinned drug rail** populates with the canonical card (drug, BBW, key sub-fields, sub-field nav).
- Follow-ups feel native: `what about hepatic impairment?`, `and with ketoconazole?`, `compare to rivaroxaban` — each answered in-thread, with claims linking into the rail's matching sub-field (which scrolls/highlights).
- The rail persists across the whole conversation; it's the grounding anchor that distinguishes this from a generic medical chatbot.
- On mobile the rail collapses to a sticky header that expands to a sheet.

## 3. Story map

**Backbone:** Ask → Converse with follow-ups → Stay grounded via the rail → Compare/branch → Resolve.

| Activity | Steps | User stories |
|---|---|---|
| Ask | Type initial question | R1: I ask and get an answer plus a pinned canonical card. |
| Converse | Natural follow-ups | R1: I ask "and hepatic?" without retyping the drug. |
| Stay grounded | Claims link to rail | R1: Each answer links into the visible canonical card. |
| Compare/branch | Multi-drug / multi-condition | Later: "compare apixaban vs rivaroxaban bleeding" with both grounded. |
| Resolve | Reach a confident answer | R1: I leave confident because the source stayed visible throughout. |

**Round-1 slice:** conversation + pinned rail (desktop) / sticky header (mobile) + claim→rail linking + persistent drug context.
**Later slice:** multi-drug rails, compare view, conversation memory across sessions.

## 4. Handling long sections (≥2 viewports)

- The conversation answers target **sub-fields**, never dumping a long section into a chat bubble.
- The **rail shows a compact summary** of each section; tapping expands the long body **in the rail** (with its own sub-field nav), keeping the thread clean.
- Long content thus lives in a navigable rail, not the conversation — the thread stays short and scannable while the full canonical detail is one click away and always visible.
- BBW pinned at the top of the rail permanently.

## 5. LangGraph implementation

- **Nodes:** `router` → `intent_parse` → `monograph_retrieve` → **`synthesize` ON** → `response_builder`. Synthesis is conversational (answers the follow-up), grounded + cited like Concept E (same grounding check).
- **Strong reliance on thread state / graph memory:** `drug_id`, conversation history, and accumulated context flags persist so follow-ups resolve pronouns ("it", "that dose") and skip re-classification. This is the most stateful concept.
- First turn emits both `answer` and a `rail_manifest` (section/sub-field tree); subsequent turns emit `answer` + `rail_focus_anchor` to re-point the rail without rebuilding it.
- Multi-drug follow-ups add a second `drug_id` to state and a second rail/section.
- **Frontend:** persistent rail component bound to thread; messages carry anchors that drive rail focus.

## 6. Assumptions to test

| # | Assumption | How to validate | Keep signal |
|---|---|---|---|
| G1 | Physicians want conversational follow-up for drug lookups. | Follow-up usage rate; preference on multi-step tasks (#6, #8). | Follow-ups used; preferred for multi-step. |
| G2 | A pinned canonical rail keeps a chatbot-style flow trustworthy. | Trust rating vs a no-rail chat; "did you trust the answers?" | Trust materially higher with rail. |
| G3 | Claim→rail linking is noticed and used for verification. | Link click-through; verification behavior. | Links used to verify. |
| G4 | Context carries correctly across follow-ups (no drift). | Accuracy of pronoun/context resolution across a multi-turn task. | High; few wrong-context answers. |
| G5 | The rail survives mobile without killing the conversation. | Mobile multi-turn task success. | Acceptable mobile flow. |

## 7. Risks & open questions

- **Most chatbot-like → highest perceived synthesis risk**; the rail is the mitigation but G2 is decisive.
- Invites off-label / out-of-scope questions — need guardrails on what synthesis will answer.
- Rail competes for space on mobile; the collapsible-header pattern must be tested hard.
- Most stateful concept → most engineering complexity around memory and context drift.
