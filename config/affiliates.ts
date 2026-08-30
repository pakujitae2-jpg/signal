// Partner configuration for the "Where to Trade" module.
// Replace each url with your own referral link or affiliate-network
// tracking link (Impact, CJ, Awin, or the partner's own program).
// Rows render grouped by category; an FTC-style disclosure is shown
// automatically beneath the module.

export type Affiliate = {
  category: "Crypto Exchanges" | "Brokerages" | "Tools & Research";
  name: string;
  desc: string;
  url: string;
};

export const AFFILIATES: Affiliate[] = [
  {
    category: "Crypto Exchanges",
    name: "Binance",
    desc: "The world's largest crypto exchange. Fee discount for new sign-ups.",
    url: "https://www.binance.com/register?ref=Z0QZG6TP",
  },
  {
    category: "Crypto Exchanges",
    name: "Coinbase",
    desc: "Regulated US exchange. The easiest on-ramp for beginners.",
    url: "https://example.com/your-coinbase-affiliate",
  },
  {
    category: "Crypto Exchanges",
    name: "Kraken",
    desc: "Veteran exchange with a strong security track record.",
    url: "https://example.com/your-kraken-affiliate",
  },
  {
    category: "Brokerages",
    name: "Interactive Brokers",
    desc: "Trade US, Japanese and Korean equities from one account.",
    url: "https://example.com/your-ibkr-referral",
  },
  {
    category: "Brokerages",
    name: "eToro",
    desc: "Multi-asset platform for stocks, ETFs and crypto.",
    url: "https://example.com/your-etoro-affiliate",
  },
  {
    category: "Tools & Research",
    name: "TradingView",
    desc: "Advanced charting, screeners and community ideas.",
    url: "https://example.com/your-tradingview-affiliate",
  },
  {
    category: "Tools & Research",
    name: "Ledger",
    desc: "Hardware wallets for keeping crypto in cold storage.",
    url: "https://example.com/your-ledger-affiliate",
  },
];

export const AFFILIATE_DISCLOSURE =
  "Some links above are referral or affiliate links. Signal may earn a commission when you sign up through them, at no additional cost to you.";
