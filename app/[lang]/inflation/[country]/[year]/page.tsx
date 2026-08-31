import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InflationPage, inflationMetadata } from "@/components/pages/InflationPage";
import { isLang } from "@/lib/i18n";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string; country: string; year: string }>; searchParams: Promise<{ amount?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, country, year } = await params;
  if (!isLang(lang) || lang === "en") return { title: "PNL404" };
  return inflationMetadata(lang, country, year);
}

export default async function Page({ params, searchParams }: Props) {
  const { lang, country, year } = await params;
  const { amount } = await searchParams;
  if (!isLang(lang) || lang === "en") notFound();
  return InflationPage({ lang, country, year, amount });
}
