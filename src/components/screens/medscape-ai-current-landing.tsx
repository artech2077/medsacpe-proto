/* eslint-disable @next/next/no-img-element */
"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { MedscapeCurrentTopRailActions } from "@/components/medscape/ai-current/current-top-rail-actions";
import { CurrentSparkIcon } from "@/components/medscape/ai-current/current-icons";
import { MedscapeCurrentHeader } from "@/components/medscape/ai-current/global-header";
import { AiResponseChatComposer } from "@/components/medscape/ai-response/chat-composer";
import { AiMicrophoneIcon } from "@/components/medscape/ai-response/iconography";
import { AiMobileTopRail } from "@/components/medscape/ai-response/mobile-top-rail";
import { AiPromptSectionsList } from "@/components/medscape/ai-response/prompt-card";
import { defaultInitialQuestion, promptSections } from "@/data/ai-response";

type MedscapeAiCurrentLandingProps = {
  prototypeRoute?: string;
};

export function MedscapeAiCurrentLanding({
  prototypeRoute = "/medscape-ai-current",
}: MedscapeAiCurrentLandingProps) {
  const router = useRouter();
  const [draft, setDraft] = useState("");

  const navigate = (href: string) => {
    startTransition(() => {
      router.push(href);
    });
  };

  const navigateToChat = (question: string, mode: "complete" | "stream" = "stream") => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;

    const modeQuery = mode === "complete" ? "&mode=complete" : "";
    navigate(`${prototypeRoute}/chat?q=${encodeURIComponent(trimmedQuestion)}${modeQuery}`);
  };

  const handleSubmit = () => {
    navigateToChat(draft);
  };

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-[#e8f0fb] text-[#161b1d]">
      <MedscapeCurrentHeader />

      <section className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-5 md:px-0">
        <div className="absolute right-4 top-5 z-20 hidden md:left-[38px] md:right-auto md:top-[28px] md:block">
          <MedscapeCurrentTopRailActions
            onHistoryClick={() => navigateToChat(defaultInitialQuestion, "complete")}
            onNewChatClick={() => setDraft("")}
          />
        </div>

        <AiMobileTopRail
          left={
            <div className="flex items-center gap-2 text-[16px] font-bold text-[#252c31]">
              <CurrentSparkIcon className="h-4 w-4" />
              <span>Medscape AI</span>
            </div>
          }
          right={
            <MedscapeCurrentTopRailActions
              onHistoryClick={() => navigateToChat(defaultInitialQuestion, "complete")}
              onNewChatClick={() => setDraft("")}
            />
          }
        />

        <div className="mx-auto flex min-h-full w-full max-w-[1024px] flex-col items-center pt-[158px] md:pt-[122px]">
          <div className="flex flex-col items-center">
            <img
              src="/assets/medscape-ai.svg"
              alt="Medscape AI"
              className="h-auto w-[174px] object-contain md:w-[220px]"
            />
            <p className="mt-1 hidden text-[16px] leading-none text-[#435056] md:block">
              Trusted Medical Intelligence
            </p>
          </div>

          <div className="mt-5 w-full max-w-[900px] md:mt-3">
            <div className="relative">
              <AiResponseChatComposer
                className="w-full"
                emptyActionIcon={<AiMicrophoneIcon />}
                isGenerating={false}
                note={null}
                onSubmit={handleSubmit}
                onValueChange={setDraft}
                placeholder="Ask anything"
                value={draft}
              />
            </div>
          </div>

          <div className="mt-8 flex w-full flex-col items-center gap-3">
            <p className="w-full max-w-[600px] text-center text-[10px] leading-[14px] font-semibold tracking-[0.04em] text-[#2c353a] uppercase md:text-[12px] md:leading-[18px]">
              Discover what you can ask Medscape AI
            </p>
            <AiPromptSectionsList sections={promptSections} onPromptSelect={navigateToChat} />
          </div>
        </div>
      </section>
    </main>
  );
}
