import { ScreenShell } from "@/components/ui/screen-shell";

export function SamplePrototypeScreen() {
  return (
    <ScreenShell
      eyebrow="Prototype / Example"
      title="Clinical Summary Prototype"
      description="Replace this sample screen with a Figma frame implementation using Codex + Figma MCP. Keep all styling token-driven and move reusable patterns into src/components/ui."
      actions={
        <>
          <button className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-white px-4 py-2 text-sm font-semibold text-[var(--text-primary)]">
            Secondary
          </button>
          <button className="rounded-[var(--radius-md)] bg-[var(--color-brand-500)] px-4 py-2 text-sm font-semibold text-white">
            Primary
          </button>
        </>
      }
    >
      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-white p-6">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Patient Snapshot</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              ["Diagnosis", "Type 2 Diabetes"],
              ["A1C", "8.1%"],
              ["Last Visit", "Feb 12, 2026"],
              ["Risk Flag", "Medication adherence"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-4"
              >
                <p className="text-xs font-semibold tracking-[0.06em] text-[var(--text-muted)] uppercase">
                  {label}
                </p>
                <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-white p-6">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Implementation Notes</h2>
          <ol className="mt-4 grid gap-3 text-sm leading-6 text-[var(--text-secondary)]">
            <li>Paste a Figma frame URL into Codex.</li>
            <li>Codex fetches design context and screenshot via Figma MCP.</li>
            <li>Codex maps variables into <code>src/styles/tokens.css</code>.</li>
            <li>Codex saves assets to <code>public/assets/&lt;slug&gt;/</code>.</li>
            <li>Codex replaces this screen with the real frame implementation.</li>
          </ol>
        </aside>
      </section>
    </ScreenShell>
  );
}
