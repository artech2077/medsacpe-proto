# Build Prompt — Concept B: Expandable Monograph Canvas

> Prereq: build `00 - Shared Prototype Shell & Tab Bar.md` first. Spec:
> `AI drug search/B - Expandable Monograph Canvas.md` + `00 - Index & Shared Architecture.md`.
> This prompt describes only what is different for Concept B.

## 0. Mandatory first step
Invoke the **`medscape-component-reuse`** skill and inventory the library before coding. Produce a
reuse map. Reuse exactly; new components only for new functionality; register them.

## 1. Goal
The chat reply is a **short in-thread pointer** ("Renal dosing is under Dosing → Renal impairment")
plus an **"Open monograph" button** that launches a **side canvas/panel beside the conversation**
(artifact/canvas pattern): right-side panel on desktop, full-screen sheet on mobile. The canvas
holds the full monograph with **left section nav, center content, right quick-reference rail
(pinned BBW + key facts), and search-within-monograph**. Opening deep-links + highlights the exact
subfield the query was about. The chat stays live; follow-ups **re-point the canvas** to a new
anchor instead of dumping text in the thread.

## 2. Reuse map (must reuse, do not duplicate)
- **Shell + tab bar at top:** `DrugConceptShell` with `activeConcept="B"`.
- **Chat chrome / composer / preparing:** reuse `AiResponseChatComposer`, `AiMobileTopRail`,
  `AiPreparingAnswerNotice` from the `ai-response` family.
- **Pointer message:** render the one-line pointer with `AiResponseAnswerContent` (short string) so
  it matches existing answer typography rather than custom markup.
- **Monograph content:** the canvas renders `apixabanMonograph` sections/subfields from
  `src/data/drug-monograph.ts`. Consider whether `DrugAiTablesArticle` can supply the in-canvas
  body styling; reuse it if the content treatment matches, otherwise render subfields directly.
- **Quick-reference rail:** pinned BBW + key facts from the monograph data.

## 3. New components (only if not covered)
- `DrugMonographCanvas` in `src/components/medscape/drug-concepts/monograph-canvas.tsx`: the
  side-panel/sheet with section nav, scrollable content, right quick-ref rail, and a
  search-within-monograph input that filters/jumps to subfields. Accepts a `targetAnchor` prop and
  scrolls+highlights it on open and on follow-up re-point. Register in the gallery (`layout` or
  `content`).

## 4. Handling long sections
The canvas is the natural home for long content: long sections get a **sticky sub-section nav** and
search-within. The chat never says "scroll to dosing" — it deep-links to `dosing.renal_adjustment`
exactly, highlighted, with the rest scrollable around it. The right rail keeps BBW + key facts
visible at any scroll depth.

## 5. Route & registry
Screen `DrugConceptMonographCanvasScreen`; route `src/app/(prototypes)/drug-concept-b/page.tsx`
renders it only. Registry entry per the shared table.

## 6. Acceptance
- `pnpm lint` + `pnpm build` pass; tab bar at top with **B active**, all tabs navigate.
- A query yields a one-line pointer + Open monograph; clicking opens the canvas scrolled+highlighted
  to the matching subfield; section nav and search-within work; a follow-up re-points the canvas
  without reloading it. Right rail keeps BBW visible. Mobile shows a full-screen sheet.
- Facts come from `drug-monograph.ts`; no duplicate components introduced.
