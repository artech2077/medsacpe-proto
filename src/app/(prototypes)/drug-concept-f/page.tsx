import { DrugConceptInstantCardScreen } from "@/components/screens/drug-concept-f-screen";

export default async function DrugConceptFPage({
  searchParams,
}: {
  searchParams: Promise<{ r?: string }>;
}) {
  const { r } = await searchParams;
  return <DrugConceptInstantCardScreen key={r} />;
}
