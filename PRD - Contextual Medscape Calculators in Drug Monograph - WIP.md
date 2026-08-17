# PRD — Contextual Medscape Calculators in Drug Monograph (Phase 1)

**Status:** WIP v0.2 · **Date:** 2026-08-17 · **Owner:** Farouk Bousaaid (PM) · **Feature status:** Pending lock  
**Google Doc:** [PRD — Contextual Medscape Calculators in Drug Monograph (Phase 1)](https://docs.google.com/document/d/1Ndmw_lpHXKZmvhZPu0v2aHTBg1rdoZ6Fk7vnxx2Zfmo/edit)  
**Prototype overview:** [AI Drug Monograph V2 — What’s New](https://docs.google.com/document/d/1vK5mc3H3IePSA-LrHDUarEfeUIkm1jfB2Hbdmcwt7fM)  
**Implementation ticket draft:** [BE + FE — Deliver contextual embedded Medscape calculators from the drug monograph payload](./Ticket%20-%20Contextual%20Medscape%20Calculators%20-%20Draft.md)

---

## 1. Problem Statement

Medscape already has clinical calculators, but a clinician reading a drug monograph must leave the monograph experience to find and use them. This breaks the user's review flow, hides the source context, and makes relevant calculators harder to discover.

Phase 1 places calculator access beside the exact monograph content to which it applies. The calculator association comes from the drug monograph data and is included in the backend payload. When the user selects the calculator icon, the existing Medscape calculator opens in the same responsive action container used elsewhere in the Answer Engine: a sidebar on desktop and a bottom sheet on mobile. The current monograph remains in place behind the container, so the user does not need to navigate to another page or use a separately implemented calculator.

## 2. Goals

1. Help clinicians discover an existing Medscape calculator at the point where the related monograph content appears.
2. Let clinicians use the calculator without leaving the drug monograph experience.
3. Make the monograph payload the source of truth for which calculator appears and where it appears.
4. Reuse the existing Medscape calculator and its clinical logic rather than rebuilding that logic in the monograph frontend.

## 3. Non-Goals / Out of Scope

- No creation of new clinical calculators or duplication of existing calculator logic in the drug monograph frontend.
- No frontend inference based on drug names, dose text, text markers, or hard-coded calculator mappings.
- No calculator trigger when the monograph payload does not contain a valid calculator association for that content item.
- No automatic transfer of patient data or monograph values into the calculator in Phase 1.
- No default navigation to a new page or browser tab when the user selects the calculator trigger.
- No change to the clinical formulas, questions, results, disclaimers, or ownership of the existing Medscape calculators.
- No new calculator entry point outside the drug monograph in Phase 1.

## 4. User Stories

- As a **clinician reading a drug monograph**, I want to see a calculator icon beside content that has a related Medscape calculator, so I can discover the tool in context.
- As a **clinician using a contextual calculator**, I want it to open in the familiar Answer Engine action container, so I can use the existing calculator without leaving the monograph on desktop or mobile.
- As a **clinician closing the calculator**, I want to return to the same monograph location, so I can continue my review without finding the section again.
- As a **clinician viewing monograph content without a related calculator**, I want the content to render normally without an empty or misleading action.
- As a **clinician when the calculator cannot load**, I want the monograph to remain available and the action container to explain the problem, so the failed tool does not block drug-reference access.
- As a **keyboard or screen-reader user**, I want the calculator trigger and action container to be labeled and operable, so I can open, use, and close the calculator independently.

## 5. Requirements

### Must-Have (P0)

**R1 — Calculator association in drug monograph data**

- [ ] The monograph content source identifies every calculator association at the exact monograph content item where the calculator trigger belongs.
- [ ] Each association provides, at minimum, a stable calculator identifier, the calculator's user-facing title, and an approved embeddable Medscape URL or route.
- [ ] The association is structured data. Calculator identity must not be encoded only as a token inside the displayed clinical text.
- [ ] If more than one calculator is associated with one content item, the payload preserves the source-defined order.
- [ ] When no calculator is associated with a content item, the data contains no calculator action for that item.

**R2 — Backend monograph payload**

- [ ] The backend includes the structured calculator association in the drug monograph payload at the content item to which it applies.
- [ ] The payload preserves the calculator identifier, title, approved embed destination, and placement relationship supplied by the monograph data.
- [ ] The calculator field is optional and backward compatible: monograph content without calculator data continues to be returned and rendered normally.
- [ ] The backend does not create calculator associations by parsing dose text or applying a frontend-specific drug-to-calculator map.
- [ ] The backend validates calculator destinations against the approved Medscape calculator source before returning them to the frontend. Invalid or unapproved destinations are omitted from the user-facing payload without removing the underlying monograph content.
- [ ] The API contract documents the calculator object and includes contract coverage for one associated calculator, no calculator, multiple calculators, and an invalid calculator destination.

The exact field names must follow the production monograph API conventions. The semantic shape can be:

```json
{
  "monographContentItem": {
    "text": "Dose or clinical statement from the monograph",
    "calculators": [
      {
        "id": "stable-calculator-id",
        "title": "User-facing Medscape calculator title",
        "embedUrl": "approved Medscape embed destination"
      }
    ]
  }
}
```

This example defines the information and relationship required by the product. Engineering must align the final property names and nesting with the existing API schema before implementation.

**R3 — Contextual frontend trigger**

- [ ] The frontend renders a calculator icon only when the corresponding monograph content item contains a valid calculator association in the payload.
- [ ] The icon appears with the associated content item and does not alter, replace, or split the clinical wording received from the monograph.
- [ ] The calculator icon must have an accessible label that identifies the calculator and the action, for example, “Open Creatinine Clearance Calculator.”
- [ ] If a payload contains multiple calculators for one content item, the frontend presents every association in the payload order using the approved interaction pattern.
- [ ] Missing, empty, malformed, or unsupported calculator data does not display a broken trigger; the monograph content continues to render normally.

**R4 — Embedded Medscape calculator container**

- [ ] Selecting the calculator trigger opens the associated existing Medscape calculator inside the shared Answer Engine action container without changing the current page route or opening a new tab.
- [ ] The container follows the existing Answer Engine user-action behavior: it is a sidebar on desktop and a bottom sheet on mobile. The calculator content is the only feature-specific part of the container.
- [ ] The frontend loads the calculator identified by the payload. It does not select a calculator using hard-coded drug, section, or text mappings.
- [ ] The container displays the calculator title from the payload and embeds the existing calculator experience, including its questions, validation, results, and clinical disclaimers.
- [ ] The monograph remains in place behind the open container, and its expanded sections and scroll position are preserved.
- [ ] The container has a clearly labeled close control. Escape closes it, and closing returns keyboard focus to the calculator trigger without changing the monograph position.
- [ ] Focus remains inside the open container for keyboard users until it is closed.
- [ ] The embedded calculator has a meaningful accessible title, and the container does not create duplicate or conflicting page landmarks.
- [ ] The calculator remains usable in every supported viewport while preserving the same no-navigation behavior.

**R5 — Loading, failure, and security behavior**

- [ ] While the calculator is loading, the action container displays an understandable loading state and remains dismissible.
- [ ] If the calculator fails to load, times out, or is unavailable, the action container displays an unavailable message and retry action. The user remains on the unchanged monograph and is not redirected automatically.
- [ ] A stale calculator response from a previously opened trigger is not shown after the user opens a different calculator.
- [ ] Only approved Medscape calculator origins and embed destinations can be loaded. Calculator URLs received from the payload are not inserted as unrestricted third-party content.
- [ ] The embed uses the production security settings required for existing Medscape calculators, including the approved content-security, frame, cookie, and sandbox behavior.

**R6 — Measurement and quality coverage**

- [ ] The integration can measure calculator trigger impressions, open attempts, successful loads, load failures, retries, and closes without recording calculator answers or patient-entered values.
- [ ] Backend tests verify the payload contract and safe omission behavior.
- [ ] Frontend tests verify trigger eligibility, payload-driven calculator selection, open and close behavior, focus return, loading, failure, and monograph-state preservation.
- [ ] End-to-end validation uses at least one real embed-approved Medscape calculator association from monograph data.

### Nice-to-Have (P1)

- Provide a user-initiated **Open calculator page** fallback only when the embedded experience is unavailable and PM approves leaving the monograph as an explicit recovery action.
- Preserve in-progress calculator answers if the action container is accidentally closed and reopened during the same monograph session, subject to the calculator's privacy and state-management rules.

### Future Considerations (P2)

- Prefill calculator inputs from user-confirmed context or structured monograph values.
- Add contextual calculator entry points outside the drug monograph.
- Rank or personalize multiple relevant calculators.
- Support non-calculator Medscape tools through the same structured monograph-tool contract.

## 6. Success Metrics

**Leading release-quality measures:** Before release, verify that eligible monograph items receive the correct structured calculator association; ineligible items do not show a trigger; approved calculators load in the shared action container; failed embeds leave the monograph usable; and keyboard, screen-reader, security, and supported-viewport checks pass. Eng and PM must approve the load-time threshold and test coverage target before final acceptance.

**Lagging user outcomes:** Measure contextual calculator open rate, successful embedded-load rate, calculator completion rate where the existing calculator can report completion, and the share of calculator use that occurs without leaving the monograph. PM must approve baselines, targets, and the measurement period before launch results are evaluated.

## 7. Open Questions

| # | Question / decision needed | Owner | Blocking? |
| --- | --- | --- | --- |
| 1 | Which existing Medscape calculators are approved and technically able to run embedded, and which exact origin, frame, cookie, content-security, and sandbox settings do they require? Eng must provide the verified allowlist and embed constraints. | Eng | Yes — before the backend allowlist and frontend embed approach are finalized |
| 2 | What are the final production payload field names and nesting for the calculator association, and how will older clients ignore the optional field? Eng must approve the contract against the current monograph API. | Eng | Yes — before backend and frontend implementation begin |
| 3 | What load-time threshold, measurement definitions, and launch targets will Phase 1 use? Eng / PM must provide and approve the values. | Eng / PM | No — build can proceed, but measurement acceptance cannot close |

## 8. Definition of Done

Phase 1 is complete when all of the following are true:

- Approved calculator associations are stored with the correct monograph content items and are delivered as structured, optional payload data.
- The backend validates calculator destinations, preserves the source relationship and order, remains backward compatible, and passes the required contract tests.
- The frontend renders calculator triggers only from valid payload data and opens the correct existing Medscape calculator in the shared Answer Engine action container without route or tab navigation.
- The container uses the existing desktop-sidebar and mobile-bottom-sheet behavior; only its calculator content is feature-specific.
- Closing the container preserves the monograph's content, expanded state, scroll position, and trigger focus.
- Loading, timeout, unavailable, retry, stale-response, and invalid-payload cases leave the monograph usable and never load an unapproved destination.
- Keyboard, screen-reader, supported-viewport, security, and end-to-end checks pass using an approved real calculator embed.
- Measurement is implemented without capturing calculator answers or patient-entered values.
- The calculator allowlist, payload contract, and content-mapping ownership decisions in the blocking open questions are approved.

## 9. Timeline

No production date is committed while the feature remains Pending lock.

Recommended sequence: (1) verify which existing calculators can be embedded and approve the source mappings; (2) approve the payload contract; (3) implement backend payload delivery and validation; (4) implement the payload-driven trigger and embedded calculator container; (5) complete contract, frontend, end-to-end, accessibility, security, performance, measurement, rollout, and rollback checks.
