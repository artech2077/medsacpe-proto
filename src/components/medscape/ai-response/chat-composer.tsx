"use client";

import type { FormEvent, ReactNode, RefObject } from "react";
import { AiSendButtonIcon } from "@/components/medscape/ai-response/iconography";

type AiResponseChatComposerProps = {
  className?: string;
  emptyActionButtonClassName?: string;
  emptyActionIcon?: ReactNode;
  emptyActionLabel?: string;
  onEmptyActionClick?: () => void;
  formClassName?: string;
  iconClassName?: string;
  inputClassName?: string;
  inputRef?: RefObject<HTMLInputElement | null>;
  isGenerating: boolean;
  note?: ReactNode | null;
  noteClassName?: string;
  onStopGeneration?: () => void;
  onSubmit: () => void;
  onValueChange: (nextValue: string) => void;
  placeholder?: string;
  showSubmitWhenEmpty?: boolean;
  submitButtonClassName?: string;
  value: string;
};

export function AiResponseChatComposer({
  className = "",
  emptyActionButtonClassName,
  emptyActionIcon,
  emptyActionLabel = "Voice input",
  onEmptyActionClick,
  formClassName,
  iconClassName,
  inputClassName,
  inputRef,
  isGenerating,
  note = (
    <>
      AI may make mistakes.{" "}
      <span className="text-[var(--mscp-color-brand-primary)]">Medscape AI Disclaimer</span>
    </>
  ),
  noteClassName = "pointer-events-auto mt-1 text-center text-[10px] leading-[13px] text-[#647484]",
  onStopGeneration,
  onSubmit,
  onValueChange,
  placeholder = "Ask anything",
  showSubmitWhenEmpty = false,
  submitButtonClassName,
  value,
}: AiResponseChatComposerProps) {
  const hasDraft = value.trim().length > 0;
  const canSubmit = hasDraft || showSubmitWhenEmpty;
  const resolvedFormClassName =
    formClassName ??
    "pointer-events-auto flex min-h-[58px] items-center gap-2 rounded-[200px] bg-[rgba(255,255,255,0.9)] px-5 py-4 shadow-[0_2px_4px_rgba(0,0,0,0.07),0_7px_28px_rgba(0,0,0,0.1)]";
  const resolvedInputClassName =
    inputClassName ??
    "min-w-0 flex-1 border-0 bg-transparent text-[17px] leading-[24px] text-[#161b1d] outline-none placeholder:text-[#6f8590] md:text-[20px] md:leading-[26px]";
  const resolvedIconClassName = iconClassName ?? "h-5 w-5";
  const resolvedSubmitButtonClassName =
    submitButtonClassName ??
    "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[var(--mscp-color-brand-primary)] transition hover:bg-[rgba(6,74,167,0.08)]";
  const resolvedEmptyActionButtonClassName =
    emptyActionButtonClassName ??
    "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[var(--mscp-color-brand-primary)] transition hover:bg-[rgba(6,74,167,0.08)]";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    onSubmit();
  };

  return (
    <div className={className}>
      <form
        onSubmit={handleSubmit}
        className={resolvedFormClassName}
        onClick={() => inputRef?.current?.focus()}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          placeholder={placeholder}
          className={resolvedInputClassName}
        />

        {isGenerating ? (
          <button
            type="button"
            aria-label="Stop generating"
            onClick={onStopGeneration}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center"
          >
            <AiSendButtonIcon className={resolvedIconClassName} generating />
          </button>
        ) : canSubmit ? (
          <button
            type="submit"
            aria-label="Send"
            className={resolvedSubmitButtonClassName}
          >
            <AiSendButtonIcon className={resolvedIconClassName} generating={false} />
          </button>
        ) : emptyActionIcon ? (
          <button
            type="button"
            aria-label={emptyActionLabel}
            onClick={onEmptyActionClick}
            className={resolvedEmptyActionButtonClassName}
          >
            {emptyActionIcon}
          </button>
        ) : null}
      </form>

      {note ? <p className={noteClassName}>{note}</p> : null}
    </div>
  );
}
