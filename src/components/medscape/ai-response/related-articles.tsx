"use client";

// ─── AiResponseRelatedArticles ──────────────────────────────────────────────────
// "Related Articles" carousel shown in the answer footer — a horizontal row of
// Medscape article cards (title, content-type, time-ago, thumbnail) on the
// light-blue article-section panel. Colors mirror the Figma tokens:
//   panel  Color/Background/Article/Section  #ECF1F9
//   title  Color/Text/Primary/Default        #161B1D
//   source Color/Text/Eyebrow/Default        #0F4557
//   meta   Color/Text/Tertiary/Default       #435056
//   link   Color/Text/Informative/Default    #064AA7
// Thumbnails use a token gradient placeholder so the prototype has no external
// image dependency.

export type RelatedArticle = {
  /** Tailwind gradient classes for the thumbnail placeholder, e.g. "from-[#dbe9ff] to-[#b9d2fb]". */
  accent: string;
  /** Source / content-type label, e.g. "Medscape Medical News". */
  contentType: string;
  id: string;
  /** Marks a paid placement — shown as "Sponsored" instead of a time-ago. */
  sponsored?: boolean;
  /** Relative time, e.g. "2 hours ago". Omitted for sponsored items. */
  timeAgo?: string;
  title: string;
};

function NewsIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5 text-[#064aa7]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4.5h10A1.5 1.5 0 0 1 14.5 6v9.5H4.5A1.5 1.5 0 0 1 3 14V4.5Z" />
      <path d="M14.5 8h1.5A1.5 1.5 0 0 1 17.5 9.5V14a1.5 1.5 0 0 1-3 0M5.5 7.5h6M5.5 10.5h6M5.5 13h4" />
    </svg>
  );
}

export function AiResponseRelatedArticles({
  articles,
  className,
}: {
  articles: RelatedArticle[];
  className?: string;
}) {
  if (articles.length === 0) return null;

  return (
    <section className={`rounded-[14px] bg-[#ecf1f9] p-4 md:p-5 ${className ?? ""}`.trim()}>
      <div className="mb-3 flex items-center gap-2">
        <NewsIcon />
        <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#435056]">
          Related Articles
        </h2>
      </div>

      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {articles.map((article) => (
          <a
            key={article.id}
            href="#"
            className="group flex w-[230px] shrink-0 snap-start flex-col overflow-hidden rounded-[12px] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.06)] transition hover:shadow-[0_4px_14px_rgba(16,24,40,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#064aa7] focus-visible:ring-offset-1"
          >
            <div className="flex flex-1 flex-col p-3">
              <h3 className="text-[14px] font-bold leading-[1.35] text-[#161b1d] [text-wrap:balance] group-hover:text-[#064aa7]">
                {article.title}
              </h3>
              <p className="mt-1.5 flex flex-wrap items-center gap-1 text-[11px]">
                {article.sponsored ? (
                  <span className="font-semibold text-[#064aa7]">Sponsored</span>
                ) : (
                  <>
                    <span className="font-semibold text-[#0f4557]">{article.contentType}</span>
                    {article.timeAgo ? (
                      <>
                        <span aria-hidden="true" className="text-[#9aa9b8]">·</span>
                        <span className="text-[#435056]">{article.timeAgo}</span>
                      </>
                    ) : null}
                  </>
                )}
              </p>
            </div>
            <div
              aria-hidden="true"
              className={`h-[112px] w-full bg-gradient-to-br ${article.accent}`}
            />
          </a>
        ))}
      </div>
    </section>
  );
}
