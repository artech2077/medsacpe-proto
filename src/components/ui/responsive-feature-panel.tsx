"use client";

import Image from "next/image";
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ResponsiveFeatureTriggerProps = {
  actionLabel?: string;
  className?: string;
  expanded?: boolean;
  hasPopup?: "dialog";
  onClick: () => void;
  title: string;
};

/** Figma-matched launcher shared by expandable and direct task actions. */
export const ResponsiveFeatureTrigger = forwardRef<
  HTMLButtonElement,
  ResponsiveFeatureTriggerProps
>(function ResponsiveFeatureTrigger(
  {
    actionLabel = "Expand",
    className,
    expanded,
    hasPopup,
    onClick,
    title,
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-expanded={expanded}
      aria-haspopup={hasPopup}
      onClick={onClick}
      className={`flex min-h-[36px] w-full items-center justify-between gap-2 rounded-[7px] border border-[var(--mscp-color-brand-primary)] bg-white px-3 py-1.5 text-left text-[var(--mscp-color-brand-primary)] transition hover:bg-[#f7faff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)] focus-visible:ring-offset-2 ${className ?? ""}`}
    >
      <span className="min-w-0 flex-1 text-[13px] font-bold leading-[15.6px] tracking-[0]">
        {title}
      </span>
      <span className="flex shrink-0 items-center gap-1 text-[11.5px] font-bold leading-[13.8px] tracking-[0]">
        {actionLabel}
        <Image
          src="/assets/ai-drug-mono-v2/peer-context-plus.svg"
          alt=""
          aria-hidden="true"
          width={12}
          height={12}
          className="h-3 w-3 shrink-0"
        />
      </span>
    </button>
  );
});

type ResponsiveFeaturePanelProps = {
  children: ReactNode;
  className?: string;
  /** Optional visual identifier shown beside the feature name in the panel header. */
  headerIcon?: ReactNode;
  onOpenChange?: (isOpen: boolean) => void;
  openLabel?: string;
  /** Panel heading when the launcher needs a shorter, action-oriented label. */
  panelTitle?: string;
  title: string;
};

type PanelPhase = "enter" | "open" | "leave";

const FOCUSABLE_ELEMENTS =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * A reusable feature launcher that opens as a right drawer on desktop and a
 * bottom sheet on mobile. The panel content is intentionally feature-agnostic
 * so calculators, interactions, and other tools can use the same shell.
 */
export function ResponsiveFeaturePanel({
  children,
  className,
  headerIcon,
  onOpenChange,
  openLabel = "Expand",
  panelTitle,
  title,
}: ResponsiveFeaturePanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [phase, setPhase] = useState<PanelPhase>("enter");
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const openPanel = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setPhase("enter");
    setIsOpen(true);
    onOpenChange?.(true);
  }, [onOpenChange]);

  const closePanel = useCallback(() => {
    if (closeTimerRef.current) return;
    setPhase("leave");

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null;
      setIsOpen(false);
      onOpenChange?.(false);
      // Returning focus is important for keyboard users, but the peer panel
      // may have just navigated the underlying comparison table elsewhere.
      // Preventing scroll preserves that intentional table position.
      triggerRef.current?.focus({ preventScroll: true });
    }, prefersReducedMotion ? 0 : 260);
  }, [onOpenChange]);

  useEffect(() => {
    if (!isOpen) return;

    const frameId = requestAnimationFrame(() => setPhase("open"));
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeButton = dialogRef.current?.querySelector<HTMLButtonElement>(
      "[data-feature-panel-close]",
    );
    closeButton?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closePanel();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS),
      );
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(frameId);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closePanel, isOpen]);

  useEffect(
    () => () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    },
    [],
  );

  const panelIsVisible = phase === "open";
  const dialogTitle = panelTitle ?? title;

  return (
    <>
      <ResponsiveFeatureTrigger
        ref={triggerRef}
        actionLabel={openLabel}
        className={className}
        expanded={isOpen}
        hasPopup="dialog"
        onClick={openPanel}
        title={title}
      />

      {isOpen ? (
        <div className="fixed inset-0 z-[80]" role="presentation">
          <button
            type="button"
            tabIndex={-1}
            aria-label={`Close ${dialogTitle}`}
            onClick={closePanel}
            className={`absolute inset-0 h-full w-full cursor-default bg-[rgba(16,24,40,0.38)] transition-opacity duration-[260ms] ${
              panelIsVisible ? "opacity-100" : "opacity-0"
            }`}
          />

          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={`absolute inset-x-0 bottom-0 flex max-h-[82dvh] flex-col overflow-hidden rounded-t-[24px] bg-white shadow-[0_-12px_48px_rgba(16,24,40,0.2)] transition-transform duration-[260ms] ease-out md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[min(520px,42vw)] md:min-w-[420px] md:rounded-none md:shadow-[-12px_0_48px_rgba(16,24,40,0.18)] ${
              panelIsVisible
                ? "translate-y-0 md:translate-x-0"
                : "translate-y-full md:translate-x-full md:translate-y-0"
            }`}
          >
            <div aria-hidden="true" className="shrink-0 px-4 pb-1 pt-3 md:hidden">
              <div className="mx-auto h-1 w-10 rounded-full bg-[#c5ced3]" />
            </div>

            <header className="flex shrink-0 items-center gap-3 border-b border-[#e6ebef] px-5 py-4 md:px-7 md:py-5">
              {headerIcon ? (
                <span aria-hidden="true" className="shrink-0 text-[#1c2935]">
                  {headerIcon}
                </span>
              ) : null}
              <h2
                id={titleId}
                className="min-w-0 flex-1 text-[22px] font-semibold leading-[1.2] tracking-[-0.015em] text-[var(--mscp-color-text-primary)] md:text-[26px]"
              >
                {dialogTitle}
              </h2>
              <button
                data-feature-panel-close
                type="button"
                aria-label={`Close ${dialogTitle}`}
                onClick={closePanel}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#435056] transition hover:bg-[#f1f4f7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mscp-color-brand-primary)]"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.5"
                >
                  <path d="m5 5 14 14M19 5 5 19" />
                </svg>
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-5 md:px-7 md:pb-8 md:pt-6">
              {children}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
