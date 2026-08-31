import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompoundPage, compoundMetadata, type CompoundParams } from "@/components/pages/CompoundPage";
import { isLang } from "@/lib/i18n";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<CompoundParams> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang) || lang === "en") return { title: "PNL404" };
  return compoundMetadata(lang);
}

export default async function Page({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!isLang(lang) || lang === "en") notFound();
  return <CompoundPage lang={lang} params={await searchParams} />;
}
