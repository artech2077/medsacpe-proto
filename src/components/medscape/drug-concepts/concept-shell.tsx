import type { ReactNode } from "react";
import type { DrugConceptLetter } from "@/data/drug-concepts";
import { DrugConceptTabBar } from "@/components/medscape/drug-concepts/concept-tab-bar";

type DrugConceptShellProps = {
  activeConcept: DrugConceptLetter;
  children: ReactNode;
  /** Override the root element's height class. Defaults to "h-dvh". Pass "h-full" when rendering inside a fixed-height phone frame. */
  className?: string;
  /** When true, forces the tab bar to letter-only (compact) mode — used inside fixed-width phone frames where viewport breakpoints don't reflect visual width. */
  compact?: boolean;
};

// Layout shell that pins the DrugConceptTabBar above the white chat panel.
// Every concept screen renders inside this so the tab bar is identical across all eight.
export function DrugConceptShell({ activeConcept, children, className, compact }: DrugConceptShellProps) {
  return (
    <main
      className={`relative flex min-h-0 flex-col overflow-hidden bg-[#dce8fb] ${className ?? "h-dvh"}`}
      style={{ color: "var(--mscp-color-text-primary, #22282d)" }}
    >
      {/* Ambient background — matches AiResponseScreen */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#d7e6fd_0%,#e9f2ff_34%,#d5e5ff_100%)]" />
        <div className="absolute inset-x-0 top-0 h-[220px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0)_72%)]" />
        <div className="absolute -left-20 top-24 h-64 w-64 rounded-full bg-[rgba(114,166,255,0.14)] blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[rgba(6,74,167,0.10)] blur-3xl" />
      </div>

      {/* Tab bar — sits above the white panel in the gradient bg */}
      <div className="relative z-10 shrink-0">
        <DrugConceptTabBar activeConcept={activeConcept} compact={compact} />
      </div>

      {/* White chat panel */}
      <section className="relative flex min-h-0 flex-1 px-2 pb-2 md:px-3 md:pb-3">
        <div className="relative flex min-h-0 flex-1 overflow-hidden rounded-[22px] border border-[rgba(109,153,206,0.42)] bg-white shadow-[0_18px_44px_rgba(6,74,167,0.12)]">
          {children}
        </div>
      </section>
    </main>
  );
}
