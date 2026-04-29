import { NextRequest, NextResponse } from "next/server";

const DEFAULT_SHARED_PROTOTYPE_PATH = "/paid-ads-exp";
const SHARED_PROTOTYPE_PATH =
  process.env.SHARED_PROTOTYPE_PATH ?? DEFAULT_SHARED_PROTOTYPE_PATH;

function normalizePath(path: string) {
  if (!path.startsWith("/")) {
    return `/${path}`;
  }

  return path === "/" ? path : path.replace(/\/+$/, "");
}

const allowedPrototypePath = normalizePath(SHARED_PROTOTYPE_PATH);

function isProductionRequest() {
  if (process.env.VERCEL_ENV) {
    return process.env.VERCEL_ENV === "production";
  }

  return process.env.NODE_ENV === "production";
}

function isAllowedProductionPath(pathname: string) {
  return (
    pathname === allowedPrototypePath ||
    pathname.startsWith(`${allowedPrototypePath}/`) ||
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
