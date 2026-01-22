import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { verifyToken } from "@/lib/utils/auth";
import User from "@/lib/models/User";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token)
      return NextResponse.json({ error: "Please log in" }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded)
      return NextResponse.json({ error: "Session expired" }, { status: 401 });

    await connectDB();
    const user = await User.findById(decoded.userId).lean();

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Calculate real numbers from the database
    const activePlans = user.investments || [];
    const moneyInPlans = activePlans.reduce(
      (sum: number, inv: any) => sum + inv.amount,
      0,
    );
    const totalEarnings = activePlans.reduce(
      (sum: number, inv: any) => sum + (inv.returns || 0),
      0,
    );

    // Admin Overrides: Use the values you set in the Admin Panel
    const walletBalance = user.wallet?.balance || 0;

    return NextResponse.json({
      success: true,
      data: {
        portfolio: {
          totalValue: moneyInPlans + totalEarnings,
          totalInvested: moneyInPlans,
          totalProfit: totalEarnings,
          investments: activePlans,
          // We include the wallet balance here so the dashboard can sum it up
          wallet: {
            balance: walletBalance,
          },
        },
      },
    });
  } catch (error) {
    console.error("Portfolio Sync Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
