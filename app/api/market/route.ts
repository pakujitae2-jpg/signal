import { NextResponse } from "next/server";
import { getMarketData } from "@/lib/market";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getMarketData();
  return NextResponse.json(data, {
    headers: {
      // CDN(Vercel Edge)에 15초 캐시 + 60초 stale-while-revalidate:
      // 사용자 급증 시에도 업스트림 호출은 최소화되고 응답은 즉시 나간다.
      "Cache-Control": "public, s-maxage=15, stale-while-revalidate=60",
    },
  });
}
