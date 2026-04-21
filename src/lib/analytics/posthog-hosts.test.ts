import { describe, expect, it } from "vitest";
import {
  resolvePostHogAssetsHost,
  resolvePostHogClientHost,
  resolvePostHogIngestHost,
  resolvePostHogProxyTarget,
  resolvePostHogUiHost,
} from "./posthog-hosts";

describe("posthog host resolution", () => {
  it("defaults the client host to the local proxy", () => {
    expect(resolvePostHogClientHost({})).toBe("/ingest");
  });

  it("prefers an absolute public host for direct PostHog usage", () => {
    expect(
      resolvePostHogIngestHost({
        NEXT_PUBLIC_POSTHOG_HOST: "https://eu.i.posthog.com/",
        POSTHOG_INGEST_HOST: "https://us.i.posthog.com",
      }),
    ).toBe("https://eu.i.posthog.com");
  });

  it("derives the asset host from the ingest region", () => {
    expect(
      resolvePostHogAssetsHost({
        POSTHOG_INGEST_HOST: "https://eu.i.posthog.com/",
      }),
    ).toBe("https://eu-assets.i.posthog.com");
  });

  it("resolves ingest endpoints against the ingest host", () => {
    expect(
      resolvePostHogProxyTarget("/i/v0/e/", "?ip=0", {
        POSTHOG_INGEST_HOST: "https://us.i.posthog.com/",
      }).toString(),
    ).toBe("https://us.i.posthog.com/i/v0/e/?ip=0");
  });

  it("resolves static assets against the asset host", () => {
    expect(
      resolvePostHogProxyTarget("/static/array.js", "", {
        POSTHOG_INGEST_HOST: "https://us.i.posthog.com/",
      }).toString(),
    ).toBe("https://us-assets.i.posthog.com/static/array.js");
  });

  it("falls back to the PostHog UI host", () => {
    expect(resolvePostHogUiHost({})).toBe("https://us.posthog.com");
  });
});
