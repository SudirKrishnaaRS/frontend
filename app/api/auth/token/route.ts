import { NextResponse } from "next/server";
import { auth0 } from "@/auth0";

export async function GET() {
  try {
    const { token } = await auth0.getAccessToken();
    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve access token" },
      { status: 401 }
    );
  }
}
