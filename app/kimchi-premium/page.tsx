import { KimchiPage, kimchiMetadata } from "@/components/pages/KimchiPage";

export const dynamic = "force-dynamic";

export const metadata = kimchiMetadata("en");

export default async function Page() {
  return KimchiPage({ lang: "en" });
}
