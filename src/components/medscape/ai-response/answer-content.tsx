"use client";

export type AiAnswerBlock =
  | { text: string; type: "heading" | "paragraph" }
  | { items: string[]; type: "list" };

export function buildAnswerBlocks(answer: string) {
  const lines = answer.split("\n");
  const blocks: AiAnswerBlock[] = [];
  let currentList: string[] = [];

  const flushList = () => {
    if (currentList.length === 0) return;
    blocks.push({ items: currentList, type: "list" });
    currentList = [];
  };

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      flushList();
      continue;
    }

    if (/^-\s+/.test(trimmedLine)) {
      currentList.push(trimmedLine.replace(/^-\s+/, ""));
      continue;
    }

    flushList();

    if (
      /^[A-Z][A-Za-z0-9\s&/]+$/.test(trimmedLine) &&
      trimmedLine.length <= 40 &&
      !trimmedLine.endsWith(".")
    ) {
      blocks.push({ text: trimmedLine, type: "heading" });
      continue;
    }

    blocks.push({ text: trimmedLine, type: "paragraph" });
  }

  flushList();
  return blocks;
}

type AiResponseAnswerContentProps = {
  answer: string;
};

export function AiResponseAnswerContent({ answer }: AiResponseAnswerContentProps) {
  const blocks = buildAnswerBlocks(answer);

  return (
    <div className="text-[16px] leading-[1.45] text-[var(--mscp-color-text-body)]">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return (
            <h2
              key={`${block.type}-${index}`}
              className="mt-8 text-[16px] font-bold text-[#3c454d] first:mt-0"
            >
              {block.text}
            </h2>
          );
        }

        if (block.type === "list") {
          return (
            <ul
              key={`${block.type}-${index}`}
              className="mt-5 list-disc space-y-3 pl-6 marker:text-[#252c31]"
            >
              {block.items.map((item, itemIndex) => (
                <li key={`${item}-${itemIndex}`}>{item}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={`${block.type}-${index}`} className="mt-5 first:mt-0">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
