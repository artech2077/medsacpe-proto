# [BE + FE] Deliver the grounded AI answer after the drug monograph widget

**Status:** Draft — tracker ID not assigned · **Feature status:** Pending lock  
**Parent PRD:** [PRD — AI Answer After Drug Monograph Widget (Phase 1)](./PRD%20-%20AI%20Answer%20After%20Drug%20Monograph%20Widget%20-%20WIP.md)

## Outcome

For an eligible drug question, render the canonical monograph widget immediately. Directly after it, show a clearly labeled AI-generated answer as it becomes available. The answer must be grounded in the monograph content from the same response turn, and every displayed citation must lead back to its supporting source. A delayed, unavailable, or unsupported AI answer must never block the monograph.

## User story

As a clinician who asks a drug question, I want to review the canonical monograph first and receive a cited AI synthesis directly after it, so I can get an answer quickly while retaining a clear path to verify the source.

## Scope

This is one end-to-end ticket. The assigned developer owns the backend lifecycle and response contract, frontend rendering and interactions, shared validation, analytics, tests, and end-to-end verification.

### Backend changes

- [ ] Return the relevant monograph payload without waiting for AI-answer completion.
- [ ] Correlate the AI-answer lifecycle with the same response-turn ID and monograph version delivered to the frontend.
- [ ] Return the answer lifecycle as pending or streaming, complete, unavailable, or unsupported because the available monograph cannot support an answer.
- [ ] On completion, return answer content, structured citations, and eligible follow-up questions when present.
- [ ] Ensure every citation resolves to an approved monograph content item or approved reference in the same response turn before the answer is marked complete.
- [ ] Return a safe non-answer state when grounding is insufficient, generation fails, or the request reaches the approved time limit; do not remove or delay the monograph response.
- [ ] Keep the AI-answer object optional and backward compatible for clients that only render the monograph.
- [ ] Document the response contract and add contract tests for pending or streaming, complete, unavailable, unsupported, invalid citation, stale response, and no-AI-answer cases.

Required semantic contract; final field names and transport must follow production API conventions:

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

### Frontend changes

- [ ] Render the question and monograph widget as soon as the monograph payload is available.
- [ ] Render the AI-answer area directly after the monograph on desktop and mobile; do not move it above the monograph.
- [ ] While the answer is pending or streaming, display an accessible, non-blocking message that the answer is being generated from the canonical source above.
- [ ] When complete, visibly identify the content as AI-generated and render its content and citations from the payload.
- [ ] Do not infer citations from answer text, drug names, or hard-coded source mappings.
- [ ] Make each valid citation and the references entry point keyboard accessible, and connect it to the matching source treatment and monograph content in the same turn.
- [ ] Render eligible follow-up questions after the newest completed answer's references. Selecting one submits a new question and does not mutate earlier completed turns.
- [ ] Keep the monograph readable and interactive while an answer is loading, unavailable, unsupported, or fails.
- [ ] If the answer is unavailable or unsupported, display the approved safe fallback and keep the monograph unchanged. Do not show a broken citation or automatically retry without user direction.
- [ ] Ignore a late answer response when it belongs to a different or superseded response turn.
- [ ] Reuse existing answer controls without changing their established behavior.

### Accessibility, privacy, and measurement

- [ ] Use an accessible AI-answer label and announce meaningful lifecycle changes without repeatedly interrupting screen-reader users during streaming.
- [ ] Ensure citation, reference, and follow-up controls have clear accessible names, support keyboard use, and retain appropriate focus behavior.
- [ ] Measure monograph-ready, AI-answer-started, completed, unavailable or unsupported, citation-opened, references-opened, and follow-up-selected events without collecting patient identifiers, patient-entered values, or answer text.

## Acceptance criteria

1. **Monograph first:** Given an eligible drug question, the relevant monograph widget appears before the AI-answer area in the same response turn on desktop and mobile.
2. **Loading:** Given a pending or streaming answer, the area after the monograph shows the approved in-progress state while the monograph remains usable.
3. **Complete answer:** Given a completed answer with valid citations, the answer is clearly labeled as AI-generated and each citation can reach the supporting source in the same response turn.
4. **Unsupported or unavailable:** Given insufficient source content, a failure, or the approved time limit, the answer area shows the approved safe non-answer state and the monograph remains unchanged and usable.
5. **Invalid citation:** Given missing, malformed, duplicate, or unresolved citation data, the frontend does not render a broken citation action and the backend does not mark the answer complete without the approved fallback.
6. **Follow-up:** Given eligible follow-up questions on the newest completed turn, selecting one creates a new response turn with its own monograph and answer state. Earlier turns remain unchanged.
7. **Stale response:** Given a late answer for an earlier or superseded turn, it is not displayed in another turn.
8. **Accessibility:** Loading changes, AI-answer labeling, citations, references, and follow-up actions pass keyboard and screen-reader validation.
9. **Privacy:** Analytics do not contain patient identifiers, patient-entered values, or answer text.
10. **End to end:** An approved monograph question returns an immediate monograph and a later cited AI answer; every displayed citation resolves to that turn's supporting monograph content.

## Test plan

- Backend unit and contract tests for monograph-first delivery, response-turn correlation, monograph-version matching, answer states, citation validation, safe non-answer responses, cancellation or stale-result handling, and optional-field compatibility.
- Frontend component tests for response order, loading, complete, unavailable, unsupported, malformed citation, references, follow-up, newest-turn-only actions, and narrow-viewport behavior.
- Frontend interaction tests for citation-to-source navigation, focus behavior, keyboard operation, live-region behavior, and a new question while a previous answer is pending.
- End-to-end test using an approved monograph question with citations that resolve to the correct content in the same response turn.
- Manual accessibility, privacy, performance, and approved fallback-copy verification.

## Dependencies and decisions required

- Eng / PM approval of the answer-generation transport, cancellation behavior, and maximum wait time.
- PM / Editorial approval of monograph eligibility and insufficient-source fallback copy.
- PM / Editorial / Eng approval of citation granularity and reference-treatment detail.
- Eng / PM approval of answer-latency, completion-rate, and citation-engagement targets.

## Definition of done

The backend delivers an immediate monograph plus a correlated, validated AI-answer lifecycle; the frontend renders the AI answer only after the monograph and makes it verifiable through payload-driven citations and references; delayed, unavailable, unsupported, malformed, and stale cases preserve the monograph; eligible follow-ups create new unchanged turns; accessibility, privacy, analytics, contract, component, responsive, and end-to-end tests pass; and every blocking decision in the parent PRD is approved.

> This is a ready-to-paste ticket draft. Do not create it in the delivery tracker until the feature is locked and the tracker/project supplies the required ticket ID.
