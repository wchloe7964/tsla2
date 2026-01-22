// app/api/user/plans/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import InvestmentPlan from "@/lib/models/InvestmentPlan"; // Corrected import

export async function GET() {
  try {
    await connectToDatabase();

    // Use isActive to match your schema
    const plans = await InvestmentPlan.find({ isActive: true }).sort({
      minAmount: 1,
    });

    return NextResponse.json({ success: true, plans });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Sync failed" },
      { status: 500 },
    );
  }
}
