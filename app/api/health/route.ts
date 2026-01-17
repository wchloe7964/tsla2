import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongodb'

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    await connectDB()
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: process.env.NODE_ENV
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message,
      environment: process.env.NODE_ENV
    }, { status: 500 })
  }
}