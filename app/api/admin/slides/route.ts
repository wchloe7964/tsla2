import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Slide from "@/lib/models/Slide";

// GET all slides
export async function GET() {
  await dbConnect();
  try {
    const slides = await Slide.find({}).sort({ order: 1 }); // Fetch all, isActive filter is done on frontend
    return NextResponse.json({ success: true, slides });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// POST new slide
export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    const slide = await Slide.create(body);
    return NextResponse.json({ success: true, slide });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
}

// PUT (Update) existing slide
export async function PUT(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Slide ID is required" },
      { status: 400 },
    );
  }

  try {
    const body = await req.json();
    const slide = await Slide.findByIdAndUpdate(id, body, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators on update
    });

    if (!slide) {
      return NextResponse.json(
        { success: false, error: "Slide not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, slide });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
}

// DELETE slide
export async function DELETE(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Slide ID is required" },
      { status: 400 },
    );
  }

  try {
    const deletedSlide = await Slide.findByIdAndDelete(id);
    if (!deletedSlide) {
      return NextResponse.json(
        { success: false, error: "Slide not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      success: true,
      message: "Slide deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
