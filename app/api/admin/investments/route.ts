import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Investment from "@/lib/models/Investment";
import User from "@/lib/models/User";

export async function GET() {
  try {
    await connectToDatabase();

    // Fetch investments and populate user details (name/email)
    const activeNodes = await Investment.find({ status: "active" })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    // Calculate total capital currently locked in nodes
    const stats = await Investment.aggregate([
      { $match: { status: "active" } },
      {
        $group: {
          _id: null,
          totalCapital: { $sum: "$amount" },
          dailyLiability: {
            $sum: {
              $multiply: ["$amount", { $divide: ["$dailyReturn", 100] }],
            },
          },
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: activeNodes,
      summary: stats[0] || { totalCapital: 0, dailyLiability: 0 },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Sync Failed" },
      { status: 500 },
    );
  }
}
