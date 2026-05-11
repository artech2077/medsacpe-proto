import { redirect } from "next/navigation";
import { paidAdsHantavirusInitialQuestion } from "@/data/paid-ads-hantavirus";

export default function PaidAdsExperience6Page() {
  redirect(
    `/paid-ads-exp-6/chat?q=${encodeURIComponent(
      paidAdsHantavirusInitialQuestion,
    )}&mode=complete&source=${encodeURIComponent("workspace_card")}`,
  );
}
