import mongoose, { Schema, Document } from 'mongoose'

export interface IStockPrice extends Document {
  stockId: mongoose.Types.ObjectId
  symbol: string
  date: Date
  
  // Price data
  open: number
  high: number
  low: number
  close: number
  volume: number
  adjustedClose: number
  
  // Technical indicators
  movingAverage20: number
  movingAverage50: number
  movingAverage200: number
  rsi: number
  macd: number
  macdSignal: number
  macdHistogram: number
  bollingerUpper: number
  bollingerLower: number
  bollingerMiddle: number
  
  // Volatility
  volatility: number
  
  createdAt: Date
}

const StockPriceSchema: Schema = new Schema(
  {
    stockId: {
      type: Schema.Types.ObjectId,
      ref: 'Stock',
      required: true,
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
    },
    date: {
      type: Date,
      required: true,
    },
    
    // Price data
    open: {
      type: Number,
      required: true,
      min: 0,
    },
    high: {
      type: Number,
      required: true,
      min: 0,
    },
    low: {
      type: Number,
      required: true,
      min: 0,
    },
    close: {
      type: Number,
      required: true,
      min: 0,
    },
    volume: {
      type: Number,
      required: true,
      min: 0,
    },
    adjustedClose: {
      type: Number,
      required: true,
      min: 0,
    },
    
    // Technical indicators
    movingAverage20: Number,
    movingAverage50: Number,
    movingAverage200: Number,
    rsi: Number,
    macd: Number,
    macdSignal: Number,
    macdHistogram: Number,
    bollingerUpper: Number,
    bollingerLower: Number,
    bollingerMiddle: Number,
    
    // Volatility
    volatility: Number,
  },
  {
    timestamps: true,
  }
)

// Compound index for unique daily prices per stock
StockPriceSchema.index({ stockId: 1, date: 1 }, { unique: true })
StockPriceSchema.index({ symbol: 1, date: -1 })
StockPriceSchema.index({ date: -1 })

export default mongoose.models.StockPrice || mongoose.model<IStockPrice>('StockPrice', StockPriceSchema)