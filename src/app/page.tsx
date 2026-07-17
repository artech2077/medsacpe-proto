import { AnalyticsLink } from "@/components/analytics/analytics-link";
import { AnalyticsMountEvent } from "@/components/analytics/analytics-mount-event";
import { getPrototypeFamily, prototypeRegistry } from "@/registry/prototypes";
import { DRUG_CONCEPTS } from "@/data/drug-concepts";

export default function Home() {
  const activePrototypeCount = prototypeRegistry.filter(
    (prototype) => prototype.status === "active",
  ).length;
  // Concept A–J routes are reachable from the explorations card; only
  // standalone prototypes get their own workspace card.
  const standalonePrototypes = prototypeRegistry.filter(
    (prototype) => !prototype.slug.startsWith("drug-concept-"),
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(0,106,255,0.1),transparent_34%),linear-gradient(180deg,#f7fafe_0%,#eef3f9_100%)]">
      <AnalyticsMountEvent
        eventName="workspace_home_viewed"
        properties={{
          active_prototype_count: activePrototypeCount,
          prototype_count: prototypeRegistry.length,
          screen_type: "workspace_home",
        }}
      />
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-6 py-8 md:px-10 md:py-10">
        <div className="grid gap-5 xl:grid-cols-3">
          {standalonePrototypes.map((prototype, index) => {
            const entryRoute = prototype.entryRoute ?? prototype.route;

            return (
              <article
                key={prototype.slug}
                className="flex min-h-[320px] flex-col justify-between rounded-[32px] border border-white/80 bg-white/84 p-7 shadow-[0_24px_60px_rgba(16,24,40,0.06)] backdrop-blur-xl"
              >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  {prototype.status ? (
                    <span className="rounded-full border border-[rgba(6,74,167,0.14)] bg-[rgba(6,74,167,0.04)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--mscp-color-brand-primary)]">
                      {prototype.status}
                    </span>
                  ) : null}
                </div>

                <h2 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                  {prototype.title}
                </h2>
                <p className="mt-4 text-base leading-8 text-[var(--text-secondary)]">
                  {prototype.description}
                </p>

                {prototype.tags?.length ? (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {prototype.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[var(--surface-muted)] px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="mt-8 flex items-center justify-between gap-4 border-t border-[rgba(16,24,40,0.08)] pt-6">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  {prototype.route}
                </span>
                <AnalyticsLink
                  href={entryRoute}
                  eventName="prototype_card_clicked"
                  eventProperties={{
                    card_position: index + 1,
                    destination_route: entryRoute,
                    prototype_family: getPrototypeFamily(prototype),
                    prototype_route: prototype.route,
                    prototype_slug: prototype.slug,
                    screen_type: "workspace_home",
                  }}
                  className="inline-flex items-center rounded-full bg-[var(--mscp-color-brand-primary)] px-5 py-3 text-sm font-semibold !text-white shadow-[0_16px_30px_rgba(6,74,167,0.18)] transition hover:bg-[#0b5cc9] hover:!text-white visited:!text-white"
                >
                  Open
                </AnalyticsLink>
              </div>
            </article>
            );
          })}

          {/* AI drug monograph concept explorations card */}
          <article className="flex min-h-[320px] flex-col justify-between rounded-[32px] border border-white/80 bg-[linear-gradient(135deg,#e8f0fd_0%,#f0f6ff_100%)] p-7 shadow-[0_24px_60px_rgba(6,74,167,0.10)] backdrop-blur-xl">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--mscp-color-brand-primary)]">
                Drug Monograph Concepts
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                AI drug monograph V1 explorations
              </h2>
              <p className="mt-4 max-w-sm text-base leading-7 text-[var(--text-secondary)]">
                Ten UX concepts for integrating the canonical drug monograph into Medscape AI chat.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {DRUG_CONCEPTS.map((concept) => (
                  <AnalyticsLink
                    key={concept.letter}
                    href={concept.route}
                    eventName="drug_concept_chip_clicked"
                    eventProperties={{
                      concept_letter: concept.letter,
                      destination_route: concept.route,
                      screen_type: "workspace_home",
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(6,74,167,0.18)] bg-white/70 px-3 py-1.5 text-[12px] font-semibold text-[var(--mscp-color-brand-primary)] transition hover:bg-white"
                  >
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[var(--mscp-color-brand-primary)] text-[9px] font-bold text-white">
                      {concept.letter}
                    </span>
                    {concept.label}
                  </AnalyticsLink>
                ))}
              </div>
            </div>
            <div className="mt-8 flex items-center justify-between gap-4 border-t border-[rgba(6,74,167,0.10)] pt-6">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                /drug-concept-a → /drug-concept-j
              </span>
              <AnalyticsLink
                href="/drug-concept-a"
                eventName="drug_concepts_opened"
                eventProperties={{
                  destination_route: "/drug-concept-a",
                  screen_type: "workspace_home",
                }}
                className="inline-flex items-center rounded-full bg-[var(--mscp-color-brand-primary)] px-5 py-3 text-sm font-semibold !text-white shadow-[0_16px_30px_rgba(6,74,167,0.18)] transition hover:bg-[#0b5cc9] hover:!text-white visited:!text-white"
              >
                Explore concepts
              </AnalyticsLink>
            </div>
          </article>

          <article className="flex min-h-[320px] flex-col justify-between rounded-[32px] border border-white/80 bg-white/80 p-7 shadow-[0_24px_60px_rgba(16,24,40,0.06)] backdrop-blur-xl">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Shared Library
              </p>
              <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                Component Gallery
              </h1>
              <p className="mt-4 max-w-sm text-base leading-7 text-[var(--text-secondary)]">
                Reusable Medscape AI building blocks for new prototype pages.
              </p>
            </div>

            <div className="pt-6">
                <AnalyticsLink
                  href="/gallery"
                  eventName="gallery_opened"
                  eventProperties={{
                    destination_route: "/gallery",
                    screen_type: "workspace_home",
                  }}
                  className="inline-flex items-center rounded-full bg-[var(--mscp-color-brand-primary)] px-5 py-3 text-sm font-semibold !text-white shadow-[0_16px_30px_rgba(6,74,167,0.18)] transition hover:bg-[#0b5cc9] hover:!text-white visited:!text-white"
                >
                  Open gallery
                </AnalyticsLink>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
