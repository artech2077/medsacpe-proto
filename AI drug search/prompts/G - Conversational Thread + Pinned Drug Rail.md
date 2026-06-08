# Build Prompt — Concept G: Conversational Thread + Pinned Drug Rail

> Prereq: build `00 - Shared Prototype Shell & Tab Bar.md` first. Spec:
> `AI drug search/G - Conversational Thread + Pinned Drug Rail.md` +
> `00 - Index & Shared Architecture.md`. This prompt describes only what is different for Concept G.

## 0. Mandatory first step
Invoke the **`medscape-component-reuse`** skill and inventory the library before coding. Produce a
reuse map. Reuse exactly; new components only for new functionality; register them.

## 1. Goal
The most thread-like concept: a normal back-and-forth conversation with a **canonical drug card
pinned alongside the thread** — a right rail on desktop, a sticky collapsible header → sheet on
mobile — so the monograph never leaves the screen. Each answer is synthesized + cited (like Concept
E), and **every claim links into the pinned rail's matching subfield**, which scrolls/highlights.
Follow-ups feel native (`what about hepatic impairment?`, `and with ketoconazole?`) and keep drug
context. The rail (BBW pinned at top) persists across the whole conversation as the grounding anchor.

## 2. Reuse map (must reuse, do not duplicate)
- **Shell + tab bar at top:** `DrugConceptShell` with `activeConcept="G"`.
- **Multi-turn conversation engine:** reuse the chat-turn streaming/state machine and rendering from
  `AiResponseScreen` (`src/components/screens/ai-response-screen.tsx`) — composer, preparing notice,
  `AiResponseAnswerContent`, `AiResponseKeyPoints`, `AiResponseAnswerActions`,
  `AiResponseAnswerSupportingContent`. Do **not** rebuild the thread; compose the existing pieces.
- **Rail content:** reuse the monograph rendering (`apixabanMonograph` sections/subfields); reuse
  the quick-reference rail built for Concept B (`DrugMonographCanvas`'s rail) if shared — factor a
  shared rail rather than copying.
- **Data:** `apixabanMonograph` + example `DrugSynthesizedAnswer`s; claims carry citation anchors
  that drive `railFocusAnchor`.

## 3. New component (only if not covered)
- `DrugPinnedRail` in `src/components/medscape/drug-concepts/pinned-rail.tsx`: the persistent
  desktop right rail / mobile sticky-header-to-sheet. Shows compact section summaries; tapping
  expands a long body **in the rail** with its own subfield nav; BBW pinned at top permanently.
  Accepts a `focusAnchor` prop so claim links scroll/highlight the matching subfield. Register in
  the gallery (`layout`). Reuse the conversation components for the thread side.

## 4. Handling long sections
Conversation answers target subfields, never dumping a long section into a bubble. The **rail shows a
compact summary** per section; tapping expands the long body **inside the rail** with its own
subfield nav, keeping the thread short. BBW pinned at the top of the rail permanently.

## 5. Route & registry
Screen `DrugConceptPinnedRailScreen`; route `src/app/(prototypes)/drug-concept-g/page.tsx` renders it
only. Registry entry per the shared table.

## 6. Acceptance
- `pnpm lint` + `pnpm build` pass; tab bar at top with **G active**, all tabs navigate.
- First question yields a cited answer + a populated pinned rail; follow-ups stay in drug context
  without retyping the drug; clicking a claim scrolls/highlights the rail subfield; desktop shows a
  right rail, mobile a sticky collapsible header → sheet; BBW always at rail top.
- Facts come from `drug-monograph.ts`; conversation engine reused, not rebuilt.
