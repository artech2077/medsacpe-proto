"use client";

/**
 * ScrollDownFAB — floating "Scroll down" button.
 *
 * Shows when the scroll container has content hidden below the fold.
 * Disappears when the user reaches the bottom.
 * Does NOT auto-scroll on its own — it is the user's manual trigger.
 *
 * Usage:
 *   Place it inside the same `relative` wrapper that contains the scroll
 *   container, positioned above the fixed composer:
 *
 *   <div className="pointer-events-none absolute inset-x-0 bottom-[72px] z-20 flex justify-center">
 *     <ScrollDownFAB scrollRef={scrollRef} />
 *   </div>
 */

import { useEffect, useRef, useState, type RefObject } from "react";

/** px from the true bottom before we consider the user "at the bottom". */
const AT_BOTTOM_THRESHOLD = 80;

type ScrollDownFABProps = {
  scrollRef: RefObject<HTMLDivElement | null>;
  /** Bottom offset from the containing block. Used when you need to nudge the
   *  button above the composer; defaults to 0 (position handled by parent). */
  className?: string;
};

export function ScrollDownFAB({ scrollRef, className = "" }: ScrollDownFABProps) {
  const [visible, setVisible] = useState(false);
  // Track whether the button has ever become visible; gates the enter animation.
  const everVisibleRef = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const check = () => {
      const fromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      const shouldShow = fromBottom > AT_BOTTOM_THRESHOLD;
      if (shouldShow) everVisibleRef.current = true;
      setVisible(shouldShow);
    };

    check();
    el.addEventListener("scroll", check, { passive: true });

    // Re-check whenever content height changes (new answers arriving).
    const ro = new ResizeObserver(check);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);

    return () => {
      el.removeEventListener("scroll", check);
      ro.disconnect();
    };
  }, [scrollRef]);

  const handleClick = () => {
    scrollRef.current?.scrollTo({
      behavior: "smooth",
      top: scrollRef.current.scrollHeight,
    });
  };

  return (
    <button
      type="button"
      aria-label="Scroll to bottom"
      onClick={handleClick}
      style={{ touchAction: "manipulation" }}
      className={[
        // Layout
        "pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-[rgba(6,74,167,0.18)] bg-white/90 px-3.5 py-1.5 backdrop-blur-sm",
        // Typography
        "text-[12px] font-semibold text-[var(--mscp-color-brand-primary)]",
        // Shadow + interactions
        "shadow-[0_2px_10px_rgba(16,24,40,0.1)] transition-all duration-200",
        "hover:bg-white hover:shadow-[0_4px_14px_rgba(16,24,40,0.14)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]",
        // Visibility — fade + slide in/out
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      Scroll down
      <svg
        viewBox="0 0 12 12"
        className="h-3 w-3"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2 4l4 4 4-4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
