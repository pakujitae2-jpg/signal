import { SearchPage, searchMetadata } from "@/components/pages/SearchPage";

export const dynamic = "force-static";
export const metadata = searchMetadata("en");

export default function Page() {
  return <SearchPage lang="en" />;
}
