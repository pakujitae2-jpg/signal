import { FearGreedPage, fearGreedMetadata } from "@/components/pages/FearGreedPage";

export const dynamic = "force-dynamic";

export const metadata = fearGreedMetadata("en");

export default async function Page() {
  return FearGreedPage({ lang: "en" });
}
