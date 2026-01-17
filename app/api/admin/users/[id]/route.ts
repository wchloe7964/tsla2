import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import mongoose from "mongoose";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
    }

    const { action, value, reason } = body;
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    switch (action) {
      case "FINANCIAL_OVERRIDE": {
        const newBalance = parseFloat(value.balance) || 0;
        const newCost = parseFloat(value.totalCost) || 0;
        const newProfit = parseFloat(value.totalProfitLoss) || 0;

        // --- GHOST TRANSACTION PREVENTION ---
        // We only create a transaction log if the WALLET balance is changing.
        // Changing Profit/Loss or Total Cost shouldn't trigger a "Deposit" log.
        const balanceDiff = newBalance - user.wallet.balance;

        if (balanceDiff !== 0) {
          user.wallet.transactions.push({
            type: balanceDiff > 0 ? "deposit" : "withdrawal",
            amount: Math.abs(balanceDiff),
            method: "wallet",
            status: "completed",
            description: reason || "Administrative Balance Adjustment",
            date: new Date(),
            referenceId: `ADMIN_OVERRIDE_${Date.now()}`,
          });
        }

        // Apply the values
        user.wallet.balance = newBalance;
        user.portfolio.totalCost = newCost;
        user.portfolio.totalProfitLoss = newProfit;

        // Recalculate total value for consistency
        user.portfolio.totalValue = newCost + newProfit;
        user.portfolio.lastUpdated = new Date();
        user.wallet.lastUpdated = new Date();
        break;
      }

      case "UPDATE_KYC":
        user.kycLevel = value; // e.g., 'LEVEL_2' for verified
        if (user.kycData) {
          user.kycData.rejectionReason = reason || "";
        }
        break;

      case "TOGGLE_STATUS":
        user.isActive = value;
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Save the user (Triggers Mongoose pre-save hooks)
    await user.save();

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error: any) {
    console.error("Admin PATCH Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
