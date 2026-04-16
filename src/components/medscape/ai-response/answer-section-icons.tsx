"use client";

export function AiChevronIcon({
  className = "h-5 w-5",
  direction = "down",
}: {
  className?: string;
  direction?: "down" | "right" | "up";
}) {
  const rotationClass =
    direction === "up" ? "rotate-180" : direction === "right" ? "-rotate-90" : "";

  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={`${className} ${rotationClass}`.trim()}
      fill="none"
    >
      <path
        d="m5 7.25 5 5 5-5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function AiLightbulbIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <path
        d="M9.25 18.25h5.5M10 21h4M12 3.25a6.75 6.75 0 0 0-4.24 12l.53.45c.65.56 1.03 1.37 1.03 2.22v.33h5.36v-.33c0-.85.37-1.66 1.03-2.22l.53-.45A6.75 6.75 0 0 0 12 3.25Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}
