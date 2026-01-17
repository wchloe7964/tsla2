import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/User";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "");

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Security Check: Ensure only admins can access this
    if (payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId, action, reason } = await req.json(); // action: 'APPROVE' or 'REJECT'

    await connectDB();

    if (action === "APPROVE") {
      await User.findByIdAndUpdate(userId, {
        kycLevel: "LEVEL_2",
        "kycData.rejectionReason": null,
      });
    } else {
      await User.findByIdAndUpdate(userId, {
        kycLevel: "REJECTED",
        "kycData.rejectionReason":
          reason || "Documents were unclear or invalid.",
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Review failed" }, { status: 500 });
  }
}
