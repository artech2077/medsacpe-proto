"use client";

/**
 * ScrollDownFAB — same scroll-to-bottom button used in the AI-response prototype.
 *
 * Shows when the scroll container has content hidden below the fold.
 * Disappears when the user reaches the bottom (or within 80 px of it).
 * Does NOT auto-scroll — it is the user's manual trigger.
 *
 * Usage (drop inside the same `relative` wrapper as the scroll container):
 *
 *   <div className="pointer-events-none absolute inset-x-0 bottom-[76px] z-10">
 *     <div className="mx-auto flex w-full max-w-[900px] justify-center px-5">
 *       <ScrollDownFAB scrollRef={scrollRef} />
 *     </div>
 *   </div>
 */

import { useEffect, useState, type RefObject } from "react";
import { aiResponseAssets } from "@/data/ai-response";

/** px from the true bottom before we consider the user "at the bottom". */
const AT_BOTTOM_THRESHOLD = 80;

type ScrollDownFABProps = {
  scrollRef: RefObject<HTMLDivElement | null>;
};

export function ScrollDownFAB({ scrollRef }: ScrollDownFABProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const check = () => {
      const fromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      setVisible(fromBottom > AT_BOTTOM_THRESHOLD);
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
      aria-label="Scroll to latest"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      disabled={!visible}
      onClick={handleClick}
      style={{ touchAction: "manipulation" }}
      className={`inline-flex h-8 w-8 items-center justify-center transition-all duration-200 ease-out ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-1 opacity-0"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={aiResponseAssets.composerIcons.scrollDown}
        alt=""
        aria-hidden="true"
        className="h-8 w-8 object-contain"
      />
    </button>
  );
}
