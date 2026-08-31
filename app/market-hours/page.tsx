import { MarketHoursHub, marketHoursHubMetadata } from "@/components/pages/MarketHoursPage";

export const dynamic = "force-dynamic";
export const metadata = marketHoursHubMetadata("en");

export default async function Page() {
  return MarketHoursHub({ lang: "en" });
}
