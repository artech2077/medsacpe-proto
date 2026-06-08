import { DrugConceptAccordionScreen } from "@/components/screens/drug-concept-c-screen";

export default async function DrugConceptCPage({
  searchParams,
}: {
  searchParams: Promise<{ r?: string }>;
}) {
  const { r } = await searchParams;
  return <DrugConceptAccordionScreen key={r} />;
}
