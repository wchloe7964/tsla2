import { NextResponse } from "next/server";

const FINNHUB_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
// The watchlist for the landing page or sidebar
const SYMBOLS = ["TSLA", "AAPL", "NVDA", "MSFT", "AMZN", "GOOGL"];

const NAME_MAP: Record<string, string> = {
  TSLA: "Tesla, Inc.",
  AAPL: "Apple Inc.",
  NVDA: "NVIDIA Corp.",
  MSFT: "Microsoft Corp.",
  AMZN: "Amazon.com",
  GOOGL: "Alphabet Inc.",
};

export async function GET() {
  if (!FINNHUB_KEY) {
    return NextResponse.json(
      { success: false, error: "System Configuration Error: API Key Missing" },
      { status: 500 },
    );
  }

  try {
    // Parallel fetching for high performance
    const stockPromises = SYMBOLS.map(async (symbol) => {
      const res = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`,
        {
          next: { revalidate: 60 }, // Cache results for 1 minute
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!res.ok) throw new Error(`External API failure for ${symbol}`);

      const data = await res.json();

      return {
        symbol,
        name: NAME_MAP[symbol] || "Global Equity",
        price: data.c || 0, // Current price
        change: data.d || 0, // Absolute change
        changePercent: data.dp || 0, // Percentage change
        high: data.h || 0, // High of the day
        low: data.l || 0, // Low of the day
      };
    });

    const results = await Promise.all(stockPromises);

    return NextResponse.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Market Data Route Error:", error);
    return NextResponse.json(
      { success: false, error: "Market Sync Failed" },
      { status: 500 },
    );
  }
}
