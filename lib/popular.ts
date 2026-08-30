import { UNIVERSE } from "./universe";

// Every symbol with an indexable quote page. /quote/[symbol] serves any
// valid symbol; listing these in the sitemap is what gets them crawled.
export const POPULAR_SYMBOLS: string[] = UNIVERSE.map((e) => e.symbol);
