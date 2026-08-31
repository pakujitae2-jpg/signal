import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TechnicalsPage, technicalsMetadata } from "@/components/quote/TechnicalsPage";
import { isLang } from "@/lib/i18n";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string; symbol: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, symbol } = await params;
  if (!isLang(lang) || lang === "en") return { title: "PNL404" };
  return technicalsMetadata(lang, decodeURIComponent(symbol));
}

export default async function Page({ params }: Props) {
  const { lang, symbol } = await params;
  if (!isLang(lang) || lang === "en") notFound();
  return TechnicalsPage({ lang, symbol: decodeURIComponent(symbol) });
}
