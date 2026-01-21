// app/api/admin/settings/wallet/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Settings from "@/lib/models/Settings";

export async function GET() {
  try {
    await connectDB();
    const settings = await Settings.findOne({ key: "admin_config" });

    // If no settings exist yet, return a default object instead of null
    if (!settings) {
      return NextResponse.json({
        success: true,
        settings: { walletAddress: "", network: "" },
      });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    // Ensure we ALWAYS return JSON even on error
    return NextResponse.json(
      { success: false, error: "DB_ERROR" },
      { status: 500 },
    );
  }
}
