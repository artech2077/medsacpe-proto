"use client";

import { type FormEvent, startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import {
  type PromptSection,
  type PromptSectionId,
  promptSections,
} from "@/components/screens/ai-response-content";
import { AiResponseSidebar } from "@/components/screens/ai-response-sidebar";

const landingLogoSrc = "/assets/Medscape AI Logo Slogan.svg";
const menuIconSrc = "/assets/kebab-menu.svg";
const microphoneIconSrc = "/assets/Microphone.svg";
const promptIconSources: Record<PromptSectionId, string> = {
  "drug-info": "/assets/Check drug info.svg",
  "challenging-questions": "/assets/Ask challenging questions.svg",
  "patient-workup": "/assets/Work up a patient.svg",
  "treatment-options": "/assets/Review treatment options.svg",
  "recent-research": "/assets/Summarize recent research.svg",
  "lab-findings": "/assets/Interpret lab findings.svg",
};

function MenuIcon() {
  return (
    <img
      src={menuIconSrc}
      alt=""
      aria-hidden="true"
      className="h-5 w-5 object-contain brightness-0 invert"
    />
  );
}

function MicrophoneIcon() {
  return (
    <img
      src={microphoneIconSrc}
      alt=""
      aria-hidden="true"
      className="h-5 w-5 object-contain"
    />
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 12-7-3 7 3 7-12-7Z" />
      <path d="M5 12h9" />
    </svg>
  );
}

function PromptChevron() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 text-[#7f8a96]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 3.5 4 4.5-4 4.5" />
    </svg>
  );
}

function PromptSectionIcon({ id }: { id: PromptSectionId }) {
  return (
    <img
      src={promptIconSources[id]}
      alt=""
      aria-hidden="true"
      className="h-5 w-5 object-contain"
    />
  );
}

function PromptCard({
  section,
  onPromptSelect,
}: {
  section: PromptSection;
  onPromptSelect: (prompt: string) => void;
}) {
  return (
    <section className="w-full rounded-[8px] bg-white px-4 pb-3 pt-5">
      <header className="flex items-center gap-2.5 pb-2 text-[16px] leading-[19px] font-semibold text-[var(--mscp-color-text-tertiary)]">
        <PromptSectionIcon id={section.id} />
        <span>{section.title}</span>
      </header>
      <div className="border-t border-[var(--mscp-color-border-primary)]">
        {section.prompts.map((prompt, index) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onPromptSelect(prompt)}
            className={`flex w-full items-start gap-3 py-2 text-left text-[15px] leading-[20px] text-[var(--mscp-color-brand-primary)] transition hover:text-[#0a5fd2] ${
              index < section.prompts.length - 1 ? "border-b border-[var(--mscp-color-border-primary)]" : ""
            }`}
          >
            <span className="flex-1">{prompt}</span>
            <span className="pt-[2px]">
              <PromptChevron />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

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
    navigate(`/ai-response/chat?q=${encodeURIComponent(trimmedQuestion)}`);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigateToChat(draft);
  };

  const handleHomeClick = () => {
    setIsSidebarOpen(false);
    navigate("/");
  };

  const handleHistoryConversationClick = (question: string) => {
    setIsSidebarOpen(false);
    navigate(`/ai-response/chat?q=${encodeURIComponent(question)}&mode=complete`);
  };

  const hasDraft = draft.trim().length > 0;

  return (
    <main className="relative h-dvh overflow-hidden text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
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
          onClick={() => setIsSidebarOpen(false)}
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
          onClose={() => setIsSidebarOpen(false)}
          onHistoryConversationClick={handleHistoryConversationClick}
          onHomeClick={handleHomeClick}
          onNewChatClick={() => setIsSidebarOpen(false)}
        />

        <section className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <header className="absolute left-3 top-3 z-20 md:left-[22px] md:top-[22px]">
            {!isSidebarOpen ? (
              <button
                type="button"
                aria-label="Open menu"
                onClick={() => setIsSidebarOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white/92 transition hover:bg-white/10"
              >
                <MenuIcon />
              </button>
            ) : null}
          </header>

          <div className="mx-auto flex min-h-full w-full max-w-[1440px] flex-col items-center px-4 pb-14 pt-28 md:px-6 md:pb-[100px] md:pt-[187px]">
            <div className="flex w-full max-w-[900px] flex-col items-center">
              <div className="flex w-full flex-col items-center gap-4">
                <img
                  src={landingLogoSrc}
                  alt="Medscape AI"
                  className="w-[210px] object-contain md:w-[255px]"
                />

                <form onSubmit={handleSubmit} className="w-full">
                  <label className="sr-only" htmlFor="ai-response-landing-input">
                    Ask anything
                  </label>
                  <div className="flex items-center rounded-[200px] bg-[rgba(255,255,255,0.9)] px-5 py-4 shadow-[0_2px_4px_rgba(0,0,0,0.07),0_7px_28px_rgba(0,0,0,0.1)]">
                    <input
                      id="ai-response-landing-input"
                      type="text"
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      placeholder="Ask anything"
                      className="min-w-0 flex-1 border-0 bg-transparent text-[17px] leading-[24px] text-[#161b1d] outline-none placeholder:text-[#6f8590] md:text-[20px] md:leading-[26px]"
                    />
                    <button
                      type={hasDraft ? "submit" : "button"}
                      aria-label={hasDraft ? "Start chat" : "Voice input"}
                      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[var(--mscp-color-brand-primary)] transition hover:bg-[rgba(6,74,167,0.08)]"
                    >
                      {hasDraft ? <SendIcon /> : <MicrophoneIcon />}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="mt-8 flex w-full max-w-[640px] flex-col items-center gap-3">
              <p className="w-full max-w-[600px] text-center text-[10px] leading-[14px] font-semibold tracking-[0.04em] text-[#e2e7e9] uppercase md:text-[12px] md:leading-[18px]">
                Discover what you can ask Medscape AI
              </p>

              <div className="flex w-full flex-col gap-2">
                {promptSections.map((section) => (
                  <PromptCard key={section.id} section={section} onPromptSelect={navigateToChat} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
