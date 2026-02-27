import { NextResponse } from "next/server";

// POC local subdomain mapping.
const PAYMENT_BASE_URL = "http://payment.lvh.me:3000";
const PRIMARY_BASE_URL = "http://sa.lvh.me:3001";

export async function GET() {
  // clear payment app session and return to payment home.
  const paymentHomeUrl = new URL("/", PAYMENT_BASE_URL);
  const paymentLogoutUrl = new URL("/auth/logout", PAYMENT_BASE_URL);
  paymentLogoutUrl.searchParams.set("returnTo", paymentHomeUrl.toString());

  // clear sa app session, then continue to payment logout.
  const primaryLogoutUrl = new URL("/auth/logout", PRIMARY_BASE_URL);
  primaryLogoutUrl.searchParams.set("returnTo", paymentLogoutUrl.toString());

  return NextResponse.redirect(primaryLogoutUrl);
}
