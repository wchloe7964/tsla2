import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import connectDB from '@/lib/db/mongodb';
import Session from '@/lib/models/Session';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || '');

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { payload } = await jwtVerify(token, JWT_SECRET);
    await connectDB();

    // Find all sessions for this user
    const sessions = await Session.find({ userId: payload.userId }).sort({ lastActive: -1 });

    // Map sessions to include a "isCurrent" flag for the UI
    const sessionData = sessions.map(s => ({
      id: s._id,
      device: s.device || 'Unknown Device',
      ip: s.ip || '0.0.0.0',
      lastActive: s.lastActive,
      isCurrent: s.token === token
    }));

    return NextResponse.json(sessionData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}