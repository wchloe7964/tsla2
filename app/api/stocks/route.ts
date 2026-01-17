import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongodb'
import Stock from '@/lib/models/Stock'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const symbols = searchParams.get('symbols')
    
    if (symbols) {
      const symbolArray = symbols.split(',')
      const stocks = await Stock.find({ symbol: { $in: symbolArray } })
      return NextResponse.json({ stocks })
    }
    
    // Get all stocks with pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit
    
    const [stocks, total] = await Promise.all([
      Stock.find()
        .skip(skip)
        .limit(limit)
        .sort({ volume: -1 }),
      Stock.countDocuments()
    ])
    
    // Get featured stocks (top 5 by volume)
    const featured = await Stock.find()
      .sort({ volume: -1 })
      .limit(5)
    
    // Get top gainers
    const gainers = await Stock.find()
      .sort({ changePercent: -1 })
      .limit(5)
    
    // Get top losers
    const losers = await Stock.find()
      .sort({ changePercent: 1 })
      .limit(5)
    
    // Get most active
    const active = await Stock.find()
      .sort({ volume: -1 })
      .limit(5)
    
    return NextResponse.json({
      stocks,
      featured,
      gainers,
      losers,
      active,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
    
  } catch (error: any) {
    console.error('Get stocks error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}