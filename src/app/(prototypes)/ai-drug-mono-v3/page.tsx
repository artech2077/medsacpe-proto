import { AiDrugAnswerFirstScreen } from "@/components/screens/ai-drug-answer-first-screen";

// V3: answer-first pivot (2026-09-22) — the AI-generated answer is primary,
// the canonical monograph is a secondary reference opened via a pill.
// V1 (/ai-drug-mono-v1) and V2 (/ai-drug-mono-v2) are untouched.
export default function AiDrugMonoV3Page() {
  return <AiDrugAnswerFirstScreen />;
}
