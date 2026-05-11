import { NextRequest, NextResponse } from "next/server";

const DEFAULT_SHARED_PROTOTYPE_PATHS = [
  "/paid-ads-exp",
  "/paid-ads-exp-3",
  "/paid-ads-exp-4",
  "/paid-ads-exp-5",
];

function normalizePath(path: string) {
  if (!path.startsWith("/")) {
    return `/${path}`;
  }

  return path === "/" ? path : path.replace(/\/+$/, "");
}

function parsePrototypePaths(value: string | undefined) {
  return (
    value
      ?.split(",")
      .map((path) => path.trim())
      .filter(Boolean) ?? []
  );
}

const allowedPrototypePaths = Array.from(
  new Set(
    [
      ...DEFAULT_SHARED_PROTOTYPE_PATHS,
      ...parsePrototypePaths(process.env.SHARED_PROTOTYPE_PATH),
      ...parsePrototypePaths(process.env.SHARED_PROTOTYPE_PATHS),
    ].map(normalizePath),
  ),
);

function isProductionRequest() {
  if (process.env.VERCEL_ENV) {
    return process.env.VERCEL_ENV === "production";
  }

  return process.env.NODE_ENV === "production";
}

export function isAllowedProductionPath(pathname: string) {
  return (
    allowedPrototypePaths.some(
      (allowedPath) =>
        pathname === allowedPath || pathname.startsWith(`${allowedPath}/`),
    ) ||
    pathname.startsWith("/ingest/")
  );
}

export function proxy(request: NextRequest) {
  if (!isProductionRequest()) {
    return NextResponse.next();
  }

  if (isAllowedProductionPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  return new NextResponse(null, { status: 404 });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
