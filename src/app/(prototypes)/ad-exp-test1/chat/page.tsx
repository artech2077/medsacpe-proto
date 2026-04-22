import { redirect } from "next/navigation";
import { MedscapeAiCurrentScreen } from "@/components/screens/medscape-ai-current-screen";

type AdExpTest1ChatPageProps = {
  searchParams: Promise<{
    mode?: string | string[];
    q?: string | string[];
    source?: string | string[];
  }>;
};

export default async function AdExpTest1ChatPage({
  searchParams,
}: AdExpTest1ChatPageProps) {
  const params = await searchParams;
  const modeValue = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const questionValue = Array.isArray(params.q) ? params.q[0] : params.q;
  const sourceValue = Array.isArray(params.source) ? params.source[0] : params.source;
  const initialQuestion = questionValue?.trim();
  const initialConversationMode = modeValue === "complete" ? "complete" : "stream";

  if (!initialQuestion) {
    redirect("/ad-exp-test1");
  }

  return (
    <MedscapeAiCurrentScreen
      adPlacement="above-question"
      composerPlaceholder="Ask Medscape AI to tailor this to your patient, setting, or next step"
      entryExperience="paid-traffic-quick-start"
      initialConversationMode={initialConversationMode}
      initialQuestion={initialQuestion}
      initialQuestionSource={sourceValue ?? "direct_url"}
      prototypeRoute="/ad-exp-test1"
      showHistoryAction={false}
    />
  );
}
