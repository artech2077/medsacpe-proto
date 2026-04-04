import { redirect } from "next/navigation";
import { AiResponseScreen } from "@/components/screens/ai-response-screen";

type AiResponseChatPageProps = {
  searchParams: Promise<{
    q?: string | string[];
  }>;
};

export default async function AiResponseChatPage({ searchParams }: AiResponseChatPageProps) {
  const params = await searchParams;
  const questionValue = Array.isArray(params.q) ? params.q[0] : params.q;
  const initialQuestion = questionValue?.trim();

  if (!initialQuestion) {
    redirect("/ai-response");
  }

  return <AiResponseScreen initialQuestion={initialQuestion} />;
}
