import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Dashboard from "@/components/Dashboard";
import { homeMetadata, homeNames } from "@/components/pages/HomePage";
import { homeCopy } from "@/lib/home-copy";
import { isLang } from "@/lib/i18n";
import { getMarketData } from "@/lib/market";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang) || lang === "en") return { title: "PNL404" };
  return homeMetadata(lang);
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang) || lang === "en") notFound();
  const initialData = await getMarketData();
  return <Dashboard initialData={initialData} t={homeCopy(lang)} lang={lang} names={homeNames(lang, initialData)} />;
}
