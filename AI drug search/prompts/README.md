# Drug Monograph Concept — Build Prompts

One build prompt per UX concept from the specs in `AI drug search/`. Each prompt instructs a coding
agent to build an **interactive prototype** for that concept in this Next.js workspace, with:

- a **tab bar pinned at the top** that toggles between all eight concept prototypes (A–H);
- **reuse of the existing component library** (`src/components/medscape/**`, `src/components/ui/**`);
- a **mandatory first step** to invoke the `medscape-component-reuse` skill and inventory before
  building.

## Order of execution

1. **`00 - Shared Prototype Shell & Tab Bar.md`** — build this first. It creates the shared tab bar
   (`DrugConceptTabBar`), the layout shell (`DrugConceptShell`), the apixaban Drug Response Contract
   data (`src/data/drug-monograph.ts`), and the eight routes/registry entries.
2. Then any concept prompt below (independent of each other once `00` exists):

| Prompt | Concept | Route |
|---|---|---|
| `A - Inline Clinical Dashboard Card.md` | Tile-grid dashboard card in the bubble | `/drug-concept-a` |
| `B - Expandable Monograph Canvas.md` | Side canvas/panel beside chat | `/drug-concept-b` |
| `C - Progressive Accordion Answer.md` | Nested accordion in one message | `/drug-concept-c` |
| `D - Workflow Mode (Intent Chips).md` | Task chips re-sequence the answer | `/drug-concept-d` |
| `E - Answer + Drug Card Tabs (Vera-inspired).md` | Answer/Drug Info/References tabs ⭐ | `/drug-concept-e` |
| `F - Instant Deterministic Answer Card (Doximity-inspired).md` | Deterministic-first card, opt-in AI | `/drug-concept-f` |
| `G - Conversational Thread + Pinned Drug Rail.md` | Chat thread + pinned canonical rail | `/drug-concept-g` |
| `H - Mobile-First Chat Answer (Epocrates-inspired).md` | Field switcher + bottom sheets | `/drug-concept-h` |
| `I - Unified Canonical Experience (Accordion + Tabs).md` | C + E merged; grouped scenario picker covering all use-case patterns (S1–S9) ⭐ leading candidate | `/drug-concept-i` |

Each concept prompt restates only what differs from the shared architecture; read the matching spec
file in the parent folder plus `00 - Index & Shared Architecture.md` for full context.
