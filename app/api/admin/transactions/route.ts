import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import { verifyToken } from "@/lib/utils/auth";

export const dynamic = "force-dynamic";

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

    const users = await User.find({
      "wallet.transactions.status": "pending",
    }).select("name email wallet.transactions");

    const pendingTransactions = users.flatMap((user: any) => {
      const userObj = user.toObject();
      const transactions = userObj.wallet?.transactions || [];

      return transactions
        .filter((tx: any) => tx.status === "pending")
        .map((tx: any) => ({
          _id: tx._id.toString(),
          type: tx.type,
          amount: tx.amount,
          method: tx.method,
          status: tx.status,
          date: tx.date,
          evidenceUrl: tx.evidenceUrl || tx.evidenceURL || "",
          userId: user._id.toString(),
          userName: user.name,
          userEmail: user.email,
        }));
    });

    pendingTransactions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json({
      success: true,
      transactions: pendingTransactions,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { userId, transactionId, newStatus } = await req.json();
    await connectDB();

    const user = await User.findById(userId);
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const transaction = user.wallet.transactions.id(transactionId);
    if (!transaction || transaction.status !== "pending") {
      return NextResponse.json(
        { error: "Invalid Transaction" },
        { status: 400 }
      );
    }

    if (newStatus === "completed") {
      if (transaction.type === "deposit") {
        user.wallet.balance += transaction.amount;
      } else if (
        transaction.type === "withdraw" ||
        transaction.type === "withdrawal"
      ) {
        if (user.wallet.balance < transaction.amount) {
          return NextResponse.json(
            { error: "Insufficient balance" },
            { status: 400 }
          );
        }
        user.wallet.balance -= transaction.amount;
      }
      transaction.status = "completed";
    } else if (newStatus === "declined") {
      transaction.status = "declined";
    }

    user.wallet.lastUpdated = new Date();
    await user.save();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
