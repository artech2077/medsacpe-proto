/* eslint-disable @next/next/no-img-element */
import { aiResponseAssets } from "@/data/ai-response";

export function CurrentHamburgerIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none">
      <path
        d="M3 6.25h18M3 12h18M3 17.75h12"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function CurrentSparkIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true" className={className} fill="none">
      <path
        d="M9 1.4c.38 3.73 1.87 5.22 5.6 5.6-3.73.38-5.22 1.87-5.6 5.6C8.62 8.87 7.13 7.38 3.4 7 7.13 6.62 8.62 5.13 9 1.4Z"
        fill="#a622ff"
      />
    </svg>
  );
}

export function CurrentMissingIcon({ label }: { label: string }) {
  return (
    <span
      aria-label={label}
      title={label}
      className="inline-flex h-4 w-4 items-center justify-center rounded-[3px] border border-dashed border-[#687680] text-[9px] leading-none font-semibold text-[#687680]"
      role="img"
    >
      ?
    </span>
  );
}

export function CurrentHeaderIcon({
  iconSrc,
  label,
}: {
  iconSrc: string;
  label: string;
}) {
  return (
    <img src={iconSrc} alt={label} className="h-4 w-4 object-contain" />
  );
}

export function CurrentScrollDownIcon() {
  return (
    <img
      src={aiResponseAssets.composerIcons.scrollDown}
      alt=""
      aria-hidden="true"
      className="h-8 w-8 object-contain"
    />
  );
}
