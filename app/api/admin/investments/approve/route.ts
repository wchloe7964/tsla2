import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Investment from "@/lib/models/Investment";

export async function PATCH(req: Request) {
  try {
    await connectToDatabase();
    const { investmentId, unit, value } = await req.json();

    const inv = await Investment.findById(investmentId);
    if (!inv)
      return NextResponse.json(
        { error: "Investment not found" },
        { status: 404 },
      );

    const now = new Date();
    let expiryDate = new Date();

    // FLEXIBLE DURATION LOGIC
    if (unit === "minutes") {
      expiryDate.setMinutes(now.getMinutes() + Number(value));
    } else if (unit === "hours") {
      expiryDate.setHours(now.getHours() + Number(value));
    } else {
      // Default to Days (either custom value or plan's duration)
      const days = value ? Number(value) : inv.durationDays;
      expiryDate.setDate(now.getDate() + days);
    }

    inv.status = "active";
    inv.approvedAt = now;
    inv.endDate = expiryDate;
    inv.customDurationSet = !!unit; // Mark that admin changed the term

    await inv.save();

    return NextResponse.json({ success: true, message: "Node activated" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
