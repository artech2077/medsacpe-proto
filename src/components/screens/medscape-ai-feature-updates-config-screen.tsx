"use client";

import { useState, type ChangeEvent, type ReactNode } from "react";
import { AnalyticsLink } from "@/components/analytics/analytics-link";
import { MedscapeFeatureUpdatesModal } from "@/components/medscape/ai-current/feature-updates-modal";
import { useMedscapeFeatureUpdatesConfig } from "@/components/medscape/ai-current/use-feature-updates-config";
import { ScreenShell } from "@/components/ui/screen-shell";
import { featureUpdatesTriggerPrompt } from "@/data/medscape-feature-updates";

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Unable to read the selected image."));
    };

    reader.onerror = () => {
      reject(new Error("Unable to read the selected image."));
    };

    reader.readAsDataURL(file);
  });
}

function ConfigField({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
        {label}
      </span>
      {children}
    </label>
  );
}

export function MedscapeAiFeatureUpdatesConfigScreen() {
  const { addSlide, removeSlide, resetSlides, updateSlide, updates } =
    useMedscapeFeatureUpdatesConfig();
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});

  const handleImageUpload = async (
    updateId: string,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadErrors((currentErrors) => ({
        ...currentErrors,
        [updateId]: "Please choose an image file.",
      }));
      return;
    }

    try {
      const imageDataUrl = await readFileAsDataUrl(file);
      updateSlide(updateId, "imageUrl", imageDataUrl);
      setUploadErrors((currentErrors) => {
        const nextErrors = { ...currentErrors };
        delete nextErrors[updateId];
        return nextErrors;
      });
    } catch (error) {
      setUploadErrors((currentErrors) => ({
        ...currentErrors,
        [updateId]:
          error instanceof Error ? error.message : "Unable to upload the selected image.",
      }));
    }
  };

  return (
    <ScreenShell
      eyebrow="Prototype Config"
      title="Medscape AI feature updates"
      description={`Edit the popup shown when users click the third landing suggestion: "${featureUpdatesTriggerPrompt}"`}
      actions={
        <>
          <AnalyticsLink
            href="/medscape-ai-current"
            eventName="feature_updates_config_open_landing_clicked"
            eventProperties={{
              destination_route: "/medscape-ai-current",
              screen_type: "feature_updates_config",
            }}
            className="inline-flex items-center rounded-full border border-[rgba(6,74,167,0.16)] bg-white px-4 py-2 text-sm font-semibold text-[var(--mscp-color-brand-primary)] transition hover:bg-[rgba(6,74,167,0.04)]"
          >
            Open landing
          </AnalyticsLink>
          <button
            type="button"
            onClick={resetSlides}
            className="inline-flex items-center rounded-full bg-[var(--mscp-color-brand-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0b5cc9]"
          >
            Reset defaults
          </button>
        </>
      }
    >
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
        <article className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-6 shadow-[var(--shadow-panel)]">
          <div className="flex flex-col gap-2 pb-6">
            <p className="text-sm leading-6 text-[var(--text-secondary)]">
              Changes save automatically in this browser. Upload an image or paste an
              image URL. Leave the image empty to keep the placeholder artwork from the
              prototype.
            </p>
          </div>

          <div className="space-y-5">
            {updates.map((update, index) => (
              <section
                key={update.id}
                className="rounded-[24px] border border-[rgba(16,24,40,0.08)] bg-white p-5"
              >
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                      Update {index + 1}
                    </p>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                      Add another slide to turn the popup into a carousel.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSlide(update.id)}
                    disabled={updates.length === 1}
                    className="inline-flex items-center rounded-full border border-[rgba(16,24,40,0.1)] px-3 py-1.5 text-sm font-semibold text-[var(--text-secondary)] transition hover:border-[rgba(16,24,40,0.18)] hover:bg-[var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Remove
                  </button>
                </div>

                <div className="space-y-4">
                  <ConfigField label="Image">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <label className="inline-flex cursor-pointer items-center rounded-full bg-[var(--mscp-color-brand-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0b5cc9]">
                          Upload image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => void handleImageUpload(update.id, event)}
                            className="sr-only"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => updateSlide(update.id, "imageUrl", "")}
                          className="inline-flex items-center rounded-full border border-[rgba(16,24,40,0.1)] px-3 py-2 text-sm font-semibold text-[var(--text-secondary)] transition hover:border-[rgba(16,24,40,0.18)] hover:bg-[var(--surface-muted)]"
                        >
                          Clear image
                        </button>
                      </div>

                      <input
                        type="url"
                        value={update.imageUrl.startsWith("data:") ? "" : update.imageUrl}
                        onChange={(event) =>
                          updateSlide(update.id, "imageUrl", event.target.value)
                        }
                        placeholder="https://example.com/feature-update.png"
                        className="w-full rounded-[16px] border border-[var(--border-subtle)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[#8cb8f0] focus:ring-4 focus:ring-[rgba(37,99,235,0.12)]"
                      />

                      <p className="text-xs leading-5 text-[var(--text-secondary)]">
                        {update.imageUrl.startsWith("data:")
                          ? "Using an uploaded image saved in this browser."
                          : update.imageUrl
                            ? "Using the pasted image URL."
                            : "No image selected. The popup will show the placeholder artwork."}
                      </p>

                      {uploadErrors[update.id] ? (
                        <p className="text-xs leading-5 text-[#b42318]">
                          {uploadErrors[update.id]}
                        </p>
                      ) : null}
                    </div>
                  </ConfigField>

                  <ConfigField label="Headline">
                    <textarea
                      rows={3}
                      value={update.headline}
                      onChange={(event) =>
                        updateSlide(update.id, "headline", event.target.value)
                      }
                      className="w-full rounded-[16px] border border-[var(--border-subtle)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[#8cb8f0] focus:ring-4 focus:ring-[rgba(37,99,235,0.12)]"
                    />
                  </ConfigField>

                  <ConfigField label="Supporting text">
                    <textarea
                      rows={2}
                      value={update.description}
                      onChange={(event) =>
                        updateSlide(update.id, "description", event.target.value)
                      }
                      className="w-full rounded-[16px] border border-[var(--border-subtle)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[#8cb8f0] focus:ring-4 focus:ring-[rgba(37,99,235,0.12)]"
                    />
                  </ConfigField>
                </div>
              </section>
            ))}
          </div>

          <div className="pt-5">
            <button
              type="button"
              onClick={addSlide}
              className="inline-flex items-center rounded-full border border-dashed border-[rgba(6,74,167,0.28)] bg-[rgba(6,74,167,0.04)] px-5 py-3 text-sm font-semibold text-[var(--mscp-color-brand-primary)] transition hover:bg-[rgba(6,74,167,0.08)]"
            >
              Add another update
            </button>
          </div>
        </article>

        <aside className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-panel)] md:p-6">
          <div className="pb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
              Live preview
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              The landing page uses this same modal component and will show carousel controls
              automatically when more than one update exists.
            </p>
          </div>

          <div className="rounded-[28px] bg-[linear-gradient(180deg,#677182_0%,#556071_100%)] p-3 md:p-5">
            <MedscapeFeatureUpdatesModal
              mode="embedded"
              onClose={() => undefined}
              onContinue={() => undefined}
              updates={updates}
            />
          </div>
        </aside>
      </section>
    </ScreenShell>
  );
}
