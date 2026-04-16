import { redirect } from "next/navigation";
import { MedscapeAiCurrentScreen } from "@/components/screens/medscape-ai-current-screen";

type AdAfterKeypointsCollapsedChatPageProps = {
  searchParams: Promise<{
    mode?: string | string[];
    q?: string | string[];
  }>;
};

export default async function AdAfterKeypointsCollapsedChatPage({
  searchParams,
}: AdAfterKeypointsCollapsedChatPageProps) {
  const params = await searchParams;
  const modeValue = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const questionValue = Array.isArray(params.q) ? params.q[0] : params.q;
  const initialQuestion = questionValue?.trim();
  const initialConversationMode = modeValue === "complete" ? "complete" : "stream";

  if (!initialQuestion) {
    redirect("/ad-after-keypoints-collapsed");
  }

  return (
    <MedscapeAiCurrentScreen
      adPlacement="after-keypoints"
      initialConversationMode={initialConversationMode}
      initialQuestion={initialQuestion}
      keyPointsDefaultExpanded={false}
      prototypeRoute="/ad-after-keypoints-collapsed"
    />
  );
}
