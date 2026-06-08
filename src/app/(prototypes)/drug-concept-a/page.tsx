import { DrugConceptDashboardCardScreen } from "@/components/screens/drug-concept-a-screen";

export default async function DrugConceptAPage({
  searchParams,
}: {
  searchParams: Promise<{ r?: string }>;
}) {
  const { r } = await searchParams;
  return <DrugConceptDashboardCardScreen key={r} />;
}
