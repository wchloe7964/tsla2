import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import { verifyToken, generateToken } from "@/lib/utils/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No session" },
        { status: 401 }
      );
    }

    // 1. Verify Token (using your existing util)
    const payload = await verifyToken(token);

    if (!payload || !payload.userId) {
      return NextResponse.json(
        { success: false, error: "Invalid Session" },
        { status: 401 }
      );
    }

    // 2. Database Connection
    await connectDB();

    // 3. Fetch User
    const user = await User.findById(payload.userId)
      .select("-password +twoFactorSecret")
      .lean();

    if (!user) {
      const response = NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
      response.cookies.delete("auth-token");
      return response;
    }

    // 4. Construct response using correct nested mapping
    const responseBody = {
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        // Mapping from your Wallet and Portfolio sub-documents
        balance: user.wallet?.balance || 0,
        portfolioValue: user.portfolio?.totalValue || 0,
        totalProfitLoss: user.portfolio?.totalProfitLoss || 0,
        wallet: user.wallet || {},
        portfolio: user.portfolio || {},
        preferences: user.preferences || {},
        kycLevel: user.kycLevel || "LEVEL_1",
        kycData: user.kycData || {},
        twoFactorEnabled: !!user.twoFactorEnabled,
      },
    };

    const response = NextResponse.json(responseBody);

    // 5. Refresh JWT (Sliding Session)
    // FIXED: Use the 'user' object AFTER it's fetched from DB
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
      { status: 401 }
    );

    // Clear cookie if token is dead
    if (error.code === "ERR_JWT_EXPIRED" || error.code === "ERR_JWS_INVALID") {
      errorResponse.cookies.delete("auth-token");
    }

    return errorResponse;
  }
}
