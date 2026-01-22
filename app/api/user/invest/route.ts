// app/api/user/invest/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Investment from "@/lib/models/Investment";
import InvestmentPlan from "@/lib/models/InvestmentPlan";
import User from "@/lib/models/User";
import { getCurrentUser } from "@/lib/utils/auth";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const payload = await getCurrentUser();

    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planId, amount } = await req.json();

    const newInvestment = await Investment.create({
      userId: payload.userId, // Use userId from your lean payload
      planId,
      amount,
      status: "pending",
      requestedAt: new Date(),
    });

    return NextResponse.json({ success: true, data: newInvestment });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Request failed" },
      { status: 500 },
    );
  }
}
