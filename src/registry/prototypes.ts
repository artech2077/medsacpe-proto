export type PrototypeDefinition = {
  description: string;
  entryRoute?: string;
  route: string;
  slug: string;
  status?: "active" | "draft";
  tags?: string[];
  title: string;
};

export function getPrototypeFamily(prototype: Pick<PrototypeDefinition, "tags">) {
  if (prototype.tags?.includes("paid-ads")) return "paid-ads";
  if (prototype.tags?.includes("current-ui")) return "medscape-ai-current";
  if (prototype.tags?.includes("drug-concept")) return "drug-concept";
  return "ai-response";
}

export const prototypeRegistry: PrototypeDefinition[] = [
  {
    description:
      "Chat reply renders as a rich dashboard card — a compact grid of clinical zone tiles (Dosing, Safety, Interactions, Renal/Hepatic, Adverse). Tap a tile to expand in place. Deterministic; no synthesized prose.",
    route: "/drug-concept-a",
    slug: "drug-concept-a",
    status: "active",
    tags: ["medscape-ai", "drug-reference", "drug-concept"],
    title: "Concept A — Inline Clinical Dashboard Card",
  },
  {
    description:
      "Chat reply gives a one-line pointer and an Open monograph button that launches a side canvas scrolled to the exact subfield anchor. The conversation stays live alongside.",
    route: "/drug-concept-b",
    slug: "drug-concept-b",
    status: "draft",
    tags: ["medscape-ai", "drug-reference", "drug-concept"],
    title: "Concept B — Expandable Monograph Canvas",
  },
  {
    description:
      "Single chat message with a nested accordion: sections collapsed to one-line summaries, expanding to subfields, expanding to verbatim canonical body. Sticky jump bar at the top.",
    route: "/drug-concept-c",
    slug: "drug-concept-c",
    status: "draft",
    tags: ["medscape-ai", "drug-reference", "drug-concept"],
    title: "Concept C — Progressive Accordion Answer",
  },
  {
    description:
      "Bare drug query returns a useful default card plus a row of clinical task chips (AFib dosing, DVT/PE, Renal, Interactions, Perioperative). Tapping a chip re-sequences the answer for that task.",
    route: "/drug-concept-d",
    slug: "drug-concept-d",
    status: "draft",
    tags: ["medscape-ai", "drug-reference", "drug-concept"],
    title: "Concept D — Workflow Mode (Intent Chips)",
  },
  {
    description:
      "Each reply carries top-of-message tabs: Answer (AI-synthesized, cited) · Drug Information (monograph card with sub-tabs) · References. Citation chips jump to the exact subfield.",
    route: "/drug-concept-e",
    slug: "drug-concept-e",
    status: "draft",
    tags: ["medscape-ai", "drug-reference", "drug-concept"],
    title: "Concept E — Answer + Drug Card Tabs",
  },
  {
    description:
      "Instant deterministic card — drug name, Black Box Warning, and verbatim key fields — with no AI prose in the first state. Ask AI is opt-in as a clearly-labeled next turn.",
    route: "/drug-concept-f",
    slug: "drug-concept-f",
    status: "draft",
    tags: ["medscape-ai", "drug-reference", "drug-concept"],
    title: "Concept F — Instant Deterministic Answer Card",
  },
  {
    description:
      "Natural back-and-forth conversation with a canonical drug card pinned alongside as a persistent rail. Every claim links into the matching subfield in the rail.",
    route: "/drug-concept-g",
    slug: "drug-concept-g",
    status: "draft",
    tags: ["medscape-ai", "drug-reference", "drug-concept"],
    title: "Concept G — Conversational Thread + Pinned Drug Rail",
  },
  {
    description:
      "Mobile-first drug chat reply: field-switcher chip strip (Dosing / Warnings / Interactions / Renal) with each field opening a bottom sheet over the thread. Swipe to dismiss.",
    route: "/drug-concept-h",
    slug: "drug-concept-h",
    status: "draft",
    tags: ["medscape-ai", "drug-reference", "drug-concept"],
    title: "Concept H — Mobile-First Chat Answer",
  },
  {
    description:
      "Leading candidate merging E and C: Answer · Drug Information · References tabs with the canonical monograph as a progressive accordion. Grouped scenario picker demonstrates all nine drug-question solution patterns (S1–S9), scripted and deterministic.",
    route: "/drug-concept-i",
    slug: "drug-concept-i",
    status: "active",
    tags: ["medscape-ai", "drug-reference", "drug-concept"],
    title: "Concept I — Unified Canonical Experience (Accordion + Tabs)",
  },
  {
    description:
      "Canonical-first answer based on the Figma design: References/Sources chips and the full monograph card render instantly, then the AI-generated answer streams in below it (references, related articles, follow-up questions) behind a ~10s shimmer.",
    route: "/drug-concept-j",
    slug: "drug-concept-j",
    status: "active",
    tags: ["medscape-ai", "drug-reference", "drug-concept"],
    title: "Concept J — Canonical Card + AI Answer",
  },
  {
    description:
      "Concept J's canonical card + AI answer experience as a standalone V1 prototype, without the A–J concept tab bar.",
    route: "/ai-drug-mono-v1",
    slug: "ai-drug-mono-v1",
    status: "active",
    tags: ["medscape-ai", "drug-reference", "drug-concept"],
    title: "AI drug mono V1",
  },
  {
    description:
      "V2 exploration workspace — starts from the AI drug mono V1 experience (canonical card + AI answer, no concept tabs) as the base for upcoming V2 changes.",
    route: "/ai-drug-mono-v2",
    slug: "ai-drug-mono-v2",
    status: "draft",
    tags: ["medscape-ai", "drug-reference", "drug-concept"],
    title: "AI drug monograph V2 explorations",
  },
];
