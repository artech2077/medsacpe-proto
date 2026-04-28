"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { captureAnalyticsEvent } from "@/lib/analytics/posthog";

type MedscapeCurrentAdBlockProps = {
  adPlacement?: string;
  adSlot?: string;
  className?: string;
  conversationId?: string;
  contentDelayMs?: number;
  hideImage?: boolean;
  prototypeFamily?: string;
  prototypeRoute?: string;
  prototypeSlug?: string;
  screenType?: string;
  turnId?: number;
};

export function MedscapeCurrentAdBlock({
  adPlacement,
  adSlot = "medscape_current_ad",
  className = "",
  conversationId,
  contentDelayMs = 0,
  hideImage = false,
  prototypeFamily,
  prototypeRoute,
  prototypeSlug,
  screenType,
  turnId,
}: MedscapeCurrentAdBlockProps) {
  const adRef = useRef<HTMLElement>(null);
  const hasTrackedViewRef = useRef(false);
  const viewTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visibleSinceRef = useRef<number | null>(null);
  const [isContentDelayComplete, setIsContentDelayComplete] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const showContent = contentDelayMs === 0 || isContentDelayComplete;

  useEffect(() => {
    if (contentDelayMs === 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsContentDelayComplete(true);
    }, contentDelayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [contentDelayMs]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const syncViewport = () => setIsDesktop(mediaQuery.matches);

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);

    return () => {
      mediaQuery.removeEventListener("change", syncViewport);
    };
  }, []);

  useEffect(() => {
    const adNode = adRef.current;
    if (!adNode || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const now = performance.now();

        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          if (visibleSinceRef.current === null) {
            visibleSinceRef.current = now;
          }

          if (!hasTrackedViewRef.current && viewTimeoutRef.current === null) {
            const visibleRatio = Number(entry.intersectionRatio.toFixed(2));
            viewTimeoutRef.current = setTimeout(() => {
              if (hasTrackedViewRef.current || visibleSinceRef.current === null) return;

              const timeVisibleMs = Math.round(performance.now() - visibleSinceRef.current);
              hasTrackedViewRef.current = true;
              captureAnalyticsEvent("ad_slot_viewed", {
                ad_placement: adPlacement,
                ad_slot: adSlot,
                conversation_id: conversationId,
                prototype_family: prototypeFamily,
                prototype_route: prototypeRoute,
                prototype_slug: prototypeSlug,
                screen_type: screenType,
                time_visible_ms: timeVisibleMs,
                turn_id: turnId,
                visible_ratio: visibleRatio,
              });
              viewTimeoutRef.current = null;
            }, 1000);
          }

          return;
        }

        if (viewTimeoutRef.current) {
          clearTimeout(viewTimeoutRef.current);
          viewTimeoutRef.current = null;
        }
        visibleSinceRef.current = null;
      },
      { threshold: [0, 0.5, 1] },
    );

    observer.observe(adNode);

    return () => {
      if (viewTimeoutRef.current) {
        clearTimeout(viewTimeoutRef.current);
        viewTimeoutRef.current = null;
      }
      observer.disconnect();
    };
  }, [
    adPlacement,
    adSlot,
    conversationId,
    prototypeFamily,
    prototypeRoute,
    prototypeSlug,
    screenType,
    turnId,
  ]);

  return (
    <aside
      ref={adRef}
      className={`border border-[#C5CED3] bg-[#F2F2F2] px-5 py-5 text-center ${className}`.trim()}
      aria-label="Advertisement"
    >
      <div className="mx-auto h-[250px] w-[300px] max-w-full overflow-hidden md:h-[90px] md:w-[728px]">
        {showContent && !hideImage ? (
          <img
            src={isDesktop ? "/assets/Salutrib_728x90.png" : "/assets/ad.png"}
            alt="Salutrib advertisement"
            className="block h-full w-full object-cover"
          />
        ) : null}
      </div>
      {showContent ? (
        <p className="mt-1 pt-1 text-[12px] leading-[12px] text-[#435056]">
          Advertisement
        </p>
      ) : null}
    </aside>
  );
}
