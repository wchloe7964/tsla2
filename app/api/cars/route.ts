import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Car from "@/lib/models/Car";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    // Build filter object
    const filter: any = {};

    // Text search
    const search = searchParams.get("search");
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { model: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Model filter
    const model = searchParams.get("model");
    if (model && model !== "All") {
      filter.model = model;
    }

    // Status filter (can be multiple)
    const statusParams = searchParams.getAll("status");
    if (statusParams.length > 0) {
      filter.status = { $in: statusParams };
    }

    // Zip/location filter
    const zip = searchParams.get("zip");
    if (zip) {
      filter.location = { $regex: zip, $options: "i" };
    }

    // Execute query
    const cars = await Car.find(filter).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      cars,
      count: cars.length,
    });
  } catch (error: any) {
    console.error("Cars API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
