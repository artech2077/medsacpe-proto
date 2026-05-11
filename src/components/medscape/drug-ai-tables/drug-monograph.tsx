/* eslint-disable @next/next/no-img-element */
import { MedscapeCurrentAdBlock } from "@/components/medscape/ai-current/ad-block";
import {
  drugAiTablesContentSections,
  drugAiTablesInteractionGroups,
  drugAiTablesPrompts,
  type DrugAiTablesContentSection,
  type DrugAiTablesInteractionGroup,
} from "@/data/drug-ai-tables";

const medscapeAiSearchUrl = "https://www.medscape.com/ai-search";

function PrintIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none">
      <path
        d="M7 8V4h10v4M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M7 14h10v6H7z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ChevronDownIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className} fill="none">
      <path
        d="m4 6 4 4 4-4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function WarningIcon({ severity }: { severity: DrugAiTablesInteractionGroup["severity"] }) {
  const colorBySeverity = {
    contraindicated: "#8a0f1e",
    serious: "#8a0f1e",
    monitor: "#8a3e0f",
    minor: "#8a3e0f",
  } satisfies Record<DrugAiTablesInteractionGroup["severity"], string>;

  if (severity === "monitor" || severity === "minor") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none">
        <path
          d="M12 3 22 20H2L12 3Z"
          stroke={colorBySeverity[severity]}
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path d="M12 9v5" stroke={colorBySeverity[severity]} strokeLinecap="round" strokeWidth="1.8" />
        <path d="M12 17h.01" stroke={colorBySeverity[severity]} strokeLinecap="round" strokeWidth="2.4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none">
      <circle cx="12" cy="12" r="9" stroke={colorBySeverity[severity]} strokeWidth="1.8" />
      <path d="M12 7v6" stroke={colorBySeverity[severity]} strokeLinecap="round" strokeWidth="1.8" />
      <path d="M12 16.5h.01" stroke={colorBySeverity[severity]} strokeLinecap="round" strokeWidth="2.4" />
    </svg>
  );
}

function MonographActions() {
  const actionClass =
    "inline-flex h-7 items-center justify-center rounded-[6px] text-[var(--mscp-color-brand-primary)] transition hover:bg-[#ecf1f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.28)]";

  return (
    <div className="flex items-center gap-6 text-[var(--mscp-color-brand-primary)]">
      <button type="button" className={`${actionClass} gap-2`} aria-label="Like amoxicillin">
        <img src="/assets/like.svg" alt="" className="h-6 w-6" />
        <span className="text-[16px] leading-[19px] text-[#435056]">309</span>
      </button>
      <button type="button" className={actionClass} aria-label="Share">
        <img src="/assets/Share.svg" alt="" className="h-6 w-6" />
      </button>
      <button type="button" className={actionClass} aria-label="Print">
        <PrintIcon />
      </button>
      <button
        type="button"
        className="h-[27px] rounded-[6px] border border-transparent px-2 text-[16px] leading-[19px] text-[#435056] transition hover:border-[#c5ced3] hover:bg-[#ecf1f9]"
      >
        Feedback
      </button>
    </div>
  );
}

function DrugHeader() {
  return (
    <section className="border-b border-[#c5ced3] pb-10">
      <p className="text-[13px] leading-[17px] font-semibold tracking-[0.01em] text-[#435056]">
        Drugs &amp; Diseases
      </p>
      <div className="mt-4">
        <h1 className="text-[38px] leading-[52px] font-bold text-[#161b1d]">
          amoxicillin (Rx)
        </h1>
        <p className="mt-2 text-[16px] leading-[21px] text-[#161b1d]">
          Brand and Other Names: Amoxil, Moxatag (DSC), more...
        </p>
        <p className="mt-2 text-[15px] leading-[19px] text-[#435056]">
          Classes: Penicillins, Amino
        </p>
      </div>
      <div className="mt-7">
        <MonographActions />
      </div>
    </section>
  );
}

function TableOfContents() {
  const items = ["Dosing", "Interactions", "Warnings", "Pregnancy", "Pharmacology"];

  return (
    <nav className="mt-10 border-b border-[#c5ced3]" aria-label="Drug monograph sections">
      <button
        type="button"
        className="flex w-full items-center justify-between py-4 text-left text-[18px] leading-[22px] font-bold text-[#161b1d]"
      >
        <span>Sections</span>
        <ChevronDownIcon />
      </button>
      <div className="flex flex-wrap gap-x-7 gap-y-2 pb-4 text-[15px] leading-[20px] font-semibold text-[#064aa7]">
        {items.map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`} className="hover:underline">
            {item}
          </a>
        ))}
      </div>
    </nav>
  );
}

function AiPromptCallout() {
  return (
    <aside className="rounded-[12px] border border-[#006aff] bg-[#ecf1f9] p-4 shadow-[inset_0_0_0_1px_rgba(246,0,255,0.42)]">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-[16px] leading-[19px] font-bold text-[#161b1d]">
          Check Before Prescribing
        </h3>
        <img src="/assets/medscape-ai-logo-icon.svg" alt="" className="mt-0.5 h-4 w-auto" />
      </div>
      <div className="mt-4 flex flex-col gap-3">
        {drugAiTablesPrompts.map((prompt) => (
          <a
            key={prompt.id}
            href={medscapeAiSearchUrl}
            className="flex items-center gap-2 text-[16px] leading-[19px] font-bold text-[#064aa7] transition hover:text-[#043b84]"
          >
            <img src="/assets/medscape-ai-logo-icon.svg" alt="" className="h-4 w-4" />
            <span>{prompt.label}</span>
          </a>
        ))}
      </div>
    </aside>
  );
}

function ContentSection({ section }: { section: DrugAiTablesContentSection }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-[20px] leading-[26px] font-bold text-[#161b1d]">{section.heading}</h3>
      {section.body?.map((paragraph) => (
        <p key={paragraph} className="text-[16px] leading-[21px] text-[#161b1d]">
          {paragraph}
        </p>
      ))}
      {section.subsections?.map((subsection) => (
        <div key={subsection.heading} className="flex flex-col gap-2">
          <h4 className="text-[20px] leading-[26px] font-bold text-[#435056]">
            {subsection.heading}
          </h4>
          {subsection.body?.map((paragraph) => (
            <p key={paragraph} className="text-[16px] leading-[21px] text-[#161b1d]">
              {paragraph}
            </p>
          ))}
          {subsection.items ? (
            <ul className="list-disc pl-6 text-[16px] leading-[21px] text-[#161b1d]">
              {subsection.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
    </section>
  );
}

function DosingAndUses() {
  return (
    <section id="dosing" className="mt-10 flex flex-col gap-8">
      <h2 className="text-[24px] leading-[31px] font-bold text-[#161b1d]">Dosing &amp; Uses</h2>
      <div className="border-b border-[#c5ced3]">
        <div className="grid grid-cols-2 text-center text-[18px] leading-[22px] font-bold">
          <button
            type="button"
            className="border-b-[3px] border-[#064aa7] pb-2 text-[#064aa7]"
          >
            Adult
          </button>
          <button type="button" className="pb-2 text-[#161b1d]">
            Pediatric
          </button>
        </div>
      </div>
      <AiPromptCallout />
      <div className="flex flex-col gap-8">
        {drugAiTablesContentSections.map((section) => (
          <ContentSection key={section.heading} section={section} />
        ))}
      </div>
    </section>
  );
}

function InteractionChecker() {
  return (
    <div className="rounded-[8px] bg-[#f2f4f5] p-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <img src="/assets/Outline (Stroke).png" alt="" className="h-6 w-6" />
          <h3 className="text-[18px] leading-none font-bold text-black">Interaction Checker</h3>
        </div>
        <p className="text-[16px] leading-5 font-medium text-[#161b1d]">
          Enter a drug name to check for any interactions.
        </p>
      </div>
      <div className="mt-6 flex flex-col gap-4">
        <div className="rounded-full border border-[#c5ced3] bg-white px-3 py-1.5 text-[18px] leading-[22px] text-[#6f8590]">
          Type a drug, OTC, or herbal name
        </div>
        <button type="button" className="w-fit text-[16px] leading-5 font-medium text-[#161b1d]">
          + amoxicillin
        </button>
      </div>
    </div>
  );
}

function InteractionsGroup({ group }: { group: DrugAiTablesInteractionGroup }) {
  return (
    <section className="border-t border-[#c5ced3] pt-6">
      <div className="flex items-center gap-4">
        <WarningIcon severity={group.severity} />
        <h3 className="text-[24px] leading-[31px] font-bold text-[#161b1d]">
          {group.title} ({group.count})
        </h3>
      </div>
      {group.items.length > 0 ? (
        <div className="mt-4 flex flex-col gap-2">
          {group.items.map((item) => (
            <button
              key={item}
              type="button"
              className="flex w-full items-center gap-4 text-left text-[16px] leading-[21px] text-[#161b1d] transition hover:text-[#064aa7]"
            >
              <ChevronDownIcon className="h-4 w-4 shrink-0" />
              <span className="min-w-0">{item}</span>
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function Interactions() {
  return (
    <section id="interactions" className="mt-8 border-t border-[#c5ced3] pt-6">
      <h2 className="text-[28px] leading-[36px] font-bold text-black">Interactions</h2>
      <div className="mt-6">
        <InteractionChecker />
      </div>
      <div className="mt-6 flex items-start justify-between gap-4">
        <h3 className="text-[18px] leading-[22px] font-bold text-[#161b1d]">All Interactions</h3>
        <button
          type="button"
          className="flex items-center gap-2 text-[16px] leading-[19px] font-bold text-[#161b1d]"
        >
          <span>Sort By:</span>
          <span className="flex items-center gap-4 border border-[#c5ced3] px-2 py-1 text-[14px] leading-[17px] font-normal">
            Severity
            <ChevronDownIcon />
          </span>
        </button>
      </div>
      <div className="mt-6 flex flex-col gap-6">
        {drugAiTablesInteractionGroups.map((group) => (
          <InteractionsGroup key={group.title} group={group} />
        ))}
      </div>
    </section>
  );
}

export function DrugAiTablesArticle() {
  return (
    <article className="bg-white text-[#161b1d]">
      <DrugHeader />
      <TableOfContents />
      <DosingAndUses />
      <div className="my-8 md:hidden">
        <MedscapeCurrentAdBlock />
      </div>
      <Interactions />
      <div className="my-8 md:hidden">
        <MedscapeCurrentAdBlock />
      </div>
      <p className="mt-8 text-[12px] leading-[18px] text-black">
        Medscape prescription drug monographs are based on FDA-approved labeling information,
        unless otherwise noted, combined with additional data derived from primary medical
        literature.
      </p>
    </article>
  );
}

function DrugAiTablesSquareAd() {
  return (
    <aside className="flex w-[300px] flex-col items-center gap-1 bg-white" aria-label="Advertisement">
      <img
        src="/assets/ad.png"
        alt="Salutrib advertisement"
        className="h-[250px] w-[300px] object-cover"
      />
      <p className="text-center text-[11px] leading-[11px] tracking-[0.5px] text-[#435056] uppercase">
        Advertisement
      </p>
    </aside>
  );
}

export function DrugAiTablesRightRail() {
  const relatedItems = [
    "Penicillin Allergy Assessment",
    "Antibiotic Resistance Trends",
    "Beta-Lactam Dosing Updates",
  ];

  return (
    <aside className="hidden w-[300px] shrink-0 flex-col gap-8 pt-16 lg:flex">
      <DrugAiTablesSquareAd />
      <section>
        <h2 className="text-[18px] leading-[22px] font-bold text-[#161b1d]">Related News</h2>
        <div className="mt-4 divide-y divide-[#c5ced3]">
          {relatedItems.map((item) => (
            <a
              key={item}
              href={medscapeAiSearchUrl}
              className="block py-4 text-[16px] leading-5 font-bold text-[#161b1d] transition hover:text-[#064aa7]"
            >
              {item}
            </a>
          ))}
        </div>
      </section>
      <DrugAiTablesSquareAd />
    </aside>
  );
}

export function DrugAiTablesFloatingAiButton() {
  return (
    <a
      href={medscapeAiSearchUrl}
      className="fixed right-5 bottom-6 z-40 inline-flex h-[46px] items-center gap-2 rounded-full border border-[#006aff] bg-[#ecf1f9] px-6 text-[16px] leading-[19px] font-bold text-[#064aa7] shadow-[0_4px_8px_rgba(0,0,0,0.22)] transition hover:bg-[#e3edf9] md:right-[calc((100vw-1160px)/2+320px)]"
    >
      <img src="/assets/medscape-ai-logo-icon.svg" alt="" className="h-4 w-4" />
      <span>Ask Medscape AI</span>
    </a>
  );
}
