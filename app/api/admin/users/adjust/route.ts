import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/User";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Safety check: only allow admins (Middleware handles the header)
    if (request.headers.get("x-user-role") !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { userId, balance, totalCost, totalProfitLoss, reason } =
      await request.json();

    const user = await User.findById(userId);
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // 1. Logic for Transaction Logging
    // Only log if the balance actually changed
    if (balance !== user.wallet.balance) {
      const diff = balance - user.wallet.balance;
      user.wallet.transactions.push({
        type: diff > 0 ? "deposit" : "withdraw",
        amount: Math.abs(diff),
        method: "adjustment",
        status: "completed",
        date: new Date(),
        description: `Admin Adjustment: ${reason || "Manual update"}`,
      });
    }

    // 2. Direct Updates
    user.wallet.balance = Number(balance);
    user.portfolio.totalCost = Number(totalCost);
    user.portfolio.totalProfitLoss = Number(totalProfitLoss);
    user.wallet.lastUpdated = new Date();

    await user.save();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
