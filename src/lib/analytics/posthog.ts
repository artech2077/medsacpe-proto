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
import {
  resolvePostHogClientHost,
  resolvePostHogUiHost,
} from "@/lib/analytics/posthog-hosts";

const POSTHOG_KEY =
  process.env.NEXT_PUBLIC_POSTHOG_KEY ??
  process.env.NEXT_PUBLIC_POSTHOG_TOKEN;
const POSTHOG_HOST = resolvePostHogClientHost();
const POSTHOG_UI_HOST = resolvePostHogUiHost();
const POSTHOG_ENABLED = process.env.NEXT_PUBLIC_POSTHOG_ENABLED === "true";
const REPLAY_ENABLED = process.env.NEXT_PUBLIC_POSTHOG_REPLAY_ENABLED === "true";
const RAW_PROMPT_CAPTURE_ENABLED =
  process.env.NEXT_PUBLIC_POSTHOG_CAPTURE_RAW_PROMPTS === "true";
const OPT_OUT_USER_AGENT_FILTER =
  process.env.NEXT_PUBLIC_POSTHOG_OPT_OUT_USERAGENT_FILTER === "true";
const FORCE_SIMPLE_PROXY_TRANSPORT = POSTHOG_HOST === "/ingest";

let hasInitializedPostHog = false;
let hasWarnedAboutMissingConfig = false;

function exposePostHogOnWindow() {
  if (typeof window === "undefined") return;

  (
    window as Window & {
      posthog?: typeof posthog;
    }
  ).posthog = posthog;
}

function ensurePostHogInitialized() {
  if (!isAnalyticsEnabled() || !POSTHOG_KEY) return false;
  if (typeof window === "undefined") return false;
  if (!hasInitializedPostHog) initPostHog();

  return true;
}

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
  if (!POSTHOG_KEY || !POSTHOG_ENABLED) {
    if (
      process.env.NODE_ENV !== "production" &&
      !hasWarnedAboutMissingConfig &&
      (POSTHOG_ENABLED || POSTHOG_KEY)
    ) {
      console.warn(
        "[analytics] PostHog is not fully configured. Set NEXT_PUBLIC_POSTHOG_ENABLED=true and provide NEXT_PUBLIC_POSTHOG_KEY or NEXT_PUBLIC_POSTHOG_TOKEN in your local env file.",
      );
      hasWarnedAboutMissingConfig = true;
    }

    return;
  }

  exposePostHogOnWindow();

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    api_transport: FORCE_SIMPLE_PROXY_TRANSPORT ? "XHR" : undefined,
    ui_host: POSTHOG_UI_HOST,
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
    disable_compression: FORCE_SIMPLE_PROXY_TRANSPORT,
    disable_session_recording: !REPLAY_ENABLED,
    mask_personal_data_properties: true,
    opt_out_useragent_filter: OPT_OUT_USER_AGENT_FILTER,
    person_profiles: "never",
    rageclick: false,
    request_batching: !FORCE_SIMPLE_PROXY_TRANSPORT,
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
      exposePostHogOnWindow();
      hasInitializedPostHog = true;
    },
  });

  hasInitializedPostHog = true;
}

export function captureAnalyticsEvent(
  eventName: string,
  properties: AnalyticsProperties = {},
) {
  if (!ensurePostHogInitialized()) return;

  const payload = buildAnalyticsPayload(eventName, properties, {
    rawPromptCaptureEnabled: isRawPromptCaptureEnabled(),
  });

  posthog.capture(payload.eventName, payload.properties as Properties);
}

export function capturePageView() {
  if (!ensurePostHogInitialized()) return;

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
  if (!ensurePostHogInitialized()) return;

  const payload = buildAnalyticsPayload("client_error_captured", properties, {
    rawPromptCaptureEnabled: isRawPromptCaptureEnabled(),
  });

  posthog.captureException(error, payload.properties as Properties);
  posthog.capture(payload.eventName, payload.properties as Properties);
}

export function getPostHogSessionId() {
  if (!ensurePostHogInitialized()) return undefined;
  return posthog.get_session_id();
}

export function getPostHogFeatureFlag(flagKey: string) {
  if (!ensurePostHogInitialized()) return undefined;
  return posthog.getFeatureFlag(flagKey);
}
