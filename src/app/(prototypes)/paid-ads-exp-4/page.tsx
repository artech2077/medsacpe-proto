import { redirect } from "next/navigation";
import { paidAdsHantavirusFluComparisonInitialQuestion } from "@/data/paid-ads-hantavirus";

export default function PaidAdsExperience4Page() {
  redirect(
    `/paid-ads-exp-4/chat?q=${encodeURIComponent(
      paidAdsHantavirusFluComparisonInitialQuestion,
    )}&mode=complete&source=${encodeURIComponent("workspace_card")}`,
  );
}
