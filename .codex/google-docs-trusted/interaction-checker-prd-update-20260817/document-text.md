# PRD — Interaction Checker Access (Phase 1)

- Document ID: 1ctqDBeTzPKE2bIsNLBxtnI1k8WfLtGsAN8mDz7Mag_Y
- Revision ID: AIroW35DBwiAyNrW9HeMnMOMsKrcId_x9rZ0PJM7YHd7PxA_vcfEPyjn1UUzZhZR1Wi-wPd9C-h9XX-IsQ0PZttSxoaKOw5_Nfb0YTTJL3I
- Selected tab: t.0
- Protected controls: 0
- Opaque controls: 0
- Authoritative dropdowns: 0

Protected-control annotations are preservation instructions. Do not insert their displayed placeholder text to recreate a native control.

## Tab 1 (t.0)

[P00001 | 1:44 | TITLE]
PRD — Interaction Checker Access (Phase 1)

[P00002 | 44:45 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00003 | 45:133 | NORMAL_TEXT]
Status: WIP v0.1 · Date: Aug 13, 2026 · Owner: Farouk Bousaaid (PM) · Feature status: Pending lock

[P00004 | 133:134 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00005 | 134:155 | HEADING_1]
1. Problem Statement

[P00006 | 155:452 | NORMAL_TEXT]
When a clinician reviews the Interactions accordion in a drug monograph, they can see interaction information but do not have a direct way to open the Medscape Interaction Checker from that context. This creates an unnecessary break between reviewing a drug and checking a medication combination.

[P00007 | 452:453 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00008 | 453:667 | NORMAL_TEXT]
Phase 1 adds one clear access point: selecting Check interactions in the Interactions accordion opens the existing Medscape Interaction Checker in a sidebar while keeping the monograph available in the background.

[P00009 | 667:668 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00010 | 668:677 | HEADING_1]
2. Goals

[P00011 | 677:778 | NORMAL_TEXT | LIST id=kix.6q9yyr9v1kw7 level=0]
Give clinicians a clear, in-context path from the Interactions accordion to the Interaction Checker.

[P00012 | 778:870 | NORMAL_TEXT | LIST id=kix.6q9yyr9v1kw7 level=0]
Let clinicians review and use the checker without losing their place in the drug monograph.

[P00013 | 870:946 | NORMAL_TEXT | LIST id=kix.6q9yyr9v1kw7 level=0]
Preserve the established V2 Interaction Checker experience once it is open.

[P00014 | 946:948 | NORMAL_TEXT]
[INLINE_OBJECT kix.9fy1kt4xfl2m]

[P00015 | 948:950 | NORMAL_TEXT]
[INLINE_OBJECT kix.o92lrlctsbrv]

[P00016 | 950:951 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00017 | 951:979 | HEADING_1]
3. Non-Goals / Out of Scope

[P00018 | 979:1118 | NORMAL_TEXT | LIST id=kix.7da76e7nax2 level=0]
No change to the Interaction Checker's medication search, selected medications, interaction results, clinical content, or classifications.

[P00019 | 1118:1191 | NORMAL_TEXT | LIST id=kix.7da76e7nax2 level=0]
No change to the interaction details already displayed in the monograph.

[P00020 | 1191:1291 | NORMAL_TEXT | LIST id=kix.7da76e7nax2 level=0]
No new or changed access point outside the Check interactions action in the Interactions accordion.

[P00021 | 1291:1357 | NORMAL_TEXT | LIST id=kix.7da76e7nax2 level=0]
No redesign of the monograph or the existing Interaction Checker.

[P00022 | 1357:1358 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00023 | 1358:1374 | HEADING_1]
4. User Stories

[P00024 | 1374:1557 | NORMAL_TEXT | LIST id=kix.p8rdvoiuzhp6 level=0]
As a clinician reviewing a drug monograph, I want to select Check interactions from the Interactions accordion, so I can check a medication combination without leaving the monograph.

[P00025 | 1557:1711 | NORMAL_TEXT | LIST id=kix.p8rdvoiuzhp6 level=0]
As a clinician using the checker, I want the monograph to remain in place behind the sidebar, so I can return to the same review context when I close it.

[P00026 | 1711:1878 | NORMAL_TEXT | LIST id=kix.p8rdvoiuzhp6 level=0]
As a keyboard or screen-reader user, I want the action and sidebar controls to be clearly labeled and operable, so I can access and dismiss the checker independently.

[P00027 | 1878:2030 | NORMAL_TEXT | LIST id=kix.p8rdvoiuzhp6 level=0]
As a clinician when the checker is unavailable, I want to remain able to read the monograph, so an unavailable checker does not block my normal review.

[P00028 | 2030:2031 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00029 | 2031:2047 | HEADING_1]
5. Requirements

[P00030 | 2047:2062 | HEADING_2]
Must-Have (P0)

[P00031 | 2062:2106 | HEADING_3]
R1 — Access from the Interactions accordion

[P00032 | 2106:2189 | NORMAL_TEXT]
☐ The Interactions accordion displays a clearly labeled Check interactions action.

[P00033 | 2189:2311 | NORMAL_TEXT]
☐ Selecting Check interactions opens the existing Medscape Interaction Checker in a sidebar beside the current monograph.

[P00034 | 2311:2427 | NORMAL_TEXT]
☐ The action can be reached and activated with a keyboard and has an accessible name that communicates its purpose.

[P00035 | 2427:2428 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00036 | 2428:2463 | HEADING_3]
R2 — In-context sidebar experience

[P00037 | 2463:2653 | NORMAL_TEXT]
☐ When the sidebar opens, the clinician can use the established V2 Interaction Checker experience, including entering medications and reviewing the checker's available results and messages.

[P00038 | 2653:2769 | NORMAL_TEXT]
☐ The current monograph remains visible but inactive behind the open sidebar, and its scroll position is preserved.

[P00039 | 2769:2946 | NORMAL_TEXT]
☐ The sidebar has a clearly labeled close control. Closing it returns the clinician to the same Interactions accordion context and returns keyboard focus to Check interactions.

[P00040 | 2946:3068 | NORMAL_TEXT]
☐ On supported narrow viewports, the checker remains usable and can be closed without preventing access to the monograph.

[P00041 | 3068:3069 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00042 | 3069:3099 | HEADING_3]
R3 — Safe availability states

[P00043 | 3099:3277 | NORMAL_TEXT]
☐ While the checker is opening or loading, the sidebar provides an understandable in-progress state. The clinician can dismiss the sidebar and return to the unchanged monograph.

[P00044 | 3277:3436 | NORMAL_TEXT]
☐ If the checker cannot be loaded, the sidebar displays its standard unavailable state and can be dismissed so the clinician can continue using the monograph.

[P00045 | 3436:3576 | NORMAL_TEXT]
☐ This integration does not change the existing checker behavior for empty medication lists, no interactions found, or interaction results.

[P00046 | 3576:3577 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00047 | 3577:3595 | HEADING_2]
Nice-to-Have (P1)

[P00048 | 3595:3650 | NORMAL_TEXT]
No P1 requirements are included in this Phase 1 scope.

[P00049 | 3650:3651 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00050 | 3651:3678 | HEADING_2]
Future Considerations (P2)

[P00051 | 3678:3728 | NORMAL_TEXT]
No P2 requirements are included in this document.

[P00052 | 3728:3729 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00053 | 3729:3748 | HEADING_1]
6. Success Metrics

[P00054 | 3748:3986 | NORMAL_TEXT]
Leading release-quality measures: Verify, before release, that the action opens the sidebar; the sidebar can be closed; the original monograph context is retained; and the path works with keyboard navigation and supported viewport sizes.

[P00055 | 3986:3987 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00056 | 3987:4253 | NORMAL_TEXT]
Lagging user outcomes: Measure use of Check interactions and successful openings of the checker from the Interactions accordion. PM must approve the baseline, target, measurement period, and definition of a successful opening before launch measurement is evaluated.

[P00057 | 4253:4254 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00058 | 4254:4272 | HEADING_1]
7. Open Questions

[P00059 | 4272:4547 | NORMAL_TEXT]
1. Question / decision needed: Confirm the approved narrow-viewport presentation for the sidebar and provide the final design reference. This is needed to complete visual acceptance for supported narrow viewports. Owner: PM / Design. Blocking: Yes — before final acceptance.

[P00060 | 4547:4548 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00061 | 4548:4570 | HEADING_1]
8. Definition of Done

[P00062 | 4570:4626 | NORMAL_TEXT]
Phase 1 is complete when all of the following are true:

[P00063 | 4626:4747 | NORMAL_TEXT | LIST id=kix.4r1uax3m0web level=0]
Check interactions is available from the Interactions accordion and opens the existing Interaction Checker in a sidebar.

[P00064 | 4747:4882 | NORMAL_TEXT | LIST id=kix.4r1uax3m0web level=0]
The open and close path preserves the clinician's monograph context, including the Interactions accordion context and scroll position.

[P00065 | 4882:4980 | NORMAL_TEXT | LIST id=kix.4r1uax3m0web level=0]
The action and sidebar are operable with a keyboard and understandable with assistive technology.

[P00066 | 4980:5087 | NORMAL_TEXT | LIST id=kix.4r1uax3m0web level=0]
The established checker experience is available without changing its medication-entry or results behavior.

[P00067 | 5087:5203 | NORMAL_TEXT | LIST id=kix.4r1uax3m0web level=0]
Loading and unavailable states allow the sidebar to be dismissed so the clinician can continue using the monograph.

[P00068 | 5203:5339 | NORMAL_TEXT | LIST id=kix.4r1uax3m0web level=0]
The approved narrow-viewport presentation is validated, and the release-quality and user-outcome measurements are ready to be assessed.

[P00069 | 5339:5340 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00070 | 5340:5352 | HEADING_1]
9. Timeline

[P00071 | 5352:5424 | NORMAL_TEXT]
No production date is committed while the feature remains Pending lock.

[P00072 | 5424:5425 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00073 | 5425:5712 | NORMAL_TEXT]
Recommended sequence: (1) confirm the narrow-viewport presentation; (2) approve the final design reference; (3) add and validate the Interactions accordion access path; (4) verify the open, close, availability, keyboard, and supported-viewport states; (5) confirm measurement readiness.

[P00074 | 5712:5713 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

