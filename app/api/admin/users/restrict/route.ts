import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/User";

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { userId, restrictionType, value } = await req.json();

    // Dynamically update the specific restriction (e.g., restrictions.canWithdraw)
    const updatePath = `restrictions.${restrictionType}`;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { [updatePath]: value } },
      { new: true },
    );

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
