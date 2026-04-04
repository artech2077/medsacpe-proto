"use client";

import { type FormEvent, startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import {
  type PromptSection,
  type PromptSectionId,
  promptSections,
} from "@/components/screens/ai-response-content";

const landingLogoSrc = "/assets/Medscape-ai-white.png";
const menuIconSrc = "/assets/Outline (Stroke).png";
const promptIconSources: Record<PromptSectionId, string> = {
  "drug-info": "/assets/Check drug info.png",
  "challenging-questions": "/assets/Ask challenging questions.png",
  "patient-workup": "/assets/Work up a patient.png",
  "treatment-options": "/assets/Review treatment options.png",
  "recent-research": "/assets/Summarize recent research.png",
  "lab-findings": "/assets/Interpret lab findings.png",
};

function MenuIcon() {
  return (
    <img src={menuIconSrc} alt="" aria-hidden="true" className="h-5 w-5 object-contain" />
  );
}

function MicrophoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4a2.8 2.8 0 0 1 2.8 2.8v4.4a2.8 2.8 0 0 1-5.6 0V6.8A2.8 2.8 0 0 1 12 4Z" />
      <path d="M6.8 10.9a5.2 5.2 0 0 0 10.4 0" />
      <path d="M12 16.1v3.4" />
      <path d="M8.8 19.5h6.4" />
    </svg>
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
      className="h-4 w-4 object-contain"
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
    <section className="w-full rounded-[8px] bg-white px-4 pb-3 pt-5 shadow-[0_1px_0_rgba(0,0,0,0.05),0_8px_24px_rgba(5,39,90,0.12)]">
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

  const navigateToChat = (question: string) => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;

    startTransition(() => {
      router.push(`/ai-response/chat?q=${encodeURIComponent(trimmedQuestion)}`);
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigateToChat(draft);
  };

  const hasDraft = draft.trim().length > 0;

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#08285f] text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1a57ba_0%,#10479f_34%,#08285f_72%,#051a41_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -left-[18%] bottom-[-12%] h-[58rem] w-[58rem] rounded-full bg-[radial-gradient(circle,rgba(113,39,179,0.74)_0%,rgba(73,34,144,0.32)_42%,rgba(8,40,95,0)_76%)] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="absolute right-[-12%] top-[-18%] h-[48rem] w-[48rem] rounded-full bg-[radial-gradient(circle,rgba(26,118,255,0.22)_0%,rgba(8,40,95,0)_70%)] blur-3xl"
      />

      <div className="relative z-10 flex min-h-dvh flex-col">
        <header className="flex items-center px-4 py-4 md:px-6">
          <button
            type="button"
            aria-label="Open menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/92 transition hover:bg-white/10"
          >
            <MenuIcon />
          </button>
        </header>

        <section className="mx-auto flex w-full max-w-[1120px] flex-1 flex-col items-center px-4 pb-14 pt-10 md:px-6 md:pb-20 md:pt-14">
          <div className="w-full max-w-[900px]">
            <div className="flex flex-col items-center">
              <img
                src={landingLogoSrc}
                alt="Medscape AI"
                className="w-[210px] object-contain md:w-[255px]"
              />
            </div>

            <form onSubmit={handleSubmit} className="mt-7 md:mt-8">
              <label className="sr-only" htmlFor="ai-response-landing-input">
                Ask anything
              </label>
              <div className="flex items-center rounded-[200px] bg-[rgba(255,255,255,0.92)] px-5 py-3 shadow-[0_2px_4px_rgba(0,0,0,0.08),0_10px_34px_rgba(0,0,0,0.14)]">
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
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--mscp-color-brand-primary)] transition hover:bg-[rgba(6,74,167,0.08)]"
                >
                  {hasDraft ? <SendIcon /> : <MicrophoneIcon />}
                </button>
              </div>
            </form>

            <div className="mt-7 text-center">
              <p className="text-[10px] leading-[14px] font-semibold tracking-[0.04em] text-[#d8e3f6] uppercase md:text-[12px] md:leading-[18px]">
                Discover what you can ask Medscape AI
              </p>
            </div>

            <div className="mt-3 flex flex-col gap-1.5 md:mt-4 md:gap-2">
              {promptSections.map((section) => (
                <PromptCard key={section.id} section={section} onPromptSelect={navigateToChat} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
