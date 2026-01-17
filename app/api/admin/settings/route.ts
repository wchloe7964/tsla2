import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongodb'
import Settings from '@/lib/models/Settings'

// GET is now public so the Header can show the System Notice
export async function GET() {
  try {
    await connectDB()
    let settings = await Settings.findOne().lean()
    
    if (!settings) {
      settings = await Settings.create({
        platformName: 'TSLA',
        systemNotice: ''
      })
    }

    return NextResponse.json({ success: true, settings })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 })
  }
}

// PATCH remains protected (Ensure your middleware/proxy allows this if user is Admin)
export async function PATCH(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()

    const settings = await Settings.findOneAndUpdate(
      {}, 
      { ...body }, 
      { new: true, upsert: true }
    )

    return NextResponse.json({ success: true, settings })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 })
  }
}