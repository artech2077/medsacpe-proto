export type PrototypeDefinition = {
  description: string;
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
];
