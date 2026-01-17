import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import AuditLog from "@/lib/models/AuditLog";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "");

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    // 1. Identify the Admin
    const token = req.cookies.get("auth-token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { payload } = await jwtVerify(token, JWT_SECRET);

    const { userId, status, reason } = await req.json();

    // 2. Fetch User and Admin data for the log
    const [targetUser, adminUser] = await Promise.all([
      User.findById(userId),
      User.findById(payload.userId),
    ]);

    if (!targetUser) throw new Error("User not found");

    const previousStatus = targetUser.kycLevel;

    // 3. Perform the Update
    const setFields: any = { kycLevel: status };
    if (status === "REJECTED") {
      setFields["kycData.rejectionReason"] = reason;
    } else {
      setFields["kycData.rejectionReason"] = null;
    }

    await User.findByIdAndUpdate(userId, { $set: setFields });

    // 4. Create the Audit Log entry
    await AuditLog.create({
      adminId: adminUser._id,
      adminName: adminUser.name,
      targetUserId: targetUser._id,
      targetUserName: targetUser.name,
      action: status === "LEVEL_2" ? "KYC_APPROVE" : "KYC_REJECT",
      details: {
        reason: reason || "No reason specified",
        previousStatus,
        newStatus: status,
      },
      ipAddress: req.headers.get("x-forwarded-for") || "0.0.0.0",
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("KYC_DECISION_ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
