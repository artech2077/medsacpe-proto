# Drug Monograph in Medscape AI — Concept Specs

This folder holds one detailed spec per UX concept for integrating the canonical Medscape drug monograph into the **Medscape AI chat** experience. Read this file first — it defines the shared orchestration model, the data contract, and the long-section handling principle that every concept inherits. Each concept file then specifies only what is *different*.

## Files

- `00 - Index & Shared Architecture.md` ← you are here
- `A - Inline Clinical Dashboard Card.md`
- `B - Expandable Monograph Canvas.md`
- `C - Progressive Accordion Answer.md`
- `D - Workflow Mode (Intent Chips).md`
- `E - Answer + Drug Card Tabs (Vera-inspired).md`
- `F - Instant Deterministic Answer Card (Doximity-inspired).md`
- `G - Conversational Thread + Pinned Drug Rail.md`
- `H - Mobile-First Chat Answer (Epocrates-inspired).md`

The original Concept 1 (current Medscape *website* monograph page) is **not** here — it is a standalone web page, not a chat experience. The testing **Control** is a chat-native baseline: a plain AI answer plus a link out to the website monograph.

---

## Shared constraint #1 — Every query goes through the AI orchestrator (LangGraph)

There is no path where the frontend talks to the monograph store directly. **Every** physician message enters a LangGraph orchestration graph. The concepts differ only in which nodes run and what the final payload looks like — not in whether orchestration happens.

### The shared graph (baseline all concepts extend)

```
                ┌─────────────┐
   user msg ───▶│   router    │  intent classification + drug NER
                └──────┬──────┘
          drug_lookup? │ no ──▶ general_answer (existing AI Search behavior)
                  yes  ▼
                ┌─────────────┐
                │ intent_parse│  field intent (dosing/safety/interactions/renal/peri-op…)
                │             │  + context flags (indication, eGFR, age, weight, co-meds)
                └──────┬──────┘
                       ▼
                ┌──────────────────┐
                │ monograph_retrieve│  DETERMINISTIC fetch from Drug Reference store
                │                  │  keyed by drug_id + section_id + sub_field_id
                └──────┬───────────┘
                       ▼
           (optional) ┌───────────┐
                       │ synthesize │  LLM, CONSTRAINED to retrieved fields only,
                       │            │  emits citations back to field anchors
                       └─────┬──────┘
                             ▼
                ┌──────────────────┐
                │ response_builder │  packages the Drug Response Contract (below)
                └──────┬───────────┘
                       ▼
                  frontend renders the concept
```

- **`router`** decides drug intent. If yes, drug queries **bypass generic web/RAG answer generation** (a remit requirement).
- **`intent_parse`** extracts the *field* intent and any *context* in the query (indication, renal function, age, weight, interacting drug). This is what lets us retrieve a **sub-field**, not the whole section.
- **`monograph_retrieve`** is deterministic and is the *only* source of drug facts. It returns structured JSON with stable anchors.
- **`synthesize`** runs **only for concepts that show a generated answer** (E, G, and the optional "Ask AI" in F). It is hard-constrained to the retrieved context and must cite field anchors. Concepts A, B, C, D, H can run with synthesis **off** (deterministic only).
- **Thread state** persists `drug_id`, last `section_id`, and context flags, so follow-ups skip re-classification and stay in drug context.

### The Drug Response Contract (what `response_builder` returns)

Every concept renders from the same payload shape; they just use different parts of it.

```json
{
  "drug": { "id": "apixaban", "name": "Apixaban", "class": "Factor Xa inhibitor" },
  "black_box_warnings": [ { "id": "bbw_1", "text": "...", "source": {...} } ],
  "matched_intent": { "field": "dosing", "subfield": "renal_adjustment",
                      "context": { "indication": "AFib", "eGFR": 35 } },
  "answer": {                       // present only if synthesize ran
    "text": "At eGFR ~35 ... not reduced for renal function alone ...",
    "citations": [ { "marker": 1, "anchor": "dosing.renal_adjustment" } ]
  },
  "sections": [
    {
      "id": "dosing", "title": "Dosing & Administration",
      "length_estimate": "long",          // drives long-section handling
      "subfields": [
        { "id": "dosing.afib", "title": "Nonvalvular AF", "anchor": "...",
          "summary": "5 mg PO BID", "body": "...verbatim canonical text...",
          "source": { "label": "Drug Reference", "url": "...", "section": "Dosing > AF" } },
        { "id": "dosing.dose_reduction", "title": "2.5 mg BID criteria", ... },
        { "id": "dosing.dvt_pe", "title": "DVT/PE treatment", ... },
        { "id": "dosing.renal_adjustment", "title": "Renal impairment", ... },
        { "id": "dosing.hepatic", "title": "Hepatic impairment", ... }
      ]
    },
    { "id": "safety", ... }, { "id": "interactions", ... }, ...
  ]
}
```

The critical design decision lives here: **the monograph is exposed as sections → sub-fields with stable anchors and a `summary` per sub-field**, not as one HTML blob. Everything below depends on it.

---

## Shared constraint #2 — Monograph sections are LONG (≥2 mobile viewports)

A real "Dosing" section for a drug like apixaban runs well past two mobile viewports (multiple indications, dose-reduction criteria, renal/hepatic adjustment, conversion, administration). If any concept dumps a full section into the chat, it fails the core goal of *faster* retrieval.

The shared principle, enforced at the data layer above and applied per concept below:

1. **Retrieve the sub-field, not the section.** When intent is known (`dosing.renal_adjustment`), return that sub-field first. The orchestrator should almost never hand back an entire long section as the primary answer.
2. **Every sub-field has a one-line `summary`** for scannable rendering; the verbatim `body` is fetched/expanded on demand (lazy load).
3. **Long sections always carry an internal jump map** (their sub-field list as anchors) so a long block is navigable, never a blind scroll.
4. **Default-collapsed long bodies must never hide a safety item** — black-box warnings and contraindications render eagerly, outside any collapse.

Each concept file has a dedicated "Handling long sections" section describing how it applies these four rules in its specific layout.

---

## How to read a concept spec

Each file follows the same structure:

1. **Summary** — one paragraph.
2. **Detailed description** — exactly what the physician sees and does in chat.
3. **Story map** — user activities (backbone) → steps → user stories, sliced into Round-1 (test) vs Later.
4. **Handling long sections** — concept-specific application of the four rules above.
5. **LangGraph implementation** — which nodes run, synthesis on/off, what the response_builder emits, frontend rendering notes.
6. **Assumptions to test** — each with a validation method and a kill/keep signal.
7. **Risks & open questions.**
