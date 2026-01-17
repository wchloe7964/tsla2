import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import { verifyToken } from "@/lib/utils/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const users = await User.find({}, "name email wallet.transactions");

    let history: any[] = [];
    users.forEach((user) => {
      user.wallet.transactions.forEach((tx: any) => {
        if (tx.status !== "pending") {
          history.push({
            ...tx.toObject(),
            userName: user.name,
            userEmail: user.email,
            userId: user._id,
          });
        }
      });
    });

    history.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json({ success: true, history });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}
