import { DrugConceptWorkflowChipsScreen } from "@/components/screens/drug-concept-d-screen";

export default async function DrugConceptDPage({
  searchParams,
}: {
  searchParams: Promise<{ r?: string }>;
}) {
  const { r } = await searchParams;
  return <DrugConceptWorkflowChipsScreen key={r} />;
}
