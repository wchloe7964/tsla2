import { NextRequest, NextResponse } from 'next/server'; // Added NextResponse
import { jwtVerify } from 'jose';
import * as OTPAuth from 'otpauth';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/models/User';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || '');

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value;
    const body = await req.json().catch(() => ({}));
    const userCode = (body.token || body.code || '').toString().trim();

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { payload } = await jwtVerify(token, JWT_SECRET);
    await connectDB();
    const user = await User.findById(payload.userId);

    if (!user || !user.twoFactorSecret) {
      return NextResponse.json({ error: '2FA not setup' }, { status: 400 });
    }

    const totp = new OTPAuth.TOTP({
      issuer: 'TESLA',
      label: user.email,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(user.twoFactorSecret),
    });

    const delta = totp.validate({ token: userCode, window: 2 });

    if (delta !== null) {
      await User.findByIdAndUpdate(payload.userId, { $set: { twoFactorEnabled: true } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Invalid code' }, { status: 400 });
  } catch (error: any) {
    console.error('Verify Error:', error.message);
    // This was where your crash happened!
    return NextResponse.json({ error: 'Verification error' }, { status: 500 });
  }
}