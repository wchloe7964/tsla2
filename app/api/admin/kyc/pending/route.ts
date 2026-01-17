import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongodb'
import User from '@/lib/models/User'

export async function GET() {
  try {
    await connectDB()
    
    const pendingUsers = await User.find({ kycLevel: 'PENDING' })
      .select([
        '+kycData.documentUrl', // REQUIRED because of your schema's select: false
        'name', 
        'email', 
        'kycData.documentType', 
        'kycData.submittedAt',
        'kycLevel'
      ])
      .lean()

    // Clean the data before sending to frontend
    const cleanedUsers = (pendingUsers || []).map(user => ({
      ...user,
      // Ensure the ID is a string for the frontend keys
      _id: user._id.toString(),
      kycData: {
        ...user.kycData,
        // Fallback for the date issue we saw
        submittedAt: user.kycData?.submittedAt || new Date().toISOString()
      }
    }))

    return NextResponse.json({ success: true, users: cleanedUsers })
  } catch (error: any) {
    console.error("KYC_FETCH_FATAL:", error.message)
    return NextResponse.json({ success: false, error: 'Database sync failed' }, { status: 500 })
  }
}