import { NextRequest, NextResponse } from "next/server";

// Share deployments set SHARE_ONLY_PATHS to a comma-separated list of the only
// pages they serve (e.g. "/share/mounjaro-update"). Any other page redirects to
// the first one. Unset, every page is reachable (team deployments, local dev).
// The owner unlocks every page once via /owner-access (key in SHARE_OWNER_KEY).
const SHARE_INFRA_PREFIXES = ["/ingest", "/health", "/owner-access"];
export const OWNER_ACCESS_COOKIE = "proto_owner_access";

export function hasOwnerAccess(cookieValue: string | undefined, ownerKey = process.env.SHARE_OWNER_KEY) {
  return Boolean(ownerKey) && cookieValue === ownerKey;
}

function normalizePath(pathname: string) {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

export function parseShareOnlyPaths(value = process.env.SHARE_ONLY_PATHS) {
  return (value ?? "")
    .split(",")
    .map((path) => path.trim())
    .filter((path) => path.startsWith("/"))
    .map(normalizePath);
}

export function isAllowedProductionPath(pathname: string, sharePaths = parseShareOnlyPaths()) {
  if (sharePaths.length === 0) return pathname.startsWith("/");
  const path = normalizePath(pathname);
  return (
    sharePaths.includes(path) ||
    SHARE_INFRA_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))
  );
}

export function proxy(request: NextRequest) {
  const sharePaths = parseShareOnlyPaths();
  if (
    isAllowedProductionPath(request.nextUrl.pathname, sharePaths) ||
    hasOwnerAccess(request.cookies.get(OWNER_ACCESS_COOKIE)?.value)
  ) {
    return NextResponse.next();
  }

  if (sharePaths.length > 0) {
    const url = request.nextUrl.clone();
    url.pathname = sharePaths[0];
    url.search = "";
    return NextResponse.redirect(url);
  }

  return new NextResponse(null, { status: 404 });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
