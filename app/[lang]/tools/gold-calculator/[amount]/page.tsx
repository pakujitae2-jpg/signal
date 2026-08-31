import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GoldPage, goldDonMetadata } from "@/components/pages/GoldPage";
import { isLang } from "@/lib/i18n";
import { parseDonSlug } from "@/lib/gold";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string; amount: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, amount } = await params;
  const don = parseDonSlug(amount);
  if (!isLang(lang) || lang === "en" || don === null) return { title: "PNL404" };
  return goldDonMetadata(lang, don);
}

export default async function Page({ params }: Props) {
  const { lang, amount } = await params;
  const don = parseDonSlug(amount);
  if (!isLang(lang) || lang === "en" || don === null) notFound();
  return GoldPage({ lang, params: {}, fixedDon: don });
}
