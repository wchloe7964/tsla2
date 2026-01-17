// app/api/admin/cars/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db/mongodb";
import Car from "@/lib/models/Car";
import { verifyToken } from "@/lib/utils/auth";

// Helper for Admin Auth
async function checkAdmin() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    if (!token) return false;
    const payload = await verifyToken(token);
    return payload && payload.role === "admin";
  } catch {
    return false;
  }
}

// 1. GET: Fetch all vehicles
export async function GET() {
  try {
    await connectDB();
    const cars = await Car.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, cars });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 2. POST: Create new vehicle
export async function POST(req: Request) {
  try {
    if (!(await checkAdmin()))
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    await connectDB();
    const body = await req.json();

    const newCar = await Car.create({
      ...body,
      year: Number(body.year),
      price: Number(body.price || 0),
      reduction: Number(body.reduction || 0),
      mileage: Number(body.mileage || 0),
      specs: {
        ...body.specs,
        seats: Number(body.specs?.seats || 5),
      },
    });

    return NextResponse.json({ success: true, car: newCar }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 3. PUT: Update existing vehicle (FIXED MAPPING)
export async function PUT(req: Request) {
  try {
    if (!(await checkAdmin()))
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    await connectDB();
    const body = await req.json();
    const { _id, ...updateData } = body;

    if (!_id)
      return NextResponse.json({ error: "ID Required" }, { status: 400 });

    const updateObject = {
      name: updateData.name,
      model: updateData.model,
      year: Number(updateData.year),
      price: Number(updateData.price || 0),
      reduction: Number(updateData.reduction || 0),
      status: updateData.status,
      mileage: Number(updateData.mileage || 0),
      location: updateData.location || "",
      delivery: updateData.delivery || "",
      images: updateData.images || [],
      description: updateData.description || "",
      features: updateData.features || [],
      "specs.range": updateData.specs?.range || "",
      "specs.acceleration": updateData.specs?.acceleration || "",
      "specs.topSpeed": updateData.specs?.topSpeed || "",
      "specs.seats": Number(updateData.specs?.seats || 5),
      "specs.drive": updateData.specs?.drive || "",
    };

    const updatedCar = await Car.findByIdAndUpdate(
      _id,
      { $set: updateObject },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, car: updatedCar });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 4. DELETE: Remove vehicle
export async function DELETE(req: Request) {
  try {
    if (!(await checkAdmin()))
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    await connectDB();
    const id = new URL(req.url).searchParams.get("id");
    if (!id)
      return NextResponse.json({ error: "ID Required" }, { status: 400 });

    await Car.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Vehicle purged" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
