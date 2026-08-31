import type { Lang } from "./i18n";
import { FEATURE_COPY } from "./feature-copy.generated";

// Copy for the pages ported from the PNL404 desk build: comparisons, the
// "if I had invested" calculator, daily movers, search and the ticker widget.
// The shapes below are what lib/feature-copy.generated.ts must satisfy, so a
// missing key fails the type-check instead of rendering blank.

export type CompareCopy = {
  /** {A} {B} */ title: string;
  /** {A} {B} */ description: string;
  /** {A} {B} */ h1: string;
  sub: string;
  hubTitle: string;
  hubDescription: string;
  hubH1: string;
  /** {n} */ hubSub: string;
  chartHeading: string;
  chartNote: string;
  statsHeading: string;
  aboutHeading: string;
  aboutP: string;
  popularHeading: string;
  colMetric: string;
  rowPrice: string;
  rowDayChange: string;
  row1m: string;
  row6m: string;
  row1y: string;
  rowHigh52: string;
  rowLow52: string;
  rowCurrency: string;
  /** {WINNER} {WINNERPCT} {LOSER} {LOSERPCT} */ leadBoth: string;
  /** {LEFTPCT} {RIGHTPCT} */ leadTie: string;
  leadNoData: string;
  footer: string;
};

export type InvestedCopy = {
  title: string;
  description: string;
  h1: string;
  sub: string;
  formHeading: string;
  assetLabel: string;
  amountLabel: string;
  startLabel: string;
  resultHeading: string;
  valueLabel: string;
  profitLabel: string;
  multipleLabel: string;
  cagrLabel: string;
  boughtLabel: string;
  nowLabel: string;
  unitsLabel: string;
  chartHeading: string;
  tableHeading: string;
  colHorizon: string;
  colValue: string;
  colMultiple: string;
  aboutHeading: string;
  aboutP1: string;
  aboutP2: string;
  unavailable: string;
  presetHeading: string;
  footer: string;
};

export type DcaCopy = {
  /** {NAME} */ title: string;
  /** {NAME} */ description: string;
  /** {NAME} */ h1: string;
  sub: string;
  formHeading: string;
  amountLabel: string;
  startLabel: string;
  resultHeading: string;
  /** {N} */ monthsNote: string;
  contributedLabel: string;
  valueLabel: string;
  profitLabel: string;
  totalPctLabel: string;
  avgCostLabel: string;
  annualizedLabel: string;
  vsLumpHeading: string;
  /** {LUMP} {DCA} */ vsLumpNote: string;
  chartHeading: string;
  tableHeading: string;
  colHorizon: string;
  colValue: string;
  colReturn: string;
  aboutHeading: string;
  aboutP1: string;
  aboutP2: string;
  unavailable: string;
  presetHeading: string;
  footer: string;
};

export type GoldCopy = {
  title: string;
  description: string;
  h1: string;
  sub: string;
  formHeading: string;
  gramLabel: string;
  donLabel: string;
  karatLabel: string;
  resultHeading: string;
  /** {N} */ forWeight: string;
  perGramLabel: string;
  perDonLabel: string;
  basisHeading: string;
  basisNote: string;
  presetHeading: string;
  /** {N} */ presetLink: string;
  /** {N} */ donPageTitle: string;
  /** {N} */ donPageDescription: string;
  aboutHeading: string;
  aboutP1: string;
  aboutP2: string;
  unavailable: string;
  footer: string;
};

export const goldDonTitle = (lang: Lang, n: string) => fill(FEATURE_COPY.gold[lang].donPageTitle, { N: n });
export const goldDonDescription = (lang: Lang, n: string) => fill(FEATURE_COPY.gold[lang].donPageDescription, { N: n });

export type MoversCopy = {
  title: string;
  description: string;
  h1: string;
  sub: string;
  heatmapHeading: string;
  gainersHeading: string;
  losersHeading: string;
  equitiesHeading: string;
  cryptoHeading: string;
  colName: string;
  colLast: string;
  colPct: string;
  aboutHeading: string;
  aboutP: string;
  unavailable: string;
  footer: string;
  periodNavHeading: string;
  periodLabels: { week: string; month: string; ytd: string; "1y": string; "3y": string; "5y": string };
  /** {PERIOD} */ periodH1: string;
  /** {PERIOD} */ periodDescription: string;
};

export type SearchCopy = {
  title: string;
  description: string;
  h1: string;
  sub: string;
  placeholder: string;
  noResults: string;
  emptyPrompt: string;
  /** {n} */ resultsCount: string;
  browseHeading: string;
  footer: string;
};

export type WidgetCopy = {
  title: string;
  description: string;
  h1: string;
  sub: string;
  previewHeading: string;
  symbolsHeading: string;
  symbolsNote: string;
  snippetHeading: string;
  copyButton: string;
  copiedButton: string;
  openEmbed: string;
  resetButton: string;
  aboutHeading: string;
  aboutP: string;
  emptyNote: string;
  footer: string;
};

export type FeatureCopy = {
  compare: Record<Lang, CompareCopy>;
  invested: Record<Lang, InvestedCopy>;
  dca: Record<Lang, DcaCopy>;
  gold: Record<Lang, GoldCopy>;
  movers: Record<Lang, MoversCopy>;
  search: Record<Lang, SearchCopy>;
  widget: Record<Lang, WidgetCopy>;
};

export const compareCopy = (lang: Lang): CompareCopy => FEATURE_COPY.compare[lang];
export const investedCopy = (lang: Lang): InvestedCopy => FEATURE_COPY.invested[lang];
export const dcaCopy = (lang: Lang): DcaCopy => FEATURE_COPY.dca[lang];
export const goldCopy = (lang: Lang): GoldCopy => FEATURE_COPY.gold[lang];
export const moversCopy = (lang: Lang): MoversCopy => FEATURE_COPY.movers[lang];
export const searchCopy = (lang: Lang): SearchCopy => FEATURE_COPY.search[lang];
export const widgetCopy = (lang: Lang): WidgetCopy => FEATURE_COPY.widget[lang];

/** Replace {TOKEN} placeholders. Unknown tokens are left as-is. */
export function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{([A-Za-z]+)\}/g, (m, k) => vars[k] ?? m);
}
