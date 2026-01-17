import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { verifyToken } from "@/lib/utils/auth";
import InvestmentProduct from "@/lib/models/InvestmentProduct";
import User from "@/lib/models/User";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyToken(token);

    // Check for admin role
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    await connectDB();

    const totalUsers = await User.countDocuments();
    const allUsers = await User.find().select("investments email wallet");

    const globalStats = {
      totalUsers,
      activeInvestmentsCount: allUsers.reduce(
        (acc, u) =>
          acc +
          (u.investments?.filter((i: any) => i.status === "active").length ||
            0),
        0
      ),
      platformLiquidity: allUsers.reduce(
        (acc, u) => acc + (u.wallet?.balance || 0),
        0
      ),
    };

    return NextResponse.json({ success: true, stats: globalStats });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();
    const body = await request.json();

    const newProduct = await InvestmentProduct.create(body);

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
