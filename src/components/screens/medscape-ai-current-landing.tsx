/* eslint-disable @next/next/no-img-element */
"use client";

import { startTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MedscapeCurrentTopRailActions } from "@/components/medscape/ai-current/current-top-rail-actions";
import { MedscapeFeatureUpdatesModal } from "@/components/medscape/ai-current/feature-updates-modal";
import { CurrentSparkIcon } from "@/components/medscape/ai-current/current-icons";
import { MedscapeCurrentHeader } from "@/components/medscape/ai-current/global-header";
import { useMedscapeFeatureUpdatesConfig } from "@/components/medscape/ai-current/use-feature-updates-config";
import { AiResponseChatComposer } from "@/components/medscape/ai-response/chat-composer";
import { AiMicrophoneIcon } from "@/components/medscape/ai-response/iconography";
import { AiMobileTopRail } from "@/components/medscape/ai-response/mobile-top-rail";
import { AiPromptSectionsList } from "@/components/medscape/ai-response/prompt-card";
import { defaultInitialQuestion, promptSections, type PromptSection } from "@/data/ai-response";
import { featureUpdatesTriggerPrompt } from "@/data/medscape-feature-updates";
import { captureAnalyticsEvent } from "@/lib/analytics/posthog";

type MedscapeAiCurrentLandingProps = {
  composerPlaceholder?: string;
  promptIntro?: string;
  prototypeRoute?: string;
  showHistoryAction?: boolean;
};

export function MedscapeAiCurrentLanding({
  composerPlaceholder = "Ask anything",
  promptIntro = "Discover what you can ask Medscape AI",
  prototypeRoute = "/medscape-ai-current",
  showHistoryAction = true,
}: MedscapeAiCurrentLandingProps) {
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const [isFeatureUpdatesOpen, setIsFeatureUpdatesOpen] = useState(false);
  const [pendingFeatureUpdatePrompt, setPendingFeatureUpdatePrompt] = useState<string | null>(
    null,
  );
  const { updates: featureUpdates } = useMedscapeFeatureUpdatesConfig();

  const navigate = (href: string) => {
    startTransition(() => {
      router.push(href);
    });
  };

  const prototypeSlug = prototypeRoute.replace(/^\//, "");
  const navigateToChat = (
    question: string,
    mode: "complete" | "stream" = "stream",
    questionSource = "composer",
  ) => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;

    const modeQuery = mode === "complete" ? "&mode=complete" : "";
    navigate(
      `${prototypeRoute}/chat?q=${encodeURIComponent(trimmedQuestion)}${modeQuery}&source=${encodeURIComponent(
        questionSource,
      )}`,
    );
  };

  const handleSubmit = () => {
    navigateToChat(draft);
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
      prototype_family: "medscape-ai-current",
      prototype_route: prototypeRoute,
      prototype_slug: prototypeSlug,
      screen_type: "prototype_landing",
    });

    if (prompt === featureUpdatesTriggerPrompt) {
      setPendingFeatureUpdatePrompt(prompt);
      setIsFeatureUpdatesOpen(true);
      captureAnalyticsEvent("feature_updates_modal_opened", {
        feature_update_count: featureUpdates.length,
        prompt_section: section.id,
        prompt_text: prompt,
        prototype_family: "medscape-ai-current",
        prototype_route: prototypeRoute,
        prototype_slug: prototypeSlug,
        screen_type: "prototype_landing",
      });
      return;
    }

    navigateToChat(prompt, "stream", "prompt_suggestion");
  };

  const closeFeatureUpdates = () => {
    setIsFeatureUpdatesOpen(false);
    captureAnalyticsEvent("feature_updates_modal_closed", {
      feature_update_count: featureUpdates.length,
      prototype_family: "medscape-ai-current",
      prototype_route: prototypeRoute,
      prototype_slug: prototypeSlug,
      screen_type: "prototype_landing",
    });
  };

  const handleFeatureUpdatesContinue = () => {
    if (!pendingFeatureUpdatePrompt) return;

    captureAnalyticsEvent("feature_updates_modal_cta_clicked", {
      feature_update_count: featureUpdates.length,
      prompt_text: pendingFeatureUpdatePrompt,
      prototype_family: "medscape-ai-current",
      prototype_route: prototypeRoute,
      prototype_slug: prototypeSlug,
      screen_type: "prototype_landing",
    });
    setIsFeatureUpdatesOpen(false);
    navigateToChat(pendingFeatureUpdatePrompt, "stream", "feature_updates_modal");
  };

  useEffect(() => {
    captureAnalyticsEvent("prototype_viewed", {
      initial_mode: "landing",
      prototype_family: "medscape-ai-current",
      prototype_route: prototypeRoute,
      prototype_slug: prototypeSlug,
      screen_type: "prototype_landing",
    });
  }, [prototypeRoute, prototypeSlug]);

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-[#e8f0fb] text-[#161b1d]">
      <MedscapeCurrentHeader />

      <section className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-5 md:px-0">
        <div className="absolute right-4 top-5 z-20 hidden md:left-[38px] md:right-auto md:top-[28px] md:block">
          <MedscapeCurrentTopRailActions
            onHistoryClick={() => {
              captureAnalyticsEvent("history_conversation_clicked", {
                prototype_family: "medscape-ai-current",
                prototype_route: prototypeRoute,
                prototype_slug: prototypeSlug,
                question_text: defaultInitialQuestion,
                screen_type: "prototype_landing",
              });
              navigateToChat(defaultInitialQuestion, "complete", "history");
            }}
            onNewChatClick={() => {
              setDraft("");
              captureAnalyticsEvent("new_chat_clicked", {
                prototype_family: "medscape-ai-current",
                prototype_route: prototypeRoute,
                prototype_slug: prototypeSlug,
                screen_type: "prototype_landing",
              });
            }}
            showHistory={showHistoryAction}
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
                onHistoryClick={() => {
                  captureAnalyticsEvent("history_conversation_clicked", {
                    prototype_family: "medscape-ai-current",
                    prototype_route: prototypeRoute,
                    prototype_slug: prototypeSlug,
                    question_text: defaultInitialQuestion,
                    screen_type: "prototype_landing",
                  });
                  navigateToChat(defaultInitialQuestion, "complete", "history");
                }}
                onNewChatClick={() => {
                  setDraft("");
                  captureAnalyticsEvent("new_chat_clicked", {
                    prototype_family: "medscape-ai-current",
                    prototype_route: prototypeRoute,
                    prototype_slug: prototypeSlug,
                    screen_type: "prototype_landing",
                  });
                }}
                showHistory={showHistoryAction}
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
                analyticsSourceSurface="medscape_current_landing"
                className="w-full"
                emptyActionIcon={<AiMicrophoneIcon />}
                isGenerating={false}
                note={null}
                onSubmit={handleSubmit}
                onValueChange={setDraft}
                placeholder={composerPlaceholder}
                value={draft}
              />
            </div>
          </div>

          <div className="mt-8 flex w-full flex-col items-center gap-3">
            <p className="w-full max-w-[600px] text-center text-[10px] leading-[14px] font-semibold tracking-[0.04em] text-[#2c353a] uppercase md:text-[12px] md:leading-[18px]">
              {promptIntro}
            </p>
            <AiPromptSectionsList sections={promptSections} onPromptSelect={handlePromptSelect} />
          </div>
        </div>
      </section>

      {isFeatureUpdatesOpen ? (
        <MedscapeFeatureUpdatesModal
          isOpen
          onClose={closeFeatureUpdates}
          onContinue={handleFeatureUpdatesContinue}
          updates={featureUpdates}
        />
      ) : null}
    </main>
  );
}
