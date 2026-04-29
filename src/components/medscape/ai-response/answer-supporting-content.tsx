"use client";

import { MedscapeCurrentAdBlock } from "@/components/medscape/ai-current/ad-block";
import {
  AiResponseFollowUpQuestions,
  type AiResponseFollowUpQuestionsVariant,
} from "@/components/medscape/ai-response/follow-up-questions";
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
  adContentDelayMs?: number;
  className?: string;
  followUpQuestions: string[];
  followUpQuestionsVariant?: AiResponseFollowUpQuestionsVariant;
  hideAd?: boolean;
  hideAdImage?: boolean;
  hideFollowUpQuestions?: boolean;
  onAdViewed?: () => void;
  onFollowUpQuestionSelect?: (question: string) => void;
  referencesDefaultExpanded?: boolean;
  references: AiAnswerReference[];
};

export function AiResponseAnswerSupportingContent({
  analyticsContext,
  adPlacement,
  adContentDelayMs = 0,
  className,
  followUpQuestions,
  followUpQuestionsVariant = "default",
  hideAd = false,
  hideAdImage = false,
  hideFollowUpQuestions = false,
  onAdViewed,
  onFollowUpQuestionSelect,
  referencesDefaultExpanded = false,
  references,
}: AiResponseAnswerSupportingContentProps) {
  return (
    <section className={className}>
      <AiResponseReferences
        analyticsContext={analyticsContext}
        defaultExpanded={referencesDefaultExpanded}
        references={references}
      />
      {hideAd ? null : (
        <MedscapeCurrentAdBlock
          adPlacement={adPlacement}
          adSlot="answer_footer"
          className="mt-4 md:mt-5"
          conversationId={analyticsContext?.conversationId}
          contentDelayMs={adContentDelayMs}
          hideImage={hideAdImage}
          onAdViewed={onAdViewed}
          prototypeFamily={analyticsContext?.prototypeFamily}
          prototypeRoute={analyticsContext?.prototypeRoute}
          prototypeSlug={analyticsContext?.prototypeSlug}
          screenType={analyticsContext?.screenType}
          turnId={analyticsContext?.turnId}
        />
      )}
      {hideFollowUpQuestions ? null : (
        <AiResponseFollowUpQuestions
          className="mt-4 md:mt-5"
          onQuestionSelect={onFollowUpQuestionSelect}
          questions={followUpQuestions}
          variant={followUpQuestionsVariant}
        />
      )}
    </section>
  );
}
