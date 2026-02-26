import { NextResponse, type NextRequest } from "next/server";
import { auth0 } from "./auth0";

// Routes that require authentication
const PROTECTED_ROUTES = ["/wallet", "/success", "/error"];

export async function middleware(request: NextRequest) {
  // First, run the Auth0 middleware to handle session management
  const authResponse = await auth0.middleware(request);

  const { pathname } = request.nextUrl;

  // Check if the current path is a protected route
  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtected) {
    try {
      const session = await auth0.getSession(request, authResponse);

      if (!session) {
        // Not authenticated — redirect to Auth0 login
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("returnTo", pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch {
      // If session check fails, redirect to login
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("returnTo", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return authResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

