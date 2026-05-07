import { redirect } from "next/navigation";
import { MedscapeAiCurrentScreen } from "@/components/screens/medscape-ai-current-screen";

const paidAdsInitialQuestion =
  "For a patient with BP 134/84, when should I start hypertension medication under the 2025 guideline?";
const paidAdsSummary =
  "BP 134/84 = stage 1 hypertension. Start medication now if high-risk; otherwise lifestyle first and reassess in 3-6 months.";
const paidAdsFollowUpQuestions = [
  "Treat stage 1 HTN with diabetes?",
  "Choose first-line stage 1 HTN drug",
  "Order labs for new hypertension",
  "Confirm hypertension with home BP",
];
const paidAdsFollowUpQuestionRedirectUrls = {
  "Treat stage 1 HTN with diabetes?":
    "https://www.medscape.com/ai-search?query=Treat%20stage%201%20HTN%20with%20diabetes%3F",
  "Choose first-line stage 1 HTN drug":
    "https://www.medscape.com/ai-search?query=Choose%20first-line%20stage%201%20HTN%20drug",
  "Order labs for new hypertension":
    "https://www.medscape.com/ai-search?query=Order%20labs%20for%20new%20hypertension",
  "Confirm hypertension with home BP":
    "https://www.medscape.com/ai-search?query=Confirm%20hypertension%20with%20home%20BP",
};

type PaidAdsExperience2ChatPageProps = {
  searchParams: Promise<{
    mode?: string | string[];
    q?: string | string[];
    source?: string | string[];
  }>;
};

export default async function PaidAdsExperience2ChatPage({
  searchParams,
}: PaidAdsExperience2ChatPageProps) {
  const params = await searchParams;
  const modeValue = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const questionValue = Array.isArray(params.q) ? params.q[0] : params.q;
  const sourceValue = Array.isArray(params.source) ? params.source[0] : params.source;
  const initialQuestion = questionValue?.trim();
  const initialConversationMode = modeValue === "complete" ? "complete" : "stream";

  if (!initialQuestion) {
    redirect(
      `/paid-ads-exp-2/chat?q=${encodeURIComponent(
        paidAdsInitialQuestion,
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
      followUpQuestionsOverride={paidAdsFollowUpQuestions}
      followUpQuestionRedirectUrls={paidAdsFollowUpQuestionRedirectUrls}
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
      prototypeRoute="/paid-ads-exp-2"
      referencesDefaultExpanded
      summaryOverride={paidAdsSummary}
    />
  );
}
