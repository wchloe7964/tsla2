import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Stock from "@/lib/models/Stock";

// DELETE Handler
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const deletedStock = await Stock.findByIdAndDelete(id);

    if (!deletedStock) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Position deleted" });
  } catch (error) {
    console.error("DELETE_ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// PATCH Handler (For your Edit button)
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const { id } = params;
    const { shares } = await req.json();

    const updatedStock = await Stock.findByIdAndUpdate(
      id,
      { shares },
      { new: true },
    );

    return NextResponse.json(updatedStock);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
