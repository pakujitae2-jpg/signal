import { NextResponse } from "next/server";
import { UA } from "@/lib/http";

// Temporary: which upstreams are reachable from the Workers runtime.
export const dynamic = "force-dynamic";

const URLS = [
  "https://www.cloudflare.com/cdn-cgi/trace",
  "https://query1.finance.yahoo.com/v8/finance/spark?symbols=AAPL,^GSPC,7203.T,005930.KS,KRW=X,GC=F&range=1d&interval=5m",
  "https://query2.finance.yahoo.com/v8/finance/chart/AAPL?range=1d&interval=5m",
  "https://query1.finance.yahoo.com/v8/finance/chart/KRW=X?range=1mo&interval=1d",
  "https://api.coingecko.com/api/v3/global",
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true",
  "https://api.coinpaprika.com/v1/global",
  "https://api.coinpaprika.com/v1/tickers?limit=10",
  "https://api.exchange.coinbase.com/products/BTC-USD/ticker",
  "https://api.exchange.coinbase.com/products/BTC-USD/candles?granularity=3600",
  "https://api.kraken.com/0/public/Ticker?pair=XBTUSD",
  "https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT",
  "https://open.er-api.com/v6/latest/USD",
  "https://api.frankfurter.app/latest?from=USD&to=KRW,JPY",
  "https://api.frankfurter.app/2026-07-30..2026-08-30?from=USD&to=KRW",
  "https://stooq.com/q/l/?s=aapl.us,^spx,^nkx,^kospi,usdkrw,gc.f&f=sd2t2ohlcv&h&e=csv",
  "https://stooq.com/q/d/l/?s=usdkrw&i=d",
  "https://api.upbit.com/v1/ticker?markets=KRW-BTC",
  "https://api.alternative.me/fng/?limit=2",
  "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH&tsyms=USD",
  "https://api.coincap.io/v2/assets?limit=5",
];

export async function GET() {
  const out = await Promise.all(
    URLS.map(async (url) => {
      const t0 = Date.now();
      try {
        const res = await fetch(url, {
          headers: { "User-Agent": UA, Accept: "application/json,text/plain,*/*" },
          signal: AbortSignal.timeout(8000),
        });
        const body = (await res.text()).replace(/\s+/g, " ").slice(0, 160);
        return { url, status: res.status, ms: Date.now() - t0, server: res.headers.get("server"), body };
      } catch (e) {
        return { url, status: 0, ms: Date.now() - t0, error: String(e).slice(0, 160) };
      }
    })
  );
  return NextResponse.json(out, { headers: { "Cache-Control": "no-store" } });
}
