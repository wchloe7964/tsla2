import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/User";
// Import the Stock model so we can calculate the real-time sum if needed
import Stock from "@/lib/models/Stock";
import { verifyToken, generateToken } from "@/lib/utils/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No session" },
        { status: 401 },
      );
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json(
        { success: false, error: "Invalid Session" },
        { status: 401 },
      );
    }

    await connectDB();

    // 1. Fetch User (excluding the heavy nested arrays now handled by Stock.ts)
    const user = await User.findById(payload.userId)
      .select("-password +twoFactorSecret")
      .lean();

    if (!user) {
      const response = NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
      response.cookies.delete("auth-token");
      return response;
    }

    // 2. Fetch User's Stocks separately to calculate total value
    // This keeps the User object light while still providing basic stats to the header/nav
    const userStocks = await Stock.find({ userId: user._id }).lean();
    const portfolioValue = userStocks.reduce(
      (sum, s) => sum + s.shares * s.entryPrice,
      0,
    );

    // 3. Construct response
    const responseBody = {
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        balance: user.wallet?.balance || 0,
        // Using the calculated value from our separate Stock model
        portfolioValue: portfolioValue,
        kycLevel: user.kycLevel || "LEVEL_1",
        twoFactorEnabled: !!user.twoFactorEnabled,
        preferences: user.preferences || {},
      },
    };

    const response = NextResponse.json(responseBody);

    // 4. Refresh JWT (Sliding Session)
    const refreshedToken = await generateToken(user._id.toString(), user.role);

    response.cookies.set({
      name: "auth-token",
      value: refreshedToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Session validation error:", error.message);
    const errorResponse = NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );

    if (error.code === "ERR_JWT_EXPIRED" || error.name === "JWTExpired") {
      errorResponse.cookies.delete("auth-token");
    }

    return errorResponse;
  }
}
