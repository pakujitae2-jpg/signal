import { notFound } from "next/navigation";
import { isLang } from "@/lib/i18n";
import EmbedPage, { metadata as embedMetadata } from "@/app/embed/page";

export const dynamic = "force-dynamic";
export const metadata = embedMetadata;

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<{ s?: string }> };

export default async function Page({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!isLang(lang) || lang === "en") notFound();
  return EmbedPage({ searchParams });
}
