import mongoose from 'mongoose'

const InvestmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planType: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  returns: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  transactions: [{
    date: Date,
    amount: Number,
    type: {
      type: String,
      enum: ['deposit', 'withdrawal', 'return']
    }
  }]
}, {
  timestamps: true
})

export default mongoose.models.Investment || mongoose.model('Investment', InvestmentSchema)