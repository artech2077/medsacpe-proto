export function getCurrentProgressText(question: string) {
  const normalized = question.toLowerCase();

  if (normalized.includes("omega")) {
    return "Reviewing clinical studies and meta-analyses on omega-3 fatty acids and cardiovascular outcomes";
  }

  return "Analyzing question";
}
