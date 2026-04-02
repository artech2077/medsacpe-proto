import Link from "next/link";

const prototypePages = [
  {
    href: "/example",
    label: "Sample prototype",
  },
  {
    href: "/ai-response",
    label: "AI response prototype",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--surface-canvas)]">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10 md:px-10">
        <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-8 shadow-[var(--shadow-panel)]">
          <div className="mb-6 inline-flex items-center rounded-full border border-[var(--border-subtle)] bg-white px-3 py-1 text-xs font-semibold tracking-[0.08em] text-[var(--text-secondary)] uppercase">
            Codex + Figma Prototype Workspace
          </div>
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-[var(--text-primary)] md:text-5xl">
            Build feature prototypes from Figma with a token-driven Next.js foundation.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--text-secondary)] md:text-lg">
            Use Codex in Cursor to implement Figma frames into route-based prototypes. This workspace already includes token CSS, font plumbing, and a sample prototype route.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {prototypePages.map((prototype) => (
              <Link
                key={prototype.href}
                href={prototype.href}
                className="inline-flex items-center rounded-[var(--radius-md)] bg-[var(--color-brand-500)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-600)]"
              >
                {prototype.label}
              </Link>
            ))}
            <a
              href="https://vercel.com/new"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-white px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--surface-muted)]"
            >
              Deploy on Vercel
            </a>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-white p-5">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">1. Tokens</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              Store Figma Variables in <code>src/styles/tokens.css</code> and keep screen styling token-backed.
            </p>
          </article>
          <article className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-white p-5">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">2. Screens</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              Implement each Figma frame at <code>src/app/(prototypes)/&lt;slug&gt;/page.tsx</code>.
            </p>
          </article>
          <article className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-white p-5">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">3. Assets</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              Save Figma MCP image/SVG assets in <code>public/assets/&lt;slug&gt;/</code> for fidelity.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
