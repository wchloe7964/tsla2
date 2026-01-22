import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import UserInvestment from "@/lib/models/Investment";

export async function GET() {
  try {
    await connectToDatabase();

    // Fetch the 5 most recent investment activities
    // We populate 'userId' if you have a relation, or just use the raw data
    const activities = await UserInvestment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const formattedActivities = activities.map((act: any) => ({
      id: act._id,
      type: "Investment Allocation",
      planName: act.planType,
      amount: act.amount,
      user: act.userId.toString().slice(-4), // Showing last 4 digits for "Security" feel
      timestamp: act.createdAt,
    }));

    return NextResponse.json({ success: true, data: formattedActivities });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Activity Stream Offline" },
      { status: 500 },
    );
  }
}
