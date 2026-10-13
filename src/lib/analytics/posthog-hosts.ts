const DEFAULT_POSTHOG_INGEST_HOST = "https://us.i.posthog.com";
const DEFAULT_POSTHOG_UI_HOST = "https://us.posthog.com";
const LOCAL_POSTHOG_PROXY_PATH = "/ingest";

type PostHogEnv = Record<string, string | undefined> & {
  NEXT_PUBLIC_POSTHOG_HOST?: string;
  NEXT_PUBLIC_POSTHOG_UI_HOST?: string;
  POSTHOG_ASSETS_HOST?: string;
  POSTHOG_INGEST_HOST?: string;
};

function trimTrailingSlash(value: string) {
  return value.replace(/\/$/, "");
}

function isAbsoluteUrl(value?: string) {
  return Boolean(value && /^https?:\/\//.test(value));
}

export function resolvePostHogClientHost(env: PostHogEnv = process.env) {
  return env.NEXT_PUBLIC_POSTHOG_HOST ?? LOCAL_POSTHOG_PROXY_PATH;
}

export function resolvePostHogUiHost(env: PostHogEnv = process.env) {
  return trimTrailingSlash(env.NEXT_PUBLIC_POSTHOG_UI_HOST ?? DEFAULT_POSTHOG_UI_HOST);
}

export function resolvePostHogIngestHost(env: PostHogEnv = process.env) {
  const host =
    env.NEXT_PUBLIC_POSTHOG_HOST && isAbsoluteUrl(env.NEXT_PUBLIC_POSTHOG_HOST)
      ? env.NEXT_PUBLIC_POSTHOG_HOST
    : env.POSTHOG_INGEST_HOST ?? DEFAULT_POSTHOG_INGEST_HOST;

  return trimTrailingSlash(host);
}

export function resolvePostHogAssetsHost(env: PostHogEnv = process.env) {
  if (env.POSTHOG_ASSETS_HOST) {
    return trimTrailingSlash(env.POSTHOG_ASSETS_HOST);
  }

  const ingestHost = resolvePostHogIngestHost(env);

  if (ingestHost.includes("us.i.posthog.com")) {
    return "https://us-assets.i.posthog.com";
  }

  if (ingestHost.includes("eu.i.posthog.com")) {
    return "https://eu-assets.i.posthog.com";
  }

  return ingestHost;
}

// Endpoints posthog-js calls from the browser. Everything else (e.g. /api/projects)
// is refused so the proxy cannot be used as a general relay to PostHog.
const POSTHOG_PROXY_ALLOWED_PREFIXES = [
  "/e",
  "/i/v0/e",
  "/capture",
  "/batch",
  "/engage",
  "/decide",
  "/flags",
  "/s",
  "/static",
  "/array",
  "/api/surveys",
  "/api/web_experiments",
  "/api/product_tours",
  "/api/early_access_features",
];

export function isAllowedPostHogProxyPath(pathname: string) {
  return POSTHOG_PROXY_ALLOWED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function resolvePostHogProxyTarget(
  path: string,
  search = "",
  env: PostHogEnv = process.env,
) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const baseHost =
    normalizedPath.startsWith("/static/") || normalizedPath.startsWith("/array/")
      ? resolvePostHogAssetsHost(env)
      : resolvePostHogIngestHost(env);

  const target = new URL(`${baseHost}${normalizedPath}${search}`);

  // Check the normalized pathname so dot segments cannot slip past the allowlist.
  if (!isAllowedPostHogProxyPath(target.pathname)) {
    throw new Error("PostHog proxy path is not allowed");
  }

  return target;
}

export { LOCAL_POSTHOG_PROXY_PATH };
