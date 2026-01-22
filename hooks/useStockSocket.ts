import { useEffect, useState } from "react";

export function useStockSocket(symbol: string) {
  const [livePrice, setLivePrice] = useState<number | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_NEXT_PUBLIC_FINNHUB_API_KEY;

    // Safety check to ensure the key is exposed to the browser
    if (!apiKey || !symbol) return;

    let socket: WebSocket;

    try {
      socket = new WebSocket(`wss://ws.finnhub.io?token=${apiKey}`);

      socket.onopen = () => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(
            JSON.stringify({ type: "subscribe", symbol: symbol.toUpperCase() }),
          );
        }
      };

      socket.onmessage = (event) => {
        const response = JSON.parse(event.data);
        if (response.type === "trade") {
          const lastTrade = response.data[response.data.length - 1];
          setLivePrice(lastTrade.p);
        }
      };

      socket.onerror = (err) => {
        console.warn("Neural Link: Connection unstable. Feed may be delayed.");
      };

      return () => {
        // Guard against closing a socket that isn't open yet
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(
            JSON.stringify({
              type: "unsubscribe",
              symbol: symbol.toUpperCase(),
            }),
          );
          socket.close();
        }
      };
    } catch (e) {
      console.error("Neural Link: Initialization failed", e);
    }
  }, [symbol]);

  return livePrice;
}
