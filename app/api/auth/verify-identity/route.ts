import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import connectDB from '@/lib/db/mongodb'
import User from '@/lib/models/User'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { payload } = await jwtVerify(token, JWT_SECRET)
    
    // In a real production app, you would handle the file upload (S3/Cloudinary) here.
    // For now, we are updating the status to PENDING.
    
    await connectDB()
    const user = await User.findByIdAndUpdate(
      payload.userId,
      { $set: { kycLevel: 'PENDING' } },
      { new: true }
    )

    return NextResponse.json({ 
      success: true, 
      kycLevel: 'PENDING',
      message: 'Documents received and are under review.' 
    })

  } catch (error) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}