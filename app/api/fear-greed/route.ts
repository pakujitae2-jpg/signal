import { NextResponse } from "next/server";
import { getFearGreed } from "@/lib/feargreed";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getFearGreed();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600" },
  });
}
