import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DcaPage, dcaMetadata, type DcaParams } from "@/components/pages/DcaPage";
import { isLang } from "@/lib/i18n";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string; symbol: string }>; searchParams: Promise<DcaParams> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, symbol } = await params;
  if (!isLang(lang) || lang === "en") return { title: "PNL404" };
  return dcaMetadata(lang, decodeURIComponent(symbol));
}

export default async function Page({ params, searchParams }: Props) {
  const { lang, symbol } = await params;
  if (!isLang(lang) || lang === "en") notFound();
  return DcaPage({ lang, symbol: decodeURIComponent(symbol), params: await searchParams });
}
