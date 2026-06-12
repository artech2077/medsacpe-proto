// Concept family definition — no client directive so it can be imported in both server and client components.

export type DrugConceptLetter = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I";

export type DrugConceptDefinition = {
  description: string;
  label: string;
  letter: DrugConceptLetter;
  route: string;
  title: string;
};

export const DRUG_CONCEPTS: DrugConceptDefinition[] = [
  {
    description:
      "Chat reply renders as a rich dashboard card embedded in the bubble — a compact grid of clinical zones, each showing the top subfield verbatim. Tap a tile to expand in place.",
    label: "Dashboard Card",
    letter: "A",
    route: "/drug-concept-a",
    title: "Concept A — Inline Clinical Dashboard Card",
  },
  {
    description:
      "Reply gives a one-line pointer and an Open monograph button that launches a side canvas scrolled to the exact subfield. Chat stays live alongside.",
    label: "Monograph Canvas",
    letter: "B",
    route: "/drug-concept-b",
    title: "Concept B — Expandable Monograph Canvas",
  },
  {
    description:
      "Single chat message with a nested accordion: sections collapsed to summaries, expanding to subfields, expanding to verbatim body. Sticky jump bar at the top.",
    label: "Accordion",
    letter: "C",
    route: "/drug-concept-c",
    title: "Concept C — Progressive Accordion Answer",
  },
  {
    description:
      "A bare drug query returns a useful default card plus a row of task chips (AFib dosing, Renal, Perioperative…). Tapping a chip re-sequences the answer for that task.",
    label: "Workflow Chips",
    letter: "D",
    route: "/drug-concept-d",
    title: "Concept D — Workflow Mode (Intent Chips)",
  },
  {
    description:
      "Each reply carries top-of-message tabs: Answer (cited AI synthesis) · Drug Information (monograph card) · References. Citation chips jump to the exact subfield.",
    label: "Answer Tabs",
    letter: "E",
    route: "/drug-concept-e",
    title: "Concept E — Answer + Drug Card Tabs",
  },
  {
    description:
      "Instant deterministic card — drug, BBW, and verbatim key fields — no AI prose in the first state. Ask AI is opt-in as a clearly-labeled next turn.",
    label: "Instant Card",
    letter: "F",
    route: "/drug-concept-f",
    title: "Concept F — Instant Deterministic Answer Card",
  },
  {
    description:
      "Natural back-and-forth conversation with a canonical drug card pinned alongside as a persistent rail. Every claim links into the matching subfield on the rail.",
    label: "Pinned Rail",
    letter: "G",
    route: "/drug-concept-g",
    title: "Concept G — Conversational Thread + Pinned Drug Rail",
  },
  {
    description:
      "Mobile-first design: reply shows a field-switcher chip strip (Dosing / Warnings / Interactions / Renal). Tapping a field raises a bottom sheet with the canonical content.",
    label: "Mobile Sheets",
    letter: "H",
    route: "/drug-concept-h",
    title: "Concept H — Mobile-First Chat Answer",
  },
  {
    description:
      "Leading candidate merging E and C: every reply carries Answer · Drug Information · References tabs with the canonical monograph as a progressive accordion. A grouped scenario picker demonstrates all nine drug-question solution patterns (S1–S9), scripted and deterministic.",
    label: "Unified",
    letter: "I",
    route: "/drug-concept-i",
    title: "Concept I — Unified Canonical Experience (Accordion + Tabs)",
  },
];
