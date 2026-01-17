import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/utils/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  // 1. FAST BYPASS (Avoid running logic for assets)
  if (
    pathname.startsWith("/_next") ||
    pathname.includes("/static") ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js)$/)
  ) {
    return NextResponse.next();
  }

  const isAdminRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  const isUserRoute = [
    "/portfolio",
    "/investments",
    "/account",
    "/dashboard",
    "/api/wallet",
  ].some((p) => pathname.startsWith(p));

  // 2. PREVENT HEADER BLOAT
  // Check if headers are already set. If so, don't re-inject them.
  if (request.headers.has("x-user-id")) {
    return NextResponse.next();
  }

  if (isAdminRoute || isUserRoute) {
    if (!token) return handleUnauthorized(request, pathname);

    try {
      const payload = await verifyToken(token);
      if (!payload || !payload.userId) {
        return handleUnauthorized(request, pathname, true);
      }

      // Role-Based Access Control
      if (isAdminRoute && payload.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // 3. MINIMAL HEADER INJECTION
      // We only pass the strings. Ensure payload.userId isn't an object.
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", String(payload.userId));
      requestHeaders.set("x-user-role", String(payload.role));

      // Use the modified headers for the current request context
      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      return response;
    } catch (error) {
      return handleUnauthorized(request, pathname, true);
    }
  }

  return NextResponse.next();
}

function handleUnauthorized(
  request: NextRequest,
  pathname: string,
  deleteCookie = false
) {
  const isApiRequest = pathname.startsWith("/api/");
  if (isApiRequest) {
    const response = NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
    if (deleteCookie) response.cookies.delete("auth-token");
    return response;
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("callbackUrl", pathname);
  const response = NextResponse.redirect(loginUrl);
  if (deleteCookie) response.cookies.delete("auth-token");
  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/portfolio/:path*",
    "/investments/:path*",
    "/account/:path*",
    "/dashboard/:path*",
    "/api/wallet/:path*",
  ],
};
