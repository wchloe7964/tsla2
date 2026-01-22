import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Investment from "@/lib/models/Investment";
import { getCurrentUser } from "@/lib/utils/auth";

export async function DELETE(req: Request) {
  try {
    await connectToDatabase();

    // Admin Check
    const payload = await getCurrentUser();
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Access Denied" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const investmentId = searchParams.get("id");

    if (!investmentId) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    // Ensure we only delete pending ones to prevent accidental deletion of active nodes
    const deleted = await Investment.findOneAndDelete({
      _id: investmentId,
      status: "pending",
    });

    if (!deleted) {
      return NextResponse.json(
        { error: "Request not found or already active" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Request declined and removed.",
    });
  } catch (error) {
    return NextResponse.json({ error: "Decline failed" }, { status: 500 });
  }
}
