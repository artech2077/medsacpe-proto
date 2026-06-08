import { DrugConceptMonographCanvasScreen } from "@/components/screens/drug-concept-b-screen";

export default async function DrugConceptBPage({
  searchParams,
}: {
  searchParams: Promise<{ anchor?: string; r?: string }>;
}) {
  const { anchor, r } = await searchParams;
  return <DrugConceptMonographCanvasScreen key={r} initialAnchor={anchor} />;
}
