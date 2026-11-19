import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Optimistic page guard: checks the auth cookie's JWT signature and expiry before
 * rendering. No DB calls here; the Express API still authorizes every request.
 */

const COOKIE_NAME = process.env.COOKIE_NAME ?? "dt_token";
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

async function hasValidSession(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token || !process.env.JWT_SECRET) return false;
  try {
    await jwtVerify(token, secret, { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const signedIn = await hasValidSession(request);

  if (pathname === "/login") {
    return signedIn
      ? NextResponse.redirect(new URL("/dashboard", request.url))
      : NextResponse.next();
  }

  if (!signedIn) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") loginUrl.searchParams.set("next", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/") return NextResponse.redirect(new URL("/dashboard", request.url));
  return NextResponse.next();
}

export const config = {
  // Pages only. Never /api (Express handles its own auth) or static assets.
  matcher: ["/", "/login", "/dashboard/:path*", "/doctors/:path*", "/patients/:path*"],
};
