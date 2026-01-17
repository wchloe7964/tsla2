import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/User";

// THIS IS THE FIX: Prevents Next.js from caching the dashboard data
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Ensure we are getting the ID from headers or cookies as per your auth
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Lean() makes it faster, select() prevents the 431 header error
    const user = await User.findById(userId)
      .select("wallet portfolio name isActive investments")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        wallet: {
          balance: user.wallet?.balance || 0,
          transactions: (user.wallet?.transactions || []).slice(-10).reverse(),
        },
        portfolio: {
          totalProfitLoss: user.portfolio?.totalProfitLoss || 0,
          totalCost: user.portfolio?.totalCost || 0,
          // Calculate current total value on the fly
          totalValue:
            (user.portfolio?.totalCost || 0) +
            (user.portfolio?.totalProfitLoss || 0),
          investments: user.investments || [],
        },
        accountStatus: user.isActive,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
