import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { verifyToken } from "@/lib/utils/auth";
import User from "@/lib/models/User";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const token = request.cookies.get("auth-token")?.value;
    if (!token)
      return NextResponse.json({ error: "Please log in" }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded || !decoded.userId)
      return NextResponse.json({ error: "Session expired" }, { status: 401 });

    // Added restrictions to the select to check lock status if needed
    const user = await User.findById(decoded.userId).select(
      "wallet restrictions"
    );
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const wallet = user.wallet || {
      balance: 0,
      currency: "USD",
      transactions: [],
    };

    const sortedTransactions = [...(wallet.transactions || [])].sort(
      (a: any, b: any) =>
        new Date(b.date || b.createdAt).getTime() -
        new Date(a.date || a.createdAt).getTime()
    );

    return NextResponse.json({
      success: true,
      data: {
        wallet: { ...wallet, transactions: sortedTransactions },
        transactions: sortedTransactions,
        // Passing restriction status to frontend so UI can adapt
        canWithdraw: user.restrictions?.canWithdraw !== false,
      },
    });
  } catch (error: any) {
    console.error("Wallet Sync Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const token = request.cookies.get("auth-token")?.value;

    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded || !decoded.userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { action, amount, method, address, evidenceUrl } =
      await request.json();

    // Fetch full user to check restrictions and balance
    const user = await User.findById(decoded.userId);

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const numAmount = Number(amount);

    // SECURITY CHECK: Withdrawal Lock
    if (action === "withdraw" || action === "withdrawal") {
      // If restrictions.canWithdraw is explicitly false, block the request
      if (user.restrictions?.canWithdraw === false) {
        return NextResponse.json(
          {
            error:
              "Withdrawal service is temporarily paused for this account. Please contact support.",
          },
          { status: 403 }
        );
      }

      // BALANCE CHECK ONLY (No deduction here as per your requirement)
      if (user.wallet.balance < numAmount) {
        return NextResponse.json(
          { error: "Insufficient Available Balance for this request." },
          { status: 400 }
        );
      }
    }

    const transaction = {
      type: action === "withdrawal" ? "withdraw" : action,
      amount: numAmount,
      method: method || "crypto",
      address: address || "",
      evidenceUrl: String(evidenceUrl || ""),
      date: new Date(),
      status: "pending",
      description:
        action === "deposit"
          ? `Deposit via ${method}`
          : `Withdrawal to ${address.split(":")[0]}`,
    };

    user.wallet.transactions.push(transaction);
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Request submitted for verification",
      data: {
        balance: user.wallet.balance, // Confirmed: No deduction on POST
      },
    });
  } catch (error: any) {
    console.error("Wallet POST Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
