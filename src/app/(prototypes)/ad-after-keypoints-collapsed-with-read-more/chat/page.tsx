import { redirect } from "next/navigation";
import { MedscapeAiCurrentScreen } from "@/components/screens/medscape-ai-current-screen";

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
    redirect("/ad-after-keypoints-collapsed-with-read-more");
  }

  return (
    <MedscapeAiCurrentScreen
      adContentDelayMs={3000}
      adPlacement="above-question"
      followUpQuestionsPlacement="before-actions"
      followUpQuestionsVariant="chips"
      hideAnswerFooterAdForFirstTurn
      initialConversationMode={initialConversationMode}
      initialQuestion={initialQuestion}
      initialQuestionSource={sourceValue ?? "direct_url"}
      instantAnswerDelayMs={3000}
      instantAnswers
      keyPointsDefaultExpanded={false}
      keyPointsVariant="collapsed-read-more"
      prototypeRoute="/ad-after-keypoints-collapsed-with-read-more"
    />
  );
}
