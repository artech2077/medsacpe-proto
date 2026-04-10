"use client";

import type { FormEvent, RefObject } from "react";
import { AiSendButtonIcon } from "@/components/medscape/ai-response/iconography";

type AiResponseChatComposerProps = {
  inputRef?: RefObject<HTMLInputElement | null>;
  isGenerating: boolean;
  note?: string;
  onStopGeneration: () => void;
  onSubmit: () => void;
  onValueChange: (nextValue: string) => void;
  placeholder?: string;
  value: string;
};

export function AiResponseChatComposer({
  inputRef,
  isGenerating,
  note = "AI may make mistakes. Always apply your clinical judgment.",
  onStopGeneration,
  onSubmit,
  onValueChange,
  placeholder = "Ask anything",
  value,
}: AiResponseChatComposerProps) {
  const hasDraft = value.trim().length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!hasDraft) return;
    onSubmit();
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="pointer-events-auto flex min-h-[48px] items-center gap-2 rounded-[999px] border border-[rgba(109,153,206,0.45)] bg-white px-4 py-1 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_22px_rgba(16,24,40,0.06)]"
        onClick={() => inputRef?.current?.focus()}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          placeholder={placeholder}
          className="h-8 flex-1 border-0 bg-transparent text-[16px] leading-[20px] text-[#1b2b3a] outline-none placeholder:text-[#93a2ae]"
        />

        {isGenerating ? (
          <button
            type="button"
            aria-label="Stop generating"
            onClick={onStopGeneration}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center"
          >
            <AiSendButtonIcon generating />
          </button>
        ) : hasDraft ? (
          <button
            type="submit"
            aria-label="Send"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center"
          >
            <AiSendButtonIcon generating={false} />
          </button>
        ) : null}
      </form>

      <p className="pointer-events-auto mt-1 text-center text-[10px] leading-[13px] text-[#647484]">
        {note}
      </p>
    </>
  );
}
