import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import InvestmentPlan from "@/lib/models/InvestmentPlan";
import Investment from "@/lib/models/Investment";
// 1. Import your custom helper
import { getCurrentUser } from "@/lib/utils/auth";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { planId, amount } = await req.json();

    // 2. Use your helper to get the lean JWT payload
    const session = await getCurrentUser();

    // 3. Robust Auth Check: Ensure session AND userId exist
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Now TypeScript knows session.userId exists
    const userId = session.userId;

    const user = await User.findById(userId);
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const plan = await InvestmentPlan.findById(planId);

    // Validation
    if (!plan || !plan.isActive)
      return NextResponse.json({ error: "Invalid Plan" }, { status: 400 });

    if (amount < plan.minAmount)
      return NextResponse.json({ error: "Below minimum" }, { status: 400 });

    // Check wallet balance (matching your User model field)
    const currentBalance = user.wallet?.balance || 0;
    if (currentBalance < amount)
      return NextResponse.json(
        { error: "Insufficient Balance" },
        { status: 400 },
      );

    // 4. Process the Transaction
    user.wallet.balance -= amount;

    // Push a transaction record to the user's ledger for transparency
    user.wallet.transactions.push({
      type: "withdrawal", // or "investment"
      amount: amount,
      description: `Plan Activation: ${plan.name}`,
      status: "completed",
      date: new Date(),
    });

    await user.save();

    // Calculate End Date
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationDays);

    // Create Investment Record
    await Investment.create({
      userId,
      planId: plan._id,
      planName: plan.name,
      amount,
      dailyReturn: plan.dailyReturn,
      endDate: endDate,
      status: "active",
    });

    return NextResponse.json({
      success: true,
      message: "Neural Node Initialized",
      newBalance: user.wallet.balance,
    });
  } catch (error) {
    console.error("Investment Error:", error);
    return NextResponse.json({ error: "Neural Sync Failed" }, { status: 500 });
  }
}
