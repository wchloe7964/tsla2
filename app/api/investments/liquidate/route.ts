import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongodb'
import { verifyToken } from '@/lib/utils/auth' // Using jose (Async)
import User from '@/lib/models/User'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

    // FIX 1: Add AWAIT here. Without it, decoded is a Promise, not an object.
    const decoded = await verifyToken(token)
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }

    const { investmentId } = await request.json()
    if (!investmentId) {
      return NextResponse.json({ error: 'Investment ID is required' }, { status: 400 })
    }

    await connectDB()

    // Find user
    const user = await User.findById(decoded.userId)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Ensure user.investments exists
    if (!user.investments || !Array.isArray(user.investments)) {
      return NextResponse.json({ error: 'No investments found' }, { status: 404 })
    }

    // Find the specific active investment
    const investmentIndex = user.investments.findIndex(
      (inv: any) => inv._id.toString() === investmentId && inv.status === 'active'
    )

    if (investmentIndex === -1) {
      return NextResponse.json({ error: 'Active investment not found' }, { status: 404 })
    }

    const investment = user.investments[investmentIndex]
    const payoutAmount = investment.amount + (investment.returns || 0)

    // FIX 2: Ensure the wallet object structure is maintained correctly
    if (!user.wallet) {
      user.wallet = { balance: 0, transactions: [] }
    }
    user.wallet.balance += payoutAmount

    // Update Investment Status
    user.investments[investmentIndex].status = 'completed'

    // This calls the pre-save hook we fixed to handle password/portfolio logic
    await user.save()

    return NextResponse.json({
      success: true,
      message: 'Liquidation successful',
      payout: payoutAmount,
      newBalance: user.wallet.balance
    })

  } catch (error: any) {
    console.error('Liquidation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}