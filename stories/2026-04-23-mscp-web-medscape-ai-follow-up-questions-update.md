# MSCP WEB - Medscape AI | follow up questions update

Type: enhancement
Date: 2026-04-23
Source Context: product-context.md

## User Story
As a Medscape AI user, I want follow-up questions in the Medscape AI current experience to match the FWQ test 1 treatment so that the next-step prompts feel more visible and easier to use after an answer is complete.

## Acceptance Criteria
- The Medscape AI current chat experience renders follow-up questions using the same placement as `fwq-test-1`, directly below the completed answer content and above the answer action row.
- The Medscape AI current chat experience renders follow-up questions using the same chip-style visual treatment as `fwq-test-1`.
- The follow-up question copy shown in Medscape AI current continues to come from the existing Medscape AI current question source and is not replaced with a new copy set in this story.
- Clicking a follow-up question in Medscape AI current submits that question as the next turn using the existing follow-up interaction behavior.
- Existing follow-up click analytics continue to fire for the updated Medscape AI current presentation.
- References, answer actions, and other completed-answer content continue to render and function correctly after the layout update.
- Loading, preparing, and streaming states remain unchanged until the answer reaches the completed state where follow-up questions are shown.

## Technical Requirements
- Update the Medscape AI current route configuration so it uses the same follow-up question placement and variant settings currently used by `src/app/(prototypes)/fwq-test-1/chat/page.tsx`.
- Preserve the current Medscape AI data source for follow-up question strings from the shared answer-supporting-content layer in `src/data/ai-response.ts`.
- Keep the shared follow-up question selection callback and submission flow unchanged so follow-up chips continue to trigger the next generated turn.
- Maintain the current analytics event flow for `follow_up_question_clicked` and downstream generation events after the UI update.
- Scope the change to the Medscape AI current follow-up question presentation and related layout wiring; do not change unrelated answer content, ad behavior, or question-generation logic.
