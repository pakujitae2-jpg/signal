import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InvestedPage, investedMetadata } from "@/components/pages/InvestedPage";
import type { InvestedParams } from "@/components/pages/InvestedPage";
import { isLang } from "@/lib/i18n";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<InvestedParams> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang) || lang === "en") return { title: "PNL404" };
  return investedMetadata(lang);
}

export default async function Page({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!isLang(lang) || lang === "en") notFound();
  return InvestedPage({ lang, params: await searchParams });
}
