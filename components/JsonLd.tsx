// Renders a JSON-LD block. Data is our own, not user input, so the only
// escaping needed is against "</script>" in string values.
export default function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, "\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
