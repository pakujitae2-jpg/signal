import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PulsePage, pulseMetadata } from "@/components/pages/PulsePage";
import { isLang } from "@/lib/i18n";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLang(lang) || lang === "en") return { title: "PNL404" };
  return pulseMetadata(lang, slug);
}

export default async function Page({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLang(lang) || lang === "en") notFound();
  return PulsePage({ lang, slug });
}
