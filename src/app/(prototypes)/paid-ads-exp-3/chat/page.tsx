import { redirect } from "next/navigation";
import { MedscapeAiCurrentScreen } from "@/components/screens/medscape-ai-current-screen";
import {
  paidAdsHantavirusFluComparisonAnswer,
  paidAdsHantavirusFluComparisonFollowUpQuestionRedirectUrls,
  paidAdsHantavirusFluComparisonFollowUpQuestions,
  paidAdsHantavirusFluComparisonInitialQuestion,
  paidAdsHantavirusFluComparisonKeyPoints,
  paidAdsHantavirusFluComparisonReferences,
} from "@/data/paid-ads-hantavirus";

type PaidAdsExperience3ChatPageProps = {
  searchParams: Promise<{
    mode?: string | string[];
    q?: string | string[];
    source?: string | string[];
  }>;
};

export default async function PaidAdsExperience3ChatPage({
  searchParams,
}: PaidAdsExperience3ChatPageProps) {
  const params = await searchParams;
  const modeValue = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const sourceValue = Array.isArray(params.source) ? params.source[0] : params.source;
  const initialQuestion = paidAdsHantavirusFluComparisonInitialQuestion;
  const initialConversationMode = modeValue === "complete" ? "complete" : "stream";

  if (!params.q) {
    redirect(
      `/paid-ads-exp-3/chat?q=${encodeURIComponent(
        paidAdsHantavirusFluComparisonInitialQuestion,
      )}&mode=complete&source=${encodeURIComponent("direct_url")}`,
    );
  }

  return (
    <MedscapeAiCurrentScreen
      adContentDelayMs={3000}
      adPlacement="above-question"
      autoScrollToInitialAd
      followUpQuestionsPlacement="before-actions"
      followUpQuestionsVariant="chips"
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
      keyPointsCollapsedContent="key-points"
      keyPointsDefaultExpanded={false}
      keyPointsLabels={{
        collapsedHeading: "Key Points",
        expandButton: "Read more",
      }}
      keyPointsOverride={paidAdsHantavirusFluComparisonKeyPoints}
      keyPointsVariant="collapsed-read-more"
      queryRedirectUrl="https://www.medscape.com/ai-search"
      referencesOverride={paidAdsHantavirusFluComparisonReferences}
      prototypeRoute="/paid-ads-exp-3"
      referencesDefaultExpanded
    />
  );
}
