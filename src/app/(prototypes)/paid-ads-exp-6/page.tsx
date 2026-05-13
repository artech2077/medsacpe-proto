import { redirect } from "next/navigation";
import { paidAdsHantavirusFluComparisonInitialQuestion } from "@/data/paid-ads-hantavirus";

export default function PaidAdsExperience6Page() {
  redirect(
    `/paid-ads-exp-6/chat?q=${encodeURIComponent(
      paidAdsHantavirusFluComparisonInitialQuestion,
    )}&mode=complete&source=${encodeURIComponent("workspace_card")}`,
  );
}
