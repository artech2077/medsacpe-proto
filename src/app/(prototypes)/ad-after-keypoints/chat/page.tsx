import { redirect } from "next/navigation";
import { MedscapeAiCurrentScreen } from "@/components/screens/medscape-ai-current-screen";

type AdAfterKeypointsChatPageProps = {
  searchParams: Promise<{
    mode?: string | string[];
    q?: string | string[];
  }>;
};

export default async function AdAfterKeypointsChatPage({
  searchParams,
}: AdAfterKeypointsChatPageProps) {
  const params = await searchParams;
  const modeValue = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const questionValue = Array.isArray(params.q) ? params.q[0] : params.q;
  const initialQuestion = questionValue?.trim();
  const initialConversationMode = modeValue === "complete" ? "complete" : "stream";

  if (!initialQuestion) {
    redirect("/ad-after-keypoints");
  }

  return (
    <MedscapeAiCurrentScreen
      adPlacement="after-keypoints"
      initialConversationMode={initialConversationMode}
      initialQuestion={initialQuestion}
      prototypeRoute="/ad-after-keypoints"
    />
  );
}
