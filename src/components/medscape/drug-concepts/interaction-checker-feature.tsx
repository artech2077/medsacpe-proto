"use client";

import Image from "next/image";
import { DrugRegimenChecker } from "@/components/medscape/drug-concepts/regimen-checker";
import { ResponsiveFeaturePanel } from "@/components/ui/responsive-feature-panel";

type InteractionCheckerFeatureProps = {
  onOpenChange?: (isOpen: boolean) => void;
  onRunCheck?: (drugCount: number) => void;
};

/**
 * Shared launcher for the regimen checker. The responsive shell owns drawer
 * and bottom-sheet behavior; the checker owns the medication and result state.
 */
export function InteractionCheckerFeature({
  onOpenChange,
  onRunCheck,
}: InteractionCheckerFeatureProps) {
  return (
    <ResponsiveFeaturePanel
      headerIcon={
        <Image
          src="/assets/Intercations.svg"
          alt=""
          aria-hidden="true"
          width={28}
          height={22}
          className="h-5 w-auto"
        />
      }
      panelTitle="Interaction Checker"
      title="Check interactions"
      onOpenChange={onOpenChange}
    >
      <DrugRegimenChecker presentation="panel" onRunCheck={onRunCheck} />
    </ResponsiveFeaturePanel>
  );
}
