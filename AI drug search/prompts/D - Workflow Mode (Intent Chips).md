# Build Prompt — Concept D: Workflow Mode (Intent Chips)

> Prereq: build `00 - Shared Prototype Shell & Tab Bar.md` first. Spec:
> `AI drug search/D - Workflow Mode (Intent Chips).md` + `00 - Index & Shared Architecture.md`.
> This prompt describes only what is different for Concept D.

## 0. Mandatory first step
Invoke the **`medscape-component-reuse`** skill and inventory the library before coding. Produce a
reuse map. Reuse exactly; new components only for new functionality; register them.

## 1. Goal
A bare drug query returns a compact monograph **header + pinned BBW + a horizontal row of task
chips** (AFib dosing · DVT/PE treatment · Renal dosing · Interactions · Perioperative interruption).
Tapping a chip **re-renders the in-thread response reorganized around that task**, promoting only
the relevant subfields to the top with supporting fields below. Not a chatbot — canonical content is
**resequenced, not generated**. The first render is **never a blank "choose intent" gate**: it
always shows a useful default card with chips on top. A contextual query (`apixaban perioperative`)
auto-routes with the matching chip already selected.

## 2. Reuse map (must reuse, do not duplicate)
- **Shell + tab bar at top:** `DrugConceptShell` with `activeConcept="D"`.
- **Chat chrome / composer / preparing:** reuse `AiResponseChatComposer`, `AiMobileTopRail`,
  `AiPreparingAnswerNotice`.
- **Chips:** reuse the existing follow-up/suggested-action chip styling. Check
  `AiResponseAnswerSupportingContent` / `follow-up-questions.tsx` first; reuse that chip component
  for the task-chip row rather than building a new chip.
- **Promoted subfield content:** render with `AiResponseAnswerContent`.
- **Data:** `apixabanMonograph.taskChips` (task → subfieldIds mapping) + matchedIntent helper for
  auto-routing.

## 3. New component (only if not covered)
- `DrugWorkflowCard` in `src/components/medscape/drug-concepts/workflow-card.tsx`: header + BBW +
  task-chip row + a body that re-sequences subfields for the selected task. A chip tap is a new
  "turn" returning a re-shaped view (client-side is fine for the prototype). Register in the gallery
  (`content`). Reuse the shared chip component inside it; do not fork a new chip style.

## 4. Handling long sections
Selecting a task retrieves only that task's subfield set (e.g. Renal dosing →
`dosing.renal_adjustment` + `dosing.dose_reduction` + `safety.renal_risk`), ~1 viewport — never the
full 2+ viewport Dosing block. "Show full dosing" is available but never the default. BBW always
pinned regardless of selected task.

## 5. Route & registry
Screen `DrugConceptWorkflowChipsScreen`; route `src/app/(prototypes)/drug-concept-d/page.tsx`
renders it only. Registry entry per the shared table.

## 6. Acceptance
- `pnpm lint` + `pnpm build` pass; tab bar at top with **D active**, all tabs navigate.
- "apixaban" shows a useful default card + chips (no forced gate); tapping "Renal dosing" reorders
  the answer to the renal task in ~1 viewport; `apixaban perioperative` auto-selects the peri-op
  chip; BBW always pinned; full monograph reachable.
- Facts come from `drug-monograph.ts`; chip styling reused (not duplicated).
