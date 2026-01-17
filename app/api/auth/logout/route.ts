import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/utils/auth";

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // 1. Clear the auth cookie using your utility
    clearAuthCookie(response);

    // 2. OPTIONAL: Tell modern browsers to clear all local storage/cache for this site
    // This is a "Nuclear Option" for high-security fintech apps
    // response.headers.set('Clear-Site-Data', '"cookies", "storage"');

    return response;
  } catch (error: any) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, error: "Logout failed" },
      { status: 500 }
    );
  }
}
