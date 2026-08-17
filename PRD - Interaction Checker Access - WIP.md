# PRD — Interaction Checker Access (Phase 1)

**Status:** WIP v0.1 · **Date:** 2026-08-13 · **Owner:** Farouk Bousaaid (PM) · **Feature status:** Pending lock
**Google Doc:** [PRD — Interaction Checker Access (Phase 1)](https://docs.google.com/document/d/1ctqDBeTzPKE2bIsNLBxtnI1k8WfLtGsAN8mDz7Mag_Y)

---

## 1. Problem Statement

When a clinician reviews the Interactions accordion in a drug monograph, they can see interaction information but do not have a direct way to open the Medscape Interaction Checker from that context. This creates an unnecessary break between reviewing a drug and checking a medication combination.

Phase 1 adds one clear access point: selecting **Check interactions** in the Interactions accordion opens the existing Medscape Interaction Checker in a sidebar, with the current monograph drug already added to the checker, while keeping the monograph available in the background.

## 2. Goals

1. Give clinicians a clear, in-context path from the Interactions accordion to the Interaction Checker.
2. Start the checker with the current monograph drug already included.
3. Preserve the established V2 Interaction Checker experience once it is open.

## 3. Non-Goals / Out of Scope

- No change to the Interaction Checker's medication search, results, clinical content, or classifications beyond adding the current monograph drug when the checker opens.
- No change to the interaction details already displayed in the monograph.
- No new or changed access point outside the **Check interactions** action in the Interactions accordion.
- No redesign of the monograph or the existing Interaction Checker.

## 4. User Stories

- As a **clinician reviewing a drug monograph**, I want to select **Check interactions** from the Interactions accordion, so I can check a medication combination without leaving the monograph.
- As a **clinician opening the checker**, I want the current monograph drug to be added automatically, so I can begin the interaction check with the drug I am already reviewing.
- As a **clinician using the checker**, I want the monograph to remain in place behind the sidebar, so I can return to the same review context when I close it.
- As a **keyboard or screen-reader user**, I want the action and sidebar controls to be clearly labeled and operable, so I can access and dismiss the checker independently.
- As a **clinician when the checker is unavailable**, I want to remain able to read the monograph, so an unavailable checker does not block my normal review.

## 5. Requirements

### Must-Have (P0)

**R1 — Access from the Interactions accordion**

- [ ] The Interactions accordion displays a clearly labeled **Check interactions** action.
- [ ] Selecting **Check interactions** opens the existing Medscape Interaction Checker in a sidebar beside the current monograph.
- [ ] The action can be reached and activated with a keyboard and has an accessible name that communicates its purpose.

**R2 — In-context sidebar experience**

- [ ] When the sidebar opens, the drug displayed in the current monograph is already added to the Interaction Checker's selected medication list.
- [ ] The pre-added current monograph drug remains available to the clinician as a selected medication and can be removed using the checker's existing medication controls.
- [ ] The clinician can use the established V2 Interaction Checker experience, including adding medications and reviewing the checker's available results and messages.
- [ ] The current monograph remains visible but inactive behind the open sidebar, and its scroll position is preserved.
- [ ] The sidebar has a clearly labeled close control. Closing it returns the clinician to the same Interactions accordion context and returns keyboard focus to **Check interactions**.
- [ ] On supported narrow viewports, the checker remains usable and can be closed without preventing access to the monograph.

**R3 — Safe availability states**

- [ ] While the checker is opening or loading, the sidebar provides an understandable in-progress state. The clinician can dismiss the sidebar and return to the unchanged monograph.
- [ ] If the checker cannot be loaded, the sidebar displays its standard unavailable state and can be dismissed so the clinician can continue using the monograph.
- [ ] This integration does not change the existing checker behavior for empty medication lists, no interactions found, or interaction results.

### Nice-to-Have (P1)

- No P1 requirements are included in this Phase 1 scope.

### Future Considerations (P2)

- No P2 requirements are included in this document.

## 6. Success Metrics

**Leading release-quality measures:** Verify, before release, that the action opens the sidebar; the sidebar can be closed; the original monograph context is retained; and the path works with keyboard navigation and supported viewport sizes.

**Lagging user outcomes:** Measure use of **Check interactions** and successful openings of the checker from the Interactions accordion. PM must approve the baseline, target, measurement period, and definition of a successful opening before launch measurement is evaluated.

## 7. Open Questions

| # | Question / decision needed | Owner | Blocking? |
| --- | --- | --- | --- |
| 1 | Confirm the approved narrow-viewport presentation for the sidebar and provide the final design reference. This is needed to complete visual acceptance for supported narrow viewports. | PM / Design | Yes — before final acceptance |

## 8. Definition of Done

Phase 1 is complete when all of the following are true:

- **Check interactions** is available from the Interactions accordion and opens the existing Interaction Checker in a sidebar.
- The current monograph drug is already added to the Interaction Checker when the sidebar opens.
- The open and close path preserves the clinician's monograph context, including the Interactions accordion context and scroll position.
- The action and sidebar are operable with a keyboard and understandable with assistive technology.
- The established checker experience is available without changing its medication-entry or results behavior.
- Loading and unavailable states allow the sidebar to be dismissed so the clinician can continue using the monograph.
- The approved narrow-viewport presentation is validated, and the release-quality and user-outcome measurements are ready to be assessed.

## 9. Timeline

No production date is committed while the feature remains Pending lock.

Recommended sequence: (1) confirm the narrow-viewport presentation; (2) approve the final design reference; (3) add and validate the Interactions accordion access path; (4) verify the open, close, availability, keyboard, and supported-viewport states; (5) confirm measurement readiness.
