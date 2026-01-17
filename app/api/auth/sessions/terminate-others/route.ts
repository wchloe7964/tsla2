import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Session from '@/lib/models/Session';

export async function DELETE(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    const currentToken = req.cookies.get('auth-token')?.value;

    if (!userId || !currentToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    // Delete all sessions for this user EXCEPT the current one
    await Session.deleteMany({
      userId,
      token: { $ne: currentToken }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to clear sessions' }, { status: 500 });
  }
}