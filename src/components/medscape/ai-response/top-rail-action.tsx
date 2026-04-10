/* eslint-disable @next/next/no-img-element */
"use client";

type AiTopRailActionProps = {
  iconSrc: string;
  label: string;
  onClick?: () => void;
};

export function AiTopRailAction({ iconSrc, label, onClick }: AiTopRailActionProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex h-9 items-center justify-center gap-2 rounded-full px-2 text-[13px] font-semibold text-[var(--mscp-color-brand-primary)] transition hover:bg-[#e8f0fb] md:px-3 md:text-[16px]"
    >
      <img src={iconSrc} alt="" aria-hidden="true" className="h-[18px] w-[18px] object-contain" />
      <span className="hidden md:inline">{label}</span>
    </button>
  );
}
