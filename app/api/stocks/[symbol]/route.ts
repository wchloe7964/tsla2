import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Stock from "@/lib/models/Stock";

// Update the interface to reflect the asynchronous nature of params
interface Params {
  params: Promise<{
    symbol: string;
  }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    // 1. Await the params to extract the symbol
    const { symbol } = await params;

    await connectDB();

    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });

    if (!stock) {
      return NextResponse.json({ error: "Stock not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Stock found",
      stock,
    });
  } catch (error: any) {
    // Note: I left the console.error here for server debugging,
    // but you can remove it if you want absolute silence.
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
