// lib/models/InvestmentProduct.ts
import mongoose from "mongoose";

const InvestmentProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  planType: {
    type: String,
    enum: ["daily", "weekly", "monthly", "yearly"],
    required: true,
  },
  minAmount: { type: Number, default: 100 },
  roiPercentage: { type: Number, required: true }, // e.g., 15 for 15%
  durationDays: { type: Number, required: true },
  description: String,
  isActive: { type: Boolean, default: true },
});

export default mongoose.models.InvestmentProduct ||
  mongoose.model("InvestmentProduct", InvestmentProductSchema);
