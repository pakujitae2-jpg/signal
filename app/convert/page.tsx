import { IndexPage, indexMetadata } from "@/components/convert/IndexPage";

export const dynamic = "force-dynamic";

export const metadata = indexMetadata("en");

export default function ConvertDirectory() {
  return <IndexPage lang="en" />;
}
