import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Car from "@/lib/models/Car";

// GET: Fetch a single car for editing
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Params is now a Promise
) {
  try {
    const { id } = await params; // Await the promise
    await connectDB();

    const car = await Car.findById(id);
    if (!car)
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });

    return NextResponse.json({ success: true, car });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch vehicle" },
      { status: 500 }
    );
  }
}

// PUT: Update vehicle details
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Params is now a Promise
) {
  try {
    const { id } = await params; // Await the promise
    await connectDB();
    const body = await request.json();

    const updatedCar = await Car.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedCar) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, car: updatedCar });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Registry update failed" },
      { status: 500 }
    );
  }
}

// DELETE: Remove vehicle from fleet
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Params is now a Promise
) {
  try {
    const { id } = await params; // Await the promise
    await connectDB();
    const deletedCar = await Car.findByIdAndDelete(id);

    if (!deletedCar) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Vehicle purged from registry",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Decommissioning failed" },
      { status: 500 }
    );
  }
}
