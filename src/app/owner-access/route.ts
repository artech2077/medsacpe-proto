import { NextRequest, NextResponse } from "next/server";
import { OWNER_ACCESS_COOKIE, hasOwnerAccess } from "@/proxy";

// Owner unlock for share deployments: submitting SHARE_OWNER_KEY sets a cookie
// that lets this browser reach every page. 404 when no key is configured.
function page(message = "", status = 200) {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Owner access</title>
<style>body{font-family:system-ui,sans-serif;background:#f8fafc;color:#161b1d;display:grid;place-items:center;min-height:100vh;margin:0;padding:16px}form{background:#fff;border:1px solid #e3eaf2;border-radius:14px;padding:24px;width:100%;max-width:340px}h1{font-size:18px;margin:0 0 12px}input,button{width:100%;box-sizing:border-box;font-size:16px;padding:10px 12px;border-radius:10px}input{border:1px solid #c5ced3;margin-bottom:12px}button{border:0;background:#064aa7;color:#fff;font-weight:700;cursor:pointer}p{color:#b42318;font-size:14px;margin:0 0 12px}</style></head>
<body><form method="post"><h1>Owner access</h1>${message ? `<p>${message}</p>` : ""}<label for="key" style="display:block;font-size:14px;margin-bottom:6px">Access key</label><input id="key" name="key" type="password" autocomplete="current-password" required autofocus><button type="submit">Unlock all pages</button></form></body></html>`;
  return new NextResponse(html, { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
}

export function GET() {
  if (!process.env.SHARE_OWNER_KEY) return new NextResponse(null, { status: 404 });
  return page();
}

export async function POST(request: NextRequest) {
  if (!process.env.SHARE_OWNER_KEY) return new NextResponse(null, { status: 404 });
  const key = String((await request.formData()).get("key") ?? "");
  if (!hasOwnerAccess(key)) return page("That key is not correct.", 401);

  const response = NextResponse.redirect(new URL("/", request.url), 303);
  response.cookies.set(OWNER_ACCESS_COOKIE, key, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 180,
    path: "/",
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
  });
  return response;
}
