import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    if (req.headers.get("x-user-role") !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { userId, amount, description, newProfit, newInvested, newBalance } =
      await req.json();

    const user = await User.findById(userId);
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // 1. Direct Balance Override
    if (newBalance !== undefined && newBalance !== null && newBalance !== "") {
      user.wallet.balance = parseFloat(newBalance);
    }
    // 2. Incremental Debit
    else {
      const debitAmount = parseFloat(amount);
      if (!isNaN(debitAmount) && debitAmount > 0) {
        // Optional: Admin bypasses insufficient funds check?
        // We allow it here so admins can fix negative balances if needed
        user.wallet.balance -= debitAmount;
        user.wallet.transactions.push({
          type: "withdraw",
          amount: debitAmount,
          method: "wallet",
          status: "completed",
          date: new Date(),
          description:
            description || "Account Maintenance / Clearing Settlement",
          referenceId: `TX-${Math.random().toString(36).toUpperCase().slice(2, 10)}`,
        });
      }
    }

    // 3. Portfolio Adjustments
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
