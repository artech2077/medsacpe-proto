"use client";

import { AiResponseAnswerActions } from "@/components/medscape/ai-response/answer-actions";
import { AiResponseFollowUpQuestions } from "@/components/medscape/ai-response/follow-up-questions";
import {
  AiResponseRelatedArticles,
  type RelatedArticle,
} from "@/components/medscape/ai-response/related-articles";

export const PROTOTYPE_FOLLOW_UP_QUESTIONS = [
  "What's the dosing for oral semaglutide (Rybelsus)?",
  "Should I lower the patient's insulin or sulfonylurea when starting?",
  "What are the most common side effects?",
] as const;

type AiResponseAnswerFooterProps = {
  answer: string;
  articles: RelatedArticle[];
  className?: string;
  onQuestionSelect?: (question: string) => void;
  showActions?: boolean;
};

/**
 * Shared prototype footer used after every answer state. Its follow-up prompts
 * and related content intentionally stay fixed so the walkthrough is about
 * the interaction pattern, not simulated recommendation logic.
 */
export function AiResponseAnswerFooter({
  answer,
  articles,
  className,
  onQuestionSelect,
  showActions = true,
}: AiResponseAnswerFooterProps) {
  return (
    <section className={className} aria-label="Answer actions and related content">
      {showActions ? <AiResponseAnswerActions answer={answer} className="mt-0" /> : null}

      <section
        className={`${showActions ? "mt-5" : "mt-0"} border-t border-[#c5ced3] pt-3`}
        aria-label="Ask a follow-up"
      >
        <div className="mb-3 flex items-center gap-2 text-[#2c353a]">
          <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5 text-[var(--mscp-color-brand-primary)]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 2.5c0 0-.8 3-2.5 4.7C5.8 8.9 2.8 9.7 2.8 10s3 .8 4.7 2.5C9.2 14.2 10 17.5 10 17.5s.8-3.3 2.5-5C14.2 10.8 17.2 10 17.2 10s-3-.8-4.7-2.5C10.8 5.5 10 2.5 10 2.5Z" />
          </svg>
          <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#5a6e7e]">
            Ask a follow-up
          </h2>
        </div>
        <AiResponseFollowUpQuestions
          variant="chips"
          questions={[...PROTOTYPE_FOLLOW_UP_QUESTIONS]}
          onQuestionSelect={onQuestionSelect}
        />
      </section>

      <AiResponseRelatedArticles articles={articles} className="mt-6" />
    </section>
  );
}
