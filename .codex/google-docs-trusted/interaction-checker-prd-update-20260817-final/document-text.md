# PRD — Interaction Checker Access (Phase 1)

- Document ID: 1ctqDBeTzPKE2bIsNLBxtnI1k8WfLtGsAN8mDz7Mag_Y
- Revision ID: AIroW35W7DZPwc3Vt85rRwCcT9pBs5Hifnp_KKNa2mmgmyMGA7TWlJyiOsmVrqj_D326OLa634MjGSCvf7afFcyqUKKyHHJKyEGyXv11aPc
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

[P00008 | 453:730 | NORMAL_TEXT]
Phase 1 adds one clear access point: selecting Check interactions in the Interactions accordion opens the existing Medscape Interaction Checker in a sidebar, with the current monograph drug already added to the checker, while keeping the monograph available in the background.

[P00009 | 730:731 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00010 | 731:740 | HEADING_1]
2. Goals

[P00011 | 740:841 | NORMAL_TEXT | LIST id=kix.6q9yyr9v1kw7 level=0]
Give clinicians a clear, in-context path from the Interactions accordion to the Interaction Checker.

[P00012 | 841:909 | NORMAL_TEXT | LIST id=kix.6q9yyr9v1kw7 level=0]
Start the checker with the current monograph drug already included.

[P00013 | 909:985 | NORMAL_TEXT | LIST id=kix.6q9yyr9v1kw7 level=0]
Preserve the established V2 Interaction Checker experience once it is open.

[P00014 | 985:987 | NORMAL_TEXT]
[INLINE_OBJECT kix.9fy1kt4xfl2m]

[P00015 | 987:989 | NORMAL_TEXT]
[INLINE_OBJECT kix.o92lrlctsbrv]

[P00016 | 989:990 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00017 | 990:1018 | HEADING_1]
3. Non-Goals / Out of Scope

[P00018 | 1018:1187 | NORMAL_TEXT | LIST id=kix.7da76e7nax2 level=0]
No change to the Interaction Checker's medication search, results, clinical content, or classifications beyond adding the current monograph drug when the checker opens.

[P00019 | 1187:1260 | NORMAL_TEXT | LIST id=kix.7da76e7nax2 level=0]
No change to the interaction details already displayed in the monograph.

[P00020 | 1260:1360 | NORMAL_TEXT | LIST id=kix.7da76e7nax2 level=0]
No new or changed access point outside the Check interactions action in the Interactions accordion.

[P00021 | 1360:1426 | NORMAL_TEXT | LIST id=kix.7da76e7nax2 level=0]
No redesign of the monograph or the existing Interaction Checker.

[P00022 | 1426:1427 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00023 | 1427:1443 | HEADING_1]
4. User Stories

[P00024 | 1443:1626 | NORMAL_TEXT | LIST id=kix.p8rdvoiuzhp6 level=0]
As a clinician reviewing a drug monograph, I want to select Check interactions from the Interactions accordion, so I can check a medication combination without leaving the monograph.

[P00025 | 1626:1798 | NORMAL_TEXT | LIST id=kix.p8rdvoiuzhp6 level=0]
As a clinician opening the checker, I want the current monograph drug to be added automatically, so I can begin the interaction check with the drug I am already reviewing.

[P00026 | 1798:1952 | NORMAL_TEXT | LIST id=kix.p8rdvoiuzhp6 level=0]
As a clinician using the checker, I want the monograph to remain in place behind the sidebar, so I can return to the same review context when I close it.

[P00027 | 1952:2119 | NORMAL_TEXT | LIST id=kix.p8rdvoiuzhp6 level=0]
As a keyboard or screen-reader user, I want the action and sidebar controls to be clearly labeled and operable, so I can access and dismiss the checker independently.

[P00028 | 2119:2271 | NORMAL_TEXT | LIST id=kix.p8rdvoiuzhp6 level=0]
As a clinician when the checker is unavailable, I want to remain able to read the monograph, so an unavailable checker does not block my normal review.

[P00029 | 2271:2272 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00030 | 2272:2288 | HEADING_1]
5. Requirements

[P00031 | 2288:2303 | HEADING_2]
Must-Have (P0)

[P00032 | 2303:2347 | HEADING_3]
R1 — Access from the Interactions accordion

[P00033 | 2347:2430 | NORMAL_TEXT]
☐ The Interactions accordion displays a clearly labeled Check interactions action.

[P00034 | 2430:2552 | NORMAL_TEXT]
☐ Selecting Check interactions opens the existing Medscape Interaction Checker in a sidebar beside the current monograph.

[P00035 | 2552:2668 | NORMAL_TEXT]
☐ The action can be reached and activated with a keyboard and has an accessible name that communicates its purpose.

[P00036 | 2668:2669 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00037 | 2669:2704 | HEADING_3]
R2 — In-context sidebar experience

[P00038 | 2704:2846 | NORMAL_TEXT]
☐ When the sidebar opens, the drug displayed in the current monograph is already added to the Interaction Checker's selected medication list.

[P00039 | 2846:3014 | NORMAL_TEXT]
☐ The pre-added current monograph drug remains available to the clinician as a selected medication and can be removed using the checker's existing medication controls.

[P00040 | 3014:3178 | NORMAL_TEXT]
☐ The clinician can use the established V2 Interaction Checker experience, including adding medications and reviewing the checker's available results and messages.

[P00041 | 3178:3294 | NORMAL_TEXT]
☐ The current monograph remains visible but inactive behind the open sidebar, and its scroll position is preserved.

[P00042 | 3294:3471 | NORMAL_TEXT]
☐ The sidebar has a clearly labeled close control. Closing it returns the clinician to the same Interactions accordion context and returns keyboard focus to Check interactions.

[P00043 | 3471:3593 | NORMAL_TEXT]
☐ On supported narrow viewports, the checker remains usable and can be closed without preventing access to the monograph.

[P00044 | 3593:3594 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00045 | 3594:3624 | HEADING_3]
R3 — Safe availability states

[P00046 | 3624:3802 | NORMAL_TEXT]
☐ While the checker is opening or loading, the sidebar provides an understandable in-progress state. The clinician can dismiss the sidebar and return to the unchanged monograph.

[P00047 | 3802:3961 | NORMAL_TEXT]
☐ If the checker cannot be loaded, the sidebar displays its standard unavailable state and can be dismissed so the clinician can continue using the monograph.

[P00048 | 3961:4101 | NORMAL_TEXT]
☐ This integration does not change the existing checker behavior for empty medication lists, no interactions found, or interaction results.

[P00049 | 4101:4102 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00050 | 4102:4120 | HEADING_2]
Nice-to-Have (P1)

[P00051 | 4120:4175 | NORMAL_TEXT]
No P1 requirements are included in this Phase 1 scope.

[P00052 | 4175:4176 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00053 | 4176:4203 | HEADING_2]
Future Considerations (P2)

[P00054 | 4203:4253 | NORMAL_TEXT]
No P2 requirements are included in this document.

[P00055 | 4253:4254 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00056 | 4254:4273 | HEADING_1]
6. Success Metrics

[P00057 | 4273:4511 | NORMAL_TEXT]
Leading release-quality measures: Verify, before release, that the action opens the sidebar; the sidebar can be closed; the original monograph context is retained; and the path works with keyboard navigation and supported viewport sizes.

[P00058 | 4511:4512 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00059 | 4512:4778 | NORMAL_TEXT]
Lagging user outcomes: Measure use of Check interactions and successful openings of the checker from the Interactions accordion. PM must approve the baseline, target, measurement period, and definition of a successful opening before launch measurement is evaluated.

[P00060 | 4778:4779 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00061 | 4779:4797 | HEADING_1]
7. Open Questions

[P00062 | 4797:5072 | NORMAL_TEXT]
1. Question / decision needed: Confirm the approved narrow-viewport presentation for the sidebar and provide the final design reference. This is needed to complete visual acceptance for supported narrow viewports. Owner: PM / Design. Blocking: Yes — before final acceptance.

[P00063 | 5072:5073 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00064 | 5073:5095 | HEADING_1]
8. Definition of Done

[P00065 | 5095:5151 | NORMAL_TEXT]
Phase 1 is complete when all of the following are true:

[P00066 | 5151:5272 | NORMAL_TEXT | LIST id=kix.4r1uax3m0web level=0]
Check interactions is available from the Interactions accordion and opens the existing Interaction Checker in a sidebar.

[P00067 | 5272:5367 | NORMAL_TEXT | LIST id=kix.4r1uax3m0web level=0]
The current monograph drug is already added to the Interaction Checker when the sidebar opens.

[P00068 | 5367:5502 | NORMAL_TEXT | LIST id=kix.4r1uax3m0web level=0]
The open and close path preserves the clinician's monograph context, including the Interactions accordion context and scroll position.

[P00069 | 5502:5600 | NORMAL_TEXT | LIST id=kix.4r1uax3m0web level=0]
The action and sidebar are operable with a keyboard and understandable with assistive technology.

[P00070 | 5600:5707 | NORMAL_TEXT | LIST id=kix.4r1uax3m0web level=0]
The established checker experience is available without changing its medication-entry or results behavior.

[P00071 | 5707:5823 | NORMAL_TEXT | LIST id=kix.4r1uax3m0web level=0]
Loading and unavailable states allow the sidebar to be dismissed so the clinician can continue using the monograph.

[P00072 | 5823:5959 | NORMAL_TEXT | LIST id=kix.4r1uax3m0web level=0]
The approved narrow-viewport presentation is validated, and the release-quality and user-outcome measurements are ready to be assessed.

[P00073 | 5959:5960 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00074 | 5960:5972 | HEADING_1]
9. Timeline

[P00075 | 5972:6044 | NORMAL_TEXT]
No production date is committed while the feature remains Pending lock.

[P00076 | 6044:6045 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00077 | 6045:6332 | NORMAL_TEXT]
Recommended sequence: (1) confirm the narrow-viewport presentation; (2) approve the final design reference; (3) add and validate the Interactions accordion access path; (4) verify the open, close, availability, keyboard, and supported-viewport states; (5) confirm measurement readiness.

[P00078 | 6332:6333 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

