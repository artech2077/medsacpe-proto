import { promptSections } from "@/data/ai-response";

export type MedscapeFeatureUpdate = {
  description: string;
  headline: string;
  id: string;
  imageUrl: string;
};

export const MEDSCAPE_FEATURE_UPDATES_STORAGE_KEY = "medscape-ai-feature-updates";
export const featureUpdatesTriggerPrompt = promptSections[0]?.prompts[2] ?? "";

export const defaultMedscapeFeatureUpdates: MedscapeFeatureUpdate[] = [
  {
    description: "Try it today by clicking on the sparkle",
    headline:
      "Ask complex medical questions, the latest clinical guidance for drugs & conditions with Medscape AI",
    id: "feature-update-1",
    imageUrl: "",
  },
];

export function cloneMedscapeFeatureUpdates(
  updates: MedscapeFeatureUpdate[],
): MedscapeFeatureUpdate[] {
  return updates.map((update) => ({ ...update }));
}

function createFeatureUpdateId(index: number) {
  return `feature-update-${index + 1}-${Date.now()}`;
}

export function createBlankMedscapeFeatureUpdate(index: number): MedscapeFeatureUpdate {
  return {
    description: "Add supporting text for this Medscape AI update.",
    headline: `New feature update ${index + 1}`,
    id: createFeatureUpdateId(index),
    imageUrl: "",
  };
}

function sanitizeFeatureUpdate(
  update: Partial<MedscapeFeatureUpdate> | null | undefined,
  index: number,
): MedscapeFeatureUpdate {
  return {
    description:
      update?.description?.trim() ||
      defaultMedscapeFeatureUpdates[0].description,
    headline:
      update?.headline?.trim() ||
      defaultMedscapeFeatureUpdates[0].headline,
    id: update?.id?.trim() || createFeatureUpdateId(index),
    imageUrl: update?.imageUrl?.trim() || "",
  };
}

export function sanitizeMedscapeFeatureUpdates(
  value: unknown,
): MedscapeFeatureUpdate[] {
  if (!Array.isArray(value) || value.length === 0) {
    return cloneMedscapeFeatureUpdates(defaultMedscapeFeatureUpdates);
  }

  return value.map((update, index) =>
    sanitizeFeatureUpdate(
      typeof update === "object" && update !== null
        ? (update as Partial<MedscapeFeatureUpdate>)
        : undefined,
      index,
    ),
  );
}

export function readMedscapeFeatureUpdatesFromStorage(
  storage: Storage | null | undefined,
): MedscapeFeatureUpdate[] {
  if (!storage) return cloneMedscapeFeatureUpdates(defaultMedscapeFeatureUpdates);

  try {
    const rawValue = storage.getItem(MEDSCAPE_FEATURE_UPDATES_STORAGE_KEY);
    if (!rawValue) return cloneMedscapeFeatureUpdates(defaultMedscapeFeatureUpdates);

    return sanitizeMedscapeFeatureUpdates(JSON.parse(rawValue));
  } catch {
    return cloneMedscapeFeatureUpdates(defaultMedscapeFeatureUpdates);
  }
}

export function writeMedscapeFeatureUpdatesToStorage(
  storage: Storage | null | undefined,
  updates: MedscapeFeatureUpdate[],
) {
  if (!storage) return;

  storage.setItem(
    MEDSCAPE_FEATURE_UPDATES_STORAGE_KEY,
    JSON.stringify(sanitizeMedscapeFeatureUpdates(updates)),
  );
}
