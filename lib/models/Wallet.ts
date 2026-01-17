import mongoose, { Schema, Document } from 'mongoose'

export interface IWallet extends Document {
  userId: mongoose.Types.ObjectId
  balance: number
  currency: string
  transactions: mongoose.Types.ObjectId[]
  
  // Wallet limits
  dailyLimit: number
  monthlyLimit: number
  
  // Statistics
  totalDeposited: number
  totalWithdrawn: number
  totalInvested: number
  
  // Virtual balance (pending transactions)
  pendingBalance: number
  availableBalance: number
  
  createdAt: Date
  updatedAt: Date
}

const WalletSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'INR'],
    },
    transactions: [{
      type: Schema.Types.ObjectId,
      ref: 'Transaction',
    }],
    
    // Limits
    dailyLimit: {
      type: Number,
      default: 10000,
    },
    monthlyLimit: {
      type: Number,
      default: 50000,
    },
    
    // Statistics
    totalDeposited: {
      type: Number,
      default: 0,
    },
    totalWithdrawn: {
      type: Number,
      default: 0,
    },
    totalInvested: {
      type: Number,
      default: 0,
    },
    
    // Virtual fields
    pendingBalance: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Virtual for available balance
WalletSchema.virtual('availableBalance').get(function (this: IWallet) {
  return this.balance - this.pendingBalance
})

export default mongoose.models.Wallet || mongoose.model<IWallet>('Wallet', WalletSchema)