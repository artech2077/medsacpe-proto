"use client";

import type {
  PeerComparedAlternative,
  PeerContextTopic,
} from "@/data/drug-intelligence-scenarios";

// ─── DrugPeerContextStrip ───────────────────────────────────────────────────────
// V2 aggregated peer-search context (Connected Drug Intelligence, Moment 4).
// An optional module rendered BELOW the canonical comparison, visually and
// semantically distinct from clinical data. Ranked topics and alternatives use
// vertical ordered lists with link affordances — never recommendation cards,
// prescribing/preference claims, or precise-looking percentages.

type DrugPeerContextStripProps = {
  activeTopicId?: string;
  alternatives: readonly PeerComparedAlternative[];
  alternativesDescription: string;
  alternativesHeader: string;
  behaviorLabel: string;
  body: string;
  explanation: string;
  header: string;
  onAlternativeSelect?: (alternative: PeerComparedAlternative) => void;
  onTopicSelect?: (topic: PeerContextTopic) => void;
  topics: readonly PeerContextTopic[];
};

export function DrugPeerContextStrip({
  activeTopicId,
  alternatives,
  alternativesDescription,
  alternativesHeader,
  behaviorLabel,
  body,
  explanation,
  header,
  onAlternativeSelect,
  onTopicSelect,
  topics,
}: DrugPeerContextStripProps) {
  return (
    <aside
      aria-label="Aggregated peer search behavior"
      className="dc-rise scroll-mb-[152px] overflow-hidden rounded-[14px] border border-dashed border-[#b9cce0] bg-[#f8fbfe] shadow-[0_1px_3px_rgba(16,24,40,0.04)]"
    >
      <div className="border-b border-[#dfe9f2] bg-white/75 px-4 py-3.5 sm:px-5">
        <div className="flex items-start gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e8f0fa] text-[#355d83]"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="5.5" cy="5" r="2" />
                <circle cx="10.5" cy="5" r="2" />
                <path d="M1.8 13c.5-2 2-3 3.7-3s3.2 1 3.7 3M8.8 13c.5-2 2-3 3.7-3 .5 0 1 .1 1.4.3" />
              </svg>
            </span>
            <div className="min-w-0">
              <h3 className="text-[13.5px] font-extrabold leading-snug text-[#263847]">
                {header}
              </h3>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.075em] text-[#60788f]">
                {behaviorLabel}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 sm:px-5">
        <p className="text-[13px] leading-[1.6] text-[#3c4d5b]">{body}</p>

        <section className="mt-4" aria-labelledby="peer-topics-heading">
          <h4
            id="peer-topics-heading"
            className="text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[#516b82]"
          >
            Most commonly reviewed topics
          </h4>
          <ol className="mt-2 space-y-1">
            {topics.map((topic) => {
              const isActive = topic.id === activeTopicId;
              return (
                <li
                  key={topic.id}
                  className={`grid grid-cols-[34px_minmax(0,1fr)] gap-2 rounded-[8px] px-2 py-2.5 transition-colors ${
                    isActive ? "bg-[rgba(6,74,167,0.055)]" : "hover:bg-white/70"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="pt-px font-mono text-[11px] font-bold tabular-nums tracking-[0.06em] text-[#7890a5]"
                  >
                    {String(topic.rank).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <a
                      href="#drug-comparison"
                      aria-current={isActive ? "true" : undefined}
                      onClick={() => onTopicSelect?.(topic)}
                      className="group inline-flex items-center gap-1 text-[12.5px] font-bold text-[var(--mscp-color-brand-primary)] transition-colors hover:text-[#003b83] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] focus-visible:ring-offset-2"
                    >
                      {topic.label}
                      <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
                    </a>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <section
          className="mt-5 border-t border-[#dfe8f1] pt-5"
          aria-labelledby="peer-alternatives-heading"
        >
          <h4 id="peer-alternatives-heading" className="text-[13px] font-extrabold text-[#263847]">
            {alternativesHeader}
          </h4>
          <p className="mt-1 text-[11.5px] leading-[1.5] text-[#61788d]">
            {alternativesDescription}
          </p>
          <ol className="mt-2.5 space-y-1">
            {alternatives.map((alternative) => (
              <li
                key={alternative.id}
                className="grid grid-cols-[34px_minmax(0,1fr)] gap-2 rounded-[8px] px-2 py-2.5 transition-colors hover:bg-white/70"
              >
                <span
                  aria-hidden="true"
                  className="pt-px font-mono text-[11px] font-bold tabular-nums tracking-[0.06em] text-[#7890a5]"
                >
                  {String(alternative.rank).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <a
                    href={`#drug-${alternative.id}`}
                    aria-label={`Open ${alternative.name} monograph`}
                    onClick={() => onAlternativeSelect?.(alternative)}
                    className="group inline-flex items-center gap-1 text-[12.5px] font-bold text-[var(--mscp-color-brand-primary)] transition-colors hover:text-[#003b83] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] focus-visible:ring-offset-2"
                  >
                    {alternative.name}
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
                  </a>
                  <p className="mt-0.5 text-[10.5px] leading-[1.45] text-[#6b8194]">
                    {alternative.drugClass}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <p className="mt-4 text-[11px] font-medium leading-[1.5] text-[#526b81]">
          {explanation}
        </p>
      </div>
    </aside>
  );
}
