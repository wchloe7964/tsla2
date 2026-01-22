import { NextRequest, NextResponse } from "next/server";

// 1. Change 'Request' to 'NextRequest' (optional but recommended)
// 2. Wrap params in a Promise type
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 3. Await the params before destructuring
    const { id } = await params;
    const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

    // Calculate Timestamps (Must be in SECONDS for Finnhub)
    const to = Math.floor(Date.now() / 1000);
    const from = to - 6 * 30 * 24 * 60 * 60; // 6 Months ago

    const url = `https://finnhub.io/api/v1/stock/candle?symbol=${id.toUpperCase()}&resolution=D&from=${from}&to=${to}&token=${apiKey}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.s === "no_data") {
      return NextResponse.json({
        success: false,
        error: "No candle data found",
      });
    }

    // Format Finnhub's 't, c, o, h, l' format into our Chart's format
    const formattedCandles = data.t.map((time: number, i: number) => ({
      date: new Date(time * 1000).toISOString().split("T")[0],
      open: data.o[i],
      high: data.h[i],
      low: data.l[i],
      close: data.c[i],
    }));

    return NextResponse.json({ success: true, data: formattedCandles });
  } catch (error) {
    console.error("Candle Fetch Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch neural candles" },
      { status: 500 },
    );
  }
}
