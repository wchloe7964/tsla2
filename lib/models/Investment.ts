import mongoose from "mongoose";

const InvestmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InvestmentPlan",
      required: true,
    },
    planName: String,
    amount: { type: Number, required: true },
    dailyReturn: { type: Number, required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
    totalEarned: { type: Number, default: 0 },
    lastProfitRedemption: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default mongoose.models.Investment ||
  mongoose.model("Investment", InvestmentSchema);
