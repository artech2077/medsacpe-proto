/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import {
  CurrentHamburgerIcon,
  CurrentHeaderIcon,
  CurrentMissingIcon,
} from "@/components/medscape/ai-current/current-icons";

const navItems = ["For You", "News & Perspective", "Tools & Reference", "CME/CE"];

export function MedscapeCurrentHeader() {
  return (
    <header className="relative z-50 flex h-[52px] shrink-0 items-center border-b border-[#d4dde9] bg-white px-3 text-[#435056] md:px-4">
      <div className="flex w-full items-center justify-between gap-3">
        <button
          type="button"
          aria-label="Open menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-[6px] text-[#435056] transition hover:bg-[#edf2f8] md:hidden"
        >
          <CurrentHamburgerIcon />
        </button>

        <Link
          href="/"
          aria-label="Medscape home"
          className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"
        >
          <img
            src="/assets/logo-medscape.svg"
            alt="Medscape"
            className="h-[25px] w-auto object-contain md:h-[34px]"
          />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-5 text-[14px] leading-none font-bold text-[#435056] md:flex">
          {navItems.map((item) => (
            <Link key={item} href="#" className="transition hover:text-[#064aa7]">
              {item}
            </Link>
          ))}
          <Link href="#" className="inline-flex items-center gap-1 transition hover:text-[#064aa7]">
            <span>More</span>
            <svg viewBox="0 0 12 12" aria-hidden="true" className="h-3 w-3" fill="none">
              <path
                d="m3 4.75 3 3 3-3"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.4"
              />
            </svg>
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-3 md:hidden">
          <button
            type="button"
            aria-label="Invitations"
            className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] transition hover:bg-[#edf2f8]"
          >
            <CurrentHeaderIcon iconSrc="/assets/invitations.svg" label="Invitations" />
          </button>

          <button
            type="button"
            aria-label="Search"
            className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] transition hover:bg-[#edf2f8]"
          >
            <CurrentHeaderIcon iconSrc="/assets/search.svg" label="Search" />
          </button>
        </div>

        <div className="ml-auto hidden items-center gap-4 md:flex">
          <button
            type="button"
            aria-label="Search"
            className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] transition hover:bg-[#edf2f8]"
          >
            <CurrentHeaderIcon iconSrc="/assets/search.svg" label="Search" />
          </button>

          <button
            type="button"
            aria-label="Invitations"
            className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] transition hover:bg-[#edf2f8]"
          >
            <CurrentHeaderIcon iconSrc="/assets/invitations.svg" label="Invitations" />
          </button>

          <button
            type="button"
            className="inline-flex h-8 items-center gap-1 rounded-[6px] text-[13px] font-semibold transition hover:bg-[#edf2f8]"
          >
            <CurrentMissingIcon label="Missing globe icon" />
            <span>EN</span>
          </button>

          <button
            type="button"
            aria-label="Profile"
            className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] transition hover:bg-[#edf2f8]"
          >
            <CurrentMissingIcon label="Missing profile icon" />
          </button>
        </div>
      </div>
    </header>
  );
}
