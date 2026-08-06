"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { AiCloseIcon } from "@/components/medscape/ai-response/iconography";
import { prototypeRegistry } from "@/registry/prototypes";

type PrototypeNavSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

type NavEntry = {
  key: string;
  title: string;
  description: string;
  href: string;
  isActive: (pathname: string) => boolean;
};

const CONCEPT_ROUTE_PREFIX = "/drug-concept-";

// The standalone workspace prototypes, plus a SINGLE entry for the concept
// explorations (browse the A–J set via the concept tab bar) — not the ten
// individual concepts. Reads the registry so new workspace prototypes appear
// automatically.
const workspaceEntries: NavEntry[] = prototypeRegistry
  .filter((prototype) => !prototype.route.startsWith(CONCEPT_ROUTE_PREFIX))
  .map((prototype) => ({
    key: prototype.slug,
    title: prototype.title,
    description: prototype.description,
    href: prototype.route,
    isActive: (pathname) => pathname === prototype.route,
  }));

const explorationsEntry: NavEntry = {
  key: "v1-explorations",
  title: "V1 explorations",
  description: "Browse the A–J drug-answer concept prototypes via the concept tab bar.",
  href: "/drug-concept-j",
  isActive: (pathname) => pathname.startsWith(CONCEPT_ROUTE_PREFIX),
};

const navEntries: NavEntry[] = [...workspaceEntries, explorationsEntry];

// Slide-in navigator so the standalone screens (which hide the A–J concept tab bar)
// still have a way to jump between the workspace prototypes and the concept explorations.
export function PrototypeNavSidebar({ isOpen, onClose }: PrototypeNavSidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden={!isOpen}
        onClick={onClose}
        className={`absolute inset-0 z-30 bg-[rgba(16,24,40,0.28)] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        aria-label="Prototypes"
        aria-hidden={!isOpen}
        className={`absolute inset-y-0 left-0 z-40 flex w-[288px] max-w-[86%] flex-col border-r border-[#d6e0ef] bg-[#edf4ff] transition-transform duration-300 ease-out md:shadow-[0_18px_44px_rgba(6,74,167,0.18)] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 pb-3 pt-4">
          <span className="text-[15px] font-semibold text-[#28323b]">Prototypes</span>
          <button
            type="button"
            aria-label="Close prototypes menu"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#495661] transition hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
          >
            <AiCloseIcon />
          </button>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-5">
          <ul className="flex flex-col gap-1">
            {navEntries.map((entry) => {
              const active = entry.isActive(pathname);

              return (
                <li key={entry.key}>
                  <Link
                    href={entry.href}
                    aria-current={active ? "page" : undefined}
                    onClick={onClose}
                    className={`flex flex-col gap-0.5 rounded-[10px] px-3 py-2.5 transition ${
                      active
                        ? "bg-white text-[var(--mscp-color-brand-primary)] shadow-[0_0_0_1px_rgba(6,74,167,0.14)]"
                        : "text-[#28323b] hover:bg-white/55"
                    }`}
                  >
                    <span className="text-[14px] font-semibold leading-[1.3]">{entry.title}</span>
                    <span className="line-clamp-2 text-[12px] leading-[1.35] text-[#55616c]">
                      {entry.description}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
