import { redirect } from "next/navigation";
import { paidAdsHantavirusInitialQuestion } from "@/data/paid-ads-hantavirus";

export default function PaidAdsExperience4Page() {
  redirect(
    `/paid-ads-exp-4/chat?q=${encodeURIComponent(
      paidAdsHantavirusInitialQuestion,
    )}&mode=complete&source=${encodeURIComponent("workspace_card")}`,
  );
}
