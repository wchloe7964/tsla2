import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/db/mongodb";
import Investment from "@/lib/models/Investment";
import User from "@/lib/models/User";
import { getCurrentUser } from "@/lib/utils/auth";

export async function PATCH(req: Request) {
  try {
    await connectToDatabase();

    // 1. Admin Security Check
    const payload = await getCurrentUser();
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Access Denied" }, { status: 403 });
    }

    const { investmentId } = await req.json();

    // 2. Find the Pending Investment
    const inv = await Investment.findById(investmentId).populate("planId");
    if (!inv || inv.status !== "pending") {
      return NextResponse.json(
        { error: "Invalid or already processed request" },
        { status: 400 },
      );
    }

    // 3. Find the User
    const user = await User.findById(inv.userId);
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // 4. Validate Balance
    if (user.wallet.balance < inv.amount) {
      return NextResponse.json(
        { error: "User has insufficient balance for this node" },
        { status: 400 },
      );
    }

    // 5. Atomic Update (Deduct & Activate)
    // We use a transaction or manual sequential updates
    user.wallet.balance -= inv.amount;
    inv.status = "active";
    inv.startDate = new Date();
    // Calculate end date based on plan duration
    inv.endDate = new Date(
      Date.now() + inv.planId.durationDays * 24 * 60 * 60 * 1000,
    );

    await user.save();
    await inv.save();

    return NextResponse.json({
      success: true,
      message: `Node activated. Balance deducted from ${user.email}`,
    });
  } catch (error: any) {
    console.error("Approval Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
