import { redirect } from "next/navigation";
import { AiResponseScreen } from "@/components/screens/ai-response-screen";

type AiResponseChatPageProps = {
  searchParams: Promise<{
    mode?: string | string[];
    q?: string | string[];
    source?: string | string[];
  }>;
};

export default async function AiResponseChatPage({ searchParams }: AiResponseChatPageProps) {
  const params = await searchParams;
  const modeValue = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const questionValue = Array.isArray(params.q) ? params.q[0] : params.q;
  const sourceValue = Array.isArray(params.source) ? params.source[0] : params.source;
  const initialQuestion = questionValue?.trim();
  const initialConversationMode = modeValue === "complete" ? "complete" : "stream";

  if (!initialQuestion) {
    redirect("/ai-response");
  }

  return (
    <AiResponseScreen
      initialConversationMode={initialConversationMode}
      initialQuestion={initialQuestion}
      initialQuestionSource={sourceValue ?? "direct_url"}
    />
  );
}
