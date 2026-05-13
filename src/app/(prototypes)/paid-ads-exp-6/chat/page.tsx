import { redirect } from "next/navigation";
import { MedscapeAiCurrentScreen } from "@/components/screens/medscape-ai-current-screen";
import {
  paidAdsHantavirusFluComparisonCompactAnswer,
  paidAdsHantavirusFluComparisonFollowUpAnswerPreviews,
  paidAdsHantavirusFluComparisonFollowUpQuestionRedirectUrls,
  paidAdsHantavirusFluComparisonFollowUpQuestions,
  paidAdsHantavirusFluComparisonInitialQuestion,
  paidAdsHantavirusFluComparisonReferences,
} from "@/data/paid-ads-hantavirus";

type PaidAdsExperience6ChatPageProps = {
  searchParams: Promise<{
    mode?: string | string[];
    q?: string | string[];
    source?: string | string[];
  }>;
};

export default async function PaidAdsExperience6ChatPage({
  searchParams,
}: PaidAdsExperience6ChatPageProps) {
  const params = await searchParams;
  const modeValue = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const sourceValue = Array.isArray(params.source) ? params.source[0] : params.source;
  const initialQuestion = paidAdsHantavirusFluComparisonInitialQuestion;
  const initialConversationMode = modeValue === "complete" ? "complete" : "stream";

  if (!params.q) {
    redirect(
      `/paid-ads-exp-6/chat?q=${encodeURIComponent(
        paidAdsHantavirusFluComparisonInitialQuestion,
      )}&mode=complete&source=${encodeURIComponent("direct_url")}`,
    );
  }

  return (
    <MedscapeAiCurrentScreen
      adContentDelayMs={3000}
      adPlacement="above-question"
      autoScrollToInitialAd
      followUpQuestionAnswerPreviews={paidAdsHantavirusFluComparisonFollowUpAnswerPreviews}
      followUpQuestionsPlacement="before-actions"
      followUpQuestionsShowReadMore={false}
      followUpQuestionsVariant="accordion-preview"
      followUpQuestionsOverride={paidAdsHantavirusFluComparisonFollowUpQuestions}
      followUpQuestionRedirectUrls={paidAdsHantavirusFluComparisonFollowUpQuestionRedirectUrls}
      hideAnswerFooterAdForFirstTurn
      hideAdImage
      initialAnswerOverride={paidAdsHantavirusFluComparisonCompactAnswer}
      initialConversationMode={initialConversationMode}
      initialQuestion={initialQuestion}
      initialQuestionSource={sourceValue ?? "direct_url"}
      instantAnswerDelayMs={3000}
      instantAnswers
      keyPointsDefaultExpanded
      queryRedirectUrl="https://www.medscape.com/ai-search"
      referencesOverride={paidAdsHantavirusFluComparisonReferences}
      prototypeRoute="/paid-ads-exp-6"
      referencesDefaultExpanded
    />
  );
}
