import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/utils/auth";

const FINNHUB_KEY = process.env.NEXT_PUBLIC_NEXT_PUBLIC_FINNHUB_API_KEY;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }, // Type params as a Promise
) {
  try {
    // 1. Next.js 16 REQUIREMENT: Await dynamic params
    const resolvedParams = await params;
    const symbol = resolvedParams.id.toUpperCase();

    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // 2. Parallel fetching for speed
    const [profileRes, newsRes] = await Promise.all([
      fetch(
        `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_KEY}`,
      ),
      fetch(
        `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${getSevenDaysAgo()}&to=${getToday()}&token=${FINNHUB_KEY}`,
      ),
    ]);

    if (!profileRes.ok || !newsRes.ok) {
      throw new Error("Finnhub stream interrupted");
    }

    const profile = await profileRes.json();
    const news = await newsRes.json();

    // 3. Return a consistent success structure
    return NextResponse.json({
      success: true,
      data: {
        profile,
        news: news.slice(0, 5),
      },
    });
  } catch (error) {
    console.error("Neural Error:", error);
    return NextResponse.json(
      { success: false, error: "Sync failed" },
      { status: 500 },
    );
  }
}

// Helpers for the news date range
function getToday() {
  return new Date().toISOString().split("T")[0];
}
function getSevenDaysAgo() {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d.toISOString().split("T")[0];
}
