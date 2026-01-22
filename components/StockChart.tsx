"use client";

import { createChart, ColorType, CandlestickSeries } from "lightweight-charts";
import React, { useEffect, useRef } from "react";

export default function StockChart({ data }: { data: any[] }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#71717a",
      },
      grid: {
        vertLines: { color: "rgba(255, 255, 255, 0.05)" },
        horzLines: { color: "rgba(255, 255, 255, 0.05)" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#3b82f6", // Neural Blue
      downColor: "#ef4444", // Danger Red
      borderVisible: false,
      wickUpColor: "#3b82f6",
      wickDownColor: "#ef4444",
    });

    series.setData(data);
    chart.timeScale().fitContent();

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data]);

  return (
    <div className="w-full bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] p-8 mb-12">
      <div className="flex justify-between items-center mb-6 px-4">
        <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-500">
          Market Trajectory
        </h3>
        <span className="text-[8px] px-2 py-1 bg-blue-500/10 text-blue-500 rounded uppercase font-bold">
          Live 30D Feed
        </span>
      </div>
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
}
