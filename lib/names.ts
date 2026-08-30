import { curName, curShort, type Lang } from "./i18n";
import { LOCAL_NAMES } from "./names.generated";

// Localized display names for quote symbols. Equities, indices, ETFs, crypto
// and commodities come from the generated table; FX pair names are derived
// from the currency dictionary so they always agree with the convert pages.

const FX_PAIR = /^([A-Z]{3})\/([A-Z]{3})$/;

export function localName(lang: Lang, symbol: string, fallback: string): string {
  if (lang === "en") return fallback;

  const pair = FX_PAIR.exec(fallback);
  if (pair) {
    const [, base, quote] = pair;
    return lang === "ko"
      ? `${curShort("ko", base)}/${curShort("ko", quote)}`
      : `${curName("ja", base)}/${curName("ja", quote)}`;
  }

  const entry = LOCAL_NAMES[symbol];
  if (!entry) return fallback;
  return (lang === "ko" ? entry[0] : entry[1]) || fallback;
}
