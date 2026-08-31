import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolsHub, toolsHubMetadata } from "@/components/pages/ToolsHub";
import { isLang } from "@/lib/i18n";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang) || lang === "en") return { title: "PNL404" };
  return toolsHubMetadata(lang);
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang) || lang === "en") notFound();
  return <ToolsHub lang={lang} />;
}
