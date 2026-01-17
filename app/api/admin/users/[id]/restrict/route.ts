import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  // Wrap params in a Promise type to satisfy Next.js 16/Turbopack requirements
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params promise to extract the ID
    const { id } = await params;
    await connectDB();

    const { canWithdraw } = await req.json();

    // Directly update the nested field in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { "restrictions.canWithdraw": canWithdraw } },
      { new: true, select: "restrictions" }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      canWithdraw: updatedUser.restrictions.canWithdraw,
    });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
