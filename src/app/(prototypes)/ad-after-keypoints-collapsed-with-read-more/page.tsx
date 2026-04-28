import { redirect } from "next/navigation";

const initialQuestion =
  "How would you adjust vancomycin dosing (loading and interval) in a 70 kg patient on intermittent hemodialysis?";

export default function AdAfterKeypointsCollapsedWithReadMorePage() {
  redirect(
    `/ad-after-keypoints-collapsed-with-read-more/chat?q=${encodeURIComponent(
      initialQuestion,
    )}&mode=complete&source=${encodeURIComponent("workspace_card")}`,
  );
}
