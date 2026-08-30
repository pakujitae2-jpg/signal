import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuotePage, quoteMetadata } from "@/components/quote/QuotePage";
import { isLang } from "@/lib/i18n";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string; symbol: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, symbol } = await params;
  if (!isLang(lang) || lang === "en") return { title: "PNL404" };
  return quoteMetadata(lang, symbol);
}

export default async function Page({ params }: Props) {
  const { lang, symbol } = await params;
  if (!isLang(lang) || lang === "en") notFound();
  return QuotePage({ lang, symbol });
}
