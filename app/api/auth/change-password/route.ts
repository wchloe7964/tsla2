import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import bcrypt from 'bcryptjs'; // Ensure you're using bcryptjs
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/models/User';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || '');

export async function POST(req: NextRequest) {
  try {
    const authToken = req.cookies.get('auth-token')?.value;
    const body = await req.json();
    const { currentPassword, newPassword } = body;

    // 1. Guard against missing input (This prevents the "undefined" error)
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { payload } = await jwtVerify(authToken!, JWT_SECRET);
    
    await connectDB();
    // Explicitly select the password field if your model hides it by default
    const user = await User.findById(payload.userId).select('+password');

    if (!user || !user.password) {
      return NextResponse.json({ error: 'User account or password record not found' }, { status: 404 });
    }

    // 2. Verify existing password
    // This is where "Illegal arguments" happens if currentPassword or user.password is missing
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    
    if (!isMatch) {
      return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 400 });
    }

    // 3. Hash and Save
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("--- CHANGE PASSWORD ERROR ---", error.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}