import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  MarketHolidaysYearPage,
  isHolidayMarket,
  isValidHolidayYear,
  marketHolidaysMetadata,
} from "@/components/pages/MarketHoursPage";
import { isLang } from "@/lib/i18n";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string; market: string; year: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, market, year } = await params;
  const y = Number(year);
  if (!isLang(lang) || lang === "en" || !isHolidayMarket(market) || !isValidHolidayYear(y)) return { title: "PNL404" };
  return marketHolidaysMetadata(lang, market, y);
}

export default async function Page({ params }: Props) {
  const { lang, market, year } = await params;
  const y = Number(year);
  if (!isLang(lang) || lang === "en" || !isHolidayMarket(market) || !isValidHolidayYear(y)) notFound();
  return MarketHolidaysYearPage({ lang, market, year: y });
}
