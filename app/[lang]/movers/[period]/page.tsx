import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PeriodMoversPage, periodMoversMetadata } from "@/components/pages/PeriodMoversPage";
import { isLang } from "@/lib/i18n";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string; period: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, period } = await params;
  if (!isLang(lang) || lang === "en") return { title: "PNL404" };
  return periodMoversMetadata(lang, period);
}

export default async function Page({ params }: Props) {
  const { lang, period } = await params;
  if (!isLang(lang) || lang === "en") notFound();
  return PeriodMoversPage({ lang, period });
}
