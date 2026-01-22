import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Investment from "@/lib/models/Investment";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { investmentId } = await req.json();

    const inv = await Investment.findById(investmentId);
    if (!inv)
      return NextResponse.json({ error: "Node not found" }, { status: 404 });

    // TERMINATION LOGIC
    inv.status = "stopped";
    inv.isManuallyStopped = true;
    inv.endDate = new Date(); // End it NOW

    await inv.save();

    return NextResponse.json({
      success: true,
      message: "Investment Terminated",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
