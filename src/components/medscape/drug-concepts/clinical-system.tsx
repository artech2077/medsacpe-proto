"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { DrugBlackBoxWarning, DrugMonographSource } from "@/data/drug-monograph";

// ─── Clinical zone accent system ────────────────────────────────────────────────
// Color carries clinical meaning. Each monograph section maps to one accent used
// consistently across concepts (tiles in A, section nav in B, sheets in H, …).
export type ZoneAccent = {
  fg: string;
  line: string;
  soft: string;
  tint: string;
};

export const ZONE_ACCENTS: Record<string, ZoneAccent> = {
  administration: { fg: "#027a48", line: "#c8e8d4", soft: "#f3fbf6", tint: "#e2f5ea" },
  adverse: { fg: "#b54708", line: "#fcdcb8", soft: "#fff8f0", tint: "#fef0e3" },
  dosing: { fg: "#064aa7", line: "#cfe0f7", soft: "#f2f7fe", tint: "#e6eefb" },
  interactions: { fg: "#6938ef", line: "#dcd2fb", soft: "#f6f4fe", tint: "#ece7fd" },
  pharmacology: { fg: "#42526b", line: "#d8e0eb", soft: "#f7f9fc", tint: "#eaeff5" },
  pregnancy: { fg: "#c11574", line: "#fbd0e8", soft: "#fef6fa", tint: "#fce7f2" },
  renal_hepatic: { fg: "#0e7090", line: "#bce8f1", soft: "#f0fbfd", tint: "#dcf3f8" },
  safety: { fg: "#b42318", line: "#fecdc9", soft: "#fef5f4", tint: "#fde7e5" },
};

export const FALLBACK_ACCENT: ZoneAccent = {
  fg: "#3c4a57",
  line: "#dde5ef",
  soft: "#f7fafd",
  tint: "#eef2f7",
};

export function getZoneAccent(sectionId: string): ZoneAccent {
  return ZONE_ACCENTS[sectionId] ?? FALLBACK_ACCENT;
}

// ─── Clinical zone icons ────────────────────────────────────────────────────────
// Real line icons (currentColor). Color is inherited from the zone accent.
type IconProps = { className?: string };

function CapsuleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <g
        style={{ transformBox: "fill-box", transformOrigin: "center", transform: "rotate(45deg)" }}
      >
        <rect
          x="2.5"
          y="8.5"
          width="19"
          height="7"
          rx="3.5"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path d="M12 8.5v7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function ShieldAlertIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <path
        d="M12 3 5 5.6v5.2c0 4.2 2.9 6.9 7 8.2 4.1-1.3 7-4 7-8.2V5.6L12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M12 8v3.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12" cy="15" r="0.95" fill="currentColor" />
    </svg>
  );
}

function InteractionsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <circle cx="8.5" cy="12" r="4.6" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="15.5" cy="12" r="4.6" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function DropletIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <path
        d="M12 3.5c0 0-6 6-6 9.8a6 6 0 0 0 12 0C18 9.5 12 3.5 12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M9.4 13.6a2.7 2.7 0 0 0 2.6 2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PulseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <path
        d="M3 12.5h4l2-6 3.4 11L16 12.5h5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DocumentIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <path
        d="M6 3.5h7l5 5v12H6Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M13 3.5v5h5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function SyringeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <path
        d="m17.5 6.5-9.2 9.2a2 2 0 0 1-1.1.56l-3 .44.44-3a2 2 0 0 1 .56-1.1l9.2-9.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m13 3 8 8M18 6l2-2M9.5 9.5l2 2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HeartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <path
        d="M12 20s-7.5-4.6-7.5-10A4.4 4.4 0 0 1 9 5.6c1.3 0 2.4.6 3 1.6.6-1 1.7-1.6 3-1.6a4.4 4.4 0 0 1 4.5 4.4c0 5.4-7.5 10-7.5 10Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FlaskIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <path
        d="M9.5 3.5h5M10.5 3.5v5.2L5.4 17a2.4 2.4 0 0 0 2.1 3.5h9a2.4 2.4 0 0 0 2.1-3.5l-5.1-8.3V3.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M7.5 14.5h9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

const ZONE_ICONS: Record<string, (props: IconProps) => ReactNode> = {
  administration: SyringeIcon,
  adverse: PulseIcon,
  dosing: CapsuleIcon,
  interactions: InteractionsIcon,
  pharmacology: FlaskIcon,
  pregnancy: HeartIcon,
  renal_hepatic: DropletIcon,
  safety: ShieldAlertIcon,
};

export function ClinicalZoneIcon({
  className = "h-[18px] w-[18px]",
  sectionId,
}: {
  className?: string;
  sectionId: string;
}) {
  const Icon = ZONE_ICONS[sectionId] ?? DocumentIcon;
  return <Icon className={className} />;
}

// ─── Chevron ────────────────────────────────────────────────────────────────────
export function ClinicalChevron({
  className = "h-4 w-4",
  open,
}: {
  className?: string;
  open: boolean;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={`${className} shrink-0 text-[#8499af] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d="m4 6 4 4 4-4" />
    </svg>
  );
}

// ─── Source label (consolidated — used by A's card and B's canvas) ───────────────
export function ClinicalSourceLabel({
  className = "",
  source,
}: {
  className?: string;
  source: DrugMonographSource;
}) {
  return (
    <span
      className={`inline-flex min-w-0 items-center gap-1.5 text-[11px] text-[#6b8499] ${className}`}
    >
      <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5 shrink-0" fill="none">
        <path
          d="M8 1.5 14 4v4c0 3.2-2.2 5.3-6 6.5C4.2 13.3 2 11.2 2 8V4L8 1.5Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path
          d="m5.8 8 1.6 1.6 3-3.2"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-semibold text-[var(--mscp-color-brand-primary)]">{source.label}</span>
      <span aria-hidden="true">·</span>
      <span className="truncate">{source.section}</span>
    </span>
  );
}

// ─── Boxed warning (FDA "black box") ──────────────────────────────────────────────
// The most critical clinical element — rendered as the serious regulatory artifact
// it is, never a soft note. Always eager, never collapsed.
// Two color treatments: "critical" (default, red/maroon FDA convention used by
// most concepts) and "navy" (Concept J — matches the Figma "ClinicalBoxedWarning"
// node 1287:15295, bg #0a1729 header/border, white body, #161b1d body text).
const BOXED_WARNING_TONES = {
  critical: {
    container: "border-2 border-[#7a271a] bg-[#fffaf9]",
    header: "bg-[#7a271a]",
    text: "text-[#5c1d12]",
  },
  navy: {
    container: "border border-[#0a1729] bg-white",
    header: "bg-[#0a1729]",
    text: "text-[#161b1d]",
  },
} as const;

export function ClinicalBoxedWarning({
  className = "",
  compact = false,
  variant = "critical",
  warnings,
}: {
  className?: string;
  compact?: boolean;
  /** Color treatment — "critical" (default) or "navy" (Concept J / Figma match). */
  variant?: keyof typeof BOXED_WARNING_TONES;
  warnings: DrugBlackBoxWarning[];
}) {
  if (!warnings.length) return null;
  const tone = BOXED_WARNING_TONES[variant];

  return (
    <div
      role="alert"
      className={`overflow-hidden rounded-[10px] ${tone.container} ${className}`}
    >
      <div className={`flex items-center gap-1.5 px-3 py-1.5 ${tone.header}`}>
        <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5 text-white" fill="none">
          <path
            d="M8 2 14.5 13.5H1.5L8 2Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path d="M8 6.5v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="8" cy="11.4" r="0.85" fill="currentColor" />
        </svg>
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white">
          Boxed Warning
        </span>
      </div>
      <div className="px-3.5 py-2.5">
        {compact ? (
          warnings.map((warning) => (
            <p key={warning.id} className={`text-[12.5px] leading-[1.55] ${tone.text} line-clamp-2`}>
              {warning.text}
            </p>
          ))
        ) : (
          <TruncatedWarningText warnings={warnings} textClassName={tone.text} />
        )}
      </div>
    </div>
  );
}

// Collapsed by default (5 lines on mobile, 3 on desktop) across all warnings
// combined, with a "Read more" / "Read less" toggle that only appears when
// the combined text actually overflows.
function TruncatedWarningText({
  warnings,
  textClassName,
}: {
  warnings: DrugBlackBoxWarning[];
  textClassName: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setOverflows(el.scrollHeight - el.clientHeight > 1);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [warnings]);

  return (
    <div>
      <div
        ref={ref}
        className={`text-[12.5px] leading-[1.55] ${textClassName} ${
          expanded ? "" : "line-clamp-5 md:line-clamp-3"
        }`}
      >
        {warnings.map((warning, index) => (
          <span key={warning.id}>
            {warning.text}
            {index < warnings.length - 1 && (
              <>
                <br />
                <br />
              </>
            )}
          </span>
        ))}
      </div>
      {(overflows || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--mscp-color-brand-primary)]"
        >
          {expanded ? "Read less" : "Read more"}
          <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            className={`h-3 w-3 shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
          >
            <path
              d="m4 6 4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
