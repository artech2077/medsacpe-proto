/* eslint-disable @next/next/no-img-element */
"use client";

import { aiResponseAssets } from "@/data/ai-response";

// ─── DrugAnswerLoadingSkeleton ──────────────────────────────────────────────────
// Shimmer placeholder for the AI-generated answer that streams in BELOW the
// canonical monograph card (Concept J). The canonical card is shown instantly;
// only this complementary synthesis is held behind the shimmer (~10s). Mirrors
// the final layout — AI label, two short sections, and a follow-up chip row —
// using the shared .dc-shimmer treatment.

function ShimmerBar({ className }: { className?: string }) {
  return <span className={`dc-shimmer block rounded-full ${className ?? ""}`} />;
}

export function DrugAnswerLoadingSkeleton() {
  return (
    <div className="dc-fade" aria-hidden="true">
      {/* AI-generation status cue */}
      <p className="mb-4 inline-flex items-center gap-2 text-[12.5px] font-medium text-[#6b7f92]">
        <img
          src={aiResponseAssets.logoAssets.promptAnimation}
          alt=""
          className="h-4 w-4 object-contain"
        />
        Generating answer from the canonical source above…
      </p>

      {/* First section: sub-heading + paragraph lines */}
      <ShimmerBar className="mb-3 h-4 w-[200px]" />
      <div className="space-y-2.5">
        <ShimmerBar className="h-3.5 w-full" />
        <ShimmerBar className="h-3.5 w-[97%]" />
        <ShimmerBar className="h-3.5 w-[72%]" />
      </div>

      {/* Second section */}
      <ShimmerBar className="mb-3 mt-6 h-4 w-[170px]" />
      <div className="space-y-2.5">
        <ShimmerBar className="h-3.5 w-full" />
        <ShimmerBar className="h-3.5 w-[64%]" />
      </div>

      {/* Follow-up chip row */}
      <div className="mt-6 flex flex-wrap gap-2">
        {["w-[200px]", "w-[150px]", "w-[170px]"].map((w, i) => (
          <ShimmerBar key={i} className={`h-8 !rounded-full ${w}`} />
        ))}
      </div>
    </div>
  );
}
