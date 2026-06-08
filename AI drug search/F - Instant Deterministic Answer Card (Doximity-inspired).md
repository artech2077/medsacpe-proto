# Concept F — Instant Deterministic Answer Card (Doximity-inspired)

> Read `00 - Index & Shared Architecture.md` first. This file specifies only what is different for Concept F.

## 1. Summary

A drug query returns a **compact, fully deterministic card in the thread — no AI-generated prose in the first state**. Just the highest-value monograph sub-fields (standard dose, key warnings, top interactions) verbatim, with **"Open full monograph"** and an optional **"Ask AI about this drug"** that expands into synthesis only on demand, as the next turn. Mirrors Doximity's instant-answer pattern (no AI text in the first state). The bet: for the common case, a deterministic card is the fastest *and* most trustworthy reply, and synthesis should be opt-in.

## 2. Detailed description

- Physician types `apixaban`. The first reply is a small card: drug + class, **pinned BBW**, and 2–4 verbatim key fields (standard AFib dose, top warnings, top interactions), each with a source label.
- Two actions: **Open full monograph** (deterministic, expands to structured sections) and **Ask AI about this drug** (opt-in synthesis).
- If the query had context (`apixaban renal dose`), the card shows the matching verbatim sub-field instead of the generic default — still deterministic.
- Tapping "Ask AI" runs synthesis as a clearly-labeled separate turn, keeping the deterministic card as the trusted anchor above it.

## 3. Story map

**Backbone:** Ask → Get an instant trusted card → (usually done) → optionally open full monograph or ask AI.

| Activity | Steps | User stories |
|---|---|---|
| Ask | Type drug / question | R1: I type "apixaban" and instantly get verbatim key facts. |
| Trust instantly | Read deterministic fields + source | R1: I know nothing was generated — it's the label/monograph text. |
| Done (common case) | Read the dose, leave | R1: For "standard dose" I'm done in one glance. |
| Go deeper | Open full monograph | R1: I expand to structured sections when I need more. |
| Opt into AI | Tap "Ask AI" | Later: for a nuanced question I explicitly ask AI, as a separate turn. |

**Round-1 slice:** instant deterministic card + BBW + key fields + Open full monograph + context-aware field swap.
**Later slice:** "Ask AI" synthesis turn, interaction checker entry point, customizable default fields.

## 4. Handling long sections (≥2 viewports)

- F sidesteps long sections by design: the first card shows **only the single highest-value sub-field** (e.g., standard dose), never a full section.
- "Open full monograph" reveals structured sections that themselves use sub-field summaries + lazy bodies (per shared rules) — so even the deep view avoids a blind 2+ viewport scroll.
- The deterministic interaction checker and renal sub-field are reachable as discrete fields, not by scrolling Dosing.

## 5. LangGraph implementation

- **Nodes (default turn):** `router` → `intent_parse` → `monograph_retrieve` → `response_builder`. **`synthesize` OFF by default.**
- `monograph_retrieve` returns the "key fields" set for the card (a per-drug-class default sub-field list) + BBW; context queries swap in the matched sub-field.
- **"Ask AI" turn:** re-enters the graph with `synthesize` ON, using the already-retrieved fields as constrained context (same grounding check as Concept E). Rendered as a new, clearly-labeled message so the deterministic card remains the anchor.
- Thread state holds `drug_id` + retrieved fields so "Ask AI" reuses context without re-fetching.
- **Frontend:** the cleanest payload — card renders from a small `key_fields[]` slice; deterministic-first is enforced by the node config (no synth on first turn).

## 6. Assumptions to test

| # | Assumption | How to validate | Keep signal |
|---|---|---|---|
| F1 | A deterministic-first card is the highest-trust reply. | Trust rating vs Concept E. | F ≥ E on trust. |
| F2 | The default key-field card answers the common case without "Ask AI." | % of tasks solved without invoking synthesis. | Majority solved deterministically. |
| F3 | Making synthesis opt-in does NOT feel like missing functionality. | "Did you want a written answer sooner?" probe. | Few wish synthesis were default. |
| F4 | Verbatim + source label is read as more credible than a cited paraphrase. | Compare trust/confidence vs E on identical task. | F preferred on trust-sensitive tasks. |
| F5 | The default key-field set matches what physicians most want first. | Which field they look for first vs what's shown. | High match; low immediate "Open monograph." |

## 7. Risks & open questions

- Thinner for nuanced/contextual questions until the user opts into AI — may feel under-powered for complex drugs.
- Choosing the default key-field set per drug class is content work.
- Risk that "Ask AI" is under-discovered; balance trust (deterministic) vs helpfulness (synthesis).
- This is the low-synthesis anchor of the spectrum — pair with E in testing to locate the trust/synthesis sweet spot.
