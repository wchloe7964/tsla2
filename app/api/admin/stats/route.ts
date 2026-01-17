import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/User";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "");

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    const { payload } = await jwtVerify(token || "", JWT_SECRET);
    if (payload.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await connectDB();

    const totalUsers = await User.countDocuments();
    const pendingKyc = await User.countDocuments({ kycLevel: "PENDING" });
    const verifiedUsers = await User.countDocuments({ kycLevel: "LEVEL_2" });

    // Summing up all wallet balances
    const users = await User.find().select("wallet");
    const totalBalance = users.reduce(
      (acc, curr) => acc + (curr.wallet?.balance || 0),
      0
    );

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        pendingKyc,
        verifiedUsers,
        totalBalance: totalBalance.toLocaleString(),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Stats fetch failed" }, { status: 500 });
  }
}
