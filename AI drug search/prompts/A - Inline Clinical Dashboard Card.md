# Build Prompt — Concept A: Inline Clinical Dashboard Card

> Prereq: build `00 - Shared Prototype Shell & Tab Bar.md` first (tab bar, `DrugConceptShell`,
> `src/data/drug-monograph.ts`). Spec: `AI drug search/A - Inline Clinical Dashboard Card.md` and
> `00 - Index & Shared Architecture.md`. This prompt describes only what is different for Concept A.

## 0. Mandatory first step
Invoke the **`medscape-component-reuse`** skill and inventory `src/registry/gallery.tsx`,
`src/components/ui/`, `src/components/medscape/`, `src/components/screens/`, and `src/data/` before
writing code. Produce a reuse map. Reuse existing components exactly; create new ones only for
genuinely new functionality, and register them.

## 1. Goal
A drug query renders the assistant reply as a **rich dashboard card embedded in the chat bubble** —
a 4–6 tile grid of clinical zones (Dosing · Safety/Warnings · Interactions · Renal/Hepatic · Adverse
effects), each tile showing the single highest-value subfield `summary`. Tapping a tile expands it
**in place** to reveal that section's subfield mini-ToC; a second tap reveals the verbatim `body`.
Fully deterministic — **no synthesized prose**. A pinned Black Box Warning sits in the card header
and an "Open full monograph" link is always present.

## 2. Reuse map (must reuse, do not duplicate)
- **Shell + tab bar at top:** wrap the screen in `DrugConceptShell` with `activeConcept="A"`.
- **Chat chrome / composer:** reuse the chat panel + `AiResponseChatComposer` + `AiMobileTopRail`
  pattern from `AiResponseScreen`. The user types a drug query; the reply is the dashboard card.
- **Preparing state:** reuse `AiPreparingAnswerNotice` before the card renders.
- **Source labels / references:** reuse `AiAnswerReference` data shape and, if you surface a sources
  list, `AiResponseAnswerSupportingContent`.
- **Data:** read drug, BBW, and `sections[].subfields[].summary/body` from `apixabanMonograph` in
  `src/data/drug-monograph.ts`. Use the query→matchedIntent helper for context pre-expansion.

## 3. New component (only if not already covered)
- `DrugDashboardCard` in `src/components/medscape/drug-concepts/dashboard-card.tsx`: the tile grid +
  header (drug name, class, pinned BBW) + expand/collapse logic. Tiles are client-side state; tap
  reveals the subfield list (one-line summaries), second tap reveals `body`. If the query carried
  context (e.g. "apixaban renal dose"), the matching tile is **pre-expanded and promoted to top**.
  Register it in the gallery (`content` category).

## 4. Handling long sections
Tiles never show a full long section — only the subfield `summary`. Expanding a tile shows the
section's subfield list as a mini-ToC (≈6 one-liners); a second tap lazy-reveals one `body`. BBW and
contraindications render in the header, **outside any collapse**.

## 5. Route & registry
Screen `DrugConceptDashboardCardScreen` in `src/components/screens/`; route
`src/app/(prototypes)/drug-concept-a/page.tsx` renders it only. Registry entry per the shared table.

## 6. Acceptance
- `pnpm lint` + `pnpm build` pass; tab bar at top with **A active**, all tabs navigate.
- Typing "apixaban" shows header + BBW + tile grid in ≤1 screen; tap expands a tile in place; a
  renal-context query pre-expands the renal tile. No synthesized text. "Open full monograph" present.
- All facts come from `drug-monograph.ts`; no duplicate components introduced.
