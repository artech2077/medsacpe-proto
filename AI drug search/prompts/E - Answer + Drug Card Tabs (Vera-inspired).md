# Build Prompt — Concept E: Answer + Drug Card Tabs (Vera-inspired) ⭐

> Prereq: build `00 - Shared Prototype Shell & Tab Bar.md` first. Spec:
> `AI drug search/E - Answer + Drug Card Tabs (Vera-inspired).md` + `00 - Index & Shared Architecture.md`.
> This prompt describes only what is different for Concept E.

## 0. Mandatory first step
Invoke the **`medscape-component-reuse`** skill and inventory the library before coding. Produce a
reuse map. Reuse exactly; new components only for new functionality; register them.

## 1. Goal
Each assistant reply carries **top-of-message tabs: Answer · Drug Information · References** (plus
**Steps** when present). The **Answer** tab is a concise AI-synthesized response (≤4 sentences) to
the exact query with **inline numbered citation chips** `[1] [2]`. **Drug Information** shows the
structured monograph card with sub-tabs (Overview / Dosing / Safety / Clinical / References) and the
**BBW pinned at top**. **References** lists the cited sources. Tapping a citation chip jumps to the
exact subfield in Drug Information (or the References list). This is the highest-synthesis concept —
the canonical card is always one tab away.

## 2. Reuse map (must reuse, do not duplicate)
- **Shell + tab bar at top:** `DrugConceptShell` with `activeConcept="E"`. (Note: these are the
  *message-level* Answer/Drug Info/References tabs — distinct from the concept tab bar at the very
  top.)
- **Chat chrome / composer / preparing:** reuse `AiResponseChatComposer`, `AiMobileTopRail`,
  `AiPreparingAnswerNotice`.
- **Answer text + citations:** render the synthesized answer with `AiResponseAnswerContent`; reuse
  `AiResponseKeyPoints` if the answer leads with key points; reuse `AiResponseAnswerActions` for the
  helpful/copy footer.
- **References tab:** reuse `references.tsx` / `reference-card.tsx` and the `AiAnswerReference` shape.
- **Drug Information card:** render `apixabanMonograph` sections as the sub-tabbed card; reuse
  `DrugAiTablesArticle` styling if it matches the canonical card treatment.
- **Data:** the example `DrugSynthesizedAnswer` (text + citations→anchors) and `sections` from
  `src/data/drug-monograph.ts`.

## 3. New component (only if not covered)
- `DrugAnswerTabs` in `src/components/medscape/drug-concepts/answer-tabs.tsx`: the message-level tab
  switcher (Answer / Drug Information / References / optional Steps) + citation-chip → subfield
  jump wiring. The Drug Information tab uses a **sticky sub-field tab strip** inside the Dosing
  sub-tab (AFib · 2.5 mg criteria · DVT/PE · Renal · Hepatic). Register in the gallery (`navigation`
  or `content`). Reuse existing answer/reference renderers inside it — do not re-implement them.

## 4. Handling long sections
The **Answer tab is the long-section solution for the asked question**: a synthesized ≤4-sentence,
cited answer instead of a 2+ viewport block. The Drug Information → Dosing sub-tab still holds the
long canonical content, navigable via a sticky sub-field strip. Citation chips deep-link to the
exact subfield (~1 viewport). BBW pinned above the sub-tabs, always eager.

## 5. Route & registry
Screen `DrugConceptAnswerTabsScreen`; route `src/app/(prototypes)/drug-concept-e/page.tsx` renders it
only. Registry entry per the shared table.

## 6. Acceptance
- `pnpm lint` + `pnpm build` pass; concept tab bar at top with **E active**, all tabs navigate.
- A specific query (`apixaban renal dose at GFR 35`) opens on the Answer tab with a short cited
  answer; citation chips jump to the matching subfield in Drug Information; References tab lists
  sources; BBW pinned in the card; Dosing sub-tab strip tames the long section.
- Facts/citations come from `drug-monograph.ts`; existing renderers reused, none duplicated.
