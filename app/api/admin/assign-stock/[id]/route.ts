import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Stock from "@/lib/models/Stock";

// --- DELETE HANDLER ---
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }, // Define params as a Promise
) {
  try {
    await connectDB();

    // UNWRAP PARAMS FIRST
    const { id } = await params;

    const deletedPosition = await Stock.findByIdAndDelete(id);

    if (!deletedPosition) {
      return NextResponse.json(
        { error: "Shareholder record not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Position successfully liquidated" });
  } catch (error) {
    console.error("Ledger Delete Error:", error);
    return NextResponse.json(
      { error: "Internal Database Error" },
      { status: 500 },
    );
  }
}

// --- UPDATE (PATCH) HANDLER ---
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }, // Define params as a Promise
) {
  try {
    await connectDB();

    // UNWRAP PARAMS FIRST
    const { id } = await params;

    const { shares } = await req.json();

    if (isNaN(shares) || shares < 0) {
      return NextResponse.json(
        { error: "Invalid share volume" },
        { status: 400 },
      );
    }

    const updatedPosition = await Stock.findByIdAndUpdate(
      id,
      { $set: { shares: Number(shares) } },
      { new: true },
    );

    return NextResponse.json(updatedPosition);
  } catch (error) {
    console.error("Ledger Update Error:", error);
    return NextResponse.json(
      { error: "Failed to update ledger" },
      { status: 500 },
    );
  }
}
