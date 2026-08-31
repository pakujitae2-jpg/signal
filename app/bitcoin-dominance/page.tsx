import { DominancePage, dominanceMetadata } from "@/components/pages/CryptoIndicesPage";

export const dynamic = "force-dynamic";
export const metadata = dominanceMetadata("en");

export default async function Page() {
  return DominancePage({ lang: "en" });
}
