/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import type { MedscapeFeatureUpdate } from "@/data/medscape-feature-updates";

type MedscapeFeatureUpdatesModalProps = {
  ctaLabel?: string;
  isOpen?: boolean;
  mode?: "embedded" | "overlay";
  onClose: () => void;
  onContinue?: (update: MedscapeFeatureUpdate, index: number) => void;
  updates: MedscapeFeatureUpdate[];
};

function FeatureUpdateImage({
  headline,
  imageUrl,
}: {
  headline: string;
  imageUrl: string;
}) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={headline}
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(135deg,#d9e6f6_0%,#edf3fb_48%,#f4e3fb_100%)]">
      <div className="absolute inset-x-6 top-6 h-10 rounded-full bg-white/50" />
      <div className="absolute right-7 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_8px_18px_rgba(6,74,167,0.14)]">
        <span className="text-xl leading-none text-[#8f3dff]">+</span>
      </div>
      <div className="absolute inset-x-6 bottom-6 grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="aspect-[1.05] rounded-[16px] bg-white/55 shadow-[0_10px_24px_rgba(16,24,40,0.08)]"
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,74,167,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(246,0,255,0.15),transparent_30%)]" />
      <div className="absolute inset-x-0 bottom-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-[#435056]">
        Placeholder image
      </div>
    </div>
  );
}

function FeatureUpdatePanel({
  activeIndex,
  canNavigate,
  ctaLabel,
  onClose,
  onContinue,
  onSelectIndex,
  onStep,
  updates,
}: {
  activeIndex: number;
  canNavigate: boolean;
  ctaLabel: string;
  onClose: () => void;
  onContinue?: (update: MedscapeFeatureUpdate, index: number) => void;
  onSelectIndex: (index: number) => void;
  onStep: (direction: -1 | 1) => void;
  updates: MedscapeFeatureUpdate[];
}) {
  const activeUpdate = updates[activeIndex] ?? updates[0];
  const isLastSlide = activeIndex === updates.length - 1;
  const buttonLabel = canNavigate && !isLastSlide ? "Next" : ctaLabel;
  if (!activeUpdate) return null;

  return (
    <section className="w-[min(100%,668px)] rounded-[8px] bg-white shadow-[0_2px_9px_rgba(0,0,0,0.1)]">
      <div className="flex justify-end px-2 pt-2 md:px-4 md:pt-4">
        <button
          type="button"
          aria-label="Close feature updates"
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#6f8590] transition hover:bg-[#edf2f8] hover:text-[#435056]"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4" fill="none">
            <path
              d="M3 3 13 13M13 3 3 13"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.4"
            />
          </svg>
        </button>
      </div>

      <div className="px-4 pb-4 md:px-8 md:pb-10">
        <div className="flex flex-col items-center gap-2 pb-4 text-center md:flex-row md:justify-center md:gap-2 md:pb-5">
          <p className="text-[16px] leading-[20.8px] font-bold text-[var(--mscp-color-text-primary)] md:text-[20px] md:leading-[26px]">
            What&apos;s new from
          </p>
          <img
            src="/assets/medscape-ai.svg"
            alt="Medscape AI"
            className="h-[22px] w-auto object-contain"
          />
        </div>

        <div className="relative overflow-hidden rounded-[8px] shadow-[0_2px_9px_rgba(0,0,0,0.1)]">
          <div className="aspect-[311/230] w-full md:aspect-[604/201]">
            <FeatureUpdateImage
              headline={activeUpdate.headline}
              imageUrl={activeUpdate.imageUrl}
            />
          </div>

          {canNavigate ? (
            <>
              <button
                type="button"
                aria-label="Previous update"
                onClick={() => onStep(-1)}
                className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#064aa7] text-white shadow-[0_10px_20px_rgba(6,74,167,0.24)] transition hover:bg-[#0b5cc9]"
              >
                <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4" fill="none">
                  <path
                    d="m10 3.5-4.5 4.5 4.5 4.5"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.6"
                  />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next update"
                onClick={() => onStep(1)}
                className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#064aa7] text-white shadow-[0_10px_20px_rgba(6,74,167,0.24)] transition hover:bg-[#0b5cc9]"
              >
                <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4" fill="none">
                  <path
                    d="M6 3.5 10.5 8 6 12.5"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.6"
                  />
                </svg>
              </button>
            </>
          ) : null}
        </div>

        <div className="flex flex-col items-center gap-5 px-1 pt-6 text-center md:px-6 md:pt-8">
          <div className="w-full max-w-[604px]">
            <p className="text-[16px] leading-[20.8px] font-bold text-[var(--mscp-color-text-primary)] md:text-[20px] md:leading-[26px]">
              {activeUpdate.headline}
            </p>
            <p className="mt-2 text-[16px] leading-[20.8px] text-[var(--mscp-color-text-primary)] md:text-[20px] md:leading-[26px]">
              {activeUpdate.description}
            </p>
          </div>

          {canNavigate ? (
            <div className="flex items-center gap-2" aria-label="Feature update pages">
              {updates.map((update, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={update.id}
                    type="button"
                    aria-label={`Show update ${index + 1}`}
                    aria-pressed={isActive}
                    onClick={() => onSelectIndex(index)}
                    className={`h-2.5 rounded-full transition ${
                      isActive ? "w-7 bg-[#064aa7]" : "w-2.5 bg-[#c5ced3]"
                    }`}
                  />
                );
              })}
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => {
              if (canNavigate && !isLastSlide) {
                onStep(1);
                return;
              }

              onContinue?.(activeUpdate, activeIndex);
            }}
            className="inline-flex min-w-[148px] items-center justify-center rounded-full bg-[#064aa7] px-6 py-3 text-[16px] leading-[19.2px] font-semibold text-white transition hover:bg-[#0b5cc9]"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </section>
  );
}

export function MedscapeFeatureUpdatesModal({
  ctaLabel = "Try it Now",
  isOpen = true,
  mode = "overlay",
  onClose,
  onContinue,
  updates,
}: MedscapeFeatureUpdatesModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sanitizedUpdates = updates.length > 0 ? updates : [];
  const canNavigate = sanitizedUpdates.length > 1;
  const boundedActiveIndex = Math.min(activeIndex, Math.max(sanitizedUpdates.length - 1, 0));

  useEffect(() => {
    if (mode !== "overlay" || !isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, mode]);

  if (sanitizedUpdates.length === 0) return null;
  if (mode === "overlay" && !isOpen) return null;

  const step = (direction: -1 | 1) => {
    setActiveIndex((currentIndex) => {
      const safeIndex = Math.min(
        currentIndex,
        Math.max(sanitizedUpdates.length - 1, 0),
      );
      const nextIndex = safeIndex + direction;
      if (nextIndex < 0) return sanitizedUpdates.length - 1;
      if (nextIndex >= sanitizedUpdates.length) return 0;
      return nextIndex;
    });
  };

  const panel = (
    <FeatureUpdatePanel
      activeIndex={boundedActiveIndex}
      canNavigate={canNavigate}
      ctaLabel={ctaLabel}
      onClose={onClose}
      onContinue={onContinue}
      onSelectIndex={setActiveIndex}
      onStep={step}
      updates={sanitizedUpdates}
    />
  );

  if (mode === "embedded") {
    return panel;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-6">
      <button
        type="button"
        aria-label="Close feature updates"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(0,0,0,0.6)]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="What's new from Medscape AI"
        className="relative z-10 w-full max-w-[700px]"
      >
        {panel}
      </div>
    </div>
  );
}
