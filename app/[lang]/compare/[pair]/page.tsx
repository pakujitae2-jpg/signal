import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComparePage, compareMetadata } from "@/components/pages/ComparePage";
import { isLang } from "@/lib/i18n";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string; pair: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, pair } = await params;
  if (!isLang(lang) || lang === "en") return { title: "PNL404" };
  return compareMetadata(lang, pair);
}

export default async function Page({ params }: Props) {
  const { lang, pair } = await params;
  if (!isLang(lang) || lang === "en") notFound();
  return ComparePage({ lang, slug: pair });
}
