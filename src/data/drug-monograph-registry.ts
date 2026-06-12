// Central registry for all drug monographs used in the AI Drug Search prototypes.
// Import from here (not individual files) when you need multi-drug support.

import { apixabanMonograph } from "./drug-monograph";
import {
  semaglutideMonograph,
  tirzepatideMonograph,
  liraglutideMonograph,
  insulinRegularHumanMonograph,
} from "./drug-monograph-diabetes";
import type { DrugMonograph } from "./drug-monograph";

export type DrugMonographEntry = {
  brandNames: string;
  id: string;
  monograph: DrugMonograph;
  shortName: string;
};

export const DRUG_MONOGRAPH_REGISTRY: DrugMonographEntry[] = [
  {
    brandNames: "Ozempic, Rybelsus, Wegovy",
    id: "semaglutide",
    monograph: semaglutideMonograph,
    shortName: "Semaglutide",
  },
  {
    brandNames: "Mounjaro, Zepbound",
    id: "tirzepatide",
    monograph: tirzepatideMonograph,
    shortName: "Tirzepatide",
  },
  {
    brandNames: "Victoza, Saxenda",
    id: "liraglutide",
    monograph: liraglutideMonograph,
    shortName: "Liraglutide",
  },
  {
    brandNames: "Humulin R, Novolin R",
    id: "insulin-regular-human",
    monograph: insulinRegularHumanMonograph,
    shortName: "Insulin Regular",
  },
  {
    brandNames: "Eliquis",
    id: "apixaban",
    monograph: apixabanMonograph,
    shortName: "Apixaban",
  },
];

export function getMonographById(id: string): DrugMonograph | undefined {
  return DRUG_MONOGRAPH_REGISTRY.find((e) => e.id === id)?.monograph;
}

// Re-export individual monographs for convenience
export {
  semaglutideMonograph,
  tirzepatideMonograph,
  liraglutideMonograph,
  insulinRegularHumanMonograph,
  apixabanMonograph,
};
export type { DrugMonograph };
