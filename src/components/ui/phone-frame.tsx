import type { ReactNode } from "react";

// Blue.svg is a 483×974 iPhone device mockup with a transparent screen cutout.
// These coordinates were measured from the SVG's transparent area.
// SCREEN_TOP is set to 88 (below the notch) so content starts below the camera pill.
const SVG_W = 483;
const SVG_H = 974;
const SCREEN_LEFT = 11;
const SCREEN_TOP = 88;
const SCREEN_BOTTOM_INSET = 44;
const SCREEN_W = SVG_W - SCREEN_LEFT * 2;          // 461
const SCREEN_H = SVG_H - SCREEN_TOP - SCREEN_BOTTOM_INSET; // 842

/**
 * Wraps children inside the Blue.svg iPhone device mockup.
 * Blue.svg has a transparent screen cutout so the content renders
 * behind the frame overlay and shows through naturally.
 * Pass shellClassName="h-full" to any inner DrugConceptShell.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative shrink-0" style={{ width: SVG_W, height: SVG_H }}>
      {/* App content — rendered inside the transparent screen cutout */}
      <div
        className="absolute overflow-hidden"
        style={{
          left: SCREEN_LEFT,
          top: SCREEN_TOP,
          width: SCREEN_W,
          height: SCREEN_H,
          // Rounded corners to match the SVG screen shape
          borderRadius: "40px 40px 42px 42px",
        }}
      >
        {children}
      </div>

      {/* Blue.svg overlay — opaque phone body, transparent screen area */}
      {/* pointer-events-none so clicks reach the app content below */}
      <img
        src="/assets/Blue.svg"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="pointer-events-none absolute inset-0 select-none"
        style={{ width: SVG_W, height: SVG_H, zIndex: 10 }}
      />
    </div>
  );
}
