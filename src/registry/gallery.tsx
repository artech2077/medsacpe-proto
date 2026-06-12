/* eslint-disable @next/next/no-img-element */
import type { ComponentType } from "react";
import { DrugAnswerTabs } from "@/components/medscape/drug-concepts/answer-tabs";
import { DrugConceptTabBar } from "@/components/medscape/drug-concepts/concept-tab-bar";
import { ClinicalBoxedWarning } from "@/components/medscape/drug-concepts/clinical-system";
import { DrugDashboardCard } from "@/components/medscape/drug-concepts/dashboard-card";
import { DrugInstantCard } from "@/components/medscape/drug-concepts/instant-card";
import { DrugMonographCanvas } from "@/components/medscape/drug-concepts/monograph-canvas";
import { DrugMonographAccordion } from "@/components/medscape/drug-concepts/monograph-accordion";
import { DrugWorkflowCard } from "@/components/medscape/drug-concepts/workflow-card";
import { CONCEPT_H_FIELD_CHIPS } from "@/components/medscape/drug-concepts/field-sheet";
import { DrugPinnedRail } from "@/components/medscape/drug-concepts/pinned-rail";
import { ClinicalZoneIcon, getZoneAccent } from "@/components/medscape/drug-concepts/clinical-system";
import { DrugScenarioPicker } from "@/components/medscape/drug-concepts/scenario-picker";
import { DrugClarifyingQuestionCard } from "@/components/medscape/drug-concepts/clarifying-question-card";
import { DrugComparisonView } from "@/components/medscape/drug-concepts/comparison-view";
import { DrugToolResultCard } from "@/components/medscape/drug-concepts/tool-result-card";
import { ConditionArticleCard } from "@/components/medscape/drug-concepts/condition-article-card";
import {
  DRUG_SCENARIO_GROUPS,
  getScenarioById,
  t2dmConditionArticle,
} from "@/data/drug-concept-i-scenarios";
import {
  semaglutideMonograph,
  tirzepatideMonograph,
} from "@/data/drug-monograph-registry";
import { apixabanMonograph } from "@/data/drug-monograph";
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

function DrugConceptTabBarPreview() {
  return (
    <div className="overflow-hidden rounded-[16px] bg-[linear-gradient(180deg,#d7e6fd_0%,#e9f2ff_100%)] px-2 py-1">
      <DrugConceptTabBar activeConcept="A" />
    </div>
  );
}

function ClinicalBoxedWarningPreview() {
  return (
    <div className="max-w-[520px] bg-white p-5">
      <ClinicalBoxedWarning warnings={apixabanMonograph.blackBoxWarnings} />
    </div>
  );
}

function DrugDashboardCardPreview() {
  return (
    <div className="max-w-[720px] rounded-[16px] bg-[#f0f5fb] p-4">
      <DrugDashboardCard
        matchedSubfieldId="dosing.renal_adjustment"
        monograph={apixabanMonograph}
      />
    </div>
  );
}

function DrugMonographAccordionPreview() {
  return (
    <div className="max-w-[720px] rounded-[16px] bg-[#f0f5fb] p-4">
      <DrugMonographAccordion
        matchedSubfieldId="dosing.renal_adjustment"
        monograph={apixabanMonograph}
      />
    </div>
  );
}

function DrugInstantCardPreview() {
  return (
    <div className="max-w-[720px] rounded-[16px] bg-[#f0f5fb] p-4">
      <DrugInstantCard
        matchedSubfieldId="dosing.afib"
        monograph={apixabanMonograph}
        onAskAi={() => undefined}
        onOpenMonograph={() => undefined}
      />
    </div>
  );
}

function DrugAnswerTabsPreview() {
  const synthesizedAnswer = apixabanMonograph.synthesizedAnswers["renal-dose-gfr35"];
  const references = synthesizedAnswer.citations.map((c, i) => {
    const sf = apixabanMonograph.sections
      .flatMap((s) => s.subfields)
      .find((s) => s.id === c.anchor);
    return {
      detail: sf?.summary ?? "",
      id: i + 1,
      source: sf?.source.section ?? "",
      sourceLabel: sf?.source.label ?? "Drug Reference",
      title: sf?.title ?? c.anchor,
      url: sf?.source.url,
    };
  });

  return (
    <div className="max-w-[720px]">
      <DrugAnswerTabs
        monograph={apixabanMonograph}
        question="Apixaban renal dose at GFR 35"
        references={references}
        synthesizedAnswer={synthesizedAnswer}
      />
    </div>
  );
}

function DrugMonographCanvasPreview() {
  return (
    <div className="h-[560px] w-full max-w-[760px] overflow-hidden rounded-[16px] border border-[#d5dfec] bg-white">
      <DrugMonographCanvas
        monograph={apixabanMonograph}
        onClose={() => {}}
        targetAnchor="dosing.renal_adjustment"
      />
    </div>
  );
}

function DrugScenarioPickerPreview() {
  return (
    <div className="max-w-[720px] rounded-[16px] bg-[#f0f5fb] p-4">
      <DrugScenarioPicker
        groups={DRUG_SCENARIO_GROUPS}
        activeScenarioId="s1-dosing"
        onSelect={() => undefined}
      />
    </div>
  );
}

function DrugClarifyingQuestionCardPreview() {
  const clarify = getScenarioById("s3-dose")?.turns[0]?.clarify;
  if (!clarify) return null;
  return (
    <div className="max-w-[720px] rounded-[16px] bg-[#f0f5fb] p-4">
      <DrugClarifyingQuestionCard
        prompt={clarify.prompt}
        options={clarify.options}
        onPick={() => undefined}
      />
    </div>
  );
}

function DrugComparisonViewPreview() {
  return (
    <div className="max-w-[760px] rounded-[16px] bg-[#f0f5fb] p-4">
      <DrugComparisonView
        synthesis="Both once-weekly SC with stepwise escalation; schedules differ."
        items={[
          { anchor: "dosing.t2dm_sc", monograph: semaglutideMonograph },
          { anchor: "dosing.t2dm", monograph: tirzepatideMonograph },
        ]}
      />
    </div>
  );
}

function DrugToolResultCardPreview() {
  const tool = getScenarioById("s8-ddi")?.turns[0]?.tool;
  if (!tool) return null;
  return (
    <div className="max-w-[640px] rounded-[16px] bg-[#f0f5fb] p-4">
      <DrugToolResultCard tool={tool} />
    </div>
  );
}

function ConditionArticleCardPreview() {
  return (
    <div className="max-w-[640px] rounded-[16px] bg-[#f0f5fb] p-4">
      <ConditionArticleCard
        article={t2dmConditionArticle}
        openedDrugIds={["semaglutide"]}
        onPickDrug={() => undefined}
      />
    </div>
  );
}

function DrugWorkflowCardPreview() {
  return (
    <div className="max-w-[680px] rounded-[16px] bg-[#f0f5fb] p-4">
      <DrugWorkflowCard
        initialTaskChipId="renal-dosing"
        monograph={apixabanMonograph}
      />
    </div>
  );
}

// Static preview of DrugFieldSheet — shows the sheet in its open position
// over a simulated thread so reviewers can see both the chip strip and the sheet.
function DrugFieldSheetPreview() {
  const interactionsChip = CONCEPT_H_FIELD_CHIPS.find((c) => c.id === "interactions")!;
  const accent = getZoneAccent(interactionsChip.sectionId);

  return (
    <div
      className="relative overflow-hidden rounded-[22px] border border-[rgba(109,153,206,0.35)] bg-white"
      style={{ height: 500 }}
    >
      {/* Simulated chat thread */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#f7fafd_0%,#fff_100%)]" />

      {/* Simulated chip strip in the thread */}
      <div className="absolute left-4 right-4 top-4 flex flex-wrap gap-2">
        {CONCEPT_H_FIELD_CHIPS.map((chip) => {
          const a = getZoneAccent(chip.sectionId);
          return (
            <span
              key={chip.id}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border px-3.5 text-[12.5px] font-semibold"
              style={{ backgroundColor: a.soft, borderColor: a.line, color: a.fg }}
            >
              <ClinicalZoneIcon sectionId={chip.sectionId} className="h-[13px] w-[13px]" />
              {chip.label}
            </span>
          );
        })}
        <span className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-[#dcd2fb] bg-[#f3f0fe] px-3.5 text-[12.5px] font-semibold text-[#6938ef]">
          ↔ Check Interactions
        </span>
      </div>

      {/* Static sheet */}
      <div
        className="absolute inset-x-0 bottom-0 flex flex-col rounded-t-[22px] bg-white shadow-[0_-8px_40px_rgba(6,74,167,0.18)]"
        style={{ height: "67%" }}
      >
        {/* Handle */}
        <div className="flex justify-center pb-2 pt-3">
          <div className="h-[5px] w-9 rounded-full bg-[#dde5ef]" />
        </div>

        {/* Header */}
        <div className="flex items-center gap-2.5 px-4 pb-3">
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: accent.tint, color: accent.fg }}
          >
            <ClinicalZoneIcon sectionId="interactions" className="h-[15px] w-[15px]" />
          </span>
          <span className="flex-1 text-[17px] font-bold text-[#161b1d]">Interactions</span>
        </div>

        {/* Tab strip */}
        <div className="border-b border-[#eef2f7]">
          <div className="flex px-1">
            {["CYP3A4/P-gp", "Anticoag", "NSAIDs"].map((label, i) => (
              <div
                key={label}
                className="min-h-[44px] border-b-2 px-3.5 py-2.5 text-[13px] font-semibold"
                style={
                  i === 0
                    ? { borderBottomColor: accent.fg, color: accent.fg }
                    : { borderBottomColor: "transparent", color: "#5a6e7e" }
                }
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Content preview */}
        <div className="px-5 pt-4">
          <p className="mb-3 text-[11.5px] font-semibold uppercase tracking-[0.07em] text-[#9aafc2]">
            Avoid combined P-gp + strong CYP3A4 inhibitors (ritonavir) or inducers (rifampin)
          </p>
          <p className="text-[16px] leading-[1.45] text-[var(--mscp-color-text-body,#4b5a67)]">
            Combined P-gp and strong CYP3A4 inhibitors (e.g., ritonavir, ketoconazole): AVOID
            combination for the atrial fibrillation indication.
          </p>
        </div>
      </div>
    </div>
  );
}

function DrugPinnedRailPreview() {
  return (
    <div className="h-[560px] w-full max-w-[320px] overflow-hidden rounded-[16px] border border-[#d5dfec]">
      <DrugPinnedRail
        focusAnchor="dosing.afib"
        monograph={apixabanMonograph}
      />
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
  {
    category: "navigation",
    description: "Sticky tab bar that toggles between the eight AI Drug Search concept prototypes (A–H).",
    id: "drug-concept-tab-bar",
    preview: DrugConceptTabBarPreview,
    sourcePath: "src/components/medscape/drug-concepts/concept-tab-bar.tsx",
    title: "DrugConceptTabBar",
    usageNotes: [
      "Pin at the top of every drug-concept prototype by rendering it inside DrugConceptShell.",
      "Pass the current concept letter as activeConcept. Do not fork per concept.",
      "Import DRUG_CONCEPTS from the same file to drive the registry and avoid drift.",
    ],
  },
  {
    category: "feedback",
    description: "FDA boxed-warning treatment — a dark regulatory header bar over the warning text. Always rendered eagerly, never collapsed. Shared across drug-concept prototypes.",
    id: "clinical-boxed-warning",
    preview: ClinicalBoxedWarningPreview,
    sourcePath: "src/components/medscape/drug-concepts/clinical-system.tsx",
    title: "ClinicalBoxedWarning",
    usageNotes: [
      "Use for any black-box / boxed warning so it reads as the serious regulatory artifact, not a soft note.",
      "Pass compact for narrow rails to clamp to two lines; otherwise renders full text.",
    ],
  },
  {
    category: "content",
    description: "Two-level expandable tile grid for a drug's clinical zones, color-coded by zone with real clinical icons. Each tile reveals a subfield mini-ToC on first tap and verbatim canonical body on second tap.",
    id: "drug-dashboard-card",
    preview: DrugDashboardCardPreview,
    sourcePath: "src/components/medscape/drug-concepts/dashboard-card.tsx",
    title: "DrugDashboardCard",
    usageNotes: [
      "Pass matchedSubfieldId from the query matcher to pre-expand and promote the relevant tile.",
      "Black Box Warnings are always rendered eagerly outside the collapse — never hidden.",
      "Feed monograph data from src/data/drug-monograph.ts; do not inline drug strings.",
    ],
  },
  {
    category: "content",
    description:
      "Single-message nested accordion for a drug monograph: section rows collapse to a one-line summary, expand to subfield rows, then to verbatim canonical body. A sticky jump bar scrolls to and opens a section.",
    id: "drug-monograph-accordion",
    preview: DrugMonographAccordionPreview,
    sourcePath: "src/components/medscape/drug-concepts/monograph-accordion.tsx",
    title: "DrugMonographAccordion",
    usageNotes: [
      "Pass matchedSubfieldId from the query matcher to auto-expand the relevant section and subfield on first render.",
      "Black Box Warnings and critical subfields (contraindications) are eager-rendered — never hidden behind a tap.",
      "Verbatim body is rendered through AiResponseAnswerContent so deep text matches existing AI-answer typography; feed monograph data from src/data/drug-monograph.ts.",
    ],
  },
  {
    category: "content",
    description:
      "Compact deterministic card showing a drug's identity, pinned Black Box Warning, and 2–4 verbatim key fields with source labels. A contextual matchedSubfieldId promotes that subfield to the top. Two actions: Open full monograph and Ask AI (opt-in synthesis).",
    id: "drug-instant-card",
    preview: DrugInstantCardPreview,
    sourcePath: "src/components/medscape/drug-concepts/instant-card.tsx",
    title: "DrugInstantCard",
    usageNotes: [
      "Pass matchedSubfieldId from the query matcher to promote the relevant field; omit for the default 4-field view.",
      "Wire onOpenMonograph to DrugMonographCanvas and onAskAi to the screen's synthesis turn handler.",
      "Black Box Warnings are always eager — never hidden.",
    ],
  },
  {
    category: "content",
    description:
      "Drug name header + pinned Black Box Warning + horizontal task chip row (AFib dosing, DVT/PE, Renal, Interactions, Perioperative). Tapping a chip re-sequences the subfield content for that task. Contextual queries pre-select a chip via auto-routing; bare queries default to AFib dosing.",
    id: "drug-workflow-card",
    preview: DrugWorkflowCardPreview,
    sourcePath: "src/components/medscape/drug-concepts/workflow-card.tsx",
    title: "DrugWorkflowCard",
    usageNotes: [
      "Pass initialTaskChipId from getMatchedTaskChipId(query) for auto-routing; omit to show the AFib-dosing default.",
      "Black Box Warnings are always pinned regardless of selected task.",
      "Chip styling reuses the same bg-[#ecf1f9] / text-[#064aa7] token from follow-up-questions; do not fork a new chip style.",
    ],
  },
  {
    category: "navigation",
    description:
      "Message-level tab switcher for Concept E: Answer (cited AI synthesis) · Drug Information (sub-tabbed monograph with sticky Dosing strip, BBW pinned above) · References. Citation chips navigate to the exact subfield instead of showing a tooltip.",
    id: "drug-answer-tabs",
    preview: DrugAnswerTabsPreview,
    sourcePath: "src/components/medscape/drug-concepts/answer-tabs.tsx",
    title: "DrugAnswerTabs",
    usageNotes: [
      "Pass synthesizedAnswer from apixabanMonograph.synthesizedAnswers and build references via the subfield helper.",
      "Citation chip clicks switch to the Drug Information tab and scroll to the anchor subfield with a highlight flash.",
      "BBW is always pinned above the Drug Information sub-tab strip — never collapsed.",
      "The Dosing sub-tab has a sticky subfield strip (AFib · 2.5 mg criteria · DVT/PE · Renal · Hepatic).",
    ],
  },
  {
    category: "layout",
    description:
      "Side canvas / full-screen sheet holding a full drug monograph: left section nav, scrollable center content, right quick-reference rail (pinned BBW + key facts), and search-within-monograph.",
    id: "drug-monograph-canvas",
    preview: DrugMonographCanvasPreview,
    sourcePath: "src/components/medscape/drug-concepts/monograph-canvas.tsx",
    title: "DrugMonographCanvas",
    usageNotes: [
      "Pass targetAnchor (a subfield id) to deep-link: the canvas scrolls to and highlights it on open and on every follow-up re-point.",
      "Renders as a docked right panel on desktop and a full-screen sheet on mobile — wrap it in a fixed inset-0 md:relative container.",
      "Feed monograph data from src/data/drug-monograph.ts; the right rail keeps Black Box Warnings + key facts visible at any scroll depth.",
    ],
  },
  {
    category: "layout",
    description:
      "Mobile bottom sheet for Concept H — slides up over the chat thread to show a sticky sub-field tab strip and one sub-field at a time. Two variants: 'field' (clinical section with tabs) and 'interaction-checker' (drug ↔ drug check). Swipe down or tap the backdrop to dismiss.",
    id: "drug-field-sheet",
    preview: DrugFieldSheetPreview,
    sourcePath: "src/components/medscape/drug-concepts/field-sheet.tsx",
    title: "DrugFieldSheet",
    usageNotes: [
      "Pass variant='field' with a FieldChip from CONCEPT_H_FIELD_CHIPS and an initialSubfieldId to open the correct tab.",
      "Pass variant='interaction-checker' to show drug interaction content without a chip reference.",
      "Render inside a position:relative container (the DrugConceptShell white panel) so z-40 stacks correctly.",
      "Feed monograph data from src/data/drug-monograph.ts — never inline drug strings.",
    ],
  },
  {
    category: "layout",
    description:
      "Persistent drug-reference rail for Concept G: BBW pinned at top, scrollable section list with compact rows that expand in-place to subfield cards. A focusAnchor prop drives auto-expand + scroll + 2.4s highlight ring for citation-chip linking from the thread.",
    id: "drug-pinned-rail",
    preview: DrugPinnedRailPreview,
    sourcePath: "src/components/medscape/drug-concepts/pinned-rail.tsx",
    title: "DrugPinnedRail",
    usageNotes: [
      "Pass focusAnchor (a subfield id) when a citation chip is clicked — the rail expands the matching section and subfield, scrolls to it, and flashes a 2.4s highlight ring.",
      "After each completed turn, auto-set focusAnchor to the first citation anchor so the rail stays grounded.",
      "Pass onClose to render a close button for the mobile sheet variant.",
      "BBW is always pinned at the top of the header — never collapses regardless of focusAnchor.",
      "Feed monograph data from src/data/drug-monograph.ts.",
    ],
  },
  {
    category: "navigation",
    description:
      "Scenario browser for Concept I, rendered under the empty-state hero: the six use-case groups from the Drug Question Use Case Taxonomy appear as cards, and selecting a card swaps in that group's preset clinician questions (each tagged with its S1–S9 solution pattern). Picking a question plays its scripted exchange.",
    id: "drug-scenario-picker",
    preview: DrugScenarioPickerPreview,
    sourcePath: "src/components/medscape/drug-concepts/scenario-picker.tsx",
    title: "DrugScenarioPicker",
    usageNotes: [
      "Feed groups from DRUG_SCENARIO_GROUPS in src/data/drug-concept-i-scenarios.ts — grouping mirrors the taxonomy's use-case categories, not solution patterns.",
      "Persist the active scenario in the URL (?scenario=<id>) in the parent screen so reviewers can deep-link.",
      "Render it in the empty state; while a scenario plays, give the header a back affordance (Concept I uses a Scenarios pill) that clears the thread.",
    ],
  },
  {
    category: "content",
    description:
      "S3 plan-mode clarifying card: the assistant asks which product the clinician means (e.g. Ozempic · Wegovy · Rybelsus) before answering. Picking an option locks the card and renders the S1 answer for that variant.",
    id: "drug-clarifying-question-card",
    preview: DrugClarifyingQuestionCardPreview,
    sourcePath: "src/components/medscape/drug-concepts/clarifying-question-card.tsx",
    title: "DrugClarifyingQuestionCard",
    usageNotes: [
      "Options come from the scenario script (ScenarioClarifyOption in drug-concept-i-scenarios.ts) — each carries the drugId, answerKey, and anchor for the follow-up card.",
      "Pass selectedOptionId after a pick to lock the card and dim the unchosen options.",
    ],
  },
  {
    category: "content",
    description:
      "S4 dual/triple canonical view: 2–3 monograph cards as side-by-side columns on desktop and a swipeable snap stack on mobile, each opened to the same section, with an optional one-line AI synthesis above. Also exports DrugMonographCardFrame — the card chrome reused by S5 stacked sources, S6 collapsed cards, and S9 persistent cards.",
    id: "drug-comparison-view",
    preview: DrugComparisonViewPreview,
    sourcePath: "src/components/medscape/drug-concepts/comparison-view.tsx",
    title: "DrugComparisonView",
    usageNotes: [
      "Pass the same anchor per item so all columns open to the comparable section; BBW stays eager inside every column via the accordion.",
      "Caps rendering at 3 items — more than 3 drugs should fall back to the S6 pattern per spec.",
      "DrugMonographCardFrame accepts highlight to play the S9 'updated in place' flash.",
    ],
  },
  {
    category: "content",
    description:
      "S8 deterministic tool card: interaction-checker verdict (severity-coded) or dose-calculator result (inputs → highlighted result + caution). Rendered like canonical content — deterministic, not generated. Source monograph slices are anchored beneath it by the screen.",
    id: "drug-tool-result-card",
    preview: DrugToolResultCardPreview,
    sourcePath: "src/components/medscape/drug-concepts/tool-result-card.tsx",
    title: "DrugToolResultCard",
    usageNotes: [
      "Tool payloads are typed DrugToolResult objects in drug-concept-i-scenarios.ts — kind 'interaction' or 'calculator'.",
      "Always anchor the source monograph slice(s) below the card so the deterministic result stays traceable to canonical content.",
    ],
  },
  {
    category: "content",
    description:
      "S7 condition-first handoff card: condition article summary (Treatment / Medication sections) with drug pills. Tapping a pill opens that drug's canonical monograph card in the thread.",
    id: "condition-article-card",
    preview: ConditionArticleCardPreview,
    sourcePath: "src/components/medscape/drug-concepts/condition-article-card.tsx",
    title: "ConditionArticleCard",
    usageNotes: [
      "Pass openedDrugIds so pills for already-opened monographs render in the active state.",
      "Article content comes from t2dmConditionArticle in drug-concept-i-scenarios.ts.",
    ],
  },
];
