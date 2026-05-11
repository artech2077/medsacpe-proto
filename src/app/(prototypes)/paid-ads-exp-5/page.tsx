import { redirect } from "next/navigation";
import { paidAdsHantavirusInitialQuestion } from "@/data/paid-ads-hantavirus";

export default function PaidAdsExperience5Page() {
  redirect(
    `/paid-ads-exp-5/chat?q=${encodeURIComponent(
      paidAdsHantavirusInitialQuestion,
    )}&mode=complete&source=${encodeURIComponent("workspace_card")}`,
  );
}
