import { DrugConceptPinnedRailScreen } from "@/components/screens/drug-concept-g-screen";

export default async function DrugConceptGPage({
  searchParams,
}: {
  searchParams: Promise<{ r?: string }>;
}) {
  const { r } = await searchParams;
  return <DrugConceptPinnedRailScreen key={r} />;
}
