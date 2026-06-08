import { DrugConceptAnswerTabsScreen } from "@/components/screens/drug-concept-e-screen";

export default async function DrugConceptEPage({
  searchParams,
}: {
  searchParams: Promise<{ r?: string }>;
}) {
  const { r } = await searchParams;
  return <DrugConceptAnswerTabsScreen key={r} />;
}
