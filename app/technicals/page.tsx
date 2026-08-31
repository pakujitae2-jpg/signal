import { ScreenerPage, screenerMetadata } from "@/components/pages/ScreenerPage";

export const dynamic = "force-dynamic";
export const metadata = screenerMetadata("en");

export default async function Page() {
  return ScreenerPage({ lang: "en" });
}
