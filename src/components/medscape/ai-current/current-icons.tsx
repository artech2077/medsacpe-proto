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
    <img
      src="/assets/Logo Icon.svg"
      alt=""
      aria-hidden="true"
      className={`${className} object-contain`}
    />
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
  className = "h-4 w-4",
  iconSrc,
  label,
}: {
  className?: string;
  iconSrc: string;
  label: string;
}) {
  return (
    <img src={iconSrc} alt={label} className={`${className} object-contain`} />
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
