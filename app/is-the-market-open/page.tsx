import { IsMarketOpenPage, isMarketOpenMetadata } from "@/components/pages/MarketHoursPage";

export const dynamic = "force-dynamic";
export const metadata = isMarketOpenMetadata("en");

export default async function Page() {
  return IsMarketOpenPage({ lang: "en" });
}
