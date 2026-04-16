/* eslint-disable @next/next/no-img-element */
"use client";

type AiTopRailActionProps = {
  className?: string;
  iconClassName?: string;
  iconSrc: string;
  label: string;
  onClick?: () => void;
  showLabel?: boolean;
  variant?: "icon" | "text";
};

export function AiTopRailAction({
  className,
  iconClassName,
  iconSrc,
  label,
  onClick,
  showLabel,
  variant = "icon",
}: AiTopRailActionProps) {
  const isTextVariant = variant === "text";

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={
        className ??
        (isTextVariant
          ? "inline-flex h-9 items-center justify-center gap-1.5 rounded-[6px] text-[14px] font-bold text-[var(--mscp-color-brand-primary)] transition hover:bg-white/60 md:px-1.5"
          : "inline-flex h-9 items-center justify-center gap-2 rounded-full px-2 text-[13px] font-semibold text-[var(--mscp-color-brand-primary)] transition hover:bg-[#e8f0fb] md:px-3 md:text-[16px]")
      }
    >
      <img
        src={iconSrc}
        alt=""
        aria-hidden="true"
        className={iconClassName ?? (isTextVariant ? "h-4 w-4 object-contain" : "h-[18px] w-[18px] object-contain")}
      />
      <span className={showLabel ? "inline" : "hidden md:inline"}>{label}</span>
    </button>
  );
}
