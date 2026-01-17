import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import * as OTPAuth from 'otpauth';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/models/User';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || '');

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value;
    const { code } = await req.json(); // The final code to confirm deactivation

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // 1. Identify User
    const { payload } = await jwtVerify(token, JWT_SECRET);
    await connectDB();
    const user = await User.findById(payload.userId).select('+twoFactorSecret');

    if (!user || !user.twoFactorSecret) {
      return NextResponse.json({ error: '2FA is not active' }, { status: 400 });
    }

    // 2. Verify the final code
    const totp = new OTPAuth.TOTP({
      issuer: 'TSLA_Node',
      label: user.email,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(user.twoFactorSecret),
    });

    const delta = totp.validate({ token: code, window: 1 });

    // 3. If code is valid, WIPE the secret
    if (delta !== null) {
      await User.findByIdAndUpdate(payload.userId, {
        $set: { 
          twoFactorEnabled: false,
          twoFactorSecret: null // Permanently delete the secret
        }
      });
      
      return NextResponse.json({ success: true, message: 'Security downgraded' });
    }

    return NextResponse.json({ error: 'Invalid confirmation code' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}