import { redirect } from "next/navigation";
import { MedscapeAiCurrentScreen } from "@/components/screens/medscape-ai-current-screen";

const paidAdsInitialQuestion =
  "How would you adjust vancomycin dosing (loading and interval) in a 70 kg patient on intermittent hemodialysis?";
const paidAdsSummary =
  "**1 g IV for a 70-kg patient**\nUse **functionally anephric dosing**: give a **loading dose of ~15 mg/kg**, then start a **low maintenance regimen**. Adjust the **dosing interval** and **post-dialysis supplementation** based on **trough levels** (target **~15-20 mg/L for serious infections**) and **clinical response**.";

type AdAfterKeypointsCollapsedWithReadMoreChatPageProps = {
  searchParams: Promise<{
    mode?: string | string[];
    q?: string | string[];
    source?: string | string[];
  }>;
};

export default async function AdAfterKeypointsCollapsedWithReadMoreChatPage({
  searchParams,
}: AdAfterKeypointsCollapsedWithReadMoreChatPageProps) {
  const params = await searchParams;
  const modeValue = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const questionValue = Array.isArray(params.q) ? params.q[0] : params.q;
  const sourceValue = Array.isArray(params.source) ? params.source[0] : params.source;
  const initialQuestion = questionValue?.trim();
  const initialConversationMode = modeValue === "complete" ? "complete" : "stream";

  if (!initialQuestion) {
    redirect(
      `/paid-ads-exp/chat?q=${encodeURIComponent(
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
      prototypeRoute="/paid-ads-exp"
      referencesDefaultExpanded
      summaryOverride={paidAdsSummary}
    />
  );
}
