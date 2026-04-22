"use client";

import { CurrentSparkIcon } from "@/components/medscape/ai-current/current-icons";
import { AiChevronIcon } from "@/components/medscape/ai-response/answer-section-icons";
import {
  buildAnswerBlocks,
  renderInlineText,
  splitLeadingKeyPoints,
} from "@/components/medscape/ai-response/answer-content";

type MedscapePaidTrafficQuickStartProps = {
  answer: string;
  detailState: "preparing" | "streaming" | "complete";
  followUpQuestions: string[];
  onActionSelect: (question: string, actionIndex: number) => void;
  onAskOwnQuestion: () => void;
  referencesCount: number;
};

function stripFormatting(text: string) {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\s+/g, " ").trim();
}

function buildShortAnswer(answer: string) {
  const { body, keyPoints } = splitLeadingKeyPoints(answer);
  const blocks = buildAnswerBlocks(body);

  const paragraph = blocks.find((block) => block.type === "paragraph");
  if (paragraph?.type === "paragraph") {
    return paragraph.text;
  }

  const list = blocks.find((block) => block.type === "list");
  if (list?.type === "list" && list.items.length > 0) {
    return list.items[0];
  }

  if (keyPoints.length > 0) {
    return keyPoints[0];
  }

  return body.trim();
}

function buildSummaryPoints(answer: string) {
  const { body, keyPoints } = splitLeadingKeyPoints(answer);

  if (keyPoints.length >= 2) {
    return keyPoints.slice(0, 2);
  }

  const blocks = buildAnswerBlocks(body);
  const fallbackItems = blocks.flatMap((block) => {
    if (block.type === "list") {
      return block.items;
    }

    if (block.type === "paragraph") {
      return [block.text];
    }

    return [];
  });

  return [...keyPoints, ...fallbackItems].filter(Boolean).slice(0, 2);
}

export function MedscapePaidTrafficQuickStart({
  answer,
  detailState,
  followUpQuestions,
  onActionSelect,
  onAskOwnQuestion,
  referencesCount,
}: MedscapePaidTrafficQuickStartProps) {
  const shortAnswer = buildShortAnswer(answer);
  const summaryPoints = buildSummaryPoints(answer);
  const quickActions = followUpQuestions.slice(0, 3);
  const sourceLabel =
    referencesCount === 1 ? "1 supporting source" : `${referencesCount} supporting sources`;

  return (
    <section className="mt-2 md:mt-1">
      <div className="flex flex-col gap-3">
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/92 px-3 py-1 text-[11px] leading-none font-semibold tracking-[0.08em] text-[#39556c] uppercase shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
          <CurrentSparkIcon className="h-3.5 w-3.5" />
          <span>Quick clinical preview</span>
        </div>
        <p className="text-[12px] leading-[1.35] font-medium text-[#51616c]">
          {detailState === "complete"
            ? "Detailed answer is ready below."
            : detailState === "streaming"
              ? "Detailed answer is building below."
              : "Detailed answer is still loading below."}
        </p>
      </div>

      <div className="mt-5">
        <p className="text-[12px] leading-none font-semibold tracking-[0.08em] text-[#51616c] uppercase">
          Short answer
        </p>
        <p className="mt-2 text-[18px] leading-[1.45] font-semibold text-[#11181d] md:max-w-[760px] md:text-[21px]">
          {renderInlineText(shortAnswer)}
        </p>
      </div>

      {summaryPoints.length > 0 ? (
        <div className="mt-5 border-t border-[#d7e2ec] pt-5">
          <p className="text-[12px] leading-none font-semibold tracking-[0.08em] text-[#51616c] uppercase">
            What matters most
          </p>
          <ul className="mt-3 space-y-3 text-[15px] leading-[1.45] text-[#2c353a]">
            {summaryPoints.map((point, index) => (
              <li key={`${point}-${index}`} className="flex items-start gap-2.5">
                <span
                  aria-hidden="true"
                  className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#064aa7]"
                />
                <span>{renderInlineText(point)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-5 border-t border-[#d7e2ec] pt-5">
        <div className="md:flex md:items-start md:justify-between md:gap-8">
          <div className="md:max-w-[220px]">
            <p className="text-[12px] leading-none font-semibold tracking-[0.08em] text-[#51616c] uppercase">
              Next step to tap
            </p>
            <p className="mt-2 text-[13px] leading-[1.45] text-[#51616c]">
              Jump into a more specific scenario without typing.
            </p>
          </div>
          <div className="mt-3 flex-1 md:mt-0">
            {quickActions.map((question, index) => (
              <button
                key={`${question}-${index}`}
                type="button"
                onClick={() => onActionSelect(question, index)}
                className={`flex w-full items-center gap-4 py-3 text-left transition hover:text-[#043b84] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.22)] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                  index === 0 ? "border-t border-[#d7e2ec]" : ""
                } border-b border-[#d7e2ec]`}
              >
                <span className="flex-1 text-[15px] leading-[1.4] font-medium text-[#17436d]">
                  {stripFormatting(question)}
                </span>
                <AiChevronIcon direction="right" className="h-4 w-4 shrink-0 text-[#17436d]" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-[#d7e2ec] pt-5 md:flex md:items-center md:justify-between md:gap-6">
        <div className="md:max-w-[560px]">
          <p className="text-[12px] leading-none font-semibold tracking-[0.08em] text-[#51616c] uppercase">
            Trust cue
          </p>
          <p className="mt-2 text-[13px] leading-[1.45] text-[#51616c]">
            Medscape AI preview grounded in the detailed answer below. {sourceLabel} are available
            farther down the page.
          </p>
        </div>
        <button
          type="button"
          onClick={onAskOwnQuestion}
          className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#064aa7] px-4 py-2 text-[14px] leading-none font-semibold text-white transition hover:bg-[#043b84] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.24)] focus-visible:ring-offset-2 focus-visible:ring-offset-white md:mt-0 md:min-w-[220px]"
        >
          Tailor this to my patient
        </button>
      </div>
    </section>
  );
}
