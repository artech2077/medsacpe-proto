# Concept H — Mobile-First Chat Answer (Epocrates-inspired)

> Read `00 - Index & Shared Architecture.md` first. This file specifies only what is different for Concept H.

## 1. Summary

The mobile rendering of a drug chat reply, designed from the phone up. The response message carries a **one-tap field switcher** (Dosing / Warnings / Interactions / Renal); tapping a field opens the canonical content in a **bottom sheet** over the thread, swipe to dismiss and keep chatting. A deterministic interaction checker is one tap away. The bet: bedside/clinic phone use is where Medscape has the most friction, and the non-negotiable mobile pattern may differ from the best desktop one.

## 2. Detailed description

- On a phone, physician asks about the drug. The reply is a compact message: drug + pinned BBW + a horizontal **field switcher** chip strip.
- Tapping "Dosing" raises a **bottom sheet** with the canonical dosing content; the sheet has its own **sticky sub-field tab strip** (AFib · 2.5 mg criteria · DVT/PE · Renal · Hepatic) so a long section fits the phone.
- Swipe down to dismiss → back in the thread to ask a follow-up.
- A dedicated **interaction checker** chip opens a deterministic check sheet (drug + drug → verbatim interaction).
- Large tap targets, one-handed reach, no horizontal scrolling of content.

## 3. Story map

**Backbone:** Ask on phone → Tap the field → Read in a sheet → Dismiss → Follow up / check interaction.

| Activity | Steps | User stories |
|---|---|---|
| Ask | Type/voice on phone | R1: I ask on my phone and get a thumb-reachable reply. |
| Tap field | Use the switcher | R1: I tap "Renal" and the sheet opens to renal dosing. |
| Read in sheet | Sub-field strip in sheet | R1: A long dosing section fits the phone via the in-sheet tabs. |
| Dismiss | Swipe down | R1: I swipe back to the thread instantly. |
| Check / follow up | Interaction checker / next Q | Later: I tap the checker and add a second drug. |

**Round-1 slice:** field switcher + bottom sheets + in-sheet sub-field strip + pinned BBW + interaction checker entry.
**Later slice:** voice input, recent-drugs shortcut, offline-cached common drugs.

## 4. Handling long sections (≥2 viewports) — the central design problem for H

- This is where the long-section constraint bites hardest: a 2+ viewport Dosing section on a 1-viewport phone.
- Solution: the field switcher goes **one level deeper** so the user picks the sub-task, and the bottom sheet renders **one sub-field at a time** with a sticky tab strip to switch sub-fields without scrolling the whole block.
- E.g., "Dosing" sheet opens on the most likely sub-field (from `matched_intent` or default), tabs across the top for the others — each tab ≤1–2 viewports.
- BBW is shown in the reply message itself (eager), not buried in a sheet.

## 5. LangGraph implementation

- **Nodes:** `router` → `intent_parse` → `monograph_retrieve` → `response_builder`. **`synthesize` OFF** (deterministic, mobile-fast); optional opt-in synthesis can mirror Concept F if desired.
- Mobile-specific concern is **payload weight + latency on cellular**: `monograph_retrieve` returns the switcher's sub-field summaries; each sub-field `body` lazy-loads when its sheet/tab opens (scoped retrieve). First reply is intentionally tiny.
- `intent_parse` sets which field switcher chip + sub-field tab opens first.
- Interaction checker = a distinct deterministic graph path (drug + drug → interaction record), never synthesized.
- **Frontend:** native-feeling bottom sheets; the field switcher maps to suggested-action chips; offline cache of common drugs is a later optimization.

## 6. Assumptions to test

| # | Assumption | How to validate | Keep signal |
|---|---|---|---|
| H1 | A field switcher + bottom sheets is the fastest mobile pattern. | Mobile time-to-answer vs other concepts on phone. | H fastest on mobile tasks. |
| H2 | The in-sheet sub-field strip solves the long-section-on-phone problem. | Scroll distance + perceived load in dosing sheet. | ≤1–2 viewport per sub-field; low load. |
| H3 | One-handed reach works for real bedside use. | Ergonomics observation / one-handed task success. | High one-handed completion. |
| H4 | Bottom sheets over the thread feel native, not disruptive. | Dismiss behavior, "did you lose your place?" probe. | Smooth; no lost context. |
| H5 | Deterministic-only is sufficient on mobile (synthesis less missed than on desktop). | Compare with an opt-in-synthesis variant. | Few request synthesis on mobile. |

## 7. Risks & open questions

- Under-powered on desktop — H is best run as the **mobile counterpart** to whichever desktop concept (A/D/E/F) tests best, not as a standalone winner.
- Bottom sheets limit how much shows at once; deep comparison tasks (#8) may be awkward on phone.
- Cellular latency makes lazy-loading both necessary and risky — measure real-network performance.
- Decide whether mobile should ever synthesize, or stay strictly deterministic.
