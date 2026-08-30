"use client";

import { useEffect, useState } from "react";
import type { CryptoCoin } from "./types";

export type LiveTick = { price: number; changePct24h: number; dir: 1 | -1 | 0; seq: number };

// Stablecoins have no meaningful USDT pair; they keep their REST price.
const STABLECOINS = new Set(["USDT", "USDC", "DAI", "FDUSD", "TUSD", "USDE", "USDS"]);

/**
 * Streams second-by-second prices for the given coins from Binance's public
 * miniTicker WebSocket, straight from the visitor's browser (no server hop).
 * Falls back silently when the stream is unavailable (ad blockers, regional
 * blocks, sandboxes) — callers keep showing REST-polled prices.
 */
export function useCryptoStream(coins: CryptoCoin[]) {
  const [live, setLive] = useState<Record<string, LiveTick>>({});
  const [connected, setConnected] = useState(false);

  const streamKey = coins
    .filter((c) => !STABLECOINS.has(c.symbol))
    .map((c) => c.symbol.toLowerCase() + "usdt")
    .join("/");

  useEffect(() => {
    if (!streamKey) return;
    let ws: WebSocket | null = null;
    let closed = false;
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;

    function connect() {
      const streams = streamKey
        .split("/")
        .map((s) => `${s}@miniTicker`)
        .join("/");
      try {
        ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);
      } catch {
        return;
      }
      ws.onopen = () => {
        attempts = 0;
        setConnected(true);
      };
      ws.onmessage = (ev) => {
        try {
          const d = JSON.parse(ev.data)?.data;
          if (!d?.s) return;
          const sym = String(d.s).replace(/USDT$/, "");
          const price = parseFloat(d.c);
          const open = parseFloat(d.o);
          if (!isFinite(price) || !isFinite(open) || open === 0) return;
          const changePct24h = ((price - open) / open) * 100;
          setLive((prev) => {
            const old = prev[sym];
            if (old && old.price === price) return prev;
            const dir: 1 | -1 | 0 = old ? (price > old.price ? 1 : -1) : 0;
            return { ...prev, [sym]: { price, changePct24h, dir, seq: (old?.seq ?? 0) + 1 } };
          });
        } catch {
          // ignore malformed frames
        }
      };
      ws.onclose = () => {
        setConnected(false);
        if (closed) return;
        attempts += 1;
        timer = setTimeout(connect, Math.min(30_000, 1000 * 2 ** attempts));
      };
      ws.onerror = () => {
        ws?.close();
      };
    }

    connect();
    return () => {
      closed = true;
      if (timer) clearTimeout(timer);
      ws?.close();
    };
  }, [streamKey]);

  return { live, connected };
}
