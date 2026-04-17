/* eslint-disable @next/next/no-img-element */
"use client";

import { startTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AiResponseChatComposer } from "@/components/medscape/ai-response/chat-composer";
import { AiMenuIcon, AiMicrophoneIcon } from "@/components/medscape/ai-response/iconography";
import { AiMobileTopRail } from "@/components/medscape/ai-response/mobile-top-rail";
import { AiPromptSectionsList } from "@/components/medscape/ai-response/prompt-card";
import { AiResponseSidebar } from "@/components/medscape/ai-response/sidebar";
import { aiResponseAssets, promptSections, type PromptSection } from "@/data/ai-response";
import { captureAnalyticsEvent } from "@/lib/analytics/posthog";

export function AiResponseLanding() {
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = (href: string) => {
    startTransition(() => {
      router.push(href);
    });
  };

  const navigateToChat = (question: string) => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;

    setIsSidebarOpen(false);
    navigate(
      `/ai-response/chat?q=${encodeURIComponent(trimmedQuestion)}&source=${encodeURIComponent(
        "composer",
      )}`,
    );
  };

  const handlePromptSelect = (
    prompt: string,
    section: PromptSection,
    promptIndex: number,
  ) => {
    captureAnalyticsEvent("prompt_suggestion_clicked", {
      prompt_index: promptIndex,
      prompt_section: section.id,
      prompt_text: prompt,
      prototype_family: "ai-response",
      prototype_route: "/ai-response",
      prototype_slug: "ai-response",
      screen_type: "prototype_landing",
    });

    const trimmedQuestion = prompt.trim();
    if (!trimmedQuestion) return;

    setIsSidebarOpen(false);
    navigate(
      `/ai-response/chat?q=${encodeURIComponent(trimmedQuestion)}&source=${encodeURIComponent(
        "prompt_suggestion",
      )}`,
    );
  };

  const handleSubmit = () => {
    navigateToChat(draft);
  };

  const handleHomeClick = () => {
    setIsSidebarOpen(false);
    captureAnalyticsEvent("home_clicked", {
      prototype_family: "ai-response",
      prototype_route: "/ai-response",
      prototype_slug: "ai-response",
      screen_type: "prototype_landing",
    });
    navigate("/");
  };

  const handleHistoryConversationClick = (question: string) => {
    setIsSidebarOpen(false);
    captureAnalyticsEvent("history_conversation_clicked", {
      prototype_family: "ai-response",
      prototype_route: "/ai-response",
      prototype_slug: "ai-response",
      question_text: question,
      screen_type: "prototype_landing",
    });
    navigate(
      `/ai-response/chat?q=${encodeURIComponent(question)}&mode=complete&source=${encodeURIComponent(
        "history",
      )}`,
    );
  };

  useEffect(() => {
    captureAnalyticsEvent("prototype_viewed", {
      initial_mode: "landing",
      prototype_family: "ai-response",
      prototype_route: "/ai-response",
      prototype_slug: "ai-response",
      screen_type: "prototype_landing",
    });
  }, []);

  return (
    <main className="relative h-dvh overflow-hidden text-white">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: [
              "radial-gradient(circle at 16% 92%, var(--mscp-color-illustrative-ai-glow-violet) 0%, rgba(76, 39, 173, 0.44) 24%, rgba(5, 29, 71, 0) 56%)",
              "radial-gradient(circle at 72% 52%, var(--mscp-color-illustrative-ai-glow-blue) 0%, rgba(0, 83, 214, 0.22) 30%, rgba(3, 44, 99, 0) 60%)",
              "linear-gradient(112deg, var(--mscp-color-illustrative-ai-background-left) 0%, #29379a 26%, #133f8c 54%, var(--mscp-color-illustrative-ai-background-right) 100%)",
            ].join(", "),
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at center, rgba(1, 10, 31, 0) 0%, rgba(1, 10, 31, 0.12) 52%, var(--mscp-color-illustrative-ai-vignette) 100%)",
            boxShadow: "inset 0 4px 32px rgba(6, 74, 167, 0.12)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[26vh]"
          style={{
            background:
              "linear-gradient(180deg, rgba(5, 29, 71, 0) 0%, var(--mscp-color-illustrative-ai-background-bottom) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 flex h-dvh">
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => {
            setIsSidebarOpen(false);
            captureAnalyticsEvent("sidebar_closed", {
              prototype_family: "ai-response",
              prototype_route: "/ai-response",
              prototype_slug: "ai-response",
              screen_type: "prototype_landing",
            });
          }}
          className={`absolute inset-0 z-30 bg-[rgba(6,27,63,0.45)] transition md:hidden ${
            isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />

        <div
          className={`hidden shrink-0 transition-[width] duration-300 ease-out md:block ${
            isSidebarOpen ? "w-[272px]" : "w-0"
          }`}
        />

        <AiResponseSidebar
          isOpen={isSidebarOpen}
          onClose={() => {
            setIsSidebarOpen(false);
            captureAnalyticsEvent("sidebar_closed", {
              prototype_family: "ai-response",
              prototype_route: "/ai-response",
              prototype_slug: "ai-response",
              screen_type: "prototype_landing",
            });
          }}
          onHistoryConversationClick={handleHistoryConversationClick}
          onHomeClick={handleHomeClick}
          onNewChatClick={() => {
            setIsSidebarOpen(false);
            captureAnalyticsEvent("new_chat_clicked", {
              prototype_family: "ai-response",
              prototype_route: "/ai-response",
              prototype_slug: "ai-response",
              screen_type: "prototype_landing",
            });
          }}
        />

        <section className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <AiMobileTopRail
            railClassName="bg-[linear-gradient(180deg,rgba(5,29,71,0.94)_0%,rgba(5,29,71,0.84)_58%,rgba(5,29,71,0)_100%)] px-3 pb-4 pt-3 backdrop-blur-[10px]"
            contentClassName="relative flex min-h-[44px] items-start justify-between gap-2"
            left={
              !isSidebarOpen ? (
                <button
                  type="button"
                      aria-label="Open menu"
                      onClick={() => {
                        setIsSidebarOpen(true);
                        captureAnalyticsEvent("sidebar_opened", {
                          prototype_family: "ai-response",
                          prototype_route: "/ai-response",
                          prototype_slug: "ai-response",
                          screen_type: "prototype_landing",
                        });
                      }}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white/92 transition hover:bg-white/10"
                >
                  <AiMenuIcon invert />
                </button>
              ) : null
            }
            center={
              <button
                type="button"
                    onClick={handleHomeClick}
                className="rounded-full px-3 py-2 transition"
                aria-label="Go to home"
              >
                <img
                  src={aiResponseAssets.logoAssets.medscapeAi}
                  alt="Medscape AI"
                  className="h-[22px] w-auto object-contain"
                />
              </button>
            }
          />

          <header className="absolute left-[22px] top-[22px] z-20 hidden md:block">
            {!isSidebarOpen ? (
              <button
                type="button"
                aria-label="Open menu"
                  onClick={() => {
                    setIsSidebarOpen(true);
                    captureAnalyticsEvent("sidebar_opened", {
                      prototype_family: "ai-response",
                      prototype_route: "/ai-response",
                      prototype_slug: "ai-response",
                      screen_type: "prototype_landing",
                    });
                  }}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white/92 transition hover:bg-white/10"
              >
                <AiMenuIcon invert />
              </button>
            ) : null}
          </header>

          <div className="mx-auto flex min-h-full w-full max-w-[1440px] flex-col items-center px-4 pb-14 pt-16 md:px-6 md:pb-[100px] md:pt-[187px]">
            <div className="flex w-full max-w-[900px] flex-col items-center">
              <div className="flex w-full flex-col items-center gap-4">
                <img
                  src={aiResponseAssets.landingLogo}
                  alt="Medscape AI"
                  className="w-[210px] object-contain md:w-[255px]"
                />

                <AiResponseChatComposer
                  analyticsSourceSurface="ai_response_landing"
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
              <p className="w-full max-w-[600px] text-center text-[10px] leading-[14px] font-semibold tracking-[0.04em] text-[#e2e7e9] uppercase md:text-[12px] md:leading-[18px]">
                Discover what you can ask Medscape AI
              </p>

              <AiPromptSectionsList sections={promptSections} onPromptSelect={handlePromptSelect} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
