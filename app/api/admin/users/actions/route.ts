import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { userId, action } = await req.json();

    switch (action) {
      case "status":
        const user = await User.findById(userId);
        await User.findByIdAndUpdate(userId, { isActive: !user.isActive });
        break;

      case "kyc-approve":
        await User.findByIdAndUpdate(userId, { "kycData.status": "verified" });
        break;

      case "kyc-decline":
        await User.findByIdAndUpdate(userId, {
          "kycData.status": "rejected",
          "kycData.documentUrl": null,
        });
        break;

      case "terminate":
        // Logic to clear sessions/JWTs would go here
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
