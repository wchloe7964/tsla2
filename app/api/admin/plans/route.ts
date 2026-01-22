import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import InvestmentPlan from "@/lib/models/InvestmentPlan";

// FETCH ALL PLANS
export async function GET() {
  try {
    await connectToDatabase();
    const plans = await InvestmentPlan.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, plans });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch plans" },
      { status: 500 },
    );
  }
}

// CREATE A NEW PLAN
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const { name, minAmount, maxAmount, dailyReturn, durationDays } = body;

    // Simple validation
    if (!name || !minAmount || !dailyReturn || !durationDays) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const newPlan = await InvestmentPlan.create({
      name,
      minAmount,
      maxAmount: maxAmount || 1000000, // Default high limit if not set
      dailyReturn,
      durationDays,
      isActive: true,
    });

    return NextResponse.json({ success: true, plan: newPlan });
  } catch (error) {
    console.error("Plan Creation Error:", error);
    return NextResponse.json(
      { success: false, error: "Server Error" },
      { status: 500 },
    );
  }
}
