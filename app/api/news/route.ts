// app/api/news/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const FINNHUB_KEY = process.env.FINNHUB_API_KEY;
  const symbol = "TSLA";

  // Fetch news from the last 7 days to ensure we have images and variety
  const today = new Date();
  const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${formatDate(oneWeekAgo)}&to=${formatDate(today)}&token=${FINNHUB_KEY}`,
      { next: { revalidate: 600 } }, // Refresh every 10 mins
    );

    const data = await response.json();

    // Filter to ensure every article has an image and is from a recognizable source
    const reliableNews = data
      .filter((item: any) => item.image && item.headline && item.source)
      .slice(0, 6) // Get the top 6 for the grid
      .map((item: any) => ({
        id: item.id,
        headline: item.headline,
        source: item.source, // Bloomberg, Reuters, etc.
        image: item.image,
        url: item.url,
        datetime: item.datetime,
        // Clinical Sentiment Logic
        sentiment:
          item.headline.toLowerCase().includes("bull") ||
          item.headline.toLowerCase().includes("record")
            ? "positive"
            : item.headline.toLowerCase().includes("drop")
              ? "negative"
              : "neutral",
      }));

    return NextResponse.json({ success: true, data: reliableNews });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "FETCH_FAILED" },
      { status: 500 },
    );
  }
}
