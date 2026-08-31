import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MARKET_KEYS, type MarketKey } from "@/config/exchange-schedule";
import { MarketHoursMarketPage, marketHoursMetadata } from "@/components/pages/MarketHoursPage";

export const dynamic = "force-dynamic";

const isMarketKey = (s: string): s is MarketKey => (MARKET_KEYS as string[]).includes(s);

type Props = { params: Promise<{ market: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { market } = await params;
  if (!isMarketKey(market)) return { title: "PNL404" };
  return marketHoursMetadata("en", market);
}

export default async function Page({ params }: Props) {
  const { market } = await params;
  if (!isMarketKey(market)) notFound();
  return MarketHoursMarketPage({ lang: "en", market });
}
