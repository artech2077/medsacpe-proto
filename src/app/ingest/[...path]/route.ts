import { NextRequest, NextResponse } from "next/server";
import { resolvePostHogProxyTarget } from "@/lib/analytics/posthog-hosts";

export const dynamic = "force-dynamic";

const REQUEST_HEADER_ALLOWLIST = [
  "accept",
  "accept-encoding",
  "accept-language",
  "cache-control",
  "content-encoding",
  "content-type",
  "origin",
  "referer",
  "sec-ch-ua",
  "sec-ch-ua-mobile",
  "sec-ch-ua-platform",
  "user-agent",
] as const;

const RESPONSE_HEADER_BLOCKLIST = new Set([
  "connection",
  "content-encoding",
  "content-length",
  "keep-alive",
  "transfer-encoding",
]);

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

function buildForwardedHeaders(request: NextRequest) {
  const headers = new Headers();

  for (const headerName of REQUEST_HEADER_ALLOWLIST) {
    const value = request.headers.get(headerName);

    if (value) {
      headers.set(headerName, value);
    }
  }

  if (!headers.has("accept")) {
    headers.set("accept", "*/*");
  }

  return headers;
}

async function proxyPostHogRequest(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const target = resolvePostHogProxyTarget(
    `/${path.join("/")}`,
    request.nextUrl.search,
  );
  const headers = buildForwardedHeaders(request);
  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: "manual",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  const upstreamResponse = await fetch(target, init);
  const responseHeaders = new Headers();

  upstreamResponse.headers.forEach((value, key) => {
    if (!RESPONSE_HEADER_BLOCKLIST.has(key.toLowerCase())) {
      responseHeaders.set(key, value);
    }
  });

  return new NextResponse(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
}

export const GET = proxyPostHogRequest;
export const HEAD = proxyPostHogRequest;
export const OPTIONS = proxyPostHogRequest;
export const POST = proxyPostHogRequest;
