import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AverageCostPage, averageMetadata, type AverageParams } from "@/components/pages/AverageCostPage";
import { isLang } from "@/lib/i18n";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<AverageParams> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang) || lang === "en") return { title: "PNL404" };
  return averageMetadata(lang);
}

export default async function Page({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!isLang(lang) || lang === "en") notFound();
  return AverageCostPage({ lang, params: await searchParams });
}
