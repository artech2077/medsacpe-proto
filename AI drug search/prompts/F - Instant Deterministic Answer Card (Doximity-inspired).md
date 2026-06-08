# Build Prompt — Concept F: Instant Deterministic Answer Card (Doximity-inspired)

> Prereq: build `00 - Shared Prototype Shell & Tab Bar.md` first. Spec:
> `AI drug search/F - Instant Deterministic Answer Card (Doximity-inspired).md` +
> `00 - Index & Shared Architecture.md`. This prompt describes only what is different for Concept F.

## 0. Mandatory first step
Invoke the **`medscape-component-reuse`** skill and inventory the library before coding. Produce a
reuse map. Reuse exactly; new components only for new functionality; register them.

## 1. Goal
A drug query returns a **compact, fully deterministic card — no AI prose in the first state**: drug +
class, **pinned BBW**, and 2–4 verbatim key fields (standard AFib dose, top warnings, top
interactions), each with a source label. Two actions: **Open full monograph** (deterministic
structured sections) and **Ask AI about this drug** (opt-in synthesis as a clearly-labeled *next
turn*). A contextual query swaps in the matching verbatim subfield instead of the generic default —
still deterministic. Tapping "Ask AI" runs synthesis as a separate message, keeping the deterministic
card as the trusted anchor above it.

## 2. Reuse map (must reuse, do not duplicate)
- **Shell + tab bar at top:** `DrugConceptShell` with `activeConcept="F"`.
- **Chat chrome / composer / preparing:** reuse `AiResponseChatComposer`, `AiMobileTopRail`,
  `AiPreparingAnswerNotice`.
- **Quick-value card pattern:** check `MedscapePaidTrafficQuickStart`
  (`ai-current/paid-traffic-quick-start.tsx`) — it already renders a short answer + compact summary +
  next-step actions + trust cue. Reuse it for the instant card if it fits; otherwise reuse its parts.
- **"Ask AI" turn:** the opt-in synthesized message reuses `AiResponseAnswerContent` +
  `AiResponseAnswerActions` (mirror the synthesis treatment from Concept E).
- **Data:** `apixabanMonograph.keyFields` for the default card, matchedIntent helper for the
  context swap, and the example `DrugSynthesizedAnswer` for the "Ask AI" turn.

## 3. New component (only if not covered)
- `DrugInstantCard` in `src/components/medscape/drug-concepts/instant-card.tsx`: the deterministic
  key-field card (BBW pinned, verbatim fields + source labels, Open full monograph + Ask AI). Only
  build this if `MedscapePaidTrafficQuickStart` cannot be configured to the same layout — prefer
  reuse. Register any new component in the gallery (`content`).

## 4. Handling long sections
F sidesteps long sections: the first card shows **only the single highest-value subfield**, never a
full section. "Open full monograph" reveals structured sections that use subfield summaries + lazy
bodies (shared rules). Renal subfield and interactions are reachable as discrete fields, not by
scrolling Dosing.

## 5. Route & registry
Screen `DrugConceptInstantCardScreen`; route `src/app/(prototypes)/drug-concept-f/page.tsx` renders
it only. Registry entry per the shared table.

## 6. Acceptance
- `pnpm lint` + `pnpm build` pass; tab bar at top with **F active**, all tabs navigate.
- "apixaban" instantly shows a deterministic card (BBW + verbatim key fields + source labels), no
  generated text; a contextual query swaps in the matching subfield; "Open full monograph" expands
  structured sections; "Ask AI" adds a clearly-labeled synthesized turn below the card.
- Facts come from `drug-monograph.ts`; quick-value card reused where possible, no duplicates.
