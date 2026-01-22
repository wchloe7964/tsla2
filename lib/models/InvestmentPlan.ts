import mongoose from "mongoose";

const InvestmentPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., "Model S Growth"
    tier: {
      type: String,
      enum: ["Standard", "Premium", "Enterprise"],
      default: "Standard",
    },
    minAmount: { type: Number, required: true },
    maxAmount: { type: Number, required: true },
    dailyReturn: { type: Number, required: true }, // e.g., 2.5 for 2.5%
    durationDays: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.InvestmentPlan ||
  mongoose.model("InvestmentPlan", InvestmentPlanSchema);
