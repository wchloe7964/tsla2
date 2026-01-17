import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import * as QRCode from 'qrcode';
import * as OTPAuth from 'otpauth'; // Reliable ESM library
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/models/User';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || '');

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // 1. Generate a random 20-byte secret using OTPAuth's built-in tool
    // This handles the Base32 encoding and padding perfectly
    const secretInstance = new OTPAuth.Secret({ size: 20 });
    const secretBase32 = secretInstance.base32;
    
    // 2. Create TOTP instance to generate the correct URI
    const totp = new OTPAuth.TOTP({
      issuer: 'TESLA',
      label: payload.email as string,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: secretInstance,
    });

    const otpauthUrl = totp.toString();

    // 3. Generate QR Code
    const qrCodeImage = await QRCode.toDataURL(otpauthUrl);

    await connectDB();
    await User.findByIdAndUpdate(payload.userId, {
      $set: { twoFactorSecret: secretBase32, twoFactorEnabled: false }
    });

    return NextResponse.json({ 
      success: true, 
      secret: secretBase32, 
      qrCode: qrCodeImage 
    });

  } catch (error: any) {
    console.error('--- 2FA SETUP ERROR ---', error);
    return NextResponse.json({ error: 'Failed to initialize security.' }, { status: 500 });
  }
}