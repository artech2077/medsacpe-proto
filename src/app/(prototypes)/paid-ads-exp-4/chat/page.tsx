import { redirect } from "next/navigation";
import { MedscapeAiCurrentScreen } from "@/components/screens/medscape-ai-current-screen";
import {
  paidAdsHantavirusFollowUpQuestionRedirectUrls,
  paidAdsHantavirusFollowUpQuestions,
  paidAdsHantavirusInitialQuestion,
} from "@/data/paid-ads-hantavirus";

type PaidAdsExperience4ChatPageProps = {
  searchParams: Promise<{
    mode?: string | string[];
    q?: string | string[];
    source?: string | string[];
  }>;
};

export default async function PaidAdsExperience4ChatPage({
  searchParams,
}: PaidAdsExperience4ChatPageProps) {
  const params = await searchParams;
  const modeValue = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const sourceValue = Array.isArray(params.source) ? params.source[0] : params.source;
  const initialQuestion = paidAdsHantavirusInitialQuestion;
  const initialConversationMode = modeValue === "complete" ? "complete" : "stream";

  if (!params.q) {
    redirect(
      `/paid-ads-exp-4/chat?q=${encodeURIComponent(
        paidAdsHantavirusInitialQuestion,
      )}&mode=complete&source=${encodeURIComponent("direct_url")}`,
    );
  }

  return (
    <MedscapeAiCurrentScreen
      adContentDelayMs={3000}
      adPlacement="above-question"
      answerDisclosureVariant="full-answer-fade"
      autoScrollToInitialAd
      followUpQuestionsPlacement="before-actions"
      followUpQuestionsVariant="chips"
      followUpQuestionsOverride={paidAdsHantavirusFollowUpQuestions}
      followUpQuestionRedirectUrls={paidAdsHantavirusFollowUpQuestionRedirectUrls}
      hideAnswerFooterAdForFirstTurn
      hideAdImage
      initialConversationMode={initialConversationMode}
      initialQuestion={initialQuestion}
      initialQuestionSource={sourceValue ?? "direct_url"}
      instantAnswerDelayMs={3000}
      instantAnswers
      keyPointsDefaultExpanded={false}
      keyPointsVariant="collapsed-read-more"
      queryRedirectUrl="https://www.medscape.com/ai-search"
      prototypeRoute="/paid-ads-exp-4"
      referencesDefaultExpanded
    />
  );
}
