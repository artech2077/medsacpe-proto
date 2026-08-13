import { describe, expect, it } from "vitest";
import { getSubfieldById } from "./drug-monograph";
import { ONCOLOGY_DOSE_CONTEXT } from "./drug-intelligence-scenarios";
import {
  bevacizumabPocScenarioMonograph,
  POC_V2_SCENARIO_MONOGRAPHS,
} from "./drug-monograph-poc-v2-scenarios";

describe("POC V2 monograph snapshots", () => {
  it("assigns a unique subfield ID to every sibling rendered by the accordion", () => {
    for (const monograph of POC_V2_SCENARIO_MONOGRAPHS) {
      const assertUniqueSiblingIds = (
        subfields: typeof monograph.sections[number]["subfields"],
        location: string,
      ) => {
        for (const subfield of subfields) {
          if (subfield.subsections) {
            assertUniqueSiblingIds(subfield.subsections, subfield.title);
          }
        }
        const ids = subfields.map((subfield) => subfield.id);

        expect(
          new Set(ids).size,
          `${monograph.drug.name}: ${location} contains duplicate accordion keys`,
        ).toBe(ids.length);
      };

      for (const section of monograph.sections) {
        assertUniqueSiblingIds(section.subfields, section.title);
      }
    }
  });

  it("groups POC dosing into adult and pediatric tabs with nested dosage forms", () => {
    const dosing = bevacizumabPocScenarioMonograph.sections.find(
      (section) => section.id === "dosing",
    );
    const dosageForms = dosing?.subfields.find(
      (subfield) => subfield.id === "adult-dosage-f-s",
    );

    expect(dosing?.title).toBe("Dosing & Uses");
    expect(dosing?.subfields.some((subfield) => subfield.population === "adult")).toBe(true);
    expect(dosing?.subfields.some((subfield) => subfield.population === "pediatric")).toBe(true);
    expect(dosageForms?.title).toBe("Dosage Forms & Strengths");
    expect(dosageForms?.subsections?.map((subfield) => subfield.title)).toEqual([
      "injectable solution",
      "Biosimilar to Avastin",
    ]);
    expect(
      getSubfieldById(
        bevacizumabPocScenarioMonograph,
        "adult-dosage-f-s.injectable-solution",
      )?.title,
    ).toBe("injectable solution");
  });

  it("uses the reference monograph section order and names", () => {
    expect(
      bevacizumabPocScenarioMonograph.sections.map((section) => section.title),
    ).toEqual([
      "Dosing & Uses",
      "Interactions",
      "Adverse Effects",
      "Warnings",
      "Pregnancy",
      "Pharmacology",
      "Administration",
    ]);
  });

  it("keeps the shared oncology calculator tied to the FOLFOX4 POC row", () => {
    expect(ONCOLOGY_DOSE_CONTEXT.mgPerKg).toBe(10);
    expect(ONCOLOGY_DOSE_CONTEXT.sourceAnchor).toBe(
      "adult-dosing-uses.in-combination-with-fluorouracil-based-chemotherapy",
    );
    expect(
      getSubfieldById(
        bevacizumabPocScenarioMonograph,
        ONCOLOGY_DOSE_CONTEXT.sourceAnchor,
      )?.body,
    ).toContain(ONCOLOGY_DOSE_CONTEXT.sourceLine);
  });
});
