import mongoose from "mongoose";

// This schema tracks individual user stakes in various plans
const InvestmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    planType: {
      type: String,
      required: true,
      enum: ["Tesla", "Neural", "Cyber", "SpaceX"], // Matches your "Matrix" types
    },
    amount: {
      type: Number,
      required: true,
    },
    returns: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "matured", "liquidated"],
      default: "active",
    },
  },
  { timestamps: true },
);

// Prevents recompilation error in Next.js HMR
export default mongoose.models.UserInvestment ||
  mongoose.model("UserInvestment", InvestmentSchema);
