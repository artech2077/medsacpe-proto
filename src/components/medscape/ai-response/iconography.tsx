/* eslint-disable @next/next/no-img-element */
import { aiResponseAssets, type PromptSectionId } from "@/data/ai-response";

export function AiMenuIcon({ invert = false }: { invert?: boolean }) {
  return (
    <img
      src={aiResponseAssets.menuIcon}
      alt=""
      aria-hidden="true"
      className={`h-5 w-5 object-contain brightness-0 ${invert ? "invert" : ""}`.trim()}
    />
  );
}

export function AiMicrophoneIcon() {
  return (
    <img
      src={aiResponseAssets.microphoneIcon}
      alt=""
      aria-hidden="true"
      className="h-5 w-5 object-contain"
    />
  );
}

export function AiSendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d="m5 12 12-7-3 7 3 7-12-7Z" />
      <path d="M5 12h9" />
    </svg>
  );
}

export function AiPromptChevron() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="h-4 w-4 text-[#7f8a96]"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
    >
      <path d="m6 3.5 4 4.5-4 4.5" />
    </svg>
  );
}

export function AiPromptSectionIcon({ id }: { id: PromptSectionId }) {
  return (
    <img
      src={aiResponseAssets.promptSectionIcons[id]}
      alt=""
      aria-hidden="true"
      className="h-5 w-5 object-contain"
    />
  );
}

export function AiCloseIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.8"
    >
      <path d="M4 4 16 16" />
      <path d="M16 4 4 16" />
    </svg>
  );
}

export function AiOverflowDotsIcon() {
  return (
    <svg viewBox="0 0 4 16" aria-hidden="true" className="h-4 w-4 fill-current">
      <circle cx="2" cy="3" r="1.1" />
      <circle cx="2" cy="8" r="1.1" />
      <circle cx="2" cy="13" r="1.1" />
    </svg>
  );
}

export function AiSendButtonIcon({
  className = "h-8 w-8",
  generating,
}: {
  className?: string;
  generating: boolean;
}) {
  return (
    <img
      src={generating ? aiResponseAssets.composerIcons.stop : aiResponseAssets.composerIcons.send}
      alt=""
      aria-hidden="true"
      className={`${className} object-contain`}
    />
  );
}

export function AiAnswerCopyIcon() {
  return (
    <img
      src={aiResponseAssets.uiIcons.copy}
      alt=""
      aria-hidden="true"
      className="h-4 w-4 object-contain"
    />
  );
}

export function AiAnswerLikeIcon({ active }: { active: boolean }) {
  return (
    <img
      src={active ? aiResponseAssets.uiIcons.likeFilled : aiResponseAssets.uiIcons.like}
      alt=""
      aria-hidden="true"
      className="h-4 w-4 object-contain"
    />
  );
}

export function AiAnswerDislikeIcon({ active }: { active: boolean }) {
  return (
    <img
      src={active ? aiResponseAssets.uiIcons.dislikeFilled : aiResponseAssets.uiIcons.dislike}
      alt=""
      aria-hidden="true"
      className="h-4 w-4 object-contain"
    />
  );
}
