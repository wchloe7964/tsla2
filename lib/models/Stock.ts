// lib/models/Stock.js
import mongoose from "mongoose";

const StockSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    shares: {
      type: Number,
      required: true,
      min: 1,
    },
    entryPrice: {
      type: Number,
      required: true,
      min: 0.01,
    },
    allocatedAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index to prevent duplicate allocations for same user and symbol
StockSchema.index({ userId: 1, symbol: 1 }, { unique: true });

export default mongoose.models.Stock || mongoose.model("Stock", StockSchema);
