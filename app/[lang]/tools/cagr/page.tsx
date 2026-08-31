import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CagrPage, cagrMetadata, type CagrParams } from "@/components/pages/CagrPage";
import { isLang } from "@/lib/i18n";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<CagrParams> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang) || lang === "en") return { title: "PNL404" };
  return cagrMetadata(lang);
}

export default async function Page({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!isLang(lang) || lang === "en") notFound();
  return <CagrPage lang={lang} params={await searchParams} />;
}
