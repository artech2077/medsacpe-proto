"use client";

import { useEffect, useRef, useState } from "react";
import {
  AiAnswerCopyIcon,
  AiAnswerDislikeIcon,
  AiAnswerLikeIcon,
} from "@/components/medscape/ai-response/iconography";
import { captureAnalyticsEvent } from "@/lib/analytics/posthog";

type AnswerReaction = "dislike" | "like" | null;

type AiResponseAnswerActionsProps = {
  analyticsContext?: {
    conversationId?: string;
    prototypeFamily?: string;
    prototypeRoute?: string;
    prototypeSlug?: string;
    question: string;
    screenType?: string;
    turnId: number;
  };
  answer: string;
  className?: string;
  copyText?: string;
};

async function copyAnswerText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  document.body.appendChild(textarea);

  try {
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, text.length);

    if (!document.execCommand("copy")) {
      throw new Error("Copy command failed");
    }
  } finally {
    document.body.removeChild(textarea);
  }
}

export function AiResponseAnswerActions({
  analyticsContext,
  answer,
  className,
  copyText,
}: AiResponseAnswerActionsProps) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [reaction, setReaction] = useState<AnswerReaction>(null);
  const copyResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const answerTextToCopy = copyText ?? answer;

  useEffect(() => {
    return () => {
      if (copyResetTimeoutRef.current) {
        clearTimeout(copyResetTimeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    const copyMethod = navigator.clipboard ? "clipboard_api" : "exec_command";

    captureAnalyticsEvent("button_clicked", {
      button_id: "answer_copy",
      button_label: "Copy",
      button_role: "copy",
      button_surface: "answer_actions",
      conversation_id: analyticsContext?.conversationId,
      prototype_family: analyticsContext?.prototypeFamily,
      prototype_route: analyticsContext?.prototypeRoute,
      prototype_slug: analyticsContext?.prototypeSlug,
      screen_type: analyticsContext?.screenType,
      turn_id: analyticsContext?.turnId,
    });

    try {
      await copyAnswerText(answerTextToCopy);
      setCopied(true);
      setCopyFailed(false);
      captureAnalyticsEvent("answer_copied", {
        answer_length: answerTextToCopy.length,
        conversation_id: analyticsContext?.conversationId,
        copy_method: copyMethod,
        prototype_family: analyticsContext?.prototypeFamily,
        prototype_route: analyticsContext?.prototypeRoute,
        prototype_slug: analyticsContext?.prototypeSlug,
        question_text: analyticsContext?.question,
        screen_type: analyticsContext?.screenType,
        turn_id: analyticsContext?.turnId,
      });

      if (copyResetTimeoutRef.current) {
        clearTimeout(copyResetTimeoutRef.current);
      }

      copyResetTimeoutRef.current = setTimeout(() => {
        setCopied(false);
        copyResetTimeoutRef.current = null;
      }, 1800);
    } catch {
      setCopied(false);
      setCopyFailed(true);
    }
  };

  const actionButtonClassName =
    "inline-flex items-center gap-2 rounded-full px-1 py-1 text-[16px] leading-none font-medium text-[var(--mscp-color-brand-primary)] transition hover:text-[#043b84] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.22)] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

  return (
    <div
      className={`${className ?? "mt-7"} flex flex-wrap items-center gap-4 text-[var(--mscp-color-brand-primary)]`}
    >
      <button
        type="button"
        aria-label="Mark answer helpful"
        aria-pressed={reaction === "like"}
        onClick={() => {
          setReaction("like");
          captureAnalyticsEvent("button_clicked", {
            button_id: "answer_helpful",
            button_label: "Helpful",
            button_role: "feedback",
            button_surface: "answer_actions",
            conversation_id: analyticsContext?.conversationId,
            prototype_family: analyticsContext?.prototypeFamily,
            prototype_route: analyticsContext?.prototypeRoute,
            prototype_slug: analyticsContext?.prototypeSlug,
            screen_type: analyticsContext?.screenType,
            turn_id: analyticsContext?.turnId,
          });
          captureAnalyticsEvent("answer_feedback_submitted", {
            answer_length: answer.length,
            conversation_id: analyticsContext?.conversationId,
            feedback: "helpful",
            prototype_family: analyticsContext?.prototypeFamily,
            prototype_route: analyticsContext?.prototypeRoute,
            prototype_slug: analyticsContext?.prototypeSlug,
            question_text: analyticsContext?.question,
            screen_type: analyticsContext?.screenType,
            turn_id: analyticsContext?.turnId,
          });
        }}
        className={actionButtonClassName}
      >
        <AiAnswerLikeIcon active={reaction === "like"} />
        <span>Helpful</span>
      </button>

      <button
        type="button"
        aria-label="Mark answer not helpful"
        aria-pressed={reaction === "dislike"}
        onClick={() => {
          setReaction("dislike");
          captureAnalyticsEvent("button_clicked", {
            button_id: "answer_not_helpful",
            button_label: "Not Helpful",
            button_role: "feedback",
            button_surface: "answer_actions",
            conversation_id: analyticsContext?.conversationId,
            prototype_family: analyticsContext?.prototypeFamily,
            prototype_route: analyticsContext?.prototypeRoute,
            prototype_slug: analyticsContext?.prototypeSlug,
            screen_type: analyticsContext?.screenType,
            turn_id: analyticsContext?.turnId,
          });
          captureAnalyticsEvent("answer_feedback_submitted", {
            answer_length: answer.length,
            conversation_id: analyticsContext?.conversationId,
            feedback: "not_helpful",
            prototype_family: analyticsContext?.prototypeFamily,
            prototype_route: analyticsContext?.prototypeRoute,
            prototype_slug: analyticsContext?.prototypeSlug,
            question_text: analyticsContext?.question,
            screen_type: analyticsContext?.screenType,
            turn_id: analyticsContext?.turnId,
          });
        }}
        className={actionButtonClassName}
      >
        <AiAnswerDislikeIcon active={reaction === "dislike"} />
        <span>Not Helpful</span>
      </button>

      <button
        type="button"
        aria-label={copied ? "Answer copied" : "Copy answer"}
        onClick={handleCopy}
        className={actionButtonClassName}
      >
        <AiAnswerCopyIcon />
        <span>{copied ? "Copied" : copyFailed ? "Copy failed" : "Copy"}</span>
      </button>
    </div>
  );
}
