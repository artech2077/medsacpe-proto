"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AiCloseIcon } from "@/components/medscape/ai-response/iconography";
import { AiResponseReferenceCard } from "@/components/medscape/ai-response/reference-card";
import { WeightBasedLiquidMedicationCalculator } from "@/components/medscape/ai-response/weight-based-liquid-medication-calculator";
import { ResponsiveFeaturePanel } from "@/components/ui/responsive-feature-panel";
import type { AiAnswerReference } from "@/data/ai-response";

export type AiAnswerBlock =
  | { text: string; type: "heading" | "paragraph" }
  | { items: string[]; type: "list" };

type AiAnswerBlockWithRange =
  | { end: number; start: number; text: string; type: "heading" | "paragraph" }
  | { end: number; items: string[]; start: number; type: "list" };

type LeadingKeyPointsSplit = {
  body: string;
  keyPoints: string[];
};

type TooltipPosition = {
  arrowLeft: number;
  left: number;
  markerKey: string;
  top: number;
  width: number;
};

const LEADING_KEY_POINTS_PATTERN =
  /^\s*Key Points\s*\n((?:-\s+.*(?:\n|$))*)(?:\n+)*/i;
const WEIGHT_DOSING_CALCULATOR_TAG = "{calc_weight_dosing}";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getCitationBlockIndexes(blocks: AiAnswerBlock[], citationCount: number) {
  if (citationCount === 0) {
    return new Map<number, number>();
  }

  const sectionEndIndexes: number[] = [];
  let lastContentIndex: number | null = null;

  blocks.forEach((block, index) => {
    if (block.type === "heading") {
      if (lastContentIndex !== null) {
        sectionEndIndexes.push(lastContentIndex);
        lastContentIndex = null;
      }
      return;
    }

    lastContentIndex = index;
  });

  if (lastContentIndex !== null) {
    sectionEndIndexes.push(lastContentIndex);
  }

  const selectedIndexes = sectionEndIndexes.slice(-Math.min(citationCount, sectionEndIndexes.length));

  if (selectedIndexes.length < citationCount) {
    for (let index = blocks.length - 1; index >= 0; index -= 1) {
      if (blocks[index]?.type === "heading" || selectedIndexes.includes(index)) {
        continue;
      }

      selectedIndexes.unshift(index);

      if (selectedIndexes.length >= citationCount) {
        break;
      }
    }
  }

  return new Map(
    selectedIndexes
      .sort((left, right) => left - right)
      .map((blockIndex, citationIndex) => [blockIndex, citationIndex + 1]),
  );
}

export function splitLeadingKeyPoints(answer: string): LeadingKeyPointsSplit {
  const match = answer.match(LEADING_KEY_POINTS_PATTERN);

  if (!match) {
    return { body: answer, keyPoints: [] };
  }

  const keyPoints = match[1]
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^-\s+/, ""));

  return {
    body: answer.slice(match[0].length).trimStart(),
    keyPoints,
  };
}

export function getLeadingKeyPointsLength(answer: string) {
  const match = answer.match(LEADING_KEY_POINTS_PATTERN);
  return match ? match[0].length : 0;
}

function buildAnswerBlocksWithRanges(answer: string): AiAnswerBlockWithRange[] {
  const lines = answer.split("\n");
  const blocks: AiAnswerBlockWithRange[] = [];
  let currentList: string[] = [];
  let currentListStart = 0;
  let currentListEnd = 0;
  let offset = 0;

  const flushList = () => {
    if (currentList.length === 0) return;
    blocks.push({
      end: currentListEnd,
      items: currentList,
      start: currentListStart,
      type: "list",
    });
    currentList = [];
  };

  for (const line of lines) {
    const lineStart = offset;
    const lineEnd = lineStart + line.length;
    const trimmedLine = line.trim();
    offset = lineEnd + 1;

    if (!trimmedLine) {
      flushList();
      continue;
    }

    if (/^-\s+/.test(trimmedLine)) {
      if (currentList.length === 0) {
        currentListStart = lineStart;
      }
      currentList.push(trimmedLine.replace(/^-\s+/, ""));
      currentListEnd = lineEnd;
      continue;
    }

    flushList();

    if (
      /^[A-Z][A-Za-z0-9\s&/():-]+$/.test(trimmedLine) &&
      trimmedLine.length <= 40 &&
      !trimmedLine.endsWith(".")
    ) {
      blocks.push({ end: lineEnd, start: lineStart, text: trimmedLine, type: "heading" });
      continue;
    }

    blocks.push({ end: lineEnd, start: lineStart, text: trimmedLine, type: "paragraph" });
  }

  flushList();
  return blocks;
}

export function buildAnswerBlocks(answer: string) {
  return buildAnswerBlocksWithRanges(answer).map((block) => {
    if (block.type === "list") {
      return { items: block.items, type: block.type };
    }

    return { text: block.text, type: block.type };
  });
}

type AiResponseAnswerContentProps = {
  answer: string;
  className?: string;
  fullAnswer?: string;
  references?: AiAnswerReference[];
};

function AiResponseCitationMarker({
  citationId,
  isActive,
  markerKey,
  onClick,
  registerButton,
}: {
  citationId: number;
  isActive: boolean;
  markerKey: string;
  onClick: (citationId: number, markerKey: string) => void;
  registerButton: (markerKey: string, node: HTMLButtonElement | null) => void;
}) {
  return (
    <button
      ref={(node) => registerButton(markerKey, node)}
      type="button"
      aria-label={`Open citation ${citationId}`}
      aria-pressed={isActive}
      onClick={() => onClick(citationId, markerKey)}
      className={`mx-0.5 inline-flex h-5 min-w-5 translate-y-[-1px] items-center justify-center rounded-full px-1.5 text-[13px] leading-none font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.22)] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
        isActive ? "bg-[#dfeafb] text-[#161b1d]" : "bg-[#ecf1f9] text-[#161b1d] hover:bg-[#dfeafb]"
      }`}
    >
      {citationId}
    </button>
  );
}

export function renderInlineText(
  text: string,
  renderCitation?: (citationId: number, key: string) => ReactNode,
): ReactNode[] {
  const nodes: ReactNode[] = [];
  let appendCalculatorIcon = false;

  text
    .split(/(\{calc_weight_dosing\}|\*\*[^*]+\*\*|\[\d+\])/g)
    .filter(Boolean)
    .forEach((part, index) => {
      if (part === WEIGHT_DOSING_CALCULATOR_TAG) {
        appendCalculatorIcon = true;
        return;
      }

      let node: ReactNode;
      if (part.startsWith("**") && part.endsWith("**")) {
        node = (
          <strong key={`${part}-${index}`} className="font-extrabold">
            {part.slice(2, -2)}
          </strong>
        );
      } else if (renderCitation && /^\[\d+\]$/.test(part)) {
        node = renderCitation(Number(part.slice(1, -1)), `${part}-${index}`);
      } else {
        node = part;
      }

      nodes.push(node);
      if (appendCalculatorIcon) {
        nodes.push(<WeightDosingCalculatorIcon key={`weight-dosing-${index}`} />);
        appendCalculatorIcon = false;
      }
    });

  return nodes;
}

/** Inline visual treatment for the Content API POC's weight-dosing marker. */
export function WeightDosingCalculatorIcon() {
  return (
    <ResponsiveFeaturePanel
      compactTrigger={<CalculatorGlyph />}
      className="ml-2 inline-flex translate-y-[3px] text-[#0085bd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0085bd] focus-visible:ring-offset-2"
      panelTitle="Weight-based liquid medication dosing"
      title="Weight-based dose calculator"
    >
      <WeightBasedLiquidMedicationCalculator />
    </ResponsiveFeaturePanel>
  );
}

function CalculatorGlyph() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="22"
      viewBox="0 0 24 34"
      width="15"
    >
      <rect x="1.5" y="1.5" width="21" height="31" rx="2.75" stroke="currentColor" strokeWidth="2.5" />
      <rect x="5" y="5.5" width="14" height="5.5" rx="0.9" stroke="currentColor" strokeWidth="2" />
      <circle cx="7" cy="16" r="1.35" fill="currentColor" />
      <circle cx="12" cy="16" r="1.35" fill="currentColor" />
      <circle cx="17" cy="16" r="1.35" fill="currentColor" />
      <circle cx="7" cy="21.5" r="1.35" fill="currentColor" />
      <circle cx="12" cy="21.5" r="1.35" fill="currentColor" />
      <circle cx="17" cy="21.5" r="1.35" fill="currentColor" />
      <circle cx="7" cy="27" r="1.35" fill="currentColor" />
      <circle cx="12" cy="27" r="1.35" fill="currentColor" />
      <circle cx="17" cy="27" r="1.35" fill="currentColor" />
    </svg>
  );
}

export function AiResponseAnswerContent({
  answer,
  className,
  fullAnswer,
  references = [],
}: AiResponseAnswerContentProps) {
  const [openCitationId, setOpenCitationId] = useState<number | null>(null);
  const [openCitationMarkerKey, setOpenCitationMarkerKey] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const citationButtonRefs = useRef(new Map<string, HTMLButtonElement>());

  const { body } = splitLeadingKeyPoints(answer);
  const { body: fullBody } = splitLeadingKeyPoints(fullAnswer ?? answer);
  const hasInlineCitations = /\[\d+\]/.test(fullBody);
  const blocks = useMemo(() => buildAnswerBlocks(body), [body]);
  const fullBlocks = useMemo(() => buildAnswerBlocksWithRanges(fullBody), [fullBody]);
  const citationTargets = useMemo(
    () => {
      if (hasInlineCitations) {
        return new Map<number, { citationId: number; end: number }>();
      }

      return new Map(
        Array.from(getCitationBlockIndexes(fullBlocks, references.length).entries()).map(
          ([blockIndex, citationId]) => [
            blockIndex,
            { citationId, end: fullBlocks[blockIndex]?.end ?? 0 },
          ],
        ),
      );
    },
    [fullBlocks, hasInlineCitations, references.length],
  );
  const openReference = useMemo(
    () => references.find((reference) => reference.id === openCitationId) ?? null,
    [openCitationId, references],
  );

  const registerCitationButton = useCallback(
    (markerKey: string, node: HTMLButtonElement | null) => {
      if (node) {
        citationButtonRefs.current.set(markerKey, node);
        return;
      }

      citationButtonRefs.current.delete(markerKey);
    },
    [],
  );

  const updateTooltipPosition = useCallback(() => {
    if (!openCitationId || !openCitationMarkerKey) {
      setTooltipPosition(null);
      return;
    }

    const contentElement = contentRef.current;
    const citationButton = citationButtonRefs.current.get(openCitationMarkerKey);
    if (!contentElement || !citationButton) {
      setTooltipPosition(null);
      return;
    }

    const contentRect = contentElement.getBoundingClientRect();
    const buttonRect = citationButton.getBoundingClientRect();
    const maxWidth = Math.max(Math.min(500, contentRect.width - 24), 240);
    const markerCenter = buttonRect.left - contentRect.left + buttonRect.width / 2;
    const left = clamp(markerCenter - maxWidth / 2, 12, Math.max(contentRect.width - maxWidth - 12, 12));
    const arrowLeft = clamp(markerCenter - left, 22, maxWidth - 22);
    const top = buttonRect.bottom - contentRect.top + 16;

    setTooltipPosition({
      arrowLeft,
      left,
      markerKey: openCitationMarkerKey,
      top,
      width: maxWidth,
    });
  }, [openCitationId, openCitationMarkerKey]);

  useEffect(() => {
    if (!openCitationId) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      updateTooltipPosition();
    });

    const handleLayoutChange = () => {
      updateTooltipPosition();
    };

    window.addEventListener("resize", handleLayoutChange);
    window.addEventListener("scroll", handleLayoutChange, true);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleLayoutChange);
      window.removeEventListener("scroll", handleLayoutChange, true);
    };
  }, [openCitationId, updateTooltipPosition]);

  useEffect(() => {
    if (!openCitationId) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (tooltipRef.current?.contains(target)) {
        return;
      }

      for (const button of citationButtonRefs.current.values()) {
        if (button.contains(target)) {
          return;
        }
      }

      setOpenCitationId(null);
      setOpenCitationMarkerKey(null);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenCitationId(null);
        setOpenCitationMarkerKey(null);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [openCitationId]);

  if (blocks.length === 0) {
    return null;
  }

  const renderCitationMarker = (citationId: number, key: string) => (
    <AiResponseCitationMarker
      key={key}
      citationId={citationId}
      isActive={openCitationId === citationId && openCitationMarkerKey === key}
      markerKey={key}
      onClick={(nextCitationId, nextMarkerKey) => {
        if (openCitationId === nextCitationId && openCitationMarkerKey === nextMarkerKey) {
          setOpenCitationId(null);
          setOpenCitationMarkerKey(null);
          setTooltipPosition(null);
          return;
        }

        setTooltipPosition(null);
        setOpenCitationId(nextCitationId);
        setOpenCitationMarkerKey(nextMarkerKey);
      }}
      registerButton={registerCitationButton}
    />
  );

  return (
    <div
      ref={contentRef}
      className={[
        "relative text-[16px] leading-[1.45] text-[var(--mscp-color-text-body)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {blocks.map((block, index) => {
        const citationTarget = citationTargets.get(index);
        const citationId =
          citationTarget && citationTarget.end <= body.length ? citationTarget.citationId : null;

        if (block.type === "heading") {
          return (
            <h2
              key={`${block.type}-${index}`}
              className="mt-8 text-[16px] font-bold text-[#3c454d] first:mt-0"
            >
              {block.text}
            </h2>
          );
        }

        if (block.type === "list") {
          return (
            <ul
              key={`${block.type}-${index}`}
              className="mt-5 list-disc space-y-3 pl-6 marker:text-[#252c31]"
            >
              {block.items.map((item, itemIndex) => {
                const isLastItem = itemIndex === block.items.length - 1;

                return (
                  <li key={`${item}-${itemIndex}`}>
                    {renderInlineText(item, (nextCitationId, key) =>
                      renderCitationMarker(
                        nextCitationId,
                        `list-${index}-${itemIndex}-${key}`,
                      ),
                    )}
                    {citationId && isLastItem ? (
                      <AiResponseCitationMarker
                        citationId={citationId}
                        isActive={
                          openCitationId === citationId &&
                          openCitationMarkerKey === `auto-list-${index}`
                        }
                        markerKey={`auto-list-${index}`}
                        onClick={(nextCitationId, nextMarkerKey) => {
                          if (
                            openCitationId === nextCitationId &&
                            openCitationMarkerKey === nextMarkerKey
                          ) {
                            setOpenCitationId(null);
                            setOpenCitationMarkerKey(null);
                            setTooltipPosition(null);
                            return;
                          }

                          setTooltipPosition(null);
                          setOpenCitationId(nextCitationId);
                          setOpenCitationMarkerKey(nextMarkerKey);
                        }}
                        registerButton={registerCitationButton}
                      />
                    ) : null}
                  </li>
                );
              })}
            </ul>
          );
        }

        return (
          <p key={`${block.type}-${index}`} className="mt-5 first:mt-0">
            {renderInlineText(block.text, (nextCitationId, key) =>
              renderCitationMarker(nextCitationId, `paragraph-${index}-${key}`),
            )}
            {citationId ? (
              <AiResponseCitationMarker
                citationId={citationId}
                isActive={
                  openCitationId === citationId &&
                  openCitationMarkerKey === `auto-paragraph-${index}`
                }
                markerKey={`auto-paragraph-${index}`}
                onClick={(nextCitationId, nextMarkerKey) => {
                  if (
                    openCitationId === nextCitationId &&
                    openCitationMarkerKey === nextMarkerKey
                  ) {
                    setOpenCitationId(null);
                    setOpenCitationMarkerKey(null);
                    setTooltipPosition(null);
                    return;
                  }

                  setTooltipPosition(null);
                  setOpenCitationId(nextCitationId);
                  setOpenCitationMarkerKey(nextMarkerKey);
                }}
                registerButton={registerCitationButton}
              />
            ) : null}
          </p>
        );
      })}

      {openReference &&
      tooltipPosition &&
      tooltipPosition.markerKey === openCitationMarkerKey ? (
        <div
          ref={tooltipRef}
          className="absolute z-20"
          style={{
            left: `${tooltipPosition.left}px`,
            top: `${tooltipPosition.top}px`,
            width: `${tooltipPosition.width}px`,
          }}
        >
          <div
            aria-hidden="true"
            className="absolute top-[-11px] h-0 w-0 border-x-[12px] border-b-[12px] border-x-transparent border-b-white"
            style={{ left: `${tooltipPosition.arrowLeft}px`, transform: "translateX(-50%)" }}
          />

          <div className="rounded-[4px] bg-white p-3 shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
            <div className="flex items-start gap-2">
              <AiResponseReferenceCard
                reference={openReference}
                variant="compact"
                className="min-w-0 flex-1"
              />

              <button
                type="button"
                aria-label="Close citation tooltip"
                onClick={() => setOpenCitationId(null)}
                className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[#2c353a] transition hover:bg-[#f4f7fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.22)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                <AiCloseIcon />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
