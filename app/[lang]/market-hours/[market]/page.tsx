import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MARKET_KEYS, type MarketKey } from "@/config/exchange-schedule";
import { MarketHoursMarketPage, marketHoursMetadata } from "@/components/pages/MarketHoursPage";
import { isLang } from "@/lib/i18n";

export const dynamic = "force-dynamic";

const isMarketKey = (s: string): s is MarketKey => (MARKET_KEYS as string[]).includes(s);

type Props = { params: Promise<{ lang: string; market: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, market } = await params;
  if (!isLang(lang) || lang === "en" || !isMarketKey(market)) return { title: "PNL404" };
  return marketHoursMetadata(lang, market);
}

export default async function Page({ params }: Props) {
  const { lang, market } = await params;
  if (!isLang(lang) || lang === "en" || !isMarketKey(market)) notFound();
  return MarketHoursMarketPage({ lang, market });
}
