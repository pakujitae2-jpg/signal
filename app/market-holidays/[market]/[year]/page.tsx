import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  MarketHolidaysYearPage,
  isHolidayMarket,
  isValidHolidayYear,
  marketHolidaysMetadata,
} from "@/components/pages/MarketHoursPage";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ market: string; year: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { market, year } = await params;
  const y = Number(year);
  if (!isHolidayMarket(market) || !isValidHolidayYear(y)) return { title: "PNL404" };
  return marketHolidaysMetadata("en", market, y);
}

export default async function Page({ params }: Props) {
  const { market, year } = await params;
  const y = Number(year);
  if (!isHolidayMarket(market) || !isValidHolidayYear(y)) notFound();
  return MarketHolidaysYearPage({ lang: "en", market, year: y });
}
