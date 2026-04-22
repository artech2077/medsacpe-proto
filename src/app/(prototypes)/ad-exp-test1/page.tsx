import { MedscapeAiCurrentLanding } from "@/components/screens/medscape-ai-current-landing";

export default function AdExpTest1Page() {
  return (
    <MedscapeAiCurrentLanding
      composerPlaceholder="Ask Medscape AI to tailor this to your patient or next step"
      promptIntro="Tap a question to test the paid-entry landing flow"
      prototypeRoute="/ad-exp-test1"
      showHistoryAction={false}
    />
  );
}
