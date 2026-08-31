import type { Metadata } from "next";
import { SeasonalityPage, seasonalityMetadata } from "@/components/quote/SeasonalityPage";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ symbol: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { symbol } = await params;
  return seasonalityMetadata("en", decodeURIComponent(symbol));
}

export default async function Page({ params }: Props) {
  const { symbol } = await params;
  return SeasonalityPage({ lang: "en", symbol: decodeURIComponent(symbol) });
}
