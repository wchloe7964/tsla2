// lib/models/Investment.ts
import mongoose from "mongoose";

const InvestmentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InvestmentPlan",
      required: true,
    },
    amount: { type: Number, required: true },
    dailyReturn: { type: Number, required: true },
    durationDays: { type: Number, required: true },

    // 1. Ensure 'pending' is lowercase in the enum
    status: {
      type: String,
      enum: ["pending", "active", "completed", "declined"],
      default: "pending",
    },

    requestedAt: { type: Date, default: Date.now },

    // 2. REMOVE 'required: true' from these.
    // They stay empty until the Admin approves the request.
    approvedAt: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.models.Investment ||
  mongoose.model("Investment", InvestmentSchema);
