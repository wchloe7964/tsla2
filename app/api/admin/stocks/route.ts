import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Stock from "@/lib/models/Stock";

export async function GET() {
  try {
    await connectToDatabase();

    // Aggregation: Fetch stocks and attach user details
    const stockRegistry = await Stock.aggregate([
      {
        $lookup: {
          from: "users", // The collection name in MongoDB (usually plural)
          localField: "userId", // Field in Stock.ts
          foreignField: "_id", // Field in User.ts
          as: "owner", // Name of the new array field
        },
      },
      { $unwind: "$owner" }, // Convert the 'owner' array into a single object
      { $sort: { allocatedAt: -1 } }, // Show newest allocations first
    ]);

    return NextResponse.json({ stocks: stockRegistry });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch registry" },
      { status: 500 },
    );
  }
}
