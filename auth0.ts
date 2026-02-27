import { Auth0Client } from "@auth0/nextjs-auth0/server";
// Import NextResponse to control redirects/responses in callback handling
import { NextResponse } from "next/server";

// OAuth error codes that mean "silent login cannot continue without user interaction"
const SILENT_LOGIN_ERROR_CODES = new Set([
  "login_required",
  "consent_required",
  "interaction_required",
  "account_selection_required",
]);

// Helper: extract OAuth error code safely from different error shapes
function getOAuthErrorCode(error: unknown): string | undefined {
  if (!error || typeof error !== "object") {
    return undefined;
  }

  // Auth0 SDK may wrap OAuth error inside error.cause.code
  const cause = (error as { cause?: unknown }).cause;
  if (cause && typeof cause === "object") {
    const causeCode = (cause as { code?: unknown }).code;
    if (typeof causeCode === "string") {
      return causeCode;
    }
  }

  // Fallback: sometimes code can be directly on error.code
  const errorCode = (error as { code?: unknown }).code;
  return typeof errorCode === "string" ? errorCode : undefined;
}

// Create one Auth0 client instance for this app (payment frontend)
export const auth0 = new Auth0Client({
  authorizationParameters: {
    // Audience tells Auth0 which API this access token is for
    audience: process.env.AUTH0_AUDIENCE,
    // RE-CHECK: not sure why we use scope here
    // scope: "openid profile email",
  },
  // Custom callback handler: runs after /auth/callback
  onCallback: async (error: unknown, ctx: { returnTo?: string }) => {
    const appBaseUrl = process.env.APP_BASE_URL || "http://payment.lvh.me:3000";
    // Where to send user after auth
    const returnTo = ctx.returnTo || "/";

    // If callback has no error, auth succeeded -> go back to requested page
    if (!error) {
      return NextResponse.redirect(new URL(returnTo, appBaseUrl));
    }

    // If callback failed, check whether it is a known silent-auth failure
    const oauthErrorCode = getOAuthErrorCode(error);
    if (oauthErrorCode && SILENT_LOGIN_ERROR_CODES.has(oauthErrorCode)) {
      // Silent auth failed (no existing SSO / needs interaction) then
      // retry using normal interactive login (without prompt=none)
      const loginUrl = new URL("/auth/login", appBaseUrl);
      loginUrl.searchParams.set("returnTo", returnTo);
      return NextResponse.redirect(loginUrl);
    }

    // For unexpected auth failures, return generic error response
    return new NextResponse("Authentication failed", { status: 500 });
  },
});
