import { redirect } from "next/navigation";
import { paidAdsHantavirusInitialQuestion } from "@/data/paid-ads-hantavirus";

export default function PaidAdsExperience3Page() {
  redirect(
    `/paid-ads-exp-3/chat?q=${encodeURIComponent(
      paidAdsHantavirusInitialQuestion,
    )}&mode=complete&source=${encodeURIComponent("workspace_card")}`,
  );
}
