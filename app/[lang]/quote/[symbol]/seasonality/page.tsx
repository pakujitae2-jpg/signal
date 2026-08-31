import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeasonalityPage, seasonalityMetadata } from "@/components/quote/SeasonalityPage";
import { isLang } from "@/lib/i18n";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string; symbol: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, symbol } = await params;
  if (!isLang(lang) || lang === "en") return { title: "PNL404" };
  return seasonalityMetadata(lang, decodeURIComponent(symbol));
}

export default async function Page({ params }: Props) {
  const { lang, symbol } = await params;
  if (!isLang(lang) || lang === "en") notFound();
  return SeasonalityPage({ lang, symbol: decodeURIComponent(symbol) });
}
