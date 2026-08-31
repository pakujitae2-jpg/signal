import { UpbitMarketsPage, upbitMarketsMetadata } from "@/components/pages/UpbitMarketsPage";

export const dynamic = "force-dynamic";
export const metadata = upbitMarketsMetadata("en");

export default function Page() {
  return <UpbitMarketsPage lang="en" />;
}
