import { redirect } from "next/navigation";
import { MedscapeAiCurrentScreen } from "@/components/screens/medscape-ai-current-screen";

type AdAboveTheQuestionChatPageProps = {
  searchParams: Promise<{
    mode?: string | string[];
    q?: string | string[];
  }>;
};

export default async function AdAboveTheQuestionChatPage({
  searchParams,
}: AdAboveTheQuestionChatPageProps) {
  const params = await searchParams;
  const modeValue = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const questionValue = Array.isArray(params.q) ? params.q[0] : params.q;
  const initialQuestion = questionValue?.trim();
  const initialConversationMode = modeValue === "complete" ? "complete" : "stream";

  if (!initialQuestion) {
    redirect("/ad-above-the-question");
  }

  return (
    <MedscapeAiCurrentScreen
      adPlacement="above-question"
      initialConversationMode={initialConversationMode}
      initialQuestion={initialQuestion}
      prototypeRoute="/ad-above-the-question"
    />
  );
}
