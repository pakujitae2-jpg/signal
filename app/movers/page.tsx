import { MoversPage, moversMetadata } from "@/components/pages/MoversPage";

export const dynamic = "force-dynamic";
export const metadata = moversMetadata("en");

export default async function Page() {
  return MoversPage({ lang: "en" });
}
