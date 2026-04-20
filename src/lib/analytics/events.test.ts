import { describe, expect, it } from "vitest";
import { buildAnalyticsPayload, sanitizePostHogProperties } from "./events";

describe("buildAnalyticsPayload", () => {
  it("removes identity fields from custom properties", () => {
    const payload = buildAnalyticsPayload(
      "question_submitted",
      {
        email: "clinician@example.com",
        name: "Clinician",
        question_length: 42,
        tester_id: "abc",
        user_id: "123",
      },
      { rawPromptCaptureEnabled: true },
    );

    expect(payload.properties).not.toHaveProperty("email");
    expect(payload.properties).not.toHaveProperty("name");
    expect(payload.properties).not.toHaveProperty("tester_id");
    expect(payload.properties).not.toHaveProperty("user_id");
    expect(payload.properties.question_length).toBe(42);
  });

  it("gates raw prompt fields behind the raw prompt capture setting", () => {
    const payload = buildAnalyticsPayload(
      "question_submitted",
      {
        question_length: 23,
        question_text: "What dose should I use?",
      },
      { rawPromptCaptureEnabled: false },
    );

    expect(payload.properties).not.toHaveProperty("question_text");
    expect(payload.properties.question_length).toBe(23);
    expect(payload.properties.raw_prompt_capture).toBe(false);
  });

  it("keeps raw prompt fields when raw prompt capture is enabled", () => {
    const payload = buildAnalyticsPayload(
      "question_submitted",
      {
        question_length: 23,
        question_text: "What dose should I use?",
      },
      { rawPromptCaptureEnabled: true },
    );

    expect(payload.properties.question_text).toBe("What dose should I use?");
    expect(payload.properties.raw_prompt_capture).toBe(true);
  });

  it("preserves PostHog distinct_id during before_send sanitization", () => {
    const properties = sanitizePostHogProperties(
      {
        distinct_id: "019d9ced-beb4-77ad-aa44-b9ee95498248",
        email: "clinician@example.com",
        question_length: 23,
      },
      true,
    );

    expect(properties.distinct_id).toBe("019d9ced-beb4-77ad-aa44-b9ee95498248");
    expect(properties).not.toHaveProperty("email");
    expect(properties.question_length).toBe(23);
  });
});
