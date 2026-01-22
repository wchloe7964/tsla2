import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/User";

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { userId, status } = await req.json();

    await User.findByIdAndUpdate(userId, { isActive: status });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
