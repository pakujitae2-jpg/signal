import type { Metadata } from "next";
import { ListPage, listMetadata } from "@/components/pages/ListsPage";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return listMetadata("en", slug);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return ListPage({ lang: "en", slug });
}
