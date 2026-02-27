import { NextResponse, type NextRequest } from "next/server";
import { auth0 } from "./auth0";

// Routes that require authentication
const PROTECTED_ROUTES = ["/", "/wallet", "/success", "/error"];

function buildLoginUrl(
  request: NextRequest,
  returnTo: string,
  silent: boolean
): URL {
  // Build login URL relative to current app origin (payment.lvh.me:3000).
  const loginUrl = new URL("/auth/login", request.url);

  // After login completes, user should come back to original path.
  loginUrl.searchParams.set("returnTo", returnTo);

  // If silent=true, ask Auth0 to try SSO without showing login UI.
  // prompt=none => "silent auth attempt"
  if (silent) {
    loginUrl.searchParams.set("prompt", "none");
  }
  return loginUrl;
}

export async function middleware(request: NextRequest) {
  // Run Auth0 SDK middleware first.
  // This handles built-in auth routes and session-related cookie logic.
  const authResponse = await auth0.middleware(request);

  const { pathname, search } = request.nextUrl;
  // full path + query so user returns exactly where they started
  const returnTo = `${pathname}${search}`;

  // Check if the current path is a protected route
  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtected) {
    try {
      // Check if user already has a valid local session in payment app
      const session = await auth0.getSession(request, authResponse);

      if (!session) {
        // No local session:
        // Try silent auth first (uses Auth0 SSO session if available)
        return NextResponse.redirect(buildLoginUrl(request, returnTo, true));
      }
    } catch {
      // If session check fails, still try silent auth first.
      return NextResponse.redirect(buildLoginUrl(request, returnTo, true));
    }
  }

  // If route is not protected OR session exists, continue request normally
  return authResponse;
}

export const config = {
  matcher: [
    // Run middleware for almost all routes, except static assets and metadata files
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
