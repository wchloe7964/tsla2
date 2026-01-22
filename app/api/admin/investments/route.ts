import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb"; // Assuming MongoDB
import Investment from "@/lib/models/Investment"; // Your Schema

export async function GET() {
  try {
    await connectToDatabase();

    // Aggregation for Stats
    const totalUsers = await User.countDocuments();
    const activePlans = await UserInvestment.find({ status: "active" });
    const platformLiquidity = activePlans.reduce(
      (acc, curr) => acc + curr.amount,
      0,
    );

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        activeInvestmentsCount: activePlans.length,
        platformLiquidity,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "System Stat Failure" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    // Create the new investment "Node" available for users to buy
    const newPlan = await Investment.create({
      title: body.title,
      description: body.description,
      minAmount: body.minAmount,
      roi: body.roi, // e.g., 15 for 15%
      duration: body.duration, // in days
      image: body.imageUrl, // URL from Cloudinary
      planType: body.planType, // 'Tesla', 'Neural', etc.
    });

    return NextResponse.json({ success: true, data: newPlan });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Deployment Failed" },
      { status: 500 },
    );
  }
}
