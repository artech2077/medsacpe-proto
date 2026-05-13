import { redirect } from "next/navigation";
import { paidAdsHantavirusFluComparisonInitialQuestion } from "@/data/paid-ads-hantavirus";

export default function PaidAdsExperience3Page() {
  redirect(
    `/paid-ads-exp-3/chat?q=${encodeURIComponent(
      paidAdsHantavirusFluComparisonInitialQuestion,
    )}&mode=complete&source=${encodeURIComponent("workspace_card")}`,
  );
}
