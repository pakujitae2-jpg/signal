import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FearGreedDatePage, fearGreedDateMetadata } from "@/components/pages/FearGreedPage";

export const dynamic = "force-dynamic";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

type Props = { params: Promise<{ date: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params;
  if (!DATE_RE.test(date)) return { title: "PNL404" };
  return fearGreedDateMetadata("en", date);
}

export default async function Page({ params }: Props) {
  const { date } = await params;
  if (!DATE_RE.test(date)) notFound();
  return FearGreedDatePage({ lang: "en", date });
}
