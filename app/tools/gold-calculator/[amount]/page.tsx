import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GoldPage, goldDonMetadata } from "@/components/pages/GoldPage";
import { parseDonSlug } from "@/lib/gold";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ amount: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { amount } = await params;
  const don = parseDonSlug(amount);
  if (don === null) return { title: "PNL404" };
  return goldDonMetadata("en", don);
}

export default async function Page({ params }: Props) {
  const { amount } = await params;
  const don = parseDonSlug(amount);
  if (don === null) notFound();
  return GoldPage({ lang: "en", params: {}, fixedDon: don });
}
