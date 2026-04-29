export const RAW_PROMPT_CAPTURE_FLAG = "analytics_raw_prompt_capture_enabled";

export type AnalyticsPrimitive = string | number | boolean | null | undefined;
export type AnalyticsProperties = Record<string, AnalyticsPrimitive>;

export type AnalyticsPayloadOptions = {
  rawPromptCaptureEnabled: boolean;
};

const FORBIDDEN_IDENTITY_KEYS = new Set([
  "$email",
  "$name",
  "email",
  "name",
  "study_id",
  "tester_id",
  "tester_role",
  "user_id",
]);

const RAW_PROMPT_KEYS = new Set([
  "follow_up_text",
  "prompt_text",
  "question_text",
]);

const PERSONAL_URL_PARAMS = new Set([
  "email",
  "name",
  "study_id",
  "tester_id",
  "tester_role",
  "user_id",
]);

const PROMPT_URL_PARAMS = new Set(["q", "question", "prompt"]);
const CAMPAIGN_URL_PARAMS = ["utm_source", "utm_medium", "utm_campaign"] as const;

function stripForbiddenProperties(
  properties: AnalyticsProperties,
  rawPromptCaptureEnabled: boolean,
) {
  const safeProperties: AnalyticsProperties = {};

  for (const [key, value] of Object.entries(properties)) {
    if (FORBIDDEN_IDENTITY_KEYS.has(key)) continue;
    if (!rawPromptCaptureEnabled && RAW_PROMPT_KEYS.has(key)) continue;
    if (value === undefined) continue;

    safeProperties[key] = value;
  }

  return safeProperties;
}

export function sanitizeTrackedUrl(
  url: string | undefined,
  rawPromptCaptureEnabled: boolean,
) {
  if (!url) return undefined;

  try {
    const parsedUrl = new URL(url, "https://medscape-ai.local");
    const paramsToRemove = new Set(PERSONAL_URL_PARAMS);

    if (!rawPromptCaptureEnabled) {
      for (const param of PROMPT_URL_PARAMS) {
        paramsToRemove.add(param);
      }
    }

    for (const param of paramsToRemove) {
      parsedUrl.searchParams.delete(param);
    }

    if (url.startsWith("http")) {
      return parsedUrl.toString();
    }

    return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
  } catch {
    return url;
  }
}

export function getDeviceType(width: number) {
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

export function getQuestionLengthBucket(length: number) {
  if (length <= 0) return "empty";
  if (length <= 10) return "1-10";
  if (length <= 50) return "11-50";
  if (length <= 100) return "51-100";
  if (length <= 250) return "101-250";
  return "251+";
}

function readUrlParam(url: string | undefined, paramName: string) {
  if (!url) return undefined;

  try {
    const parsedUrl = new URL(url, "https://medscape-ai.local");
    return parsedUrl.searchParams.get(paramName) ?? undefined;
  } catch {
    return undefined;
  }
}

function fillCampaignPropertiesFromUrl(
  properties: AnalyticsProperties,
  candidateUrls: Array<string | undefined>,
) {
  const nextProperties = { ...properties };

  for (const paramName of CAMPAIGN_URL_PARAMS) {
    if (nextProperties[paramName]) continue;

    for (const candidateUrl of candidateUrls) {
      const value = readUrlParam(candidateUrl, paramName);
      if (!value) continue;

      nextProperties[paramName] = value;
      break;
    }
  }

  return nextProperties;
}

export function createAnalyticsId(prefix: string) {
  const randomPart =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return `${prefix}_${randomPart}`;
}

export function getBrowserAnalyticsProperties(
  rawPromptCaptureEnabled: boolean,
): AnalyticsProperties {
  if (typeof window === "undefined") {
    return {
      app_environment: process.env.NODE_ENV ?? "development",
      app_version: process.env.NEXT_PUBLIC_APP_VERSION ?? "local",
      is_authenticated: false,
      raw_prompt_capture: rawPromptCaptureEnabled,
    };
  }

  const route = `${window.location.pathname}${window.location.search}`;
  const searchParams = new URLSearchParams(window.location.search);

  return fillCampaignPropertiesFromUrl(
    {
    app_environment: process.env.NODE_ENV ?? "development",
    app_version:
      process.env.NEXT_PUBLIC_APP_VERSION ??
      process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ??
      "local",
    device_type: getDeviceType(window.innerWidth),
    is_authenticated: false,
    pathname: window.location.pathname,
    raw_prompt_capture: rawPromptCaptureEnabled,
    referrer: sanitizeTrackedUrl(document.referrer, rawPromptCaptureEnabled),
    route: sanitizeTrackedUrl(route, rawPromptCaptureEnabled),
    utm_campaign: searchParams.get("utm_campaign"),
    utm_medium: searchParams.get("utm_medium"),
    utm_source: searchParams.get("utm_source"),
    viewport_height: window.innerHeight,
    viewport_width: window.innerWidth,
    },
    [window.location.href, route],
  );
}

export function buildAnalyticsPayload(
  eventName: string,
  properties: AnalyticsProperties = {},
  options: AnalyticsPayloadOptions,
) {
  const mergedProperties: AnalyticsProperties = {
    ...getBrowserAnalyticsProperties(options.rawPromptCaptureEnabled),
    ...properties,
    is_authenticated: false,
    raw_prompt_capture: options.rawPromptCaptureEnabled,
  };

  const propertiesWithCampaign = fillCampaignPropertiesFromUrl(mergedProperties, [
    typeof mergedProperties["$current_url"] === "string"
      ? mergedProperties["$current_url"]
      : undefined,
    typeof mergedProperties["route"] === "string" ? mergedProperties["route"] : undefined,
  ]);

  return {
    eventName,
    properties: stripForbiddenProperties(
      propertiesWithCampaign,
      options.rawPromptCaptureEnabled,
    ),
  };
}

export function sanitizePostHogProperties(
  properties: AnalyticsProperties,
  rawPromptCaptureEnabled: boolean,
) {
  const sanitized = stripForbiddenProperties(properties, rawPromptCaptureEnabled);

  for (const urlKey of ["$current_url", "$referrer", "route", "referrer"]) {
    const value = sanitized[urlKey];
    if (typeof value === "string") {
      sanitized[urlKey] = sanitizeTrackedUrl(value, rawPromptCaptureEnabled);
    }
  }

  const withCampaignProperties = fillCampaignPropertiesFromUrl(sanitized, [
    typeof sanitized["$current_url"] === "string" ? sanitized["$current_url"] : undefined,
    typeof sanitized["route"] === "string" ? sanitized["route"] : undefined,
  ]);

  withCampaignProperties.is_authenticated = false;
  withCampaignProperties.raw_prompt_capture = rawPromptCaptureEnabled;

  return withCampaignProperties;
}
