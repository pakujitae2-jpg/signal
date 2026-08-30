import { QuotesDirectory, quotesMetadata } from "@/components/quote/QuotesDirectory";

export const dynamic = "force-static";

export const metadata = quotesMetadata("en");

export default function Page() {
  return <QuotesDirectory lang="en" />;
}
