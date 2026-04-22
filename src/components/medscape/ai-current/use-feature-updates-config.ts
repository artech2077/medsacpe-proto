"use client";

import { useSyncExternalStore } from "react";
import {
  createBlankMedscapeFeatureUpdate,
  defaultMedscapeFeatureUpdates,
  cloneMedscapeFeatureUpdates,
  MEDSCAPE_FEATURE_UPDATES_STORAGE_KEY,
  sanitizeMedscapeFeatureUpdates,
  type MedscapeFeatureUpdate,
  writeMedscapeFeatureUpdatesToStorage,
} from "@/data/medscape-feature-updates";

const listeners = new Set<() => void>();
const defaultSnapshot = cloneMedscapeFeatureUpdates(defaultMedscapeFeatureUpdates);
let cachedRawSnapshot: string | null = null;
let cachedClientSnapshot: MedscapeFeatureUpdate[] | null = null;

function emitFeatureUpdatesStoreChange() {
  listeners.forEach((listener) => listener());
}

function subscribeToFeatureUpdatesStore(listener: () => void) {
  listeners.add(listener);

  const handleStorage = (event: StorageEvent) => {
    if (event.key && event.key !== MEDSCAPE_FEATURE_UPDATES_STORAGE_KEY) return;
    listener();
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function getFeatureUpdatesSnapshot() {
  const rawValue = window.localStorage.getItem(MEDSCAPE_FEATURE_UPDATES_STORAGE_KEY);

  if (rawValue === cachedRawSnapshot && cachedClientSnapshot) {
    return cachedClientSnapshot;
  }

  cachedRawSnapshot = rawValue;

  try {
    cachedClientSnapshot = rawValue
      ? sanitizeMedscapeFeatureUpdates(JSON.parse(rawValue))
      : defaultSnapshot;
  } catch {
    cachedClientSnapshot = defaultSnapshot;
  }

  return cachedClientSnapshot;
}

function getFeatureUpdatesServerSnapshot() {
  return defaultSnapshot;
}

export function useMedscapeFeatureUpdatesConfig() {
  const updates = useSyncExternalStore(
    subscribeToFeatureUpdatesStore,
    getFeatureUpdatesSnapshot,
    getFeatureUpdatesServerSnapshot,
  );

  const persistUpdates = (nextUpdates: MedscapeFeatureUpdate[]) => {
    const sanitizedUpdates = sanitizeMedscapeFeatureUpdates(nextUpdates);

    cachedRawSnapshot = JSON.stringify(sanitizedUpdates);
    cachedClientSnapshot = sanitizedUpdates;
    writeMedscapeFeatureUpdatesToStorage(window.localStorage, sanitizedUpdates);
    emitFeatureUpdatesStoreChange();
  };

  const updateSlide = (
    id: string,
    field: keyof Omit<MedscapeFeatureUpdate, "id">,
    value: string,
  ) => {
    persistUpdates(
      updates.map((update) =>
        update.id === id ? { ...update, [field]: value } : update,
      ),
    );
  };

  const addSlide = () => {
    persistUpdates([
      ...updates,
      createBlankMedscapeFeatureUpdate(updates.length),
    ]);
  };

  const removeSlide = (id: string) => {
    if (updates.length === 1) return;

    persistUpdates(updates.filter((update) => update.id !== id));
  };

  const resetSlides = () => {
    persistUpdates(cloneMedscapeFeatureUpdates(defaultMedscapeFeatureUpdates));
  };

  return {
    addSlide,
    removeSlide,
    resetSlides,
    updateSlide,
    updates,
  };
}
