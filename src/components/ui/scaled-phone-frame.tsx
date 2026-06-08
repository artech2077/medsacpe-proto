"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { PhoneFrame } from "@/components/ui/phone-frame";

const PHONE_W = 483;
const PHONE_H = 974;
const PADDING = 32; // px total (16px each side / top / bottom)

/**
 * Wraps PhoneFrame in a CSS transform that scales it to fit the viewport
 * without scrolling. The outer div shrinks to the scaled dimensions so
 * centering works naturally.
 */
export function ScaledPhoneFrame({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState(1);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const maxH = window.innerHeight - PADDING;
      const maxW = window.innerWidth - PADDING;
      const s = Math.min(maxH / PHONE_H, maxW / PHONE_W, 1);
      setScale(s);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const scaledW = Math.round(PHONE_W * scale);
  const scaledH = Math.round(PHONE_H * scale);

  return (
    // Outer div is sized to the scaled dimensions so flexbox centering works
    <div ref={frameRef} style={{ width: scaledW, height: scaledH, overflow: "hidden" }}>
      {/* Inner div is native size, scaled via transform from top-left origin */}
      <div
        style={{
          width: PHONE_W,
          height: PHONE_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <PhoneFrame>{children}</PhoneFrame>
      </div>
    </div>
  );
}
