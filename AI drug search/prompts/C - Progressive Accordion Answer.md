# Build Prompt — Concept C: Progressive Accordion Answer

> Prereq: build `00 - Shared Prototype Shell & Tab Bar.md` first. Spec:
> `AI drug search/C - Progressive Accordion Answer.md` + `00 - Index & Shared Architecture.md`.
> This prompt describes only what is different for Concept C.

## 0. Mandatory first step
Invoke the **`medscape-component-reuse`** skill and inventory the library before coding. Produce a
reuse map. Reuse exactly; new components only for new functionality; register them.

## 1. Goal
The reply is a **single chat message that is a nested accordion**: top-level section rows (Dosing,
Safety, Interactions, Renal/Hepatic, Adverse effects) collapsed to a one-line `summary`, expanding
to **subfield rows**, expanding to the **verbatim `body`**. A **sticky jump bar** of chips
(Dosing / Safety / Interactions / Renal) sits at the top of the message and scrolls to a section.
Deterministic. Context-aware: a renal query auto-expands Dosing → Renal impairment on first render.

## 2. Reuse map (must reuse, do not duplicate)
- **Shell + tab bar at top:** `DrugConceptShell` with `activeConcept="C"`.
- **Chat chrome / composer / preparing:** reuse `AiResponseChatComposer`, `AiMobileTopRail`,
  `AiPreparingAnswerNotice`.
- **Body typography:** render verbatim subfield `body` via `AiResponseAnswerContent` so deep text
  matches existing answer styling.
- **Source labels:** reuse `AiAnswerReference` shape per subfield.
- **Data:** `apixabanMonograph` sections/subfields + matchedIntent helper for auto-expand.

## 3. New component (only if not covered)
- `DrugMonographAccordion` in `src/components/medscape/drug-concepts/monograph-accordion.tsx`:
  two-level accordion (section → subfield → body) + a sticky jump bar. Accordion state is
  client-side; `matchedIntent` marks one node `defaultExpanded`. Register in the gallery (`content`).

## 4. Handling long sections
The accordion *is* the long-section solution: a long Dosing section is never one scroll — it
decomposes into individually expandable subfield rows, so the user reads ~1 viewport. The sticky
jump bar prevents losing place. **Eager-render rule:** BBW and contraindication rows are expanded by
default and pinned; only non-critical bodies start collapsed.

## 5. Route & registry
Screen `DrugConceptAccordionScreen`; route `src/app/(prototypes)/drug-concept-c/page.tsx` renders it
only. Registry entry per the shared table.

## 6. Acceptance
- `pnpm lint` + `pnpm build` pass; tab bar at top with **C active**, all tabs navigate.
- Reply is one compact message; all sections fit ~one screen collapsed; ≤2 taps reach a body; jump
  bar scrolls to a section; renal query auto-expands the renal subfield; BBW always visible.
- Facts come from `drug-monograph.ts`; no duplicate components introduced.
