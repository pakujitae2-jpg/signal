import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PairPage, pairMetadata } from "@/components/convert/PairPage";
import { isLang } from "@/lib/i18n";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string; pair: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, pair } = await params;
  if (!isLang(lang) || lang === "en") return { title: "PNL404" };
  return pairMetadata(lang, pair);
}

export default async function LocalizedConvertPage({ params }: Props) {
  const { lang, pair } = await params;
  if (!isLang(lang) || lang === "en") notFound();
  return PairPage({ lang, slug: pair });
}
