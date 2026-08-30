import { NextResponse } from "next/server";
import { getQuoteDetail, isValidSymbol, RANGES, type Range } from "@/lib/quote";

export const dynamic = "force-dynamic";

export async function GET(req: Request, ctx: { params: Promise<{ symbol: string }> }) {
  const { symbol: raw } = await ctx.params;
  const symbol = decodeURIComponent(raw);
  if (!isValidSymbol(symbol)) {
    return NextResponse.json({ error: "invalid symbol" }, { status: 400 });
  }
  const rangeParam = new URL(req.url).searchParams.get("range") ?? "1d";
  const range: Range = (RANGES as string[]).includes(rangeParam) ? (rangeParam as Range) : "1d";

  const data = await getQuoteDetail(symbol, range);
  if (!data) {
    return NextResponse.json({ error: "data unavailable" }, { status: 502 });
  }
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" },
  });
}
