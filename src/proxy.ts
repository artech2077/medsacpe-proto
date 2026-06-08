import { NextRequest, NextResponse } from "next/server";

export function isAllowedProductionPath(pathname: string) {
  return pathname.startsWith("/");
}

export function proxy(request: NextRequest) {
  if (isAllowedProductionPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  return new NextResponse(null, { status: 404 });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
