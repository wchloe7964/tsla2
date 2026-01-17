import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/User";

/**
 * GET: Fetch all users or search users with lightweight payload
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Establish robust connection
    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    // 2. Build optimized filter
    let filter = {};
    if (query && query.trim() !== "") {
      filter = {
        $or: [
          { name: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ],
      };
    }

    // 3. Execute Query with strict field selection
    // Selecting only what the table needs prevents header/body bloat
    const users = await User.find(filter)
      .select(
        "name email role balance investedAmount totalProfitLoss kycLevel createdAt"
      )
      .sort({ createdAt: -1 })
      .lean();

    // 4. Return standard success structure
    return NextResponse.json(
      {
        success: true,
        users: users || [],
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0", // Prevent stale admin data
        },
      }
    );
  } catch (error: any) {
    console.error("CRITICAL_API_GET_ERROR:", error.message);

    return NextResponse.json(
      {
        success: false,
        error: "Member directory synchronization failed",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * POST: Manual Administrative Entry
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Safety check for empty body
    const body = await request.json().catch(() => null);

    if (!body || !body.email || !body.name || !body.password) {
      return NextResponse.json(
        {
          success: false,
          error: "Incomplete credentials: Name, Email, and Password required",
        },
        { status: 400 }
      );
    }

    // Create user with sanitized numeric defaults
    const newUser = await User.create({
      ...body,
      balance: Number(body.balance) || 0,
      investedAmount: Number(body.investedAmount) || 0,
      totalProfitLoss: Number(body.totalProfitLoss) || 0,
    });

    // Return user without password
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return NextResponse.json(
      {
        success: true,
        user: userResponse,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("CRITICAL_API_POST_ERROR:", error.message);

    // Handle duplicate email error specifically
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: "Identity conflict: Email already exists in infrastructure",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Manual entry failed",
      },
      { status: 500 }
    );
  }
}
