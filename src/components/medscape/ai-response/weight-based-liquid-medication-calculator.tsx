"use client";

import { useMemo, useState } from "react";

type UnitOption = {
  label: string;
  value: string;
};

type CalculatorQuestion = {
  label: string;
  units: UnitOption[];
};

const QUESTIONS: CalculatorQuestion[] = [
  {
    label: "Patient weight",
    units: [
      { label: "kg", value: "kg" },
      { label: "lb", value: "lb" },
    ],
  },
  {
    label: "Dosage (per day)",
    units: [
      { label: "mg/kg", value: "mg/kg" },
      { label: "g/kg", value: "g/kg" },
      { label: "mcg/kg", value: "mcg/kg" },
    ],
  },
  {
    label: "Liquid formulation — medication amount",
    units: [
      { label: "mg", value: "mg" },
      { label: "grams", value: "g" },
      { label: "mcg", value: "mcg" },
    ],
  },
  {
    label: "Liquid formulation — per volume",
    units: [
      { label: "mL", value: "mL" },
      { label: "L", value: "L" },
    ],
  },
];

const FREQUENCIES = [
  { dosesPerDay: 1, label: "q24hr (qDay)" },
  { dosesPerDay: 2, label: "q12hr (BID)" },
  { dosesPerDay: 3, label: "q8hr (TID)" },
  { dosesPerDay: 4, label: "q6hr (QID)" },
  { dosesPerDay: 6, label: "q4hr" },
  { dosesPerDay: 8, label: "q3hr" },
  { dosesPerDay: 12, label: "q2hr" },
  { dosesPerDay: 24, label: "q1hr" },
] as const;

function asNumber(value: string) {
  const number = Number(value.replace(",", "."));
  return Number.isFinite(number) && number > 0 ? number : null;
}

function toMilligrams(value: number, unit: string) {
  if (unit === "g") return value * 1000;
  if (unit === "mcg") return value / 1000;
  return value;
}

function toKilograms(value: number, unit: string) {
  return unit === "lb" ? value / 2.20462 : value;
}

function format(value: number, fractionDigits = 2) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: value % 1 === 0 ? 0 : Math.min(1, fractionDigits),
  }).format(value);
}

export function calculateWeightBasedLiquidMedicationDose({
  concentrationAmount,
  concentrationAmountUnit,
  concentrationVolume,
  concentrationVolumeUnit,
  dosage,
  dosageUnit,
  dosesPerDay,
  weight,
  weightUnit,
}: {
  concentrationAmount: number;
  concentrationAmountUnit: string;
  concentrationVolume: number;
  concentrationVolumeUnit: string;
  dosage: number;
  dosageUnit: string;
  dosesPerDay: number;
  weight: number;
  weightUnit: string;
}) {
  const dailyDoseMg = toKilograms(weight, weightUnit) * toMilligrams(dosage, dosageUnit.split("/")[0]!);
  const amountPerMl = toMilligrams(concentrationAmount, concentrationAmountUnit) /
    (concentrationVolumeUnit === "L" ? concentrationVolume * 1000 : concentrationVolume);
  const dosePerAdministrationMg = dailyDoseMg / dosesPerDay;

  return {
    dailyDoseMg,
    dosePerAdministrationMg,
    volumePerAdministrationMl: dosePerAdministrationMg / amountPerMl,
  };
}

/**
 * A local, task-scoped version of Medscape's weight-based liquid dosing flow.
 * It intentionally stays inside the prototype drawer so the answer remains
 * visible and no clinical tool is opened in a separate browser tab.
 */
export function WeightBasedLiquidMedicationCalculator() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(["", "", "", ""]);
  const [units, setUnits] = useState(["kg", "mg/kg", "mg", "mL"]);
  const [frequency, setFrequency] = useState<(typeof FREQUENCIES)[number] | null>(null);

  const currentQuestion = step === 2 ? null : QUESTIONS[step < 2 ? step : step - 1];
  const value = currentQuestion ? values[step < 2 ? step : step - 1] : "";
  const isValueValid = currentQuestion ? asNumber(value) !== null : frequency !== null;
  const calculation = useMemo(() => {
    const [weight, dosage, amount, volume] = values.map(asNumber);
    if (!weight || !dosage || !amount || !volume || !frequency) return null;

    return calculateWeightBasedLiquidMedicationDose({
      concentrationAmount: amount,
      concentrationAmountUnit: units[2]!,
      concentrationVolume: volume,
      concentrationVolumeUnit: units[3]!,
      dosage,
      dosageUnit: units[1]!,
      dosesPerDay: frequency.dosesPerDay,
      weight,
      weightUnit: units[0]!,
    });
  }, [frequency, units, values]);

  const updateValue = (index: number, nextValue: string) => {
    setValues((current) => current.map((item, itemIndex) => itemIndex === index ? nextValue : item));
  };

  const updateUnit = (index: number, nextUnit: string) => {
    setUnits((current) => current.map((item, itemIndex) => itemIndex === index ? nextUnit : item));
  };

  if (step === 4 && calculation) {
    return (
      <section aria-label="Weight-based liquid medication dosing results">
        <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#52616c]">Results</p>
        <h3 className="mt-1 text-[24px] font-bold leading-tight text-[#1c2935]">Weight-based liquid medication dosing</h3>
        <dl className="mt-5 space-y-3">
          {[
            ["Calculated amount per single dose", `${format(calculation.dosePerAdministrationMg)} mg`],
            ["Total daily dosage", `${format(calculation.dailyDoseMg)} mg`],
            ["Liquid volume per single dose", `${format(calculation.volumePerAdministrationMl)} mL`],
          ].map(([label, result]) => (
            <div key={label} className="overflow-hidden rounded-[8px] border border-[#69747b]">
              <dt className="bg-[#4b4b4b] px-4 py-2 text-[15px] font-bold text-white">{label}</dt>
              <dd className="px-4 py-2.5 text-[16px] font-bold text-[#4b4b4b] [font-variant-numeric:tabular-nums]">{result}</dd>
            </div>
          ))}
        </dl>
        <button
          type="button"
          onClick={() => setStep(0)}
          className="mt-5 rounded-[7px] border border-[#0085bd] px-4 py-2 text-[14px] font-bold text-[#0074a7] transition hover:bg-[#f0f9fd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0085bd]"
        >
          Start over
        </button>
      </section>
    );
  }

  const questionNumber = step + 1;
  const valueIndex = step < 2 ? step : step - 1;

  return (
    <section aria-label="Weight-based liquid medication dosing calculator">
      <div className="-mx-5 -mt-5 flex items-center gap-3 bg-[#4aa0d2] px-5 py-3 text-white md:-mx-7 md:-mt-6 md:px-7">
        {step > 0 ? (
          <button
            type="button"
            aria-label="Previous question"
            onClick={() => setStep((current) => current - 1)}
            className="-ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-[25px] leading-none transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            ‹
          </button>
        ) : null}
        <p className="text-[16px] font-bold">Question {questionNumber} of 5</p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <h3 className="text-[17px] font-bold text-[#4b4b4b]">
          {questionNumber}. {step === 2 ? "Frequency of dose? Once/Every" : currentQuestion?.label}
        </h3>
        <span className="shrink-0 text-[14px] font-semibold text-[#0074a7]">Default units</span>
      </div>

      {step === 2 ? (
        <div className="mt-4 overflow-hidden rounded-[7px] border border-[#79c6f2]">
          {FREQUENCIES.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => {
                setFrequency(option);
                setStep(3);
              }}
              className="block w-full border-b border-[#79c6f2] px-4 py-2.5 text-center text-[16px] font-medium text-[#4b4b4b] transition last:border-b-0 hover:bg-[#f0f9fd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0085bd]"
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="mt-4 flex gap-2">
            <input
              autoFocus
              aria-label={currentQuestion?.label}
              inputMode="decimal"
              value={value}
              onChange={(event) => updateValue(valueIndex, event.target.value)}
              className="min-w-0 flex-1 rounded-[7px] border border-[#79c6f2] px-3 py-3 text-[17px] text-[#4b4b4b] outline-none focus:border-[#0085bd] focus:ring-1 focus:ring-[#0085bd]"
            />
            <div className="flex overflow-hidden rounded-[7px] border border-[#0085bd]">
              {currentQuestion?.units.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateUnit(valueIndex, option.value)}
                  className={`min-w-12 border-r border-[#0085bd] px-2 text-[11px] font-medium last:border-r-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0085bd] ${
                    units[valueIndex] === option.value ? "bg-[#eef7fc] text-[#27333a]" : "bg-white text-[#4b4b4b] hover:bg-[#f7fbfd]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            disabled={!isValueValid}
            onClick={() => setStep((current) => current + 1)}
            className="mt-3 w-full rounded-[7px] bg-[#4aa0d2] px-4 py-2.5 text-[17px] font-bold text-white transition hover:bg-[#298cc4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0085bd] focus-visible:ring-offset-2 disabled:border disabled:border-[#9b9b9b] disabled:bg-white disabled:text-[#929292]"
          >
            {step === 3 ? "View results" : "Next question →"}
          </button>
        </>
      )}
      <p className="mt-5 text-[12px] leading-relaxed text-[#66747c]">For clinical reference only. Confirm the selected product concentration and dose before use.</p>
    </section>
  );
}
