# PRD — AI Answer After Drug Monograph Widget (Phase 1)

**Status:** WIP v0.1 · **Date:** 2026-08-17 · **Owner:** Farouk Bousaaid (PM) · **Feature status:** Pending lock  
**Prototype:** [Concept J — Canonical Card + AI Answer](/drug-concept-j)  
**Implementation ticket draft:** [BE + FE — Deliver the grounded AI answer after the drug monograph widget](./Ticket%20-%20AI%20Answer%20After%20Drug%20Monograph%20Widget%20-%20Draft.md)

---

## 1. Problem Statement

Clinicians need an answer to their drug question, but an AI response can take longer to generate than the canonical drug information is available. Making the clinician wait for the AI answer delays access to trusted monograph content; showing an uncited answer before the monograph makes it harder to verify the response.

Phase 1 shows the relevant drug monograph widget immediately, then places a clearly labeled AI-generated answer directly after it. The AI answer is grounded in the monograph content delivered for that same question and links each citation back to its source. If the answer is still generating, unsupported, or unavailable, the monograph remains available and useful.

## 2. Goals

1. Give clinicians immediate access to the relevant canonical monograph before the AI answer is ready.
2. Provide a concise, clearly labeled AI synthesis directly after the monograph widget.
3. Let clinicians verify the AI synthesis against the exact monograph content and references used to support it.
4. Keep the drug-reference experience useful when the AI answer is delayed, unavailable, or cannot be grounded in the available monograph content.

## 3. Non-Goals / Out of Scope

- No replacement of the canonical monograph widget with AI-generated content.
- No AI answer shown before the monograph widget in Phase 1.
- No answer grounded in sources that are not approved for the current monograph response.
- No presentation of an uncited clinical assertion as if it came from the monograph.
- No redesign of the existing monograph widget, answer actions, reference cards, or chat composer.
- No automatic use of patient data, clinical notes, or other sensitive context to generate or personalize an answer.
- No related-article ranking or new editorial recommendation logic in Phase 1.

## 4. User Stories

- As a **clinician who asks a drug question**, I want to see the relevant monograph immediately, so I can start reviewing trusted information while the AI answer is prepared.
- As a **clinician reading the response**, I want the AI answer to appear directly after the monograph and be clearly labeled, so I understand it is a synthesis rather than canonical monograph text.
- As a **clinician verifying an AI answer**, I want to open its citations and return to the related monograph content, so I can assess the supporting source myself.
- As a **clinician when the answer is delayed or unavailable**, I want to keep using the monograph, so the AI response never blocks drug-reference access.
- As a **clinician asking a follow-up question**, I want it to create a new response with its own monograph and answer, so earlier answers and their sources remain unchanged.
- As a **keyboard or screen-reader user**, I want the loading state, answer, citations, references, and follow-up actions to be announced and operable, so I can use the full response independently.

## 5. Requirements

### Must-Have (P0)

**R1 — Monograph-first response order**

- [ ] For an eligible drug question, the frontend renders the question and the relevant canonical monograph widget as soon as the monograph response is available.
- [ ] The AI answer appears only after that monograph widget in the same response turn, on desktop and mobile.
- [ ] The monograph widget remains readable and interactive while the AI answer is generating, complete, unavailable, or unsupported.
- [ ] The responsive layout preserves this order on narrow viewports; it does not move the AI answer above the monograph.
- [ ] A new question creates a new response turn with its own monograph and AI-answer state. It does not replace the content or citations of an earlier completed turn.

**R2 — Grounded AI-answer payload and lifecycle**

- [ ] The backend associates each AI-answer request and response with the same response turn and monograph version delivered to the frontend.
- [ ] The backend provides a distinct AI-answer lifecycle state: pending or streaming, complete, unavailable, or unsupported because the available monograph content cannot support an answer.
- [ ] The completed answer payload contains the answer content and structured citations that identify the supporting monograph content item or approved reference for that same response turn.
- [ ] The backend does not return an answer as complete unless its citations resolve to valid, approved source content for that turn.
- [ ] If the answer cannot be grounded, times out, or fails, the backend returns a safe non-answer state without removing, delaying, or altering the monograph payload.
- [ ] The answer and monograph payload contract is backward compatible: a client can render the monograph normally when no AI-answer object is present.

The exact field names must follow the production response API conventions. The required semantic shape is:

```json
{
  "responseTurn": {
    "id": "response-turn-id",
    "monograph": {
      "version": "monograph-version",
      "contentItems": []
    },
    "aiAnswer": {
      "status": "pending | streaming | complete | unavailable | unsupported",
      "content": "AI-generated answer when complete",
      "citations": [
        {
          "id": "citation-id",
          "monographContentItemId": "supporting-content-item-id"
        }
      ],
      "followUpQuestions": []
    }
  }
}
```

This example defines the required relationship between the response turn, monograph, answer state, and citations. Engineering must align the final property names and transport with the existing response API.

**R3 — Answer presentation and source verification**

- [ ] While the answer is pending or streaming, the area directly after the monograph shows a clear in-progress state that explains the answer is being generated from the canonical source above.
- [ ] When complete, the answer is visibly labeled as AI-generated and visually distinct from the canonical monograph content.
- [ ] The frontend renders the answer content and structured citation markers from the payload without inferring citations from answer text or drug-name mappings.
- [ ] Selecting a citation opens the associated reference treatment and gives the clinician a path to the exact related monograph content.
- [ ] The response provides a references entry point that shows the source details represented by the answer citations.
- [ ] Missing, malformed, duplicate, or unresolved citation data does not render a broken citation action. The answer must show the approved safe fallback for unsupported citation content or the backend must return a non-answer state.
- [ ] Existing answer actions are reused without changing their established behavior.

**R4 — Follow-up, loading, and failure behavior**

- [ ] When the completed answer includes eligible follow-up questions, the newest response turn displays them after its references. Selecting one submits it as a new question.
- [ ] Earlier response turns retain their completed answer and references but do not invite branching through follow-up actions.
- [ ] If the AI answer is delayed, the loading state remains associated with the correct monograph and response turn; a late result for an older or superseded turn is not displayed in a newer turn.
- [ ] If the AI answer is unavailable or unsupported, the area after the monograph explains that an AI answer cannot be provided from the available source and keeps the monograph usable. Any retry action follows the approved product behavior.
- [ ] If the clinician submits another question while an answer is pending, the frontend preserves the prior turn's canonical monograph and does not show its result in the new turn.

**R5 — Accessibility, privacy, measurement, and quality coverage**

- [ ] The loading-to-complete change is announced without repeatedly interrupting screen-reader users while content streams.
- [ ] The answer has a programmatic label that identifies it as AI-generated; citation, references, and follow-up controls have clear accessible names and can be used with a keyboard.
- [ ] Analytics can measure monograph-ready, AI-answer-started, AI-answer-completed, unavailable or unsupported, citation-opened, references-opened, and follow-up-selected events without recording patient identifiers, patient-entered values, or answer text.
- [ ] Backend tests cover response-turn correlation, monograph version matching, answer states, citation validation, safe non-answer responses, and optional-field compatibility.
- [ ] Frontend tests cover monograph-first order, loading, completed, unavailable, unsupported, stale-result, citation, references, follow-up, keyboard, and narrow-viewport states.
- [ ] End-to-end validation uses an approved monograph question and proves that each displayed citation resolves to the related monograph content in the same response turn.

### Nice-to-Have (P1)

- Show approved related articles after the answer footer when they are supplied in the response payload.
- Allow a clinician to request a retry after an unavailable or timed-out AI answer without resubmitting the question.

### Future Considerations (P2)

- Include additional approved clinical sources beyond the drug monograph in a grounded answer.
- Personalize answers using clinician-confirmed patient context.
- Let clinicians choose the preferred answer-first or monograph-first response order.
- Provide answer-history, comparison, or export features.

## 6. Success Metrics

**Leading release-quality measures:** Before release, verify that eligible turns show the monograph before the answer; the monograph remains usable in every AI-answer state; completed answers carry resolvable citations; unavailable and unsupported states preserve the monograph; and keyboard, screen-reader, supported-viewport, privacy, and end-to-end checks pass. Eng and PM must approve answer-latency and test-coverage targets before final acceptance.

**Lagging user outcomes:** Measure time to monograph availability, AI-answer completion rate, citation-open rate, reference-open rate, follow-up selection rate, and the share of eligible turns in which clinicians can continue reviewing the monograph while waiting. PM must approve the baselines, targets, measurement period, and definition of an eligible turn before launch results are evaluated.

## 7. Open Questions

| # | Question / decision needed | Owner | Blocking? |
| --- | --- | --- |
| 1 | Which answer-generation transport, cancellation behavior, and maximum wait time will Phase 1 use? Eng / PM must define the delivery approach and the exact user-visible state at the limit. | Eng / PM | Yes — before the backend and frontend lifecycle approach is finalized |
| 2 | Which monograph content is eligible to support an AI answer, and what is the approved clinician-facing copy when the available content is insufficient? PM / Editorial must define the eligibility and fallback copy. | PM / Editorial | Yes — before answer content is published |
| 3 | What citation granularity is required for Phase 1—per assertion, paragraph, or answer section—and which source detail must appear in the reference treatment? PM / Editorial / Eng must approve the policy. | PM / Editorial / Eng | Yes — before final acceptance and quality validation |
| 4 | What answer-latency, completion-rate, and citation-engagement targets will determine launch success? Eng / PM must provide and approve the values. | Eng / PM | No — build can proceed, but measurement acceptance cannot close |

## 8. Definition of Done

Phase 1 is complete when all of the following are true:

- Eligible response turns show the canonical monograph widget before the associated AI-answer area on desktop and mobile.
- The backend returns a correlated, backward-compatible monograph and AI-answer contract with validated citations and safe pending, complete, unavailable, and unsupported states.
- The frontend renders the answer only after the monograph, clearly identifies it as AI-generated, and renders citations, references, and eligible follow-ups from payload data.
- A citation reaches the supporting source in the same response turn, and a malformed or unresolved citation cannot create a broken action.
- Delayed, failed, unsupported, and stale answer responses leave the monograph intact and usable.
- New turns do not mutate earlier completed monographs, answers, or citations.
- Accessibility, privacy, analytics, backend contract, frontend component, narrow-viewport, and end-to-end checks pass.
- The answer delivery approach, content eligibility and fallback copy, and citation policy in the blocking open questions are approved.

## 9. Timeline

No production date is committed while the feature remains Pending lock.

Recommended sequence: (1) approve answer eligibility, fallback copy, citation policy, and lifecycle approach; (2) define and test the shared monograph-and-answer contract; (3) implement monograph-first rendering and AI-answer lifecycle states; (4) implement citation, references, and follow-up interactions; (5) complete quality, accessibility, privacy, performance, measurement, rollout, and rollback checks.
