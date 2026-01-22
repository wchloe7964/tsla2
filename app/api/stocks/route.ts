import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Stock from "@/lib/models/Stock";
// 1. Import your custom helper instead of NextAuth
import { getCurrentUser } from "@/lib/utils/auth";

export async function GET() {
  try {
    await connectToDatabase();

    // 2. Use your helper to get the lean JWT payload
    const session = await getCurrentUser();

    // Check if session exists and has the userId (from your generateToken function)
    if (!session || !session.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: No valid session found" },
        { status: 401 },
      );
    }

    // 3. Filter by the userId stored in your custom JWT
    const partnerStocks = await Stock.find({ userId: session.userId }).lean();

    const formattedStocks = partnerStocks.map((s: any) => ({
      _id: s._id.toString(),
      symbol: s.symbol,
      name: s.symbol === "TSLA" ? "Tesla, Inc." : "Equity Node",
      price: s.entryPrice || 0,
      shares: s.shares || 0,
      changePercent: 0,
    }));

    return NextResponse.json({
      success: true,
      data: { stocks: formattedStocks },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Neural Sync Failed" },
      { status: 500 },
    );
  }
}
