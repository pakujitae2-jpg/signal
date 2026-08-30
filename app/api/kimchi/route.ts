import { NextResponse } from "next/server";
import { getKimchiData } from "@/lib/kimchi";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getKimchiData();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30" },
  });
}
