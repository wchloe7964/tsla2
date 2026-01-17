import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import { verifyToken } from "@/lib/utils/auth";

export async function POST(req: NextRequest) {
  try {
    // 1. Extract and verify token (consistent with your other routes)
    const token = req.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Invalid Session" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("document") as File;
    const docType = formData.get("documentType") as string;

    if (!file || !docType) {
      return NextResponse.json(
        { error: "Missing document or type" },
        { status: 400 }
      );
    }

    // 2. Storage Implementation (Cloudinary integration)
    // You can use your existing Cloudinary logic here to upload the 'file'
    const documentUrl = "https://storage.provider.com/id-docs/temp-link.jpg";

    await connectDB();

    // Using decoded.userId from the verified JWT
    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      {
        $set: {
          "kyc.status": "pending",
          "kyc.documentType": docType,
          "kyc.documentUrl": documentUrl,
          "kyc.submittedAt": new Date(),
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Documents submitted for review",
    });
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
