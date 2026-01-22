import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Investment from "@/lib/models/Investment";
import User from "@/lib/models/User"; // Required for populate
import InvestmentPlan from "@/lib/models/InvestmentPlan"; // Required for populate

export async function GET() {
  try {
    await connectToDatabase();

    // We must populate 'userId' to get the email
    // and 'planId' to get the plan name
    const investments = await Investment.find({})
      .populate({
        path: "userId",
        select: "email", // Only grab the email for the card
      })
      .populate({
        path: "planId",
        select: "name dailyReturn durationDays",
      })
      .sort({ requestedAt: -1 });

    return NextResponse.json({
      success: true,
      investments: investments || [],
    });
  } catch (error: any) {
    console.error("Fetch Error:", error);
    return NextResponse.json(
      { success: false, investments: [] },
      { status: 500 },
    );
  }
}
