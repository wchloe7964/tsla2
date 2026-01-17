import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Session from '@/lib/models/Session';

export async function DELETE(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    const userId = req.headers.get('x-user-id'); // Injected by your Proxy

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    // Ensure the user can only delete THEIR OWN sessions
    const session = await Session.findOne({ _id: sessionId, userId });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    await Session.findByIdAndDelete(sessionId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Revocation failed' }, { status: 500 });
  }
}