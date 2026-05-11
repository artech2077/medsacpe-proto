/* eslint-disable @next/next/no-img-element */
import type { ComponentType } from "react";
import { MedscapeCurrentAdBlock } from "@/components/medscape/ai-current/ad-block";
import { MedscapeFeatureUpdatesModal } from "@/components/medscape/ai-current/feature-updates-modal";
import { MedscapeCurrentHeader } from "@/components/medscape/ai-current/global-header";
import { MedscapePaidTrafficQuickStart } from "@/components/medscape/ai-current/paid-traffic-quick-start";
import { DrugAiTablesArticle } from "@/components/medscape/drug-ai-tables/drug-monograph";
import { AiResponseAnswerActions } from "@/components/medscape/ai-response/answer-actions";
import {
  AiResponseAnswerContent,
  splitLeadingKeyPoints,
} from "@/components/medscape/ai-response/answer-content";
import { AiResponseAnswerSupportingContent } from "@/components/medscape/ai-response/answer-supporting-content";
import { AiResponseChatComposer } from "@/components/medscape/ai-response/chat-composer";
import { AiResponseFadedAnswerPreview } from "@/components/medscape/ai-response/faded-answer-preview";
import { AiResponseKeyPoints } from "@/components/medscape/ai-response/key-points";
import { AiMobileTopRail } from "@/components/medscape/ai-response/mobile-top-rail";
import { AiPreparingAnswerNotice } from "@/components/medscape/ai-response/preparing-answer-notice";
import {
  AiPromptCard,
} from "@/components/medscape/ai-response/prompt-card";
import { AiTopRailAction } from "@/components/medscape/ai-response/top-rail-action";
import { ScreenShell } from "@/components/ui/screen-shell";
import {
  aiResponseAssets,
  buildMockAnswer,
  buildMockAnswerSupportingContent,
  defaultInitialQuestion,
  promptSections,
} from "@/data/ai-response";
import { defaultMedscapeFeatureUpdates } from "@/data/medscape-feature-updates";

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

function MobileTopRailPreview() {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[#d5dfec] bg-white">
      <AiMobileTopRail
        className="relative z-20"
        left={<div className="text-[15px] font-semibold text-[#252c31]">Menu</div>}
        center={
          <img
            src={aiResponseAssets.logoAssets.medscapeAi}
            alt="Medscape AI"
            className="h-[22px] w-auto object-contain"
          />
        }
        right={
          <>
            <AiTopRailAction iconSrc={aiResponseAssets.uiIcons.share} label="Share" />
            <AiTopRailAction iconSrc={aiResponseAssets.uiIcons.download} label="Download" />
          </>
        }
        rightClassName="relative z-10 ml-auto flex items-center gap-0.5"
      />
    </div>
  );
}

function PromptCardPreview() {
  return (
    <div className="max-w-[560px]">
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
  const supportingContent = buildMockAnswerSupportingContent(defaultInitialQuestion);

  return (
    <div className="rounded-[20px] bg-white p-5">
      <AiResponseAnswerContent
        answer={buildMockAnswer(defaultInitialQuestion)}
        references={supportingContent.references}
      />
    </div>
  );
}

function FadedAnswerPreview() {
  const answer = buildMockAnswer(defaultInitialQuestion);
  const supportingContent = buildMockAnswerSupportingContent(defaultInitialQuestion);

  return (
    <div className="rounded-[20px] bg-white p-5">
      <AiResponseFadedAnswerPreview
        answer={answer}
        expanded={false}
        fullAnswer={answer}
        onExpandedChange={() => undefined}
        references={supportingContent.references}
      />
    </div>
  );
}

function KeyPointsPreview() {
  return (
    <div className="max-w-[760px] rounded-[20px] bg-white p-5">
      <AiResponseKeyPoints
        keyPoints={splitLeadingKeyPoints(buildMockAnswer(defaultInitialQuestion)).keyPoints}
      />
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

function CurrentHeaderPreview() {
  return (
    <div className="overflow-hidden rounded-[8px] border border-[#d5dfec]">
      <MedscapeCurrentHeader />
    </div>
  );
}

function CurrentAdBlockPreview() {
  return (
    <div className="max-w-[760px] bg-white p-5">
      <MedscapeCurrentAdBlock />
    </div>
  );
}

function FeatureUpdatesModalPreview() {
  return (
    <div className="rounded-[28px] bg-[linear-gradient(180deg,#65707f_0%,#586374_100%)] p-4">
      <MedscapeFeatureUpdatesModal
        mode="embedded"
        onClose={() => undefined}
        onContinue={() => undefined}
        updates={defaultMedscapeFeatureUpdates}
      />
    </div>
  );
}

function SupportingContentPreview() {
  const supportingContent = buildMockAnswerSupportingContent(defaultInitialQuestion);

  return (
    <div className="max-w-[760px] rounded-[20px] bg-white p-5">
      <AiResponseAnswerSupportingContent
        followUpQuestions={supportingContent.followUpQuestions}
        onFollowUpQuestionSelect={() => undefined}
        references={supportingContent.references}
      />
    </div>
  );
}

function PaidTrafficQuickStartPreview() {
  const supportingContent = buildMockAnswerSupportingContent(defaultInitialQuestion);

  return (
    <div className="max-w-[860px] rounded-[24px] bg-white p-5">
      <MedscapePaidTrafficQuickStart
        answer={buildMockAnswer(defaultInitialQuestion)}
        detailState="preparing"
        followUpQuestions={supportingContent.followUpQuestions}
        onActionSelect={() => undefined}
        onAskOwnQuestion={() => undefined}
        referencesCount={supportingContent.references.length}
      />
    </div>
  );
}

function DrugAiTablesArticlePreview() {
  return (
    <div className="max-h-[720px] max-w-[900px] overflow-hidden rounded-[8px] border border-[#d5dfec] bg-white p-6">
      <DrugAiTablesArticle />
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
    category: "navigation",
    description: "Shared mobile top-rail container for logo, menu, and utility actions with a gradient backdrop.",
    id: "ai-mobile-top-rail",
    preview: MobileTopRailPreview,
    sourcePath: "src/components/medscape/ai-response/mobile-top-rail.tsx",
    title: "AiMobileTopRail",
    usageNotes: [
      "Use for mobile-only page rails instead of recreating sticky gradient header markup in screens.",
      "Pass page-specific left, center, and right content rather than forking the rail layout.",
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
    category: "content",
    description: "Reusable Medscape AI feature-update popup with optional carousel behavior for multiple announcements.",
    id: "medscape-feature-updates-modal",
    preview: FeatureUpdatesModalPreview,
    sourcePath: "src/components/medscape/ai-current/feature-updates-modal.tsx",
    title: "MedscapeFeatureUpdatesModal",
    usageNotes: [
      "Pass typed update data so the same modal can render one or many slides.",
      "Use overlay mode in product screens and embedded mode for previews or configuration flows.",
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
      "Use class props and showSubmitWhenEmpty for prototype-specific treatments instead of creating another composer.",
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
      "Pair with AiResponseKeyPoints when answers begin with a leading Key Points section.",
    ],
  },
  {
    category: "content",
    description: "Three-line answer preview with a white fade and learn-more disclosure.",
    id: "ai-response-faded-answer-preview",
    preview: FadedAnswerPreview,
    sourcePath: "src/components/medscape/ai-response/faded-answer-preview.tsx",
    title: "AiResponseFadedAnswerPreview",
  },
  {
    category: "content",
    description: "Collapsible key-points panel for answer intros that need a shared highlighted summary treatment.",
    id: "ai-response-key-points",
    preview: KeyPointsPreview,
    sourcePath: "src/components/medscape/ai-response/key-points.tsx",
    title: "AiResponseKeyPoints",
    usageNotes: [
      "Pass parsed leading bullet points rather than duplicating key-points markup in the screen.",
      "Use the default expanded state to match the Figma answer treatment.",
    ],
  },
  {
    category: "content",
    description: "Paid-entry quick-value layer that surfaces a short answer, compact summary, next-step actions, and trust cue before the detailed response.",
    id: "medscape-paid-traffic-quick-start",
    preview: PaidTrafficQuickStartPreview,
    sourcePath: "src/components/medscape/ai-current/paid-traffic-quick-start.tsx",
    title: "MedscapePaidTrafficQuickStart",
    usageNotes: [
      "Use for paid-traffic and ad-entry experiments that need immediate value before full answer reading.",
      "Pass answer and supporting content from the same turn so quick actions remain clinically aligned.",
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
  {
    category: "navigation",
    description: "Current Medscape global header with desktop navigation and mobile utility actions.",
    id: "medscape-current-header",
    preview: CurrentHeaderPreview,
    sourcePath: "src/components/medscape/ai-current/global-header.tsx",
    title: "MedscapeCurrentHeader",
    usageNotes: [
      "Use at the top of current-style Medscape prototype screens.",
      "Missing source assets are shown as explicit placeholder icons.",
    ],
  },
  {
    category: "content",
    description: "Responsive current-style advertisement placeholder for answer loading and footer placements.",
    id: "medscape-current-ad-block",
    preview: CurrentAdBlockPreview,
    sourcePath: "src/components/medscape/ai-current/ad-block.tsx",
    title: "MedscapeCurrentAdBlock",
    usageNotes: [
      "Use after the generation status while an answer is preparing.",
      "Use persistently between References and Follow-up Questions on completed answers.",
    ],
  },
  {
    category: "content",
    description: "Shared completed-answer footer stack that keeps References, the persistent ad, and Follow-up Questions in the correct order.",
    id: "ai-response-answer-supporting-content",
    preview: SupportingContentPreview,
    sourcePath: "src/components/medscape/ai-response/answer-supporting-content.tsx",
    title: "AiResponseAnswerSupportingContent",
    usageNotes: [
      "Pass typed references and follow-up question strings from the answer data layer.",
      "Use the onFollowUpQuestionSelect callback to trigger the next shared chat turn.",
    ],
  },
  {
    category: "content",
    description: "Drug monograph content stack with embedded Medscape AI prescribing prompts and interaction groups.",
    id: "drug-ai-tables-article",
    preview: DrugAiTablesArticlePreview,
    sourcePath: "src/components/medscape/drug-ai-tables/drug-monograph.tsx",
    title: "DrugAiTablesArticle",
    usageNotes: [
      "Use for drug reference prototypes that embed Medscape AI prompts inside monograph content.",
      "Pair with the current Medscape header and ad block rather than duplicating shell-level chrome.",
    ],
  },
];
