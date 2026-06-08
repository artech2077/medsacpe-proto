# Build Prompt — Shared Shell, Concept Tab Bar & Drug Data

> **Read this first, then read the per-concept prompt (A–H).** This prompt builds the shared
> scaffolding that every concept prototype depends on: the **tab bar that toggles between the
> eight concept prototypes**, the shared drug-monograph data module, and the route family. Each
> concept prompt (`A.md` … `H.md`) assumes this scaffolding already exists and only describes what
> is *different* for that concept.

You are working in the Medscape AI prototype workspace (Next.js 16 + React 19 + Tailwind v4).

## 0. Mandatory first step — component reuse

**Before writing any code, invoke the `medscape-component-reuse` skill** and follow its
inventory-before-build workflow. Inspect `src/registry/gallery.tsx`, `src/components/ui/`,
`src/components/medscape/`, `src/components/screens/`, and `src/data/`. Produce a short reuse map
(feature → existing component → change needed) before implementing. Do **not** create a duplicate
or near-copy of any component that already exists. Only create the new shared assets called out
below, and register every reusable asset in the gallery and every route in the registry.

## 1. What you are building

A family of **eight drug-monograph-in-chat concept prototypes (A–H)**, each on its own route, all
sharing one **tab bar pinned at the top** that lets a reviewer toggle between the eight concepts
without leaving the experience. This prompt builds the three shared pieces; the concept prompts
build the eight bodies.

Source of truth for the concepts: the spec files in `AI drug search/` —
`00 - Index & Shared Architecture.md` (the shared orchestration model, the **Drug Response
Contract**, and the long-section rules) plus `A …` through `H …`. Read `00 - Index` before building
the data module — the data shape below is a direct implementation of its Drug Response Contract.

## 2. Shared piece 1 — `DrugConceptTabBar` (new shared component)

Create `src/components/medscape/drug-concepts/concept-tab-bar.tsx` exporting `DrugConceptTabBar`.

- Renders a horizontal, scrollable strip of **eight tabs**, one per concept, in order A→H.
- Each tab shows the concept letter + a short label (e.g. `A · Dashboard Card`,
  `B · Monograph Canvas`, `C · Accordion`, `D · Workflow Chips`, `E · Answer Tabs`,
  `F · Instant Card`, `G · Pinned Rail`, `H · Mobile Sheets`).
- Takes a single required prop `activeConcept: "A" | "B" | … | "H"`; the active tab is visually
  promoted (filled/underlined using design tokens from `src/styles/tokens.css` — no hardcoded
  hex where a token exists).
- Tabs navigate between the eight routes. **Reuse `AnalyticsLink`**
  (`src/components/analytics/analytics-link.tsx`) for each tab so navigation is tracked, rather
  than hand-rolling `<a>`/router calls. Fire a `concept_tab_switched` event with
  `{ from_concept, to_concept, destination_route }`.
- Sticky at the top of the viewport, horizontally scrollable on mobile with large tap targets, no
  layout shift. It is presentation + navigation only — it owns no concept state.
- Export a single shared `DRUG_CONCEPTS` array (letter, label, route, title) and drive both the tab
  bar and the registry entries from it so the list never drifts.

Register `DrugConceptTabBar` in `src/registry/gallery.tsx` under the `navigation` category with
usage notes ("Pin at the top of every drug-concept prototype; pass the current concept letter as
`activeConcept`. Do not fork per concept.").

## 3. Shared piece 2 — `DrugConceptShell` (new shared layout component)

Create `src/components/medscape/drug-concepts/concept-shell.tsx` exporting `DrugConceptShell`.

- Thin layout wrapper that renders the **`DrugConceptTabBar` pinned at top** + a branded frame, then
  `children` below (the concept body).
- Reuse the existing chat chrome where it fits: the white rounded chat panel, gradient background,
  and `AiMobileTopRail` treatment from `AiResponseScreen`
  (`src/components/screens/ai-response-screen.tsx`). Do **not** duplicate that markup wholesale —
  extract/reuse, and if a piece is genuinely shared, factor the minimal reusable bit rather than
  copy-pasting the whole screen.
- Props: `activeConcept`, optional `header`, `children`. Keep it presentational.

Every concept screen renders inside `DrugConceptShell` so the tab bar is identical across all eight.

## 4. Shared piece 3 — `src/data/drug-monograph.ts` (new typed data module)

Implement the **Drug Response Contract** from `00 - Index & Shared Architecture.md` as a typed mock
for **apixaban** (the running example in the specs). This is the single source of drug facts that
all eight concepts read from — concepts differ in rendering, not data.

Model these types and export a populated `apixabanMonograph` constant:

```ts
export type DrugMonographSource = { label: string; url: string; section: string };
export type DrugSubfield = {
  id: string;            // e.g. "dosing.renal_adjustment"
  title: string;         // "Renal impairment"
  summary: string;       // one-line scannable summary
  body: string[];        // verbatim canonical paragraphs (lazy-rendered on demand)
  source: DrugMonographSource;
};
export type DrugSection = {
  id: string;            // "dosing" | "safety" | "interactions" | "renal_hepatic" | "adverse"
  title: string;
  lengthEstimate: "short" | "long";
  subfields: DrugSubfield[];
};
export type DrugBlackBoxWarning = { id: string; text: string; source: DrugMonographSource };
export type DrugKeyField = { subfieldId: string; label: string };   // for F's "key fields" card
export type DrugTaskChip = { id: string; label: string; subfieldIds: string[] }; // for D/H
export type DrugSynthesizedAnswer = {
  text: string;
  citations: { marker: number; anchor: string }[];   // anchor → subfield id
};
export type DrugMonograph = {
  drug: { id: string; name: string; class: string };
  blackBoxWarnings: DrugBlackBoxWarning[];
  keyFields: DrugKeyField[];
  taskChips: DrugTaskChip[];
  sections: DrugSection[];
};
```

Populate apixaban realistically per `00 - Index` (Factor Xa inhibitor; Dosing section is **long**
with subfields AFib `dosing.afib`, 2.5 mg criteria `dosing.dose_reduction`, DVT/PE `dosing.dvt_pe`,
renal `dosing.renal_adjustment`, hepatic `dosing.hepatic`, administration; plus Safety,
Interactions, Renal/Hepatic, Adverse sections). Add task chips matching Concept D
(`AFib dosing`, `DVT/PE treatment`, `Renal dosing`, `Interactions`, `Perioperative interruption`)
mapped to their subfield sets, a `keyFields` list for Concept F, and one or two example
`DrugSynthesizedAnswer` objects for the synthesis concepts (E, G).

Also export a small helper to look up a subfield by anchor id, and a helper that returns the
`matchedIntent` subfield given a query string (simple keyword match: "renal" → renal subfield,
"perioperative" → peri-op, etc.) so concepts can demo context pre-expansion/auto-routing.

> Note: `src/data/drug-ai-tables.ts` (amoxicillin) is a different, table-oriented shape used by the
> existing Drug AI tables prototype. Do not overload it — create `drug-monograph.ts` for these
> concepts. Reuse `AiAnswerReference`/supporting-content shapes from `src/data/ai-response.ts` where
> a concept needs references/follow-ups.

## 5. Routes & registry

Create eight thin route files under `src/app/(prototypes)/`, one per concept, each rendering only
its screen component (keep `page.tsx` logic-free per CLAUDE.md):

| Concept | Slug / route | Screen component (built in concept prompt) |
|---|---|---|
| A | `drug-concept-a` | `DrugConceptDashboardCardScreen` |
| B | `drug-concept-b` | `DrugConceptMonographCanvasScreen` |
| C | `drug-concept-c` | `DrugConceptAccordionScreen` |
| D | `drug-concept-d` | `DrugConceptWorkflowChipsScreen` |
| E | `drug-concept-e` | `DrugConceptAnswerTabsScreen` |
| F | `drug-concept-f` | `DrugConceptInstantCardScreen` |
| G | `drug-concept-g` | `DrugConceptPinnedRailScreen` |
| H | `drug-concept-h` | `DrugConceptMobileSheetsScreen` |

Add all eight to `src/registry/prototypes.ts` with `tags: ["medscape-ai", "drug-reference", "drug-concept"]`,
descriptive titles ("Concept A — Inline Clinical Dashboard Card", etc.), and `status: "active"`.
Drive these from the shared `DRUG_CONCEPTS` array so tab bar and registry stay in sync.

## 6. Long-section rule (applies to every concept)

Enforce `00 - Index` shared constraint #2 in the data + components: never dump a full long section;
render subfield `summary` first and the verbatim `body` only on demand; **black-box warnings and
contraindications always render eagerly, outside any collapse.** Each concept prompt restates how it
applies this.

## 7. Acceptance

- `pnpm lint` and `pnpm build` pass.
- `/` lists all eight concept prototypes; `/gallery` shows `DrugConceptTabBar`.
- Visiting any concept route shows the **tab bar at the top with that concept active**, and every
  tab navigates to the matching prototype.
- All eight concepts read drug facts from `src/data/drug-monograph.ts` — no inlined drug strings.
- No duplicate components were created for features the library already covers.
