import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import InvestmentPlan from "@/lib/models/InvestmentPlan";
import Investment from "@/lib/models/Investment";
import { getServerSession } from "next-auth"; // Adjust based on your auth setup

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { planId, amount } = await req.json();

    // 1. Get User from Session (simplified for example)
    const session = await getServerSession();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;
    const user = await User.findById(userId);
    const plan = await InvestmentPlan.findById(planId);

    // 2. Validation
    if (!plan || !plan.isActive)
      return NextResponse.json({ error: "Invalid Plan" }, { status: 400 });
    if (amount < plan.minAmount)
      return NextResponse.json({ error: "Below minimum" }, { status: 400 });
    if (user.balance < amount)
      return NextResponse.json(
        { error: "Insufficient Balance" },
        { status: 400 },
      );

    // 3. Process the "Movement"
    // Deduct from User Balance
    user.balance -= amount;
    await user.save();

    // Calculate End Date
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationDays);

    // Create Investment Record
    const newInvestment = await Investment.create({
      userId,
      planId: plan._id,
      planName: plan.name,
      amount,
      dailyReturn: plan.dailyReturn,
      endDate: endDate,
    });

    return NextResponse.json({
      success: true,
      message: "Node Initialized Successfully",
      newBalance: user.balance,
    });
  } catch (error) {
    console.error("Investment Error:", error);
    return NextResponse.json({ error: "Transaction Failed" }, { status: 500 });
  }
}
