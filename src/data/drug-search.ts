// Free-text drug search for /ai-drug-mono-v2 (manual composer input only).
//
// Mirrors the POC backend's orchestrator flow against the bundled, verbatim POC
// content (drug-monograph-poc-data.ts):
//   typed text -> resolve a drug name (exact generic/brand + fuzzy misspelling)
//               -> detect an optional section intent ("apixaban dosing")
//               -> anchor the monograph card at that section (or default to the
//                  adult Forms & Strengths subfield when no section is named).
//
// The 4.4 MB POC dataset is loaded lazily (dynamic import) so it never weighs
// down the landing page or the scripted scenarios — it is fetched only the first
// time a physician types a real drug query.

import type { DrugMonograph } from "./drug-monograph";
import type { PocNameIndexEntry } from "./drug-monograph-poc-data";

export type DrugSearchMatch = {
  /** Subfield id to open/flash in the card (section intent, or adult F&S). */
  anchor: string;
  drugId: string;
  drugName: string;
  /** Canonical taxonomy section id the query targeted, or null when none. */
  sectionId: string | null;
};

// ── lazy-loaded, cached POC data ────────────────────────────────────────────────
let monographsById: Map<string, DrugMonograph> | null = null;
let nameIndex: PocNameIndexEntry[] | null = null;
let byNorm: Map<string, PocNameIndexEntry[]> | null = null;
let uniqueNorms: string[] = [];
let loadPromise: Promise<void> | null = null;

async function loadPocData(): Promise<void> {
  if (monographsById) return;
  if (!loadPromise) {
    loadPromise = import("./drug-monograph-poc-data").then((mod) => {
      monographsById = new Map(mod.POC_MONOGRAPHS.map((m) => [m.drug.id, m]));
      nameIndex = mod.POC_NAME_INDEX;
      const grouped = new Map<string, PocNameIndexEntry[]>();
      for (const entry of nameIndex) {
        const list = grouped.get(entry.norm);
        if (list) list.push(entry);
        else grouped.set(entry.norm, [entry]);
      }
      byNorm = grouped;
      uniqueNorms = [...grouped.keys()];
    });
  }
  await loadPromise;
}

/** Cached lookup — only valid after resolveDrugQuery() has loaded the data. */
export function getPocMonographById(id: string): DrugMonograph | undefined {
  return monographsById?.get(id);
}

/** Fire-and-forget warm-up so the first manual query resolves instantly. */
export function warmDrugSearch(): void {
  void loadPocData();
}

// ── normalization + resolution (mirrors POC server.mjs) ─────────────────────────
const norm = (s: string) => (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "");

// Bounded Levenshtein for misspelling tolerance ("match or nothing").
function lev(a: string, b: string, max: number): number {
  const m = a.length;
  const n = b.length;
  if (Math.abs(m - n) > max) return max + 1;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let cur = new Array<number>(n + 1);
  for (let i = 1; i <= m; i++) {
    cur[0] = i;
    let best = cur[0];
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (cur[j] < best) best = cur[j];
    }
    if (best > max) return max + 1;
    [prev, cur] = [cur, prev];
  }
  return prev[n];
}

// From a set of matched name entries, choose one drug (prefer the drug whose own
// primary name this is over products that merely list it as an ingredient).
function pickDrug(entries: PocNameIndexEntry[]): PocNameIndexEntry | null {
  const ids = [...new Set(entries.map((e) => e.id))];
  if (ids.length === 1) return entries.find((e) => e.matchType === "generic") ?? entries[0];
  const prim = entries.filter((e) => e.primary);
  const pids = [...new Set(prim.map((e) => e.id))];
  if (pids.length === 1) return prim.find((e) => e.matchType === "generic") ?? prim[0];
  return null;
}

function resolveName(candidate: string): PocNameIndexEntry | null {
  const q = norm(candidate);
  if (!q || !byNorm) return null;

  const exact = byNorm.get(q);
  if (exact) return pickDrug(exact);

  // fuzzy — budget scales with length, same as the POC resolver
  const budget = q.length <= 5 ? 1 : q.length <= 9 ? 2 : 3;
  let best = budget + 1;
  let hits: string[] = [];
  for (const cand of uniqueNorms) {
    if (Math.abs(cand.length - q.length) > best) continue;
    const d = lev(q, cand, best);
    if (d < best) {
      best = d;
      hits = [cand];
    } else if (d === best) {
      hits.push(cand);
    }
  }
  if (best > budget || hits.length === 0) return null;
  return pickDrug(hits.flatMap((h) => byNorm!.get(h) ?? []));
}

// ── section intent detection ────────────────────────────────────────────────────
// Canonical taxonomy ids, in routing-precedence order. When a query names more
// than one section, the first match here wins.
const SECTION_MATCHERS: { id: string; terms: string[] }[] = [
  {
    id: "dosing",
    terms: [
      "dosing & uses", "dosing and uses", "dose reduction", "dosing", "dosage",
      "doses", "dose", "uses", "indications", "indication", "forms & strengths",
      "forms and strengths", "strengths", "renal", "kidney", "hepatic", "liver",
      "crcl", "gfr",
    ],
  },
  {
    id: "interactions",
    terms: ["drug interactions", "interactions", "interaction", "interacts", "interact"],
  },
  {
    id: "adverse",
    terms: [
      "adverse effects", "adverse effect", "adverse", "side effects",
      "side effect", "reactions",
    ],
  },
  {
    id: "safety",
    terms: [
      "black box", "boxed warning", "boxed", "warnings", "warning",
      "contraindications", "contraindication", "precautions", "precaution",
    ],
  },
  {
    id: "pregnancy",
    terms: [
      "pregnancy & lactation", "pregnancy", "pregnant", "lactation",
      "breastfeeding", "breast feeding", "nursing",
    ],
  },
  {
    id: "pharmacology",
    terms: [
      "pharmacology", "mechanism of action", "mechanism", "pharmacokinetics",
      "pharmacodynamics", "half-life", "half life", "metabolism",
    ],
  },
  {
    id: "administration",
    terms: [
      "administration", "administer", "how to take", "storage", "reconstitution",
      "preparation",
    ],
  },
];

// Every section term, longest first, so multi-word phrases strip before their
// component words when deriving the drug-name candidate.
const ALL_TERMS = [...new Set(SECTION_MATCHERS.flatMap((s) => s.terms))].sort(
  (a, b) => b.length - a.length,
);

function hasTerm(text: string, term: string): boolean {
  // word-ish boundary match so "dose" doesn't fire inside "glucose"
  const escaped = term.replace(/[.*+?^${}()|[\]\\&]/g, "\\$&");
  return new RegExp(`(^|[^a-z])${escaped}([^a-z]|$)`, "i").test(text);
}

// ── anchoring ─────────────────────────────────────────────────────────────────
// Default landing subfield = the adult Forms & Strengths row (first in the
// combined Dosing & Uses section). Falls back to the first adult / first subfield.
function adultFormsAndStrengthsAnchor(monograph: DrugMonograph): string | undefined {
  const dosing = monograph.sections.find((s) => s.id === "dosing");
  const subs = dosing?.subfields ?? monograph.sections[0]?.subfields ?? [];
  const fs = subs.find(
    (sf) => sf.population !== "pediatric" && sf.id.startsWith("adult-dosage-f-s"),
  );
  const firstAdult = subs.find((sf) => sf.population !== "pediatric");
  return (fs ?? firstAdult ?? subs[0])?.id;
}

function sectionFirstAnchor(monograph: DrugMonograph, sectionId: string): string | undefined {
  const section = monograph.sections.find((s) => s.id === sectionId);
  if (!section) return undefined;
  if (sectionId === "dosing") return adultFormsAndStrengthsAnchor(monograph);
  return section.subfields[0]?.id;
}

// ── entry point ───────────────────────────────────────────────────────────────
/**
 * Resolve a manually typed query to a drug + optional section anchor.
 * Returns null when no drug in the bundled catalog matches (→ scripted fallback).
 */
export async function resolveDrugQuery(text: string): Promise<DrugSearchMatch | null> {
  await loadPocData();
  const raw = text.trim().toLowerCase();
  if (!raw) return null;

  // 1) detect section intent from the whole query
  let sectionId: string | null = null;
  for (const matcher of SECTION_MATCHERS) {
    if (matcher.terms.some((term) => hasTerm(raw, term))) {
      sectionId = matcher.id;
      break;
    }
  }

  // 2) strip section terms + filler to get the drug-name candidate
  let candidate = raw;
  for (const term of ALL_TERMS) {
    candidate = candidate.replace(new RegExp(`(^|[^a-z])${term.replace(/[.*+?^${}()|[\]\\&]/g, "\\$&")}([^a-z]|$)`, "gi"), " ");
  }
  candidate = candidate
    .replace(/\b(for|the|of|a|an|what|is|are|and|in|with|section|info|information|monograph|drug)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  // 3) resolve the candidate; fall back to the full query if stripping was too aggressive
  let entry = resolveName(candidate);
  if (!entry) entry = resolveName(raw);
  if (!entry) return null;

  const monograph = getPocMonographById(entry.id);
  if (!monograph) return null;

  const anchor =
    (sectionId ? sectionFirstAnchor(monograph, sectionId) : undefined) ??
    adultFormsAndStrengthsAnchor(monograph);
  if (!anchor) return null;

  // Only report a section when its anchor actually resolved in this drug.
  const resolvedSection = sectionId && monograph.sections.some((s) => s.id === sectionId)
    ? sectionId
    : null;

  return { anchor, drugId: entry.id, drugName: monograph.drug.name, sectionId: resolvedSection };
}
