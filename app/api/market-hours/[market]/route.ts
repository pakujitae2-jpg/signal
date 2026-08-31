import { NextResponse } from "next/server";
import { MARKET_KEYS, SCHEDULES, type MarketKey } from "@/config/exchange-schedule";
import { marketStatus } from "@/lib/market-hours";

export const dynamic = "force-dynamic";

const isMarketKey = (s: string): s is MarketKey => (MARKET_KEYS as string[]).includes(s);

export async function GET(_req: Request, { params }: { params: Promise<{ market: string }> }) {
  const { market } = await params;
  if (!isMarketKey(market)) return NextResponse.json({ error: "unknown market" }, { status: 404 });

  const now = new Date();
  const status = marketStatus(SCHEDULES[market], now);
  return NextResponse.json(
    {
      now: now.toISOString(),
      open: status.open,
      activeSession: status.activeSession,
      changesAt: status.changesAt.toISOString(),
      isHoliday: status.isHoliday,
      holidayName: status.holidayName,
    },
    { headers: { "Cache-Control": "public, s-maxage=15, stale-while-revalidate=45" } }
  );
}
