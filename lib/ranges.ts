// Chart ranges shared by server code and the client-side QuoteView. Kept
// separate from lib/quote so the client bundle does not pull in the
// symbol universe.
export type Range = "1d" | "5d" | "1mo" | "6mo" | "1y";
export const RANGES: Range[] = ["1d", "5d", "1mo", "6mo", "1y"];
export const RANGE_LABEL: Record<Range, string> = { "1d": "1D", "5d": "5D", "1mo": "1M", "6mo": "6M", "1y": "1Y" };
