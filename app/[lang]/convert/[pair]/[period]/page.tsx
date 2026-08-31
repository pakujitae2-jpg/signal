import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FxHistoryPage, fxHistoryMetadata } from "@/components/convert/FxHistoryPage";
import { isLang } from "@/lib/i18n";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string; pair: string; period: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, pair, period } = await params;
  if (!isLang(lang) || lang === "en") return { title: "PNL404" };
  return fxHistoryMetadata(lang, pair, period);
}

export default async function Page({ params }: Props) {
  const { lang, pair, period } = await params;
  if (!isLang(lang) || lang === "en") notFound();
  return FxHistoryPage({ lang, pairSlug: pair, period });
}
