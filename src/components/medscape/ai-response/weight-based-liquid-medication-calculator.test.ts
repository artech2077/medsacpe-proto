import { describe, expect, it } from "vitest";
import { calculateWeightBasedLiquidMedicationDose } from "./weight-based-liquid-medication-calculator";

describe("calculateWeightBasedLiquidMedicationDose", () => {
  it("calculates the daily dose, single dose, and liquid volume", () => {
    expect(
      calculateWeightBasedLiquidMedicationDose({
        concentrationAmount: 100,
        concentrationAmountUnit: "mg",
        concentrationVolume: 5,
        concentrationVolumeUnit: "mL",
        dosage: 10,
        dosageUnit: "mg/kg",
        dosesPerDay: 2,
        weight: 20,
        weightUnit: "kg",
      }),
    ).toEqual({
      dailyDoseMg: 200,
      dosePerAdministrationMg: 100,
      volumePerAdministrationMl: 5,
    });
  });

  it("normalizes pounds, grams, micrograms, and liters before calculating", () => {
    const result = calculateWeightBasedLiquidMedicationDose({
      concentrationAmount: 1,
      concentrationAmountUnit: "g",
      concentrationVolume: 1,
      concentrationVolumeUnit: "L",
      dosage: 10_000,
      dosageUnit: "mcg/kg",
      dosesPerDay: 1,
      weight: 2.20462,
      weightUnit: "lb",
    });

    expect(result.dailyDoseMg).toBeCloseTo(10);
    expect(result.dosePerAdministrationMg).toBeCloseTo(10);
    expect(result.volumePerAdministrationMl).toBeCloseTo(10);
  });
});
