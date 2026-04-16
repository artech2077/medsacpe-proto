"use client";

import { MedscapeCurrentAdBlock } from "@/components/medscape/ai-current/ad-block";
import { AiResponseFollowUpQuestions } from "@/components/medscape/ai-response/follow-up-questions";
import { AiResponseReferences } from "@/components/medscape/ai-response/references";
import type { AiAnswerReference } from "@/data/ai-response";

type AiResponseAnswerSupportingContentProps = {
  className?: string;
  followUpQuestions: string[];
  onFollowUpQuestionSelect?: (question: string) => void;
  references: AiAnswerReference[];
};

export function AiResponseAnswerSupportingContent({
  className,
  followUpQuestions,
  onFollowUpQuestionSelect,
  references,
}: AiResponseAnswerSupportingContentProps) {
  return (
    <section className={className}>
      <AiResponseReferences references={references} />
      <MedscapeCurrentAdBlock className="mt-4 md:mt-5" />
      <AiResponseFollowUpQuestions
        className="mt-4 md:mt-5"
        onQuestionSelect={onFollowUpQuestionSelect}
        questions={followUpQuestions}
      />
    </section>
  );
}
