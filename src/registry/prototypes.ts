export type PrototypeDefinition = {
  description: string;
  entryRoute?: string;
  route: string;
  slug: string;
  status?: "active" | "draft";
  tags?: string[];
  title: string;
};

export const prototypeRegistry: PrototypeDefinition[] = [
  {
    description:
      "Medscape AI search-to-answer conversation flow with landing prompts, history, and streaming answer states.",
    route: "/ai-response",
    slug: "ai-response",
    status: "active",
    tags: ["medscape-ai", "chat", "streaming"],
    title: "AI Response Prototype",
  },
  {
    description:
      "Current Medscape AI visual treatment with the same landing prompt and streaming conversation behavior.",
    route: "/medscape-ai-current",
    slug: "medscape-ai-current",
    status: "active",
    tags: ["medscape-ai", "current-ui", "chat"],
    title: "Medscape AI current",
  },
  {
    description:
      "Medscape AI current with the first ad pinned above each question so it remains visible during generation and completed answers.",
    route: "/ad-above-the-question",
    slug: "ad-above-the-question",
    status: "active",
    tags: ["medscape-ai", "current-ui", "ad-placement"],
    title: "Ad above the question",
  },
  {
    description:
      "Ad-above-the-question variant that keeps the FWQ test 1 organization while collapsing the answer into a quick summary with a read-more expansion for key points and the full response.",
    route: "/ad-exp-test1",
    slug: "ad-exp-test1",
    status: "active",
    tags: ["medscape-ai", "current-ui", "ad-placement", "follow-up-questions"],
    title: "Ad exp test1",
  },
  {
    description:
      "Ad-above-the-question variant that moves Figma-style chip follow-up questions directly below the completed answer and above the action row.",
    route: "/fwq-test-1",
    slug: "fwq-test-1",
    status: "active",
    tags: ["medscape-ai", "current-ui", "ad-placement", "follow-up-questions"],
    title: "FWQ test 1",
  },
  {
    description:
      "Medscape AI current with the first ad held until the key points block appears, then kept between key points and the answer for every response.",
    route: "/ad-after-keypoints",
    slug: "ad-after-keypoints",
    status: "active",
    tags: ["medscape-ai", "current-ui", "ad-placement"],
    title: "Ad after keypoints",
  },
  {
    description:
      "Medscape AI current with key points collapsed by default and the first ad appearing between key points and the answer once key points are available.",
    route: "/ad-after-keypoints-collapsed",
    slug: "ad-after-keypoints-collapsed",
    status: "active",
    tags: ["medscape-ai", "current-ui", "ad-placement"],
    title: "Ad after keypoints collapsed",
  },
  {
    description:
      "Medscape AI current with the first ad pinned below a collapsed key points card that previews the first bullet and expands with a Read More action.",
    entryRoute:
      "/ad-after-keypoints-collapsed-with-read-more/chat?q=How%20would%20you%20adjust%20vancomycin%20dosing%20(loading%20and%20interval)%20in%20a%2070%20kg%20patient%20on%20intermittent%20hemodialysis%3F&mode=complete&source=workspace_card",
    route: "/ad-after-keypoints-collapsed-with-read-more",
    slug: "ad-after-keypoints-collapsed-with-read-more",
    status: "active",
    tags: ["medscape-ai", "current-ui", "ad-placement"],
    title: "Paid ads experience",
  },
  {
    description:
      "Configuration surface for the Medscape AI feature-update popup shown from the landing experience, including multi-slide carousel content.",
    route: "/medscape-ai-feature-updates-config",
    slug: "medscape-ai-feature-updates-config",
    status: "active",
    tags: ["medscape-ai", "config", "carousel"],
    title: "Feature updates config",
  },
];
