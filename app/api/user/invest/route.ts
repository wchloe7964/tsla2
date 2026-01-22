import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Investment from "@/lib/models/Investment";
import InvestmentPlan from "@/lib/models/InvestmentPlan";
import { getCurrentUser } from "@/lib/utils/auth";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const payload = await getCurrentUser();

    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planId, amount } = await req.json();

    // Fetch the plan to get the ROI/Duration snapshots
    const plan = await InvestmentPlan.findById(planId);
    if (!plan)
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });

    // This data structure now matches the updated Schema
    const newInvestment = await Investment.create({
      userId: payload.userId,
      planId: plan._id,
      amount: Number(amount),
      dailyReturn: plan.dailyReturn,
      durationDays: plan.durationDays,
      status: "pending", // Matches the lowercase enum
    });

    return NextResponse.json({ success: true, data: newInvestment });
  } catch (error: any) {
    console.error("Validation Error:", error.message);
    // This will now send the specific error back to your frontend alert
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
