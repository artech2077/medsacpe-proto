import { redirect } from "next/navigation";
import { MedscapeAiCurrentScreen } from "@/components/screens/medscape-ai-current-screen";
import {
  paidAdsHantavirusFluComparisonAnswer,
  paidAdsHantavirusFluComparisonFollowUpAnswerPreviews,
  paidAdsHantavirusFluComparisonFollowUpQuestionRedirectUrls,
  paidAdsHantavirusFluComparisonFollowUpQuestions,
  paidAdsHantavirusFluComparisonInitialQuestion,
  paidAdsHantavirusFluComparisonReferences,
} from "@/data/paid-ads-hantavirus";

type PaidAdsExperience5ChatPageProps = {
  searchParams: Promise<{
    mode?: string | string[];
    q?: string | string[];
    source?: string | string[];
  }>;
};

export default async function PaidAdsExperience5ChatPage({
  searchParams,
}: PaidAdsExperience5ChatPageProps) {
  const params = await searchParams;
  const modeValue = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const sourceValue = Array.isArray(params.source) ? params.source[0] : params.source;
  const initialQuestion = paidAdsHantavirusFluComparisonInitialQuestion;
  const initialConversationMode = modeValue === "complete" ? "complete" : "stream";

  if (!params.q) {
    redirect(
      `/paid-ads-exp-5/chat?q=${encodeURIComponent(
        paidAdsHantavirusFluComparisonInitialQuestion,
      )}&mode=complete&source=${encodeURIComponent("direct_url")}`,
    );
  }

  return (
    <MedscapeAiCurrentScreen
      adContentDelayMs={3000}
      adPlacement="above-question"
      answerDisclosureVariant="full-answer-fade"
      autoScrollToInitialAd
      fadedAnswerCollapsedContent="first-paragraph"
      followUpQuestionAnswerPreviews={paidAdsHantavirusFluComparisonFollowUpAnswerPreviews}
      followUpQuestionsPlacement="before-actions"
      followUpQuestionsVariant="accordion-preview"
      followUpQuestionsOverride={paidAdsHantavirusFluComparisonFollowUpQuestions}
      followUpQuestionRedirectUrls={paidAdsHantavirusFluComparisonFollowUpQuestionRedirectUrls}
      hideAnswerFooterAdForFirstTurn
      hideAdImage
      initialAnswerOverride={paidAdsHantavirusFluComparisonAnswer}
      initialConversationMode={initialConversationMode}
      initialQuestion={initialQuestion}
      initialQuestionSource={sourceValue ?? "direct_url"}
      instantAnswerDelayMs={3000}
      instantAnswers
      keyPointsDefaultExpanded={false}
      keyPointsVariant="collapsed-read-more"
      learnMoreLabel="Read more"
      queryRedirectUrl="https://www.medscape.com/ai-search"
      referencesOverride={paidAdsHantavirusFluComparisonReferences}
      prototypeRoute="/paid-ads-exp-5"
      referencesDefaultExpanded
    />
  );
}
