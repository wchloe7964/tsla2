import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

// --- TYPESCRIPT INTERFACE ---
// This tells TypeScript exactly what a User Document looks like
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin" | "moderator" | "analyst";
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  portfolio: {
    stocks: any[];
    totalValue: number;
    totalCost: number;
    totalProfitLoss: number;
  };
  // Declare the custom method here
  runPortfolioCalcs: () => void;
  comparePassword: (candidate: string) => Promise<boolean>;
}

// Interface for Static Methods
interface IUserModel extends Model<IUser> {
  findByEmailWithPassword: (
    email: string,
  ) => mongoose.Query<IUser | null, IUser>;
}

const UserSchema = new mongoose.Schema(
  {
    investments: [
      {
        planType: {
          type: String,
          enum: ["daily", "weekly", "monthly", "yearly"],
        },
        amount: { type: Number, required: true },
        startDate: { type: Date, default: Date.now },
        endDate: { type: Date },
        status: {
          type: String,
          enum: ["active", "completed", "cancelled"],
          default: "active",
        },
        restrictions: {
          canWithdraw: { type: Boolean, default: true },
          isFrozen: { type: Boolean, default: false },
        },
        returns: { type: Number, default: 0 },
        image: String,
      },
    ],
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
      select: false,
    },
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "" },
    role: {
      type: String,
      enum: ["user", "admin", "moderator", "analyst"],
      default: "user",
    },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String, select: false },
    recoveryKeys: { type: [String], select: false },
    kycLevel: {
      type: String,
      enum: ["LEVEL_1", "PENDING", "LEVEL_2", "REJECTED"],
      default: "LEVEL_1",
    },
    kycData: {
      documentType: {
        type: String,
        enum: ["passport", "national_id", "drivers_license"],
      },
      documentUrl: { type: String, select: false },
      rejectionReason: { type: String },
      submittedAt: { type: Date },
    },
    preferences: {
      currency: { type: String, default: "USD", uppercase: true },
      country: { type: String, default: "US", uppercase: true, maxlength: 2 },
      language: { type: String, default: "en" },
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
      },
      theme: { type: String, enum: ["light", "dark", "auto"], default: "auto" },
    },
    wallet: {
      balance: { type: Number, default: 0, min: 0 },
      currency: { type: String, default: "USD" },
      lastUpdated: { type: Date, default: Date.now },
      transactions: [
        {
          type: {
            type: String,
            enum: [
              "buy",
              "sell",
              "deposit",
              "withdraw",
              "withdrawal",
              "dividend",
            ],
            required: true,
          },
          amount: { type: Number, required: true },
          method: { type: String, enum: ["bank", "crypto", "wallet", "card"] },
          status: {
            type: String,
            enum: ["pending", "completed", "failed", "declined"],
            default: "pending",
          },
          date: { type: Date, default: Date.now },
          referenceId: String,
          evidenceUrl: { type: String, default: "" },
          description: String,
        },
      ],
    },
    portfolio: {
      stocks: [
        {
          symbol: { type: String, required: true, uppercase: true },
          quantity: { type: Number, default: 0 },
          averagePrice: { type: Number, default: 0 },
          totalCost: { type: Number, default: 0 },
          currentPrice: { type: Number, default: 0 },
          currentValue: { type: Number, default: 0 },
          profitLoss: { type: Number, default: 0 },
        },
      ],
      totalValue: { type: Number, default: 0 },
      totalCost: { type: Number, default: 0 },
      totalProfitLoss: { type: Number, default: 0 },
      lastUpdated: { type: Date, default: Date.now },
    },
    isActive: { type: Boolean, default: true },
    lastLogin: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// --- HOOKS ---
UserSchema.pre<IUser>("save", async function () {
  // Use double cast to bypass internal Mongoose structural checks
  const user = this as any as IUser;

  if (
    user.isModified("password") &&
    user.password &&
    !user.password.startsWith("$2")
  ) {
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(user.password, salt);
  }

  if (user.isModified("portfolio.stocks")) {
    user.runPortfolioCalcs();
  }
});

// --- INSTANCE METHODS ---
UserSchema.methods.comparePassword = async function (candidate: string) {
  return await bcrypt.compare(candidate, this.password);
};

UserSchema.methods.runPortfolioCalcs = function () {
  const p = this.portfolio;
  p.stocks.forEach((stock: any) => {
    stock.currentValue = stock.quantity * (stock.currentPrice || 0);
    stock.totalCost = stock.quantity * stock.averagePrice;
    stock.profitLoss = stock.currentValue - stock.totalCost;
  });
  p.totalCost = p.stocks.reduce((sum: number, s: any) => sum + s.totalCost, 0);
  p.totalValue = p.stocks.reduce(
    (sum: number, s: any) => sum + s.currentValue,
    0,
  );
  p.totalProfitLoss = p.totalValue - p.totalCost;
};

// --- STATIC METHODS ---
UserSchema.statics.findByEmailWithPassword = function (email: string) {
  return this.findOne({ email: email.toLowerCase() }).select(
    "+password +twoFactorSecret +recoveryKeys",
  );
};

UserSchema.index({ "wallet.balance": -1 });

const User =
  mongoose.models.User || mongoose.model<IUser, IUserModel>("User", UserSchema);
export { User }; // Named export
export default User; // Default export
