import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RankingPage, rankingMetadata } from "@/components/pages/RankingPage";
import { isLang } from "@/lib/i18n";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string; metric: string; market: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, metric, market } = await params;
  if (!isLang(lang) || lang === "en") return { title: "PNL404" };
  return rankingMetadata(lang, metric, market);
}

export default async function Page({ params }: Props) {
  const { lang, metric, market } = await params;
  if (!isLang(lang) || lang === "en") notFound();
  return RankingPage({ lang, metric, market });
}
