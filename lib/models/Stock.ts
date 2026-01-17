import mongoose from 'mongoose'

const StockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  change: {
    type: Number,
    default: 0
  },
  changePercent: {
    type: Number,
    default: 0
  },
  volume: {
    type: Number,
    default: 0
  },
  marketCap: Number,
  description: String,
  sector: String,
  industry: String,
  logo: String,
  historicalData: [{
    date: Date,
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    volume: Number
  }]
}, {
  timestamps: true
})

export default mongoose.models.Stock || mongoose.model('Stock', StockSchema)