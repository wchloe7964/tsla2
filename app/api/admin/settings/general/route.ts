import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import SiteConfig from "@/lib/models/SiteConfig";
import { getCurrentUser } from "@/lib/utils/auth";

export async function GET() {
  try {
    await connectToDatabase();
    // We only ever need one config document
    let config = await SiteConfig.findOne().lean();
    if (!config) {
      config = await SiteConfig.create({}); // Create default if missing
    }
    return NextResponse.json({ success: true, data: config });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Sync Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser();
    // Ensure the user is an admin (lean JWT check)
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized access node" },
        { status: 401 },
      );
    }

    const body = await req.json();
    await connectToDatabase();

    const updatedConfig = await SiteConfig.findOneAndUpdate(
      {}, // Empty filter finds the first one
      { ...body },
      { new: true, upsert: true },
    );

    return NextResponse.json({ success: true, data: updatedConfig });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Update failed" },
      { status: 500 },
    );
  }
}
