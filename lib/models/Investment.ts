import mongoose from "mongoose";

const InvestmentSchema = new mongoose.Schema(
  {
    // FIX: Add 'ref' to String type so .populate() can find the User
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InvestmentPlan",
      required: true,
    },
    amount: { type: Number, required: true },
    dailyReturn: { type: Number, required: true },
    durationDays: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "active", "completed", "declined", "stopped"],
      default: "pending",
    },

    // Administrative Controls
    isManuallyStopped: { type: Boolean, default: false },
    customDurationSet: { type: Boolean, default: false },

    requestedAt: { type: Date, default: Date.now },
    approvedAt: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.models.Investment ||
  mongoose.model("Investment", InvestmentSchema);
