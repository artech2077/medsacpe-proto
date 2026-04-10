"use client";

import Link from "next/link";
import { galleryCategoryOrder, galleryRegistry } from "@/registry/gallery";

const categoryLabels = {
  content: "Content",
  feedback: "Feedback",
  input: "Input",
  layout: "Layout",
  navigation: "Navigation",
} as const;

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(0,106,255,0.1),transparent_34%),linear-gradient(180deg,#f7fafe_0%,#eef3f9_100%)]">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 md:px-10 md:py-10">
        <header className="flex flex-col gap-4 rounded-[28px] border border-white/80 bg-white/82 px-6 py-5 shadow-[0_20px_50px_rgba(16,24,40,0.05)] backdrop-blur-xl md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Gallery
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
              Shared Components
            </h1>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              Reusable Medscape AI building blocks grouped by purpose.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[var(--surface-muted)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)]">
              {galleryRegistry.length} components
            </div>
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-[rgba(16,24,40,0.1)] bg-white px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--surface-panel)]"
            >
              Back
            </Link>
          </div>
        </header>

        {galleryCategoryOrder.map((category) => {
          const entries = galleryRegistry.filter((entry) => entry.category === category);
          if (!entries.length) return null;

          return (
            <section key={category} className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                    {categoryLabels[category]}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    {entries.length} component{entries.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="grid gap-5 xl:grid-cols-2">
                {entries.map((entry) => {
                  const Preview = entry.preview;

                  return (
                    <article
                      key={entry.id}
                      className="rounded-[32px] border border-white/80 bg-white/84 p-6 shadow-[0_24px_60px_rgba(16,24,40,0.06)] backdrop-blur-xl"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                            {entry.title}
                          </h3>
                          <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                            {entry.description}
                          </p>
                        </div>

                        <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                          {entry.category}
                        </span>
                      </div>

                      <div className="mt-5 rounded-[24px] border border-[rgba(16,24,40,0.08)] bg-[var(--surface-canvas)] p-4">
                        <Preview />
                      </div>

                      <div className="mt-5 grid gap-3">
                        <code className="block rounded-[18px] bg-[var(--surface-muted)] px-4 py-3 text-[13px] text-[var(--text-secondary)]">
                          {entry.sourcePath}
                        </code>

                        {entry.usageNotes?.length ? (
                          <ul className="grid gap-2 text-sm text-[var(--text-secondary)]">
                            {entry.usageNotes.map((note) => (
                              <li
                                key={note}
                                className="rounded-[18px] bg-[var(--surface-muted)] px-4 py-3"
                              >
                                {note}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </section>
    </main>
  );
}
