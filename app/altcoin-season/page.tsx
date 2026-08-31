import { AltseasonPage, altseasonMetadata } from "@/components/pages/CryptoIndicesPage";

export const dynamic = "force-dynamic";
export const metadata = altseasonMetadata("en");

export default async function Page() {
  return AltseasonPage({ lang: "en" });
}
