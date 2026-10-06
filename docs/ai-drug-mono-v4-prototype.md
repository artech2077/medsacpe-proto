# AI drug mono V4 — AI + pill and drug updates

Route: `/ai-drug-mono-v4` (opens the Ozempic CKD example automatically).
Direct example: `/ai-drug-mono-v4?scenario=ozempic-ckd-dosing`.

Additional Examples:
- Variation 3, **Clinical takeaway first**: `/ai-drug-mono-v4?scenario=ozempic-update-takeaway`. Leads with the practical dose implication; “What changed in the label” expands the original explanation and sources.
- Variation 5, **Editorial update brief**: `/ai-drug-mono-v4?scenario=ozempic-update-editorial`. Collapsed by default with its formal clinical title in the banner. Expands into Indicated Patient Population, U.S. Prescribing Information Update, Clinical Implications, and Supporting References. The body copy is unchanged.
- **Drug update as the answer — email link**: `/ai-drug-mono-v4?scenario=ozempic-update-email`. Simulates an incoming email link. The editorial update is displayed as a fully visible answer using the shared answer renderer, with a clinical headline and inline reference citations. There is no update banner, disclosure control, separate dosing answer, or generation delay. The drug pill, copy/feedback actions, and follow-up questions remain available. No email is sent; the link is the local prototype destination.

Both variations use the same Ozempic answer, date, clinical facts, and drug pill. No monograph section links appear in either update card.

Product question: can a returning clinician understand a drug update and its clinical relevance alongside a direct AI answer, while keeping the full monograph accessible through the drug pill?

## Experience

- A collapsed update banner shows the drug, historical U.S. label date, affected topics, and a short explanation.
- “See what changed” expands narrative **What changed** and **Why it matters** content for the kidney indication and maintenance dose. There is no added/removed diff in V4.
- Each explanation has a source link. The drug pill below the answer opens the monograph.
- The scripted AI answer loads alongside an immediately available drug pill. The pill opens and closes the existing monograph card.
- The banner appears once for Ozempic in a conversation and can be dismissed. Examples resets the conversation; follow-ups and the composer can play the supported scenarios.

## Reuse

`AiDrugAnswerFirstScreen` now accepts a typed experience configuration and serves V3 and V4. V3 keeps its original defaults and the pre-existing six-second loading behavior. V4 uses `DrugConceptShell`, `PrototypeNavSidebar`, `AiMobileTopRail`, `MedscapeCurrentAdBlock`, `AiResponseChatComposer`, `AiResponseAnswerContent`, `DrugMonographHandoffPill`, `DrugMonographCardFrame`, answer actions, follow-ups, and `ScrollDownFAB`.

`DrugMonographChangeAlert` accepts the new explanatory section contract; the gallery previews Ozempic. Its legacy diff contract remains available to V2. No new UI components were created.

## Fixtures and evidence

Typed configuration and answer: `src/data/drug-answer-first-experiences.ts`.
Update and sources: `src/data/drug-monograph-updates.ts`.
Existing Medscape semaglutide fixture: `src/data/drug-monograph-diabetes.ts`.

- [January 28, 2025 approval announcement and FLOW trial evidence](https://www.ozempic.com/content/dam/diabetes-patient/ozempic/pdfs/Ozempic_CKD_sNDA_Press_Release_January_28_2025.pdf)
- [FDA prescribing information](https://www.accessdata.fda.gov/drugsatfda_docs/label/2025/209637s035,209637s037lbl.pdf), sections 1, 2.2, 5.5, 5.6, and 14.3.

This is a historical January 2025 U.S. label example, not a claim of a new October 2026 update. The FDA PDF linked above was revised October 2025 and identifies the indication and dosing changes as January 2025. Clinical relevance copy is an editorial interpretation of these sources.

## Limitations and next validation

The AI answers are preset, viewing history is simulated, and updates do not come from a live feed. The expanded monograph uses the existing broader semaglutide fixture, while the new CKD answer is specifically sourced to the Ozempic injection U.S. label. Dismissal lasts for the mounted conversation, not across sessions. No deployment or live clinical integration was added.

Next: validate whether clinicians understand the indication population and 1 mg maintenance dose from the banner, and whether source access and the drug pill support their review workflow.

Built using `prototype-generation` from `pm-operating-system` 0.6.0 and the workspace `medscape-component-reuse` skill.

## Verification

- `npm test`: all 23 tests passed across 7 files.
- `npm run build`: passed, including TypeScript and generation of the new route.
- `npm run lint`: no errors; four existing warnings in unrelated files.
- V3 and `/gallery`: HTTP 200. V3 deep link renders one answer without the new update banner.
- Browser: checked expansion/collapse, source URLs, pill open/close, dismissal, and follow-up playback. One initial question and one banner render in V4.
- Mobile at 390 × 844: document width 390px, banner width 343px; no horizontal page overflow.
