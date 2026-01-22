// app/api/user/investments/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Investment from "@/lib/models/Investment"; // Make sure this model exists!
import InvestmentPlan from "@/lib/models/InvestmentPlan";
import { getCurrentUser } from "@/lib/utils/auth";

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const payload = await getCurrentUser();

    // Check for userId specifically, as defined in your generateToken function
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    // Use payload.userId (String) instead of session.user.id
    const query: any = { userId: payload.userId };
    if (status) {
      query.status = status;
    }

    const investments = await Investment.find(query)
      .populate("planId")
      .sort({ requestedAt: -1 });

    return NextResponse.json({ success: true, investments });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Server Error" },
      { status: 500 },
    );
  }
}
