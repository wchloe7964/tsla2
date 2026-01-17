import mongoose, { Schema, Document } from "mongoose";

interface IPortfolioItem {
  stockId: mongoose.Types.ObjectId;
  symbol: string;
  quantity: number;
  averagePrice: number;
  investedAmount: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
  lastUpdated: Date;
}

export interface IPortfolio extends Document {
  userId: mongoose.Types.ObjectId;
  items: IPortfolioItem[];

  // Portfolio summary
  totalInvested: number;
  totalCurrentValue: number;
  totalProfitLoss: number;
  totalProfitLossPercentage: number;

  // Performance metrics
  dailyChange: number;
  dailyChangePercentage: number;
  weeklyChange: number;
  weeklyChangePercentage: number;
  monthlyChange: number;
  monthlyChangePercentage: number;

  // Risk metrics
  volatility: number;
  sharpeRatio: number;
  beta: number;

  // Diversification
  sectorAllocation: Map<string, number>;

  createdAt: Date;
  updatedAt: Date;
}

const PortfolioItemSchema: Schema = new Schema({
  stockId: {
    type: Schema.Types.ObjectId,
    ref: "Stock",
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  averagePrice: {
    type: Number,
    required: true,
    min: 0,
  },
  investedAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  currentValue: {
    type: Number,
    required: true,
    min: 0,
  },
  profitLoss: {
    type: Number,
    required: true,
  },
  profitLossPercentage: {
    type: Number,
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const PortfolioSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [PortfolioItemSchema],

    // Summary
    totalInvested: {
      type: Number,
      default: 0,
    },
    totalCurrentValue: {
      type: Number,
      default: 0,
    },
    totalProfitLoss: {
      type: Number,
      default: 0,
    },
    totalProfitLossPercentage: {
      type: Number,
      default: 0,
    },

    // Performance
    dailyChange: {
      type: Number,
      default: 0,
    },
    dailyChangePercentage: {
      type: Number,
      default: 0,
    },
    weeklyChange: {
      type: Number,
      default: 0,
    },
    weeklyChangePercentage: {
      type: Number,
      default: 0,
    },
    monthlyChange: {
      type: Number,
      default: 0,
    },
    monthlyChangePercentage: {
      type: Number,
      default: 0,
    },

    // Risk metrics
    volatility: {
      type: Number,
      default: 0,
    },
    sharpeRatio: {
      type: Number,
      default: 0,
    },
    beta: {
      type: Number,
      default: 0,
    },

    // Diversification
    sectorAllocation: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
PortfolioSchema.index({ userId: 1 });
PortfolioSchema.index({ "items.stockId": 1 });

PortfolioSchema.pre<IPortfolio>("save", async function () {
  const portfolio = this as any as IPortfolio;

  // Calculate totals
  portfolio.totalInvested = portfolio.items.reduce(
    (sum, item) => sum + item.investedAmount,
    0
  );
  portfolio.totalCurrentValue = portfolio.items.reduce(
    (sum, item) => sum + item.currentValue,
    0
  );
  portfolio.totalProfitLoss =
    portfolio.totalCurrentValue - portfolio.totalInvested;

  portfolio.totalProfitLossPercentage =
    portfolio.totalInvested > 0
      ? (portfolio.totalProfitLoss / portfolio.totalInvested) * 100
      : 0;

  // Calculate sector allocation
  const sectorMap = new Map<string, number>();
  portfolio.items.forEach((item) => {
    const sector = "Technology"; // Placeholder
    const current = sectorMap.get(sector) || 0;
    sectorMap.set(sector, current + item.currentValue);
  });

  // Convert to percentages
  if (portfolio.totalCurrentValue > 0) {
    sectorMap.forEach((value, key) => {
      sectorMap.set(key, (value / portfolio.totalCurrentValue) * 100);
    });
  }

  portfolio.sectorAllocation = sectorMap;

  // No next() call needed in async hooks
});

export default mongoose.models.Portfolio ||
  mongoose.model<IPortfolio>("Portfolio", PortfolioSchema);
