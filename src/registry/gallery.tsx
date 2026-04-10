import type { ComponentType } from "react";
import { AiResponseAnswerActions } from "@/components/medscape/ai-response/answer-actions";
import { AiResponseAnswerContent } from "@/components/medscape/ai-response/answer-content";
import { AiResponseChatComposer } from "@/components/medscape/ai-response/chat-composer";
import { AiPreparingAnswerNotice } from "@/components/medscape/ai-response/preparing-answer-notice";
import {
  AiPromptCard,
} from "@/components/medscape/ai-response/prompt-card";
import { AiTopRailAction } from "@/components/medscape/ai-response/top-rail-action";
import { ScreenShell } from "@/components/ui/screen-shell";
import {
  aiResponseAssets,
  buildMockAnswer,
  defaultInitialQuestion,
  promptSections,
} from "@/data/ai-response";

export type GalleryCategory =
  | "content"
  | "feedback"
  | "input"
  | "layout"
  | "navigation";

export type GalleryEntry = {
  category: GalleryCategory;
  description: string;
  id: string;
  preview: ComponentType;
  sourcePath: string;
  title: string;
  usageNotes?: string[];
};

export const galleryCategoryOrder: GalleryCategory[] = [
  "layout",
  "navigation",
  "content",
  "input",
  "feedback",
];

function ScreenShellPreview() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-[var(--border-subtle)]">
      <ScreenShell
        eyebrow="Shared Layout"
        title="Reusable screen shell"
        description="Use for prototype pages that need a consistent branded frame and header."
        actions={
          <button className="rounded-[var(--radius-md)] bg-[var(--color-brand-500)] px-4 py-2 text-sm font-semibold text-white">
            Action
          </button>
        }
      >
        <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-white p-6 text-sm text-[var(--text-secondary)]">
          Screen content preview
        </div>
      </ScreenShell>
    </div>
  );
}

function TopRailActionPreview() {
  return (
    <div className="flex items-center gap-2 rounded-[24px] bg-[#eef4fe] p-4">
      <AiTopRailAction iconSrc={aiResponseAssets.uiIcons.share} label="Share" />
      <AiTopRailAction iconSrc={aiResponseAssets.uiIcons.download} label="Download" />
    </div>
  );
}

function PromptCardPreview() {
  return (
    <div className="max-w-[460px]">
      <AiPromptCard section={promptSections[0]} onPromptSelect={() => undefined} />
    </div>
  );
}

function ComposerPreview() {
  return (
    <div className="max-w-[620px] rounded-[24px] bg-[#f5f8fc] p-4">
      <AiResponseChatComposer
        isGenerating={false}
        onStopGeneration={() => undefined}
        onSubmit={() => undefined}
        onValueChange={() => undefined}
        value="Compare GLP-1 receptor agonists and SGLT2 inhibitors for a patient with obesity and cardiovascular disease."
      />
    </div>
  );
}

function PreparingNoticePreview() {
  return (
    <div className="rounded-[20px] bg-white p-4">
      <AiPreparingAnswerNotice question={defaultInitialQuestion} />
    </div>
  );
}

function AnswerContentPreview() {
  return (
    <div className="rounded-[20px] bg-white p-5">
      <AiResponseAnswerContent answer={buildMockAnswer(defaultInitialQuestion)} />
    </div>
  );
}

function AnswerActionsPreview() {
  return (
    <div className="rounded-[20px] bg-white p-5">
      <AiResponseAnswerActions answer={buildMockAnswer(defaultInitialQuestion)} />
    </div>
  );
}

export const galleryRegistry: GalleryEntry[] = [
  {
    category: "layout",
    description: "Shared frame for route-level prototypes with a consistent title, description, and action rail.",
    id: "screen-shell",
    preview: ScreenShellPreview,
    sourcePath: "src/components/ui/screen-shell.tsx",
    title: "ScreenShell",
    usageNotes: [
      "Use at the screen composition layer, not inside route files.",
      "Pass page-specific actions as children rather than re-creating shell markup.",
    ],
  },
  {
    category: "navigation",
    description: "Compact branded action used in the AI response top rail for utility actions.",
    id: "ai-top-rail-action",
    preview: TopRailActionPreview,
    sourcePath: "src/components/medscape/ai-response/top-rail-action.tsx",
    title: "AiTopRailAction",
    usageNotes: [
      "Provide icon path and label.",
      "Use for secondary actions such as share and download.",
    ],
  },
  {
    category: "content",
    description: "Prompt suggestion card for Medscape AI landing experiences and future intake flows.",
    id: "ai-prompt-card",
    preview: PromptCardPreview,
    sourcePath: "src/components/medscape/ai-response/prompt-card.tsx",
    title: "AiPromptCard",
    usageNotes: [
      "Pair with typed prompt section data from src/data/ai-response.ts.",
      "Use callback props instead of hardcoding navigation.",
    ],
  },
  {
    category: "input",
    description: "Reusable chat composer for AI prototype answer views with send and stop states.",
    id: "ai-response-chat-composer",
    preview: ComposerPreview,
    sourcePath: "src/components/medscape/ai-response/chat-composer.tsx",
    title: "AiResponseChatComposer",
    usageNotes: [
      "Own state in the screen, then pass value and handlers into the composer.",
      "Use the generating state to switch from send to stop affordance.",
    ],
  },
  {
    category: "feedback",
    description: "Inline progress notice shown before a streamed answer starts rendering.",
    id: "ai-preparing-answer-notice",
    preview: PreparingNoticePreview,
    sourcePath: "src/components/medscape/ai-response/preparing-answer-notice.tsx",
    title: "AiPreparingAnswerNotice",
    usageNotes: ["Provide the current question so the preview can reflect the active topic."],
  },
  {
    category: "content",
    description: "Structured answer renderer that converts mock clinical text into headings, paragraphs, and lists.",
    id: "ai-response-answer-content",
    preview: AnswerContentPreview,
    sourcePath: "src/components/medscape/ai-response/answer-content.tsx",
    title: "AiResponseAnswerContent",
    usageNotes: [
      "Use with content strings generated by prototype data modules or mocked model output.",
      "Keep raw text generation separate from the renderer.",
    ],
  },
  {
    category: "feedback",
    description: "Inline helpful, not helpful, and copy controls for completed AI answer states.",
    id: "ai-response-answer-actions",
    preview: AnswerActionsPreview,
    sourcePath: "src/components/medscape/ai-response/answer-actions.tsx",
    title: "AiResponseAnswerActions",
    usageNotes: [
      "Pass the final answer string so the copy action can mirror the rendered content.",
      "Mount beneath completed answer content so feedback is tied to a single response.",
    ],
  },
];
