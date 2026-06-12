"use client";

import type { DrugToolResult } from "@/data/drug-concept-i-scenarios";

// ─── DrugToolResultCard ─────────────────────────────────────────────────────────
// S8 deterministic tool card: interaction-checker verdict or dose-calculator
// result, rendered like canonical content (deterministic, not generated). The
// source monograph slices are anchored beneath it by the screen.

const SEVERITY_STYLE: Record<
  string,
  { bar: string; chipBg: string; chipFg: string }
> = {
  Contraindicated: { bar: "#7a271a", chipBg: "#fde7e5", chipFg: "#7a271a" },
  Serious: { bar: "#b42318", chipBg: "#fde7e5", chipFg: "#b42318" },
  "Monitor Closely": { bar: "#b54708", chipBg: "#fef0e3", chipFg: "#b54708" },
  Minor: { bar: "#067647", chipBg: "#e2f5ea", chipFg: "#067647" },
};

function ToolFrame({
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
            <rect x="2.5" y="1.5" width="11" height="13" rx="1.5" />
            <path d="M5 4.5h6M5 8h2.5M5 11h2.5M9.8 8h1.2M9.8 11h1.2" />
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

export function DrugToolResultCard({ tool }: { tool: DrugToolResult }) {
  if (tool.kind === "interaction") {
    const sev = SEVERITY_STYLE[tool.severity] ?? SEVERITY_STYLE["Monitor Closely"];
    return (
      <ToolFrame title={tool.title} badge="Deterministic tool">
        <div className="px-4 py-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[14px] font-bold text-[#1c2935]">{tool.pair[0]}</span>
            <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5 text-[#9aa9b8]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M2 8h12M11 4.5 14.5 8 11 11.5M5 4.5 1.5 8 5 11.5" />
            </svg>
            <span className="text-[14px] font-bold text-[#1c2935]">{tool.pair[1]}</span>
            <span
              className="ml-auto rounded-full px-2.5 py-1 text-[11px] font-bold"
              style={{ backgroundColor: sev.chipBg, color: sev.chipFg }}
            >
              {tool.severity}
            </span>
          </div>

          <p
            className="mt-3 border-l-[3px] pl-3 text-[13px] font-medium leading-[1.55] text-[#33424f]"
            style={{ borderColor: sev.bar }}
          >
            {tool.summary}
          </p>

          <ul className="mt-3 space-y-1.5">
            {tool.lines.map((line, i) => (
              <li key={i} className="flex items-start gap-2 text-[12.5px] leading-[1.55] text-[#46535f]">
                <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#c2cfdc]" />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </ToolFrame>
    );
  }

  return (
    <ToolFrame title={tool.title} badge="Deterministic tool">
      <div className="px-4 py-3.5">
        <dl className="grid gap-2 sm:grid-cols-2">
          {tool.inputs.map((input) => (
            <div key={input.label} className="rounded-[10px] bg-[#f6f9fc] px-3 py-2">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.07em] text-[#8497a9]">
                {input.label}
              </dt>
              <dd className="mt-0.5 text-[13.5px] font-semibold text-[#22303c] [font-variant-numeric:tabular-nums]">
                {input.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-3 rounded-[10px] border border-[rgba(6,74,167,0.22)] bg-[rgba(6,74,167,0.05)] px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.07em] text-[var(--mscp-color-brand-primary)]">
            {tool.result.label}
          </p>
          <p className="mt-0.5 text-[17px] font-extrabold tracking-[-0.01em] text-[var(--mscp-color-brand-primary)] [font-variant-numeric:tabular-nums]">
            {tool.result.value}
          </p>
        </div>

        <ul className="mt-3 space-y-1.5">
          {tool.lines.map((line, i) => (
            <li key={i} className="flex items-start gap-2 text-[12.5px] leading-[1.55] text-[#46535f]">
              <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#c2cfdc]" />
              {line}
            </li>
          ))}
        </ul>

        <p className="mt-3 rounded-[10px] bg-[#fef0e3] px-3 py-2.5 text-[12.5px] font-medium leading-[1.5] text-[#7a3c08]">
          {tool.caution}
        </p>
      </div>
    </ToolFrame>
  );
}
