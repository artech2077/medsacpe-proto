# [BE + FE] Deliver contextual embedded Medscape calculators from the drug monograph payload

**Status:** Draft — tracker ID not assigned · **Feature status:** Pending lock  
**Parent PRD:** [PRD — Contextual Medscape Calculators in Drug Monograph (Phase 1)](./PRD%20-%20Contextual%20Medscape%20Calculators%20in%20Drug%20Monograph%20-%20WIP.md)

## Outcome

When a drug monograph content item has an existing Medscape calculator association, show a contextual calculator trigger beside that item. Selecting it opens the calculator in the shared Answer Engine action container: a sidebar on desktop and a bottom sheet on mobile. The user does not navigate away from the monograph. The backend and frontend must use one structured monograph payload contract; the frontend must not infer or hard-code calculator mappings.

## User story

As a clinician reading a drug monograph, I want to open a related Medscape calculator from the relevant content in the familiar Answer Engine sidebar or bottom sheet, so I can complete the calculation without leaving my monograph review.

## Scope

This is one end-to-end ticket. The assigned developer owns the backend payload work, frontend integration, shared contract, tests, and end-to-end verification.

## Acceptance criteria

1. **Eligible content:** Given a monograph payload item with one approved calculator, the related content displays one labeled calculator trigger. Selecting it opens the identified existing calculator in the desktop sidebar or mobile bottom sheet, as appropriate.
2. **No association:** Given a payload item without calculator data, the content renders normally and no calculator trigger appears.
3. **Invalid association:** Given an invalid or unapproved calculator destination, the backend omits the calculator action and the frontend renders the monograph content without a broken trigger.
4. **Multiple associations:** Given multiple approved calculators on one item, every calculator is available in payload order through the approved interaction pattern.
5. **No navigation:** Opening and using the calculator does not change the route or open a browser tab. Closing returns the user to the same monograph position and restores focus to the trigger.
6. **Failure:** If the embed fails or times out, the action container remains dismissible, shows an unavailable state with retry, and leaves the monograph usable.
7. **Accessibility:** The trigger, action container, embedded title, close action, Escape behavior, focus containment, and focus return pass keyboard and screen-reader validation.
8. **Security:** A URL outside the approved Medscape calculator allowlist cannot be embedded.
9. **Privacy:** Analytics contain no calculator answers or patient-entered values.
10. **End to end:** At least one real embed-approved calculator stored in monograph data is returned by the backend and successfully used in the frontend action container.

### Backend changes

- [ ] Confirm the production monograph source field that contains calculator associations.
- [ ] Define an optional, backward-compatible calculator object on the exact monograph content item where the trigger belongs.
- [ ] Include at least the stable calculator ID, user-facing title, and approved embed URL or route.
- [ ] Preserve multiple calculator associations and their source-defined order.
- [ ] Return no calculator action when the source content has no valid association.
- [ ] Validate destinations against the approved Medscape calculator allowlist. Omit invalid or unapproved calculator metadata while returning the monograph content normally.
- [ ] Document the payload contract and add contract tests for one calculator, no calculator, multiple calculators, and an invalid destination.

Example semantic contract; final names must match production API conventions:

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

### Frontend changes

- [ ] Render the calculator icon only from a valid calculator association on the corresponding payload item.
- [ ] Preserve the clinical text exactly as delivered; do not use a text token, dose parser, drug map, or hard-coded calculator URL to create the trigger.
- [ ] Give the calculator icon an accessible label that identifies the calculator and action, for example, **Open Creatinine Clearance Calculator**.
- [ ] Open the payload-selected existing Medscape calculator inside the shared Answer Engine action container without changing the page route or opening a new tab.
- [ ] Use the existing Answer Engine behavior: sidebar on desktop and bottom sheet on mobile. The calculator content is the only feature-specific part of the container.
- [ ] Display the payload title in the container and give the embedded calculator a meaningful accessible title.
- [ ] Preserve the monograph scroll position and expanded state while the container is open and after it closes.
- [ ] Support close control, Escape, focus containment, and focus return to the originating trigger.
- [ ] Show a dismissible loading state in the container while the embed loads.
- [ ] On load failure, timeout, or unavailable calculator, keep the monograph unchanged and show an unavailable message with retry in the container. Do not redirect automatically.
- [ ] Ignore stale embed results if the user opens another calculator before the previous one finishes loading.
- [ ] Do not render a broken trigger for missing, empty, malformed, or unsupported calculator data.
- [ ] Use the existing responsive action-container behavior without introducing navigation away from the monograph.

## Dependencies and decisions required

- Eng approval of the final payload shape and backward-compatibility approach.
- Eng verification of embed-approved calculator origins and required security settings.
- Eng / PM approval of load-time and measurement targets.

## Definition of done

The backend delivers validated calculator associations in the monograph payload; the frontend renders and opens the correct existing Medscape calculator in the shared Answer Engine action container—desktop sidebar or mobile bottom sheet—without leaving the monograph; safe empty, invalid, loading, failure, and stale states work; accessibility, security, privacy, responsive, contract, component, and end-to-end tests pass; and every blocking decision in the parent PRD is approved.
