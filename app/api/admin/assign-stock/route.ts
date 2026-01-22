import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Stock from "@/lib/models/Stock";
import User from "@/lib/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { userId, symbol, shares, priceAtAllocation } = await req.json();

    // 1. Basic Validation
    if (!userId || !symbol || Number(shares) <= 0) {
      return NextResponse.json(
        { error: "Invalid allocation data" },
        { status: 400 },
      );
    }

    // 2. The Upsert Operation
    // This looks for a match on userId + symbol.
    // If found: Increases shares. If not: Creates new document.
    const result = await Stock.findOneAndUpdate(
      {
        userId: userId,
        symbol: symbol.toUpperCase().trim(),
      },
      {
        $inc: { shares: Number(shares) },
        $set: {
          entryPrice: Number(priceAtAllocation),
          updatedAt: new Date(),
        },
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      },
    );

    return NextResponse.json({
      success: true,
      message: `Registry updated: ${symbol} allocation confirmed.`,
      data: result,
    });
  } catch (error: any) {
    console.error("UPSERT_ERROR:", error);
    // Handle MongoDB unique index or validation errors
    const message =
      error.code === 11000
        ? "Duplicate entry detected"
        : "Database write failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
