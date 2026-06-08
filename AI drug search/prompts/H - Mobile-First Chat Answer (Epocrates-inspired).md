# Build Prompt — Concept H: Mobile-First Chat Answer (Epocrates-inspired)

> Prereq: build `00 - Shared Prototype Shell & Tab Bar.md` first. Spec:
> `AI drug search/H - Mobile-First Chat Answer (Epocrates-inspired).md` +
> `00 - Index & Shared Architecture.md`. This prompt describes only what is different for Concept H.

## 0. Mandatory first step
Invoke the **`medscape-component-reuse`** skill and inventory the library before coding. Produce a
reuse map. Reuse exactly; new components only for new functionality; register them.

## 1. Goal
The **mobile-first** drug chat reply, designed from the phone up. The reply is a compact message:
drug + **pinned BBW** + a horizontal **field-switcher chip strip** (Dosing / Warnings / Interactions
/ Renal). Tapping a field raises a **bottom sheet** over the thread with the canonical content; the
sheet has its own **sticky sub-field tab strip** (AFib · 2.5 mg criteria · DVT/PE · Renal · Hepatic)
so a long section fits a phone. Swipe down to dismiss → back to the thread. A dedicated
**interaction-checker** chip opens a deterministic check sheet (drug + drug → verbatim interaction).
Large tap targets, one-handed reach, no horizontal content scroll. Deterministic.

## 2. Reuse map (must reuse, do not duplicate)
- **Shell + tab bar at top:** `DrugConceptShell` with `activeConcept="H"`. Render in a phone-width
  frame.
- **Mobile chrome:** reuse `AiMobileTopRail` and `AiResponseChatComposer` (mobile treatment).
- **Field-switcher / interaction chips:** reuse the existing chip component (follow-up/suggested
  action) used in Concept D — do not fork a new chip style.
- **Sheet content:** render `apixabanMonograph` subfields; reuse `AiResponseAnswerContent` for the
  verbatim body inside the sheet.
- **Preparing state:** reuse `AiPreparingAnswerNotice`.
- **Data:** `apixabanMonograph` (subfields + interactions section) + matchedIntent helper to pick
  which field chip + sub-field tab opens first.

## 3. New component (only if not covered)
- `DrugFieldSheet` in `src/components/medscape/drug-concepts/field-sheet.tsx`: the bottom sheet with
  a sticky sub-field tab strip, swipe-to-dismiss, one sub-field rendered at a time (≤1–2 viewports).
  Also a deterministic interaction-checker sheet variant (drug + drug → verbatim interaction record).
  Register in the gallery (`navigation` or `content`). Reuse the shared chip + answer renderers
  inside it.

## 4. Handling long sections (the central problem for H)
The field switcher goes one level deeper so the user picks the sub-task; the bottom sheet renders
**one sub-field at a time** with a sticky tab strip to switch sub-fields without scrolling the whole
block. The Dosing sheet opens on the most likely sub-field (from matchedIntent or default), tabs
across the top for the others — each tab ≤1–2 viewports. **BBW shown eagerly in the reply message
itself**, never buried in a sheet.

## 5. Route & registry
Screen `DrugConceptMobileSheetsScreen`; route `src/app/(prototypes)/drug-concept-h/page.tsx` renders
it only. Registry entry per the shared table.

## 6. Acceptance
- `pnpm lint` + `pnpm build` pass; tab bar at top with **H active**, all tabs navigate.
- On a phone-width frame: reply shows drug + pinned BBW + field-switcher chips; tapping "Renal"
  opens a bottom sheet to renal dosing with a sticky sub-field strip; swipe-down dismisses to the
  thread; interaction-checker chip opens a deterministic two-drug check; one-handed reach, no
  horizontal content scroll.
- Facts come from `drug-monograph.ts`; chips and answer renderers reused, not duplicated.
