"use client";

import posthog from "posthog-js";
import type { CaptureResult, Properties } from "posthog-js";
import {
  RAW_PROMPT_CAPTURE_FLAG,
  type AnalyticsProperties,
  buildAnalyticsPayload,
  sanitizePostHogProperties,
  sanitizeTrackedUrl,
} from "@/lib/analytics/events";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";
const POSTHOG_ENABLED = process.env.NEXT_PUBLIC_POSTHOG_ENABLED === "true";
const REPLAY_ENABLED = process.env.NEXT_PUBLIC_POSTHOG_REPLAY_ENABLED === "true";
const RAW_PROMPT_CAPTURE_ENABLED =
  process.env.NEXT_PUBLIC_POSTHOG_CAPTURE_RAW_PROMPTS === "true";

let hasInitializedPostHog = false;

export function isAnalyticsEnabled() {
  return Boolean(POSTHOG_ENABLED && POSTHOG_KEY);
}

export function isRawPromptCaptureEnabled() {
  if (!RAW_PROMPT_CAPTURE_ENABLED) return false;
  if (!hasInitializedPostHog) return true;

  const flagValue = posthog.getFeatureFlag(RAW_PROMPT_CAPTURE_FLAG, {
    send_event: false,
  });

  return flagValue !== false;
}

function sanitizeCaptureResult(event: CaptureResult | null): CaptureResult | null {
  if (!event) return event;

  return {
    ...event,
    properties: sanitizePostHogProperties(
      (event.properties ?? {}) as AnalyticsProperties,
      isRawPromptCaptureEnabled(),
    ) as Properties,
  };
}

export function initPostHog() {
  if (hasInitializedPostHog || typeof window === "undefined") return;
  if (!isAnalyticsEnabled() || !POSTHOG_KEY) return;

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    autocapture: false,
    capture_pageleave: false,
    capture_pageview: false,
    custom_personal_data_properties: [
      "email",
      "name",
      "study_id",
      "tester_id",
      "tester_role",
      "user_id",
    ],
    defaults: "2026-01-30",
    disable_session_recording: !REPLAY_ENABLED,
    mask_personal_data_properties: true,
    person_profiles: "never",
    rageclick: false,
    session_recording: {
      maskAllInputs: false,
      maskInputOptions: {
        email: true,
        password: true,
        search: false,
        tel: true,
        text: false,
        textarea: false,
      },
      recordBody: false,
      recordHeaders: false,
    },
    before_send: (event) => sanitizeCaptureResult(event),
    loaded: () => {
      hasInitializedPostHog = true;
    },
  });
}

export function captureAnalyticsEvent(
  eventName: string,
  properties: AnalyticsProperties = {},
) {
  if (!isAnalyticsEnabled()) return;

  const payload = buildAnalyticsPayload(eventName, properties, {
    rawPromptCaptureEnabled: isRawPromptCaptureEnabled(),
  });

  posthog.capture(payload.eventName, payload.properties as Properties);
}

export function capturePageView() {
  if (!isAnalyticsEnabled() || typeof window === "undefined") return;

  const rawPromptCaptureEnabled = isRawPromptCaptureEnabled();
  const currentUrl = sanitizeTrackedUrl(window.location.href, rawPromptCaptureEnabled);
  const payload = buildAnalyticsPayload(
    "$pageview",
    {
      $current_url: currentUrl,
      $host: window.location.host,
      $pathname: window.location.pathname,
      title: document.title,
    },
    { rawPromptCaptureEnabled },
  );

  posthog.capture(payload.eventName, payload.properties as Properties);
}

export function captureClientError(
  error: unknown,
  properties: AnalyticsProperties = {},
) {
  if (!isAnalyticsEnabled()) return;

  const payload = buildAnalyticsPayload("client_error_captured", properties, {
    rawPromptCaptureEnabled: isRawPromptCaptureEnabled(),
  });

  posthog.captureException(error, payload.properties as Properties);
  posthog.capture(payload.eventName, payload.properties as Properties);
}

export function getPostHogSessionId() {
  if (!isAnalyticsEnabled() || !hasInitializedPostHog) return undefined;
  return posthog.get_session_id();
}

export function getPostHogFeatureFlag(flagKey: string) {
  if (!isAnalyticsEnabled() || !hasInitializedPostHog) return undefined;
  return posthog.getFeatureFlag(flagKey);
}
