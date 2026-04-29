"use client";

import { useRef } from "react";
import type { FormEvent, ReactNode, RefObject } from "react";
import { AiSendButtonIcon } from "@/components/medscape/ai-response/iconography";
import {
  type AnalyticsProperties,
  getQuestionLengthBucket,
} from "@/lib/analytics/events";
import { captureAnalyticsEvent } from "@/lib/analytics/posthog";

export type AiResponseComposerSubmitMethod = "button" | "enter";

const MEDSCAPE_AI_DISCLAIMER_URL =
  "https://reference.medscape.com/public/ai_search-disclaimer?_gl=1*l2izxc*_gcl_au*NjA0MzI3NjQwLjE3NzUyMDcyMzMuMjEzNjU4NDc5LjE3NzUyMDcyNTIuMTc3NTIwNzI1Mw..";

type AiResponseChatComposerProps = {
  className?: string;
  emptyActionButtonClassName?: string;
  emptyActionIcon?: ReactNode;
  emptyActionLabel?: string;
  analyticsEventProperties?: AnalyticsProperties;
  analyticsSourceSurface?: string;
  onEmptyActionClick?: () => void;
  formClassName?: string;
  iconClassName?: string;
  inputClassName?: string;
  inputRef?: RefObject<HTMLInputElement | null>;
  isGenerating: boolean;
  note?: ReactNode | null;
  noteClassName?: string;
  onStopGeneration?: () => void;
  onSubmit: (submitMethod?: AiResponseComposerSubmitMethod) => void;
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
  analyticsSourceSurface,
  onEmptyActionClick,
  formClassName,
  iconClassName,
  inputClassName,
  inputRef,
  analyticsEventProperties,
  isGenerating,
  note = (
    <>
      AI may make mistakes.{" "}
      <a
        href={MEDSCAPE_AI_DISCLAIMER_URL}
        className="!text-[#064aa7] visited:!text-[#064aa7] hover:!text-[#0b5cc9]"
      >
        Medscape AI Disclaimer
      </a>
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
  const hasTrackedFocusRef = useRef(false);
  const trackedLengthBucketsRef = useRef(new Set<string>());
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

    const nativeSubmitEvent = event.nativeEvent as SubmitEvent;
    const submitMethod: AiResponseComposerSubmitMethod =
      nativeSubmitEvent.submitter instanceof HTMLButtonElement ? "button" : "enter";
    const trimmedValue = value.trim();

    captureAnalyticsEvent("composer_submit_clicked", {
      ...analyticsEventProperties,
      char_bucket: getQuestionLengthBucket(trimmedValue.length),
      has_text: trimmedValue.length > 0,
      question_length: trimmedValue.length,
      source_surface: analyticsSourceSurface ?? "unknown",
      submit_method: submitMethod,
    });

    onSubmit(submitMethod);
  };

  const handleInputFocus = () => {
    if (hasTrackedFocusRef.current) return;

    hasTrackedFocusRef.current = true;
    captureAnalyticsEvent("composer_focused", {
      ...analyticsEventProperties,
      source_surface: analyticsSourceSurface ?? "unknown",
    });
  };

  const handleValueChange = (nextValue: string) => {
    const trimmedValue = nextValue.trim();
    const lengthBucket = getQuestionLengthBucket(trimmedValue.length);

    if (
      lengthBucket !== "empty" &&
      !trackedLengthBucketsRef.current.has(lengthBucket)
    ) {
      trackedLengthBucketsRef.current.add(lengthBucket);
      captureAnalyticsEvent("composer_changed", {
        ...analyticsEventProperties,
        char_bucket: lengthBucket,
        has_text: trimmedValue.length > 0,
        source_surface: analyticsSourceSurface ?? "unknown",
      });
    }

    onValueChange(nextValue);
  };

  const handleEmptyActionClick = () => {
    captureAnalyticsEvent("voice_input_clicked", {
      ...analyticsEventProperties,
      source_surface: analyticsSourceSurface ?? "unknown",
    });
    captureAnalyticsEvent("button_clicked", {
      ...analyticsEventProperties,
      button_id: "composer_voice_input",
      button_label: emptyActionLabel,
      button_role: "input",
      button_surface: "composer",
    });
    onEmptyActionClick?.();
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
          onChange={(event) => handleValueChange(event.target.value)}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className={resolvedInputClassName}
        />

        {isGenerating ? (
          <button
            type="button"
            aria-label="Stop generating"
            onClick={() => {
              captureAnalyticsEvent("button_clicked", {
                ...analyticsEventProperties,
                button_id: "composer_stop",
                button_label: "Stop generating",
                button_role: "stop_generation",
                button_surface: "composer",
              });
              onStopGeneration?.();
            }}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center"
          >
            <AiSendButtonIcon className={resolvedIconClassName} generating />
          </button>
        ) : canSubmit ? (
          <button
            type="submit"
            aria-label="Send"
            onClick={() => {
              captureAnalyticsEvent("button_clicked", {
                ...analyticsEventProperties,
                button_id: "composer_send",
                button_label: "Send",
                button_role: "submit",
                button_surface: "composer",
              });
            }}
            className={resolvedSubmitButtonClassName}
          >
            <AiSendButtonIcon className={resolvedIconClassName} generating={false} />
          </button>
        ) : emptyActionIcon ? (
          <button
            type="button"
            aria-label={emptyActionLabel}
            onClick={handleEmptyActionClick}
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
