import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import { verifyToken } from "@/lib/utils/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyToken(token);

    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { userId, transactionId, action } = await req.json();
    await connectDB();

    const user = await User.findById(userId);
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const transaction = user.wallet.transactions.id(transactionId);
    if (!transaction)
      return NextResponse.json({ error: "Request not found" }, { status: 404 });

    if (transaction.status !== "pending") {
      return NextResponse.json(
        { error: "Transaction already processed" },
        { status: 400 }
      );
    }

    if (action === "approve") {
      if (transaction.type === "deposit") {
        user.wallet.balance += transaction.amount;
      } else if (
        transaction.type === "withdraw" ||
        transaction.type === "withdrawal"
      ) {
        if (user.wallet.balance < transaction.amount) {
          return NextResponse.json(
            { error: "User has insufficient balance now" },
            { status: 400 }
          );
        }
        user.wallet.balance -= transaction.amount;
      }

      transaction.status = "completed";
    } else if (action === "reject") {
      transaction.status = "declined";
    }

    user.wallet.lastUpdated = new Date();
    await user.save();

    return NextResponse.json({
      success: true,
      message: `Transaction ${action}ed`,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
