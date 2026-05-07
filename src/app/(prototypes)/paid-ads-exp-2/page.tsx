import { redirect } from "next/navigation";

const initialQuestion =
  "For a patient with BP 134/84, when should I start hypertension medication under the 2025 guideline?";

export default function PaidAdsExperience2Page() {
  redirect(
    `/paid-ads-exp-2/chat?q=${encodeURIComponent(
      initialQuestion,
    )}&mode=complete&source=${encodeURIComponent("workspace_card")}`,
  );
}
