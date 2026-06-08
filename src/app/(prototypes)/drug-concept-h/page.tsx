import { DrugConceptMobileSheetsScreen } from "@/components/screens/drug-concept-h-screen";
import { ScaledPhoneFrame } from "@/components/ui/scaled-phone-frame";

export default async function DrugConceptHPage({
  searchParams,
}: {
  searchParams: Promise<{ r?: string }>;
}) {
  const { r } = await searchParams;
  return (
    <div
      className="flex h-screen items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 120% 100% at 50% 20%, #12294d 0%, #080e1c 55%, #040710 100%)",
      }}
    >
      <ScaledPhoneFrame>
        <DrugConceptMobileSheetsScreen key={r} shellClassName="h-full" compact />
      </ScaledPhoneFrame>
    </div>
  );
}
