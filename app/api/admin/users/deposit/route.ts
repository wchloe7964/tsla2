import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Role check remains the same
    if (req.headers.get("x-user-role") !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { userId, amount, description, newProfit, newInvested, newBalance } =
      await req.json();

    const user = await User.findById(userId);
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // 1. Direct Balance Override (High Priority)
    if (newBalance !== undefined && newBalance !== null && newBalance !== "") {
      user.wallet.balance = parseFloat(newBalance);
    }
    // 2. Incremental Deposit (Only if override wasn't used)
    else {
      const depositAmount = parseFloat(amount);
      if (!isNaN(depositAmount) && depositAmount > 0) {
        user.wallet.balance += depositAmount;
        user.wallet.transactions.push({
          type: "deposit",
          amount: depositAmount,
          method: "wallet",
          status: "completed",
          date: new Date(),
          description: description || "Network Nodes Sync / Liquidity Top-up",
          referenceId: `TX-${Math.random().toString(36).toUpperCase().slice(2, 10)}`,
        });
      }
    }

    // 3. Portfolio Adjustments (Code A logic)
    if (
      newInvested !== undefined &&
      newInvested !== null &&
      newInvested !== ""
    ) {
      user.portfolio.totalCost = parseFloat(newInvested);
    }
    if (newProfit !== undefined && newProfit !== null && newProfit !== "") {
      user.portfolio.totalProfitLoss = parseFloat(newProfit);
    }

    // Sync Total Portfolio Value
    user.portfolio.totalValue =
      (user.portfolio.totalCost || 0) + (user.portfolio.totalProfitLoss || 0);
    user.portfolio.lastUpdated = new Date();

    await user.save();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
