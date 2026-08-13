"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  evaluateDoseReductionCriteria,
  ONCOLOGY_DOSE_CONTEXT,
  PATIENT_CLARIFY_STEPS,
  PATIENT_CONTEXT,
  type PatientClarifyStep,
  type PatientContextField,
} from "@/data/drug-intelligence-scenarios";

// ─── DrugPatientContextPanel ────────────────────────────────────────────────────
// V2 patient-specific criteria matching (Connected Drug Intelligence, Moment 2).
// A compact inline module: AI-extracted values render as editable fields that
// the physician must CONFIRM before any result appears; the result itself is a
// deterministic threshold match against the published monograph criteria — no
// recommendation, probability, confidence score, or AI badge. Values are
// session-only and visibly scoped to this task.

type PanelPhase = "confirm" | "edit" | "result";

function DeterministicFrame({
  badge,
  children,
  title,
}: {
  badge: string;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section
      aria-label={title}
      className="dc-rise overflow-hidden rounded-[14px] border border-[#dce6f0] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.05)]"
    >
      <header className="flex items-center gap-2 border-b border-[#edf2f7] bg-[#f8fafc] px-4 py-2.5">
        <span aria-hidden="true" className="text-[var(--mscp-color-brand-primary)]">
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="5" r="2.6" />
            <path d="M3 13.5c.7-2.4 2.6-3.7 5-3.7s4.3 1.3 5 3.7" />
          </svg>
        </span>
        <h3 className="text-[13px] font-bold text-[#22303c]">{title}</h3>
        <span className="ml-auto rounded-full bg-[rgba(6,74,167,0.07)] px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.08em] text-[var(--mscp-color-brand-primary)]">
          {badge}
        </span>
      </header>
      {children}
    </section>
  );
}

function CriterionIcon({ matches }: { matches: boolean }) {
  return matches ? (
    <span
      aria-hidden="true"
      className="mt-0.5 inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#e2f5ea] text-[#067647]"
    >
      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m2.5 6.5 2.4 2.4L9.5 3.5" />
      </svg>
    </span>
  ) : (
    <span
      aria-hidden="true"
      className="mt-0.5 inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#f1f5f9] text-[#8497a9]"
    >
      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M3 6h6" />
      </svg>
    </span>
  );
}

type DrugPatientContextPanelProps = {
  /** Label for the compare action, e.g. "Compare with rivaroxaban". */
  compareLabel?: string;
  /** Values for this check only (field id → string). Missing fields start
   * empty; omit entirely to use the scripted example values. Values are
   * per-instance — they are never carried to another turn. */
  initialValues?: Record<string, string>;
  onCancel?: () => void;
  onCompare?: () => void;
  /** Analytics hook — receives field TYPES present, never patient values. */
  onConfirm?: (fieldIds: string[]) => void;
  /** Open the monograph at a source anchor (criteria trace / renal row). */
  onOpenSource?: (anchor: string) => void;
  /** Move the canonical card's anchor (renal-guidance row selection). */
  onSelectRenalAnchor?: (anchor: string) => void;
  /** Reuses the patient-context component for a labeled weight-based oncology
   * calculation rather than the default AF dose-reduction check. */
  oncologyDose?: typeof ONCOLOGY_DOSE_CONTEXT;
  /** Bare content for a responsive feature panel; inline cards retain their frame. */
  presentation?: "inline" | "panel";
  /** Values were already confirmed upstream (patient-details prompt) — render
   * the deterministic result immediately; Edit remains available. */
  startInResult?: boolean;
};

function OncologyDoseContextPanel({
  context,
  initialValues,
  onConfirm,
  onOpenSource,
  presentation = "inline",
  startInResult,
}: {
  context: typeof ONCOLOGY_DOSE_CONTEXT;
  initialValues?: Record<string, string>;
  onConfirm?: (fieldIds: string[]) => void;
  onOpenSource?: (anchor: string) => void;
  presentation?: "inline" | "panel";
  startInResult: boolean;
}) {
  const [phase, setPhase] = useState<"questions" | "result">(
    startInResult ? "result" : "questions",
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [traceOpen, setTraceOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      context.fields.map((field) => [
        field.id,
        initialValues?.[field.id] ?? field.value,
      ]),
    ),
  );
  const weight = Number(values.weight?.replace(",", "."));
  const validWeight = Number.isFinite(weight) && weight >= 25 && weight <= 350;
  const dose = validWeight ? weight * context.mgPerKg : null;
  const regimen = context.fields.find((field) => field.id === "regimen")?.value ?? "FOLFOX4";

  const frame = (content: React.ReactNode, title: string) =>
    presentation === "panel" ? (
      content
    ) : (
      <DeterministicFrame
        badge={phase === "result" ? "Deterministic calculation" : "Patient context"}
        title={title}
      >
        {content}
      </DeterministicFrame>
    );

  if (phase === "questions") {
    const question = [
      "Which labeled regimen is being calculated?",
      "What is the patient’s body weight?",
      "Confirm the dose schedule",
    ][questionIndex]!;

    const content = (
      <div aria-label={question} role="form" className="pb-2">
        <div aria-label={`Question ${questionIndex + 1} of 3`} className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              aria-hidden="true"
              className={`h-1.5 rounded-full ${
                index <= questionIndex
                  ? "bg-[var(--mscp-color-brand-primary)]"
                  : "bg-[#eef0f2]"
              }`}
            />
          ))}
        </div>

        <p className="mt-5 text-[17px] font-medium leading-[1.3] text-[#52616c]">
          Question {questionIndex + 1} of 3
        </p>
        <h3 className="mt-2 text-[23px] font-semibold leading-[1.26] tracking-[-0.012em] text-[#1c2329]">
          {question}
        </h3>

        {questionIndex === 0 ? (
          <div className="mt-7 border-y border-[#c7d0d7]">
            <button
              type="button"
              onClick={() => {
                setValues((previous) => ({ ...previous, regimen }));
                setQuestionIndex(1);
              }}
              className="flex w-full items-center gap-4 px-4 py-4 text-left text-[20px] font-medium text-[#1c2329] transition hover:bg-[#f6f9fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--mscp-color-brand-primary)]"
            >
              <span aria-hidden="true" className="h-5 w-5 shrink-0 rounded-full border-2 border-[var(--mscp-color-brand-primary)]" />
              {regimen}
            </button>
          </div>
        ) : null}

        {questionIndex === 1 ? (
          <form
            className="mt-7"
            onSubmit={(event) => {
              event.preventDefault();
              if (validWeight) setQuestionIndex(2);
            }}
          >
            <label className="sr-only" htmlFor="oncology-dose-weight">
              Body weight in kilograms
            </label>
            <div className="flex items-stretch gap-2">
              <div className="flex min-w-0 flex-1 items-center rounded-[8px] border border-[#aebcc7] bg-white px-4 focus-within:border-[var(--mscp-color-brand-primary)] focus-within:ring-1 focus-within:ring-[var(--mscp-color-brand-primary)]">
                <input
                  id="oncology-dose-weight"
                  autoFocus
                  inputMode="decimal"
                  value={values.weight ?? ""}
                  onChange={(event) =>
                    setValues((previous) => ({ ...previous, weight: event.target.value }))
                  }
                  placeholder="Enter body weight"
                  className="min-w-0 flex-1 bg-transparent py-4 text-[20px] font-medium text-[#1c2329] outline-none placeholder:text-[#718796] [font-variant-numeric:tabular-nums]"
                />
                <span className="ml-3 text-[18px] font-medium text-[#52616c]">kg</span>
              </div>
              <button
                type="submit"
                disabled={!validWeight}
                className="shrink-0 rounded-[8px] bg-[var(--mscp-color-brand-primary)] px-4 text-[14px] font-bold text-white transition hover:bg-[#053b85] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] focus-visible:ring-offset-2 disabled:bg-[#c2cfdc]"
              >
                Continue
              </button>
            </div>
            {!validWeight ? (
              <p role="alert" className="mt-2 text-[13px] font-medium text-[#b42318]">
                Enter a body weight between 25 and 350 kg.
              </p>
            ) : null}
          </form>
        ) : null}

        {questionIndex === 2 ? (
          <div className="mt-7 border-y border-[#c7d0d7]">
            <button
              type="button"
              onClick={() => {
                onConfirm?.(["weight", "regimen"]);
                setPhase("result");
              }}
              className="flex w-full items-center gap-4 px-4 py-4 text-left text-[20px] font-medium text-[#1c2329] transition hover:bg-[#f6f9fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--mscp-color-brand-primary)]"
            >
              <span aria-hidden="true" className="h-5 w-5 shrink-0 rounded-full border-2 border-[var(--mscp-color-brand-primary)]" />
              {context.doseLine}
            </button>
          </div>
        ) : null}

        {questionIndex > 0 ? (
          <button
            type="button"
            onClick={() => setQuestionIndex((index) => index - 1)}
            className="mt-5 text-[14px] font-bold text-[var(--mscp-color-brand-primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
          >
            Back
          </button>
        ) : null}
        <p className="mt-5 text-[11px] font-medium text-[#8497a9]">
          Patient details apply to this task only and are cleared on reset.
        </p>
      </div>
    );

    return frame(content, "Patient dose calculator");
  }

  const result = (
      <div aria-live="polite" className="pb-2">
        <div className="rounded-[10px] border border-[rgba(6,74,167,0.22)] bg-[rgba(6,74,167,0.05)] px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.07em] text-[var(--mscp-color-brand-primary)]">
            Calculated dose
          </p>
          <p className="mt-0.5 text-[20px] font-extrabold text-[var(--mscp-color-brand-primary)] [font-variant-numeric:tabular-nums]">
            {dose?.toLocaleString()} mg IV
          </p>
          <p className="mt-1 text-[12.5px] leading-[1.5] text-[#2e4763]">
            {weight} kg × {context.mgPerKg} mg/kg · every 2 weeks
          </p>
        </div>
        <p className="mt-3 text-[13px] font-bold text-[#1c2935]">{context.doseLine}</p>
        <button
          type="button"
          onClick={() => setTraceOpen((open) => !open)}
          aria-expanded={traceOpen}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full text-[12px] font-semibold text-[var(--mscp-color-brand-primary)] transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
        >
          How this was determined
        </button>
        {traceOpen ? (
          <div className="mt-2 rounded-[10px] bg-[#f6f9fc] px-3 py-2.5 text-[12.5px] leading-[1.55] text-[#46535f]">
            <p className="font-semibold text-[#22303c]">Confirmed inputs</p>
            <p className="mt-0.5">Body weight: {weight} kg · {values.regimen}</p>
            <p className="mt-2 font-semibold text-[#22303c]">Monograph row</p>
            <button
              type="button"
              onClick={() => onOpenSource?.(context.sourceAnchor)}
              className="mt-0.5 text-left font-mono text-[11.5px] font-semibold text-[var(--mscp-color-brand-primary)] hover:underline"
            >
              {context.sourceLine}
            </button>
          </div>
        ) : null}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#eef3f8] pt-3">
          <button
            type="button"
            onClick={() => {
              setQuestionIndex(0);
              setPhase("questions");
            }}
            className="inline-flex items-center rounded-full border border-[rgba(6,74,167,0.35)] px-4 py-2 text-[13px] font-bold text-[var(--mscp-color-brand-primary)] transition hover:bg-[#f2f7fe] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
          >
            Edit answers
          </button>
        </div>
      </div>
  );

  return frame(result, context.resultLabel);
}

export function DrugPatientContextPanel({
  compareLabel = "Compare alternatives",
  initialValues,
  onCancel,
  onCompare,
  onConfirm,
  onOpenSource,
  onSelectRenalAnchor,
  oncologyDose,
  presentation = "inline",
  startInResult = false,
}: DrugPatientContextPanelProps) {
  if (oncologyDose) {
    return (
      <OncologyDoseContextPanel
        context={oncologyDose}
        initialValues={initialValues}
        onConfirm={onConfirm}
        onOpenSource={onOpenSource}
        presentation={presentation}
        startInResult={startInResult}
      />
    );
  }

  const [phase, setPhase] = useState<PanelPhase>(startInResult ? "result" : "confirm");
  const [dismissed, setDismissed] = useState(false);
  const [traceOpen, setTraceOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      PATIENT_CONTEXT.fields.map((f) => [
        f.id,
        initialValues ? (initialValues[f.id] ?? "") : f.value,
      ]),
    ),
  );

  const numeric = (id: string): number | undefined => {
    const raw = values[id]?.trim();
    if (!raw) return undefined;
    const n = Number(raw.replace(",", "."));
    return Number.isNaN(n) ? undefined : n;
  };

  // Inline plausibility validation — implausible values block the check.
  const fieldError = (field: PatientContextField): string | undefined => {
    if (field.min === undefined) return undefined;
    const raw = values[field.id]?.trim();
    if (!raw) return undefined; // missing is handled by the missing-input state
    const n = Number(raw.replace(",", "."));
    if (Number.isNaN(n) || n < (field.min ?? -Infinity) || n > (field.max ?? Infinity)) {
      return field.validationMessage;
    }
    return undefined;
  };

  const errors = PATIENT_CONTEXT.fields
    .map((f) => ({ field: f, message: fieldError(f) }))
    .filter((e) => e.message);

  const evaluation = useMemo(
    () =>
      evaluateDoseReductionCriteria({
        age: numeric("age"),
        crcl: numeric("crcl"),
        scr: numeric("scr"),
        weight: numeric("weight"),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [values],
  );

  const missingCriteria = evaluation.knownCount < 2;

  if (dismissed) return null;

  const confirm = () => {
    if (errors.length > 0) return;
    onConfirm?.(
      PATIENT_CONTEXT.fields.filter((f) => values[f.id]?.trim()).map((f) => f.id),
    );
    setPhase("result");
  };

  // ── Confirm / edit states — no result before confirmation ──
  if (phase === "confirm" || phase === "edit") {
    const editing = phase === "edit";
    return (
      <DeterministicFrame badge="Patient context" title="Add patient context">
        <div className="px-4 py-3.5">
          <p className="text-[13px] font-medium leading-[1.55] text-[#33424f]">
            {PATIENT_CONTEXT.confirmPrompt}
          </p>

          <dl className="mt-3 grid gap-2 md:grid-cols-2">
            {PATIENT_CONTEXT.fields.map((field) => {
              const error = fieldError(field);
              return (
                <div
                  key={field.id}
                  className={`rounded-[10px] border px-3 py-2 ${
                    error ? "border-[#f2b8b5] bg-[#fef5f4]" : "border-transparent bg-[#f6f9fc]"
                  }`}
                >
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.07em] text-[#8497a9]">
                    {field.label}
                  </dt>
                  <dd className="mt-0.5 flex items-baseline gap-1.5">
                    {editing ? (
                      <input
                        aria-label={field.label}
                        value={values[field.id] ?? ""}
                        onChange={(e) =>
                          setValues((prev) => ({ ...prev, [field.id]: e.target.value }))
                        }
                        className="w-full min-w-0 border-b border-[#c2cfdc] bg-transparent pb-0.5 text-[13.5px] font-semibold text-[#22303c] outline-none [font-variant-numeric:tabular-nums] focus:border-[var(--mscp-color-brand-primary)]"
                      />
                    ) : (
                      <span className="text-[13.5px] font-semibold text-[#22303c] [font-variant-numeric:tabular-nums]">
                        {values[field.id]?.trim() || "—"}
                      </span>
                    )}
                    {field.unit ? (
                      <span className="shrink-0 text-[11px] font-medium text-[#8497a9]">
                        {field.unit}
                      </span>
                    ) : null}
                  </dd>
                  {error ? (
                    <p role="alert" className="mt-1 text-[11px] font-medium text-[#b42318]">
                      {error}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </dl>

          {missingCriteria ? (
            <div className="mt-3 rounded-[10px] bg-[#fef0e3] px-3 py-2.5">
              <p className="text-[12.5px] font-bold text-[#7a3c08]">
                {PATIENT_CONTEXT.missingInputTitle}
              </p>
              <p className="mt-0.5 text-[12.5px] font-medium leading-[1.5] text-[#7a3c08]">
                {PATIENT_CONTEXT.missingInputBody}
              </p>
              {numeric("crcl") !== undefined ? (
                <p className="mt-1.5 text-[12px] leading-[1.5] text-[#7a3c08]">
                  {PATIENT_CONTEXT.crclOnlyNote}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={confirm}
              disabled={errors.length > 0 || missingCriteria}
              style={{ touchAction: "manipulation" }}
              className="inline-flex items-center rounded-full bg-[var(--mscp-color-brand-primary)] px-4 py-2 text-[13px] font-bold text-white transition hover:bg-[#053b85] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] focus-visible:ring-offset-2 disabled:bg-[#c2cfdc]"
            >
              {PATIENT_CONTEXT.actions.confirm}
            </button>
            <button
              type="button"
              onClick={() => setPhase(editing ? "confirm" : "edit")}
              style={{ touchAction: "manipulation" }}
              className="inline-flex items-center rounded-full border border-[rgba(6,74,167,0.35)] px-4 py-2 text-[13px] font-bold text-[var(--mscp-color-brand-primary)] transition hover:bg-[#f2f7fe] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
            >
              {editing ? "Done editing" : PATIENT_CONTEXT.actions.editValues}
            </button>
            <button
              type="button"
              onClick={() => {
                setDismissed(true);
                onCancel?.();
              }}
              style={{ touchAction: "manipulation" }}
              className="ml-auto rounded-full px-3 py-2 text-[12.5px] font-semibold text-[#5a6e7e] transition hover:bg-[#f1f5f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
            >
              {PATIENT_CONTEXT.actions.cancel}
            </button>
          </div>

          <p className="mt-3 text-[11px] font-medium text-[#9aa9b8]">
            {PATIENT_CONTEXT.scopeNote}
          </p>
        </div>
      </DeterministicFrame>
    );
  }

  // ── Result state — deterministic criteria match ──
  const crcl = numeric("crcl");
  return (
    <DeterministicFrame badge="Deterministic match" title={PATIENT_CONTEXT.result.label}>
      <div aria-live="polite" className="px-4 py-3.5">
        {/* Verbatim monograph dose line — reduction line when the rule is met,
            otherwise the standard dose with a criteria-not-met note. */}
        <div className="rounded-[10px] border border-[rgba(6,74,167,0.22)] bg-[rgba(6,74,167,0.05)] px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.07em] text-[var(--mscp-color-brand-primary)]">
            From the Medscape monograph
          </p>
          <p className="mt-0.5 text-[14.5px] font-bold leading-[1.5] text-[var(--mscp-color-brand-primary)] [font-variant-numeric:tabular-nums]">
            {evaluation.reductionApplies
              ? PATIENT_CONTEXT.result.doseLine
              : PATIENT_CONTEXT.result.standardDoseLine}
          </p>
          {!evaluation.reductionApplies ? (
            <p className="mt-1 text-[12px] font-medium leading-[1.5] text-[#2e4763]">
              {PATIENT_CONTEXT.result.notMetNote}
            </p>
          ) : null}
        </div>

        <p className="mt-3 text-[13px] font-bold text-[#1c2935]">{evaluation.summary}</p>

        <ul className="mt-2 space-y-1.5">
          {evaluation.criteria.map((row) => (
            <li key={row.criterion} className="flex items-start gap-2">
              <CriterionIcon matches={row.matches} />
              <span className="text-[13px] leading-[1.5] text-[#33424f] [font-variant-numeric:tabular-nums]">
                <span className="font-semibold">{row.patientValue}</span>
                {" — "}
                {row.matches ? "matches" : "does not match"}{" "}
                <span className="font-semibold">{row.criterion}</span>
              </span>
            </li>
          ))}
        </ul>

        {/* Renal guidance row — separate from the criteria; moves the card anchor */}
        <button
          type="button"
          onClick={() => onSelectRenalAnchor?.(PATIENT_CONTEXT.result.renalGuidance.anchor)}
          style={{ touchAction: "manipulation" }}
          className="mt-3 flex w-full items-start gap-2 rounded-[10px] border border-[#e3ebf4] bg-[#f8fafc] px-3 py-2.5 text-left transition hover:border-[rgba(6,74,167,0.35)] hover:bg-[#f2f7fe] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
        >
          <span aria-hidden="true" className="mt-0.5 text-[var(--mscp-color-brand-primary)]">
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 1.8C5.6 4.6 4.2 6.9 4.2 9a3.8 3.8 0 0 0 7.6 0c0-2.1-1.4-4.4-3.8-7.2Z" />
            </svg>
          </span>
          <span className="min-w-0">
            <span className="block text-[12.5px] font-bold text-[#22303c] [font-variant-numeric:tabular-nums]">
              Renal guidance — {crcl !== undefined ? `CrCl ${crcl} mL/min` : PATIENT_CONTEXT.result.renalGuidance.patientValue}
            </span>
            <span className="mt-0.5 block text-[12.5px] leading-[1.5] text-[#46535f]">
              {evaluation.crclBelowStudiedThreshold
                ? "Confirmed CrCl is below 15 mL/min — the monograph notes apixaban was not studied in this range for DVT/PE, and specific ESRD-on-hemodialysis dosing applies for AF. Open the Renal Impairment row for the canonical guidance."
                : PATIENT_CONTEXT.result.renalGuidance.note}
            </span>
            <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--mscp-color-brand-primary)]">
              Open Renal Impairment row
              <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3 w-3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </span>
          </span>
        </button>

        {/* How this was determined */}
        <button
          type="button"
          onClick={() => setTraceOpen((v) => !v)}
          aria-expanded={traceOpen}
          style={{ touchAction: "manipulation" }}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full text-[12px] font-semibold text-[var(--mscp-color-brand-primary)] transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
        >
          <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            className={`h-3 w-3 transition-transform ${traceOpen ? "rotate-90" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          >
            <path d="m6 3.5 4.5 4.5L6 12.5" />
          </svg>
          How this was determined
        </button>
        {traceOpen ? (
          <div className="mt-2 rounded-[10px] bg-[#f6f9fc] px-3 py-2.5 text-[12.5px] leading-[1.55] text-[#46535f]">
            <p className="font-semibold text-[#22303c]">Confirmed inputs</p>
            <p className="mt-0.5 [font-variant-numeric:tabular-nums]">
              {PATIENT_CONTEXT.fields
                .filter((f) => values[f.id]?.trim())
                .map((f) => `${f.label}: ${values[f.id]}${f.unit ? ` ${f.unit}` : ""}`)
                .join(" · ")}
            </p>
            <p className="mt-2 font-semibold text-[#22303c]">Criteria path</p>
            <p className="mt-0.5">{PATIENT_CONTEXT.result.trace.rule}</p>
            <p className="mt-2 font-semibold text-[#22303c]">Source rows</p>
            <p className="mt-0.5 flex flex-wrap gap-x-3 gap-y-1">
              {PATIENT_CONTEXT.result.trace.sourceAnchors.map((anchor) => (
                <button
                  key={anchor}
                  type="button"
                  onClick={() => onOpenSource?.(anchor)}
                  style={{ touchAction: "manipulation" }}
                  className="inline-flex items-center gap-1 font-mono text-[11.5px] font-semibold text-[var(--mscp-color-brand-primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
                >
                  {anchor}
                  <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3 w-3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </button>
              ))}
            </p>
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#eef3f8] pt-3">
          <button
            type="button"
            onClick={() => setPhase("edit")}
            style={{ touchAction: "manipulation" }}
            className="inline-flex items-center rounded-full border border-[rgba(6,74,167,0.35)] px-4 py-2 text-[13px] font-bold text-[var(--mscp-color-brand-primary)] transition hover:bg-[#f2f7fe] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
          >
            {PATIENT_CONTEXT.actions.edit}
          </button>
          {onCompare ? (
            <button
              type="button"
              onClick={onCompare}
              style={{ touchAction: "manipulation" }}
              className="inline-flex items-center rounded-full bg-[var(--mscp-color-brand-primary)] px-4 py-2 text-[13px] font-bold text-white transition hover:bg-[#053b85] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] focus-visible:ring-offset-2"
            >
              {compareLabel}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => onOpenSource?.(PATIENT_CONTEXT.result.trace.sourceAnchors[0]!)}
            style={{ touchAction: "manipulation" }}
            className="inline-flex items-center rounded-full px-3 py-2 text-[12.5px] font-semibold text-[var(--mscp-color-brand-primary)] transition hover:bg-[#f2f7fe] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
          >
            {PATIENT_CONTEXT.actions.openSources}
          </button>
          <button
            type="button"
            onClick={() => {
              setDismissed(true);
              onCancel?.();
            }}
            style={{ touchAction: "manipulation" }}
            className="ml-auto rounded-full px-3 py-2 text-[12px] font-semibold text-[#5a6e7e] transition hover:bg-[#f1f5f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
          >
            {PATIENT_CONTEXT.actions.clear}
          </button>
        </div>

        <p className="mt-3 text-[11px] font-medium text-[#9aa9b8]">
          {PATIENT_CONTEXT.scopeNote}
        </p>
      </div>
    </DeterministicFrame>
  );
}

// ─── DrugPatientDetailsPrompt ───────────────────────────────────────────────────
// Clarifying-question state of the composer (Vera-style): the input field
// itself steps through compact one-at-a-time questions — value questions render
// an inline input, option questions render numbered rows with a "Something
// else" free-text row. Deliberately short so it never covers the thread,
// especially on mobile. Values apply to this check only and are never saved
// for later turns; Submit is gated on at least two of the three criteria.

type DrugPatientDetailsPromptProps = {
  onConfirm: (values: Record<string, string>) => void;
  onDismiss?: () => void;
  /** Always-available free-form input under the form questions — submitting
   * routes the text like the normal composer (and closes the form). */
  onFreeText?: (text: string) => void;
  /** Question steps — defaults to the patient-context clarify script. */
  steps?: PatientClarifyStep[];
};

export function DrugPatientDetailsPrompt({
  onConfirm,
  onDismiss,
  onFreeText,
  steps = PATIENT_CLARIFY_STEPS,
}: DrugPatientDetailsPromptProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [otherActive, setOtherActive] = useState(false);
  const [freeDraft, setFreeDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const step = steps[stepIndex]!;
  const isLast = stepIndex === steps.length - 1;

  // Focus the inline input whenever a value step (or "Something else") shows.
  useEffect(() => {
    if (step.kind === "value" || otherActive) inputRef.current?.focus();
  }, [step, otherActive]);

  const valueError = (
    s: PatientClarifyStep,
    vals: Record<string, string> = values,
  ): string | undefined => {
    if (s.kind !== "value") return undefined;
    const raw = vals[s.id]?.trim();
    if (!raw) return undefined;
    const n = Number(raw.replace(",", "."));
    if (Number.isNaN(n) || n < (s.min ?? -Infinity) || n > (s.max ?? Infinity)) {
      return s.validationMessage;
    }
    return undefined;
  };

  const currentError = valueError(step);
  const stepOptional = (s: PatientClarifyStep) => s.kind === "value" && Boolean(s.optional);
  const stepAnswered = (s: PatientClarifyStep, vals: Record<string, string> = values) =>
    Boolean(vals[s.id]?.trim());
  // Required questions cannot be skipped: advancing needs a valid answer
  // unless the step is explicitly optional (those get the Skip button).
  const canAdvance = !currentError && (stepOptional(step) || stepAnswered(step));
  const isComplete = (vals: Record<string, string>) =>
    steps.every((s) => stepOptional(s) || stepAnswered(s, vals)) &&
    !steps.some((s) => valueError(s, vals));

  // Compact trail of what has been entered so far, e.g. "82 years · 58 kg".
  const summary = steps
    .filter((s) => values[s.id]?.trim())
    .map((s) =>
      s.kind === "value" && s.unit ? `${values[s.id]!.trim()} ${s.unit}` : values[s.id]!.trim(),
    )
    .join(" · ");

  const goTo = (index: number) => {
    setStepIndex(Math.min(Math.max(index, 0), steps.length - 1));
    setOtherActive(false);
  };

  // Answering IS the advance: Enter on value questions, tapping an option on
  // option questions. The final answered question submits the whole form —
  // there is no Next or Submit button.
  const next = () => {
    if (!canAdvance) return;
    if (isLast) {
      if (isComplete(values)) onConfirm(values);
      return;
    }
    goTo(stepIndex + 1);
  };

  return (
    <div
      role="form"
      aria-label={step.question}
      className="dc-rise overflow-hidden rounded-[22px] border border-[rgba(109,153,206,0.45)] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_22px_rgba(16,24,40,0.08)]"
    >
      {/* Header — question + step pagination + dismiss */}
      <div className="flex items-center gap-2 px-4 pb-1 pt-2.5">
        <p className="min-w-0 flex-1 truncate text-[13.5px] font-bold text-[#1c2935]">
          {step.question}
        </p>
        <div className="flex shrink-0 items-center gap-0.5 text-[#8497a9]">
          <button
            type="button"
            aria-label="Previous question"
            disabled={stepIndex === 0}
            onClick={() => goTo(stepIndex - 1)}
            style={{ touchAction: "manipulation" }}
            className="inline-flex h-6 w-6 items-center justify-center rounded-full transition hover:bg-[#f1f5f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.22)] disabled:opacity-35"
          >
            <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M7.5 2.5 4 6l3.5 3.5" /></svg>
          </button>
          <span className="text-[11px] font-semibold tabular-nums">
            {stepIndex + 1} of {steps.length}
          </span>
          <button
            type="button"
            aria-label="Next question"
            disabled={isLast || !canAdvance}
            onClick={() => goTo(stepIndex + 1)}
            style={{ touchAction: "manipulation" }}
            className="inline-flex h-6 w-6 items-center justify-center rounded-full transition hover:bg-[#f1f5f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.22)] disabled:opacity-35"
          >
            <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 2.5 8 6l-3.5 3.5" /></svg>
          </button>
        </div>
        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss patient details"
            style={{ touchAction: "manipulation" }}
            className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[#9aa9b8] transition hover:bg-[#f1f5f9] hover:text-[#5a6e7e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.22)]"
          >
            <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="m3.5 3.5 7 7M10.5 3.5l-7 7" /></svg>
          </button>
        ) : null}
      </div>

      {/* Body — inline input for value steps, numbered rows for option steps */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          next();
        }}
        className="px-2.5 pb-1"
      >
        {step.kind === "value" ? (
          <div>
            <div
              className={`flex items-center gap-2 rounded-[14px] border px-3 py-1.5 transition focus-within:border-[var(--mscp-color-brand-primary)] ${
                currentError ? "border-[#f2b8b5] bg-[#fef5f4]" : "border-[#e3ebf4] bg-[#fafcfe]"
              }`}
            >
              <input
                ref={inputRef}
                value={values[step.id] ?? ""}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, [step.id]: e.target.value }))
                }
                inputMode="decimal"
                placeholder="Type a value…"
                aria-label={step.question}
                className="h-8 min-w-0 flex-1 border-0 bg-transparent text-[15px] font-semibold text-[#22303c] outline-none [font-variant-numeric:tabular-nums] placeholder:font-normal placeholder:text-[#93a2ae]"
              />
              {step.unit ? (
                <span className="shrink-0 text-[12px] font-medium text-[#8497a9]">
                  {step.unit}
                </span>
              ) : null}
              {canAdvance ? (
                <button
                  type="submit"
                  aria-label={isLast ? "Submit answers" : "Continue"}
                  style={{ touchAction: "manipulation" }}
                  className="inline-flex h-6 shrink-0 items-center gap-1 rounded-full bg-[var(--mscp-color-brand-primary)] px-2 text-[10.5px] font-bold text-white transition hover:bg-[#053b85] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
                >
                  Enter
                  <svg viewBox="0 0 12 12" aria-hidden="true" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2.5v3.2a1.3 1.3 0 0 1-1.3 1.3H2.5M4.8 4.6 2.4 7l2.4 2.4" /></svg>
                </button>
              ) : null}
            </div>
            {currentError ? (
              <p role="alert" className="mt-1 px-1 text-[11px] font-medium text-[#b42318]">
                {currentError}
              </p>
            ) : null}
          </div>
        ) : (
          <ul className="space-y-0.5">
            {step.options.map((option, index) => {
              const isSelected = values[step.id] === option;
              return (
                <li key={option}>
                  <button
                    type="button"
                    onClick={() => {
                      setOtherActive(false);
                      const nextValues = { ...values, [step.id]: option };
                      setValues(nextValues);
                      // Answering advances; answering the last question submits.
                      if (isLast) {
                        if (isComplete(nextValues)) onConfirm(nextValues);
                      } else {
                        goTo(stepIndex + 1);
                      }
                    }}
                    style={{ touchAction: "manipulation" }}
                    className={`flex w-full items-center gap-2.5 rounded-[12px] px-2.5 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.25)] ${
                      isSelected
                        ? "bg-[var(--mscp-color-brand-primary)]"
                        : "bg-[#f6f9fc] hover:bg-[#eef4fb]"
                    }`}
                  >
                    <span
                      className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] text-[10.5px] font-bold tabular-nums ${
                        isSelected ? "bg-white/20 text-white" : "bg-white text-[#7d8ea0]"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span
                      className={`min-w-0 flex-1 truncate text-[13px] font-semibold ${
                        isSelected ? "text-white" : "text-[#1c2935]"
                      }`}
                    >
                      {option}
                    </span>
                    {isSelected ? (
                      <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-white" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
                    ) : null}
                  </button>
                </li>
              );
            })}
            {step.allowOther ? (
              <li>
                {otherActive ? (
                  <div className="flex items-center gap-2 rounded-[12px] border border-[#e3ebf4] bg-[#fafcfe] px-2.5 py-1 focus-within:border-[var(--mscp-color-brand-primary)]">
                    <svg viewBox="0 0 14 14" aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[#9aa9b8]" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2.5 11.5 4.5 5 11l-2.5.5L3 9z" /></svg>
                    <input
                      ref={inputRef}
                      value={values[step.id] ?? ""}
                      onChange={(e) =>
                        setValues((prev) => ({ ...prev, [step.id]: e.target.value }))
                      }
                      placeholder="Type the indication…"
                      aria-label="Something else"
                      className="h-7 min-w-0 flex-1 border-0 bg-transparent text-[13px] font-semibold text-[#22303c] outline-none placeholder:font-normal placeholder:text-[#93a2ae]"
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setValues((prev) => ({ ...prev, [step.id]: "" }));
                      setOtherActive(true);
                    }}
                    style={{ touchAction: "manipulation" }}
                    className="flex w-full items-center gap-2.5 rounded-[12px] px-2.5 py-2 text-left text-[13px] text-[#93a4b5] transition hover:bg-[#f6f9fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.25)]"
                  >
                    <svg viewBox="0 0 14 14" aria-hidden="true" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2.5 11.5 4.5 5 11l-2.5.5L3 9z" /></svg>
                    Something else
                  </button>
                )}
              </li>
            ) : null}
          </ul>
        )}

        {/* Footer — no Next/Submit: answering advances. Skip appears only on
            optional questions; required ones cannot be passed unanswered. */}
        <div className="flex items-center gap-2 px-1.5 pb-1.5 pt-2">
          <p className="min-w-0 flex-1 truncate text-[11px] text-[#9aa9b8] [font-variant-numeric:tabular-nums]">
            {!canAdvance && !currentError
              ? "Answer to continue."
              : summary || PATIENT_CONTEXT.promptHint}
          </p>
          {stepOptional(step) && !isLast ? (
            <button
              type="button"
              onClick={() => goTo(stepIndex + 1)}
              style={{ touchAction: "manipulation" }}
              className="shrink-0 rounded-full border border-[#dbe3ec] px-3 py-1 text-[11.5px] font-semibold text-[#5a6e7e] transition hover:border-[rgba(6,74,167,0.4)] hover:text-[var(--mscp-color-brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.22)]"
            >
              Skip
            </button>
          ) : null}
        </div>
      </form>

      {/* Always-available free-form input under the form questions — behaves
          like the normal composer (sibling form: no nesting). */}
      {onFreeText ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const trimmed = freeDraft.trim();
            if (!trimmed) return;
            setFreeDraft("");
            onFreeText(trimmed);
          }}
          className="border-t border-[#eef2f7] px-2.5 pb-2 pt-1.5"
        >
          <div className="flex items-center gap-2 rounded-[999px] border border-[rgba(109,153,206,0.45)] bg-white px-3 py-0.5 focus-within:border-[var(--mscp-color-brand-primary)]">
            <input
              value={freeDraft}
              onChange={(e) => setFreeDraft(e.target.value)}
              placeholder="Or ask a drug question…"
              aria-label="Ask a drug question"
              className="h-8 min-w-0 flex-1 border-0 bg-transparent text-[14px] text-[#1b2b3a] outline-none placeholder:text-[#93a2ae]"
            />
            <button
              type="submit"
              disabled={!freeDraft.trim()}
              aria-label="Send question"
              style={{ touchAction: "manipulation" }}
              className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--mscp-color-brand-primary)] text-white transition hover:bg-[#053b85] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] disabled:bg-[#c2cfdc]"
            >
              <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9.5v-7M3 5l3-2.5L9 5" /></svg>
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
