# AI drug mono V4 — AI + pill and drug updates

Route: `/ai-drug-mono-v4` (opens the Ozempic CKD example automatically).
Direct example: `/ai-drug-mono-v4?scenario=ozempic-ckd-dosing`.

Additional Examples:
- Variation 3, **Clinical takeaway first**: `/ai-drug-mono-v4?scenario=ozempic-update-takeaway`. Leads with the practical dose implication; “What changed in the label” expands the original explanation and sources.
- Variation 5, **Editorial update brief · Mounjaro**: `/ai-drug-mono-v4?scenario=mounjaro-update-editorial`. Uses its own Mounjaro (tirzepatide) update: the FDA approval of NDA 215866 S-044/S-045, signed 08/27/2026. It covers the new cardiovascular risk reduction indication and the 2.5 mg dose for ongoing glycemic control. Collapsed by default with its formal clinical title in the banner, and expands into Indicated Patient Population, U.S. Prescribing Information Update, Clinical Implications, and Supporting References. Question: "Can I keep a patient with type 2 diabetes on Mounjaro 2.5 mg once weekly?" The answer cites the Mounjaro label, the approval letter, and the Zepbound label, and the pill opens the tirzepatide monograph. Content is limited to the verified FDA passages in `older-verified-updates.csv`. The Zepbound rows were not used, because those changes do not extend to Mounjaro. ⚠️ The shared tirzepatide monograph fixture still says the 2.5 mg dose is not effective for glycemic control, so it contradicts the update during the simulated review-pending window.
- **Drug update as the answer — email link**: `/ai-drug-mono-v4?scenario=ozempic-update-email`. Simulates an incoming email link. The editorial update is displayed as a fully visible answer using the shared answer renderer, with a clinical headline and inline reference citations. There is no update banner, disclosure control, separate dosing answer, or generation delay. The drug pill, copy/feedback actions, and follow-up questions remain available. No email is sent; the link is the local prototype destination.

Variation 3 and the default example share the Ozempic answer, date, clinical facts, and drug pill; Variation 5 carries its own scenario-level update (`AnswerFirstScenario.update`). No monograph section links appear in either update card.

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
Update and sources: `src/data/drug-monograph-updates.ts` (`OZEMPIC_UPDATE`, `MOUNJARO_UPDATE`).
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

## Sharing the Mounjaro example with a user

Share page: `/share/mounjaro-update`. It opens straight into the Mounjaro update, question, answer, and pill. It has no prototype menu, no Examples switcher, and no follow-up chips. The tirzepatide dosing follow-up was removed because that answer predates the update and contradicts it. It is configured by `SHARE_MOUNJARO_UPDATE` and is not listed in `prototypeRegistry`, so it never appears in the internal prototype menu.

Alternatives: beside the Mounjaro pill, a labeled "Alternatives" group shows Ozempic (semaglutide) and Victoza (liraglutide) as neutral gray pills the same height as the drug pill (`AnswerFirstScenario.alternatives`); they appear in V4 Variation 5 too. Tapping one opens that drug's monograph at its type 2 diabetes dosing row. Only one monograph is open at a time. The alternatives are a prototype choice, not an editorial or clinical recommendation.

To make it the only reachable page, set `SHARE_ONLY_PATHS=/share/mounjaro-update` in the Vercel project's environment variables, then redeploy. Push the same code to GitHub (Vercel) and GitLab (company deployment). The setting, not the code, decides which deployment is restricted. `src/proxy.ts` redirects every other page (`/`, `/gallery`, V1–V4, concepts) to the share page with a 307. Analytics (`/ingest`) and `/health` keep working. The company deployment has no such setting, so every page stays open there.

Owner access: also set `SHARE_OWNER_KEY` in Vercel to a long random value. Open `/owner-access`, enter the key once, and that browser can reach every page for 180 days (cookie `proto_owner_access`). Clear the site's cookies to lock it again. Changing the key signs out every unlocked browser. Without `SHARE_OWNER_KEY`, `/owner-access` returns 404. A local production build confirmed the redirects, the rejection of a wrong key, and the unlock.

Limit: this blocks pages, not code. The shared screen's JavaScript still bundles the V4 scenario data, so a technical user reading the page source could find other scenario text.
