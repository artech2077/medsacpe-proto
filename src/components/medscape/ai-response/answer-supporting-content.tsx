"use client";

import { MedscapeCurrentAdBlock } from "@/components/medscape/ai-current/ad-block";
import { AiResponseFollowUpQuestions } from "@/components/medscape/ai-response/follow-up-questions";
import { AiResponseReferences } from "@/components/medscape/ai-response/references";
import type { AiAnswerReference } from "@/data/ai-response";

type AiResponseAnswerSupportingContentProps = {
  analyticsContext?: {
    conversationId?: string;
    prototypeFamily?: string;
    prototypeRoute?: string;
    prototypeSlug?: string;
    screenType?: string;
    turnId?: number;
  };
  adPlacement?: string;
  className?: string;
  followUpQuestions: string[];
  onFollowUpQuestionSelect?: (question: string) => void;
  references: AiAnswerReference[];
};

export function AiResponseAnswerSupportingContent({
  analyticsContext,
  adPlacement,
  className,
  followUpQuestions,
  onFollowUpQuestionSelect,
  references,
}: AiResponseAnswerSupportingContentProps) {
  return (
    <section className={className}>
      <AiResponseReferences references={references} />
      <MedscapeCurrentAdBlock
        adPlacement={adPlacement}
        adSlot="answer_footer"
        className="mt-4 md:mt-5"
        conversationId={analyticsContext?.conversationId}
        prototypeFamily={analyticsContext?.prototypeFamily}
        prototypeRoute={analyticsContext?.prototypeRoute}
        prototypeSlug={analyticsContext?.prototypeSlug}
        screenType={analyticsContext?.screenType}
        turnId={analyticsContext?.turnId}
      />
      <AiResponseFollowUpQuestions
        className="mt-4 md:mt-5"
        onQuestionSelect={onFollowUpQuestionSelect}
        questions={followUpQuestions}
      />
    </section>
  );
}
