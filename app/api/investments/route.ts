import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db/mongodb";
import { verifyToken } from "@/lib/utils/auth";
import User from "@/lib/models/User";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    // FIX 1: Explicit check for token existence
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded?.userId)
      return NextResponse.json({ error: "Invalid Session" }, { status: 401 });

    await connectDB();
    const user = await User.findById(decoded.userId)
      .select("investments wallet")
      .lean();

    if (!user)
      return NextResponse.json(
        { error: "Account sync failed" },
        { status: 404 },
      );

    const investments = user.investments || [];

    return NextResponse.json({
      success: true,
      investments: investments,
      data: {
        investments: investments,
        stats: {
          // FIX 2: Explicitly typing the accumulator 'acc' as number
          totalInvested: investments.reduce(
            (acc: number, inv: any) =>
              acc + (inv.status === "active" ? inv.amount : 0),
            0,
          ),
          totalReturns: investments.reduce(
            (acc: number, inv: any) =>
              acc + (inv.status === "active" ? inv.returns || 0 : 0),
            0,
          ),
          balance: user.wallet?.balance || 0,
        },
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, investments: [] });
  }
}

export async function POST(request: NextRequest) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const token = request.cookies.get("auth-token")?.value;

    // FIX 3: Add the safety check for token in POST
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || !decoded.userId) throw new Error("Please log in again");

    const { planType, amount } = await request.json();

    if (!planType || !amount || amount < 100) {
      return NextResponse.json(
        { error: "The minimum to start is $100" },
        { status: 400 },
      );
    }

    await connectDB();
    const user = await User.findById(decoded.userId).session(session);
    if (!user) throw new Error("User not found");

    if (user.wallet.balance < amount) {
      return NextResponse.json(
        { error: "You don't have enough cash in your wallet for this plan." },
        { status: 400 },
      );
    }

    const endDate = new Date();
    const intervals: Record<string, number> = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };
    endDate.setDate(endDate.getDate() + (intervals[planType] || 30));

    const newInvestment = {
      planType,
      amount,
      startDate: new Date(),
      endDate,
      status: "active",
      returns: 0,
    };

    user.wallet.balance -= amount;
    user.investments.push(newInvestment);

    await user.save({ session });
    await session.commitTransaction();

    return NextResponse.json({
      success: true,
      data: { investment: newInvestment, balance: user.wallet.balance },
    });
  } catch (error: any) {
    await session.abortTransaction();
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    session.endSession();
  }
}
