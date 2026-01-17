import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongodb'
import Order from '@/lib/models/Order'
import Car from '@/lib/models/Car'
import User from '@/lib/models/User'
import { getCurrentUser } from '@/lib/utils/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    await connectDB()
    
    const orders = await Order.find({ userId: user.userId })
      .populate('carId')
      .sort({ createdAt: -1 })
    
    return NextResponse.json({ orders })
    
  } catch (error: any) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    await connectDB()
    
    const body = await request.json()
    const { carId, ...orderData } = body
    
    // Check if car exists and is available
    const car = await Car.findById(carId)
    if (!car) {
      return NextResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      )
    }
    
    if (!car.available || car.stock <= 0) {
      return NextResponse.json(
        { error: 'Car is not available' },
        { status: 400 }
      )
    }
    
    // Check user's wallet balance (optional)
    const userDoc = await User.findById(user.userId)
    if (userDoc.wallet.balance < car.price) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      )
    }
    
    // Create order
    const order = await Order.create({
      ...orderData,
      userId: user.userId,
      carId,
      totalPrice: car.price,
      status: 'pending',
      paymentStatus: 'pending'
    })
    
    // Update car stock
    car.stock -= 1
    if (car.stock === 0) {
      car.available = false
    }
    await car.save()
    
    // Add car to user's portfolio
    userDoc.cars.push(carId)
    // Deduct from wallet (if paying with wallet)
    userDoc.wallet.balance -= car.price
    await userDoc.save()
    
    return NextResponse.json({
      message: 'Order created successfully',
      order,
      orderId: order._id
    })
    
  } catch (error: any) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}