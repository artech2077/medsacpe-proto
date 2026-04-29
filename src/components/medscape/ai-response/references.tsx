/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { AiChevronIcon } from "@/components/medscape/ai-response/answer-section-icons";
import { AiResponseReferenceCard } from "@/components/medscape/ai-response/reference-card";
import { aiResponseAssets, type AiAnswerReference } from "@/data/ai-response";
import { captureAnalyticsEvent } from "@/lib/analytics/posthog";

type AiResponseReferencesProps = {
  analyticsContext?: {
    conversationId?: string;
    prototypeFamily?: string;
    prototypeRoute?: string;
    prototypeSlug?: string;
    screenType?: string;
    turnId?: number;
  };
  className?: string;
  defaultExpanded?: boolean;
  references: AiAnswerReference[];
};

export function AiResponseReferences({
  analyticsContext,
  className,
  defaultExpanded = false,
  references,
}: AiResponseReferencesProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (references.length === 0) {
    return null;
  }

  return (
    <section className={`border-t border-[#c5ced3] pt-3 ${className ?? ""}`.trim()}>
      <button
        type="button"
        aria-expanded={isExpanded}
        onClick={() =>
          setIsExpanded((current) => {
            const nextExpanded = !current;
            captureAnalyticsEvent("button_clicked", {
              button_id: "references_toggle",
              button_label: "References",
              button_role: "toggle",
              button_surface: "references",
              conversation_id: analyticsContext?.conversationId,
              prototype_family: analyticsContext?.prototypeFamily,
              prototype_route: analyticsContext?.prototypeRoute,
              prototype_slug: analyticsContext?.prototypeSlug,
              screen_type: analyticsContext?.screenType,
              turn_id: analyticsContext?.turnId,
            });
            captureAnalyticsEvent("references_toggled", {
              conversation_id: analyticsContext?.conversationId,
              expanded: nextExpanded,
              prototype_family: analyticsContext?.prototypeFamily,
              prototype_route: analyticsContext?.prototypeRoute,
              prototype_slug: analyticsContext?.prototypeSlug,
              reference_count: references.length,
              screen_type: analyticsContext?.screenType,
              turn_id: analyticsContext?.turnId,
            });
            return nextExpanded;
          })
        }
        className="flex w-full items-center justify-between gap-3 text-left text-[#2c353a]"
      >
        <span className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full">
            <img
              src={aiResponseAssets.uiIcons.references}
              alt=""
              aria-hidden="true"
              className="h-4 w-4 shrink-0 object-contain"
            />
          </span>
          <span className="text-[18px] leading-[1.2] font-semibold">References</span>
        </span>

        <AiChevronIcon
          direction={isExpanded ? "up" : "down"}
          className="h-5 w-5 shrink-0 text-[#161b1d]"
        />
      </button>

      {isExpanded ? (
        <div className="mt-3 space-y-3 border-t border-[#c5ced3] pt-3">
          {references.map((reference) => (
            <AiResponseReferenceCard key={reference.id} reference={reference} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
