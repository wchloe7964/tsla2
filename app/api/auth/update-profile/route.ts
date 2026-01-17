import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import connectDB from '@/lib/db/mongodb'
import User from '@/lib/models/User'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // 1. Verify Identity
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const userId = payload.userId
    
    const body = await request.json()
    const { name, currency, country } = body

    await connectDB()

    // 2. Update User Document
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        $set: { 
          name, 
          'preferences.currency': currency,
          'preferences.country': country 
        } 
      },
      { new: true } // Returns the modified document
    ).select('-password')

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      user: updatedUser 
    })

  } catch (error) {
    console.error('Profile Update Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}