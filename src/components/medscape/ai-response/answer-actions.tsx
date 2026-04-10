"use client";

import { useEffect, useRef, useState } from "react";
import {
  AiAnswerCopyIcon,
  AiAnswerDislikeIcon,
  AiAnswerLikeIcon,
} from "@/components/medscape/ai-response/iconography";

type AnswerReaction = "dislike" | "like" | null;

type AiResponseAnswerActionsProps = {
  answer: string;
};

async function copyAnswerText(answer: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(answer);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = answer;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export function AiResponseAnswerActions({ answer }: AiResponseAnswerActionsProps) {
  const [copied, setCopied] = useState(false);
  const [reaction, setReaction] = useState<AnswerReaction>(null);
  const copyResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyResetTimeoutRef.current) {
        clearTimeout(copyResetTimeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    try {
      await copyAnswerText(answer);
      setCopied(true);

      if (copyResetTimeoutRef.current) {
        clearTimeout(copyResetTimeoutRef.current);
      }

      copyResetTimeoutRef.current = setTimeout(() => {
        setCopied(false);
        copyResetTimeoutRef.current = null;
      }, 1800);
    } catch {
      setCopied(false);
    }
  };

  const actionButtonClassName =
    "inline-flex items-center gap-2 rounded-full px-1 py-1 text-[16px] leading-none font-medium text-[var(--mscp-color-brand-primary)] transition hover:text-[#043b84] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(6,74,167,0.22)] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

  return (
    <div className="mt-7 flex flex-wrap items-center gap-4 text-[var(--mscp-color-brand-primary)]">
      <button
        type="button"
        aria-label="Mark answer helpful"
        aria-pressed={reaction === "like"}
        onClick={() => setReaction("like")}
        className={actionButtonClassName}
      >
        <AiAnswerLikeIcon active={reaction === "like"} />
        <span>Helpful</span>
      </button>

      <button
        type="button"
        aria-label="Mark answer not helpful"
        aria-pressed={reaction === "dislike"}
        onClick={() => setReaction("dislike")}
        className={actionButtonClassName}
      >
        <AiAnswerDislikeIcon active={reaction === "dislike"} />
        <span>Not Helpful</span>
      </button>

      <button
        type="button"
        aria-label="Copy answer"
        onClick={handleCopy}
        className={actionButtonClassName}
      >
        <AiAnswerCopyIcon />
        <span>{copied ? "copied!" : "Copy"}</span>
      </button>
    </div>
  );
}
