// app/api/stocks/route.ts
import { NextResponse } from "next/server";

const FINNHUB_KEY = process.env.FINNHUB_API_KEY; // Get from finnhub.io
const SYMBOLS = ["TSLA", "AAPL", "NVDA", "MSFT", "AMZN"];

export async function GET() {
  try {
    const stockPromises = SYMBOLS.map(async (symbol) => {
      const res = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`,
        { next: { revalidate: 60 } }, // Cache for 1 minute
      );
      const data = await res.json();
      return {
        symbol,
        price: data.c, // Current price
        change: data.d, // Change
        changePercent: data.dp, // Percent change
      };
    });

    const results = await Promise.all(stockPromises);
    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "API_FETCH_FAILED" },
      { status: 500 },
    );
  }
}
