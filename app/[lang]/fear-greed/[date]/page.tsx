import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FearGreedDatePage, fearGreedDateMetadata } from "@/components/pages/FearGreedPage";
import { isLang } from "@/lib/i18n";

export const dynamic = "force-dynamic";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

type Props = { params: Promise<{ lang: string; date: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, date } = await params;
  if (!isLang(lang) || lang === "en" || !DATE_RE.test(date)) return { title: "PNL404" };
  return fearGreedDateMetadata(lang, date);
}

export default async function Page({ params }: Props) {
  const { lang, date } = await params;
  if (!isLang(lang) || lang === "en" || !DATE_RE.test(date)) notFound();
  return FearGreedDatePage({ lang, date });
}
