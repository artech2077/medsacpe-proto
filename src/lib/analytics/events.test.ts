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

  it("fills campaign properties from route when explicit UTM properties are missing", () => {
    const properties = sanitizePostHogProperties(
      {
        route:
          "/paid-ads-exp/chat?source=workspace_card&utm_source=test_source&utm_medium=test_medium&utm_campaign=test_campaign",
      },
      true,
    );

    expect(properties.utm_source).toBe("test_source");
    expect(properties.utm_medium).toBe("test_medium");
    expect(properties.utm_campaign).toBe("test_campaign");
  });

  it("fills campaign properties from the duplicated paid ads route", () => {
    const properties = sanitizePostHogProperties(
      {
        route:
          "/paid-ads-exp-2/chat?source=workspace_card&utm_source=test_source&utm_medium=test_medium&utm_campaign=test_campaign",
      },
      true,
    );

    expect(properties.utm_source).toBe("test_source");
    expect(properties.utm_medium).toBe("test_medium");
    expect(properties.utm_campaign).toBe("test_campaign");
  });

  it("keeps explicit campaign properties when route also has UTM properties", () => {
    const payload = buildAnalyticsPayload(
      "paid_ads_landing_viewed",
      {
        route:
          "/paid-ads-exp/chat?utm_source=route_source&utm_medium=route_medium&utm_campaign=route_campaign",
        utm_campaign: "explicit_campaign",
        utm_medium: "explicit_medium",
        utm_source: "explicit_source",
      },
      { rawPromptCaptureEnabled: true },
    );

    expect(payload.properties.utm_source).toBe("explicit_source");
    expect(payload.properties.utm_medium).toBe("explicit_medium");
    expect(payload.properties.utm_campaign).toBe("explicit_campaign");
  });
});
