import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongodb'
import User from '@/lib/models/User'
import { hashPassword } from '@/lib/utils/auth'
import * as yup from 'yup'
import crypto from 'crypto'

const requestResetSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
})

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    
    // Validate input
    try {
      await requestResetSchema.validate(body)
    } catch (validationError: any) {
      return NextResponse.json(
        { error: validationError.message },
        { status: 400 }
      )
    }
    
    const user = await User.findOne({ email: body.email.toLowerCase() })
    if (!user) {
      // Don't reveal that user doesn't exist for security
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, you will receive a reset link.'
      })
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = Date.now() + 3600000 // 1 hour from now
    
    // Store token in user document
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = new Date(resetTokenExpiry)
    await user.save()
    
    // In a real app, send email here with the reset link
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`
    
    console.log('Password reset URL:', resetUrl) // For development only
    
    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, you will receive a reset link.'
    })
    
  } catch (error: any) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}