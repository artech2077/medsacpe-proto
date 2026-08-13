"use client";

import {
  DrugPeerContextStrip,
  type DrugPeerContextStripProps,
} from "@/components/medscape/drug-concepts/peer-context-strip";
import { ResponsiveFeaturePanel } from "@/components/ui/responsive-feature-panel";

type DrugPeerContextFeatureProps = DrugPeerContextStripProps & {
  onOpenChange?: (isOpen: boolean) => void;
};

/**
 * Responsive feature treatment for the existing V2 peer-context content.
 * Content and interactions stay owned by DrugPeerContextStrip; this component
 * only supplies the compact launcher and drawer/bottom-sheet presentation.
 */
export function DrugPeerContextFeature({
  onAlternativeSelect,
  onOpenChange,
  onTopicSelect,
  ...contextProps
}: DrugPeerContextFeatureProps) {
  return (
    <ResponsiveFeaturePanel title={contextProps.header} onOpenChange={onOpenChange}>
      <DrugPeerContextStrip
        {...contextProps}
        presentation="panel"
        onAlternativeSelect={onAlternativeSelect}
        onTopicSelect={onTopicSelect}
      />
    </ResponsiveFeaturePanel>
  );
}
