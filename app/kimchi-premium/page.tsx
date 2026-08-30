import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import KimchiView from "@/components/KimchiView";
import { AFFILIATES, AFFILIATE_DISCLOSURE } from "@/config/affiliates";
import { getKimchiData } from "@/lib/kimchi";

export const dynamic = "force-dynamic";

const DESCRIPTION =
  "Live kimchi premium for Bitcoin and top altcoins — the price gap between Korea's Upbit exchange and global markets, updated every 30 seconds.";

export const metadata: Metadata = {
  title: "Kimchi Premium Tracker",
  description: DESCRIPTION,
  alternates: { canonical: "/kimchi-premium" },
  openGraph: {
    type: "website",
    siteName: "PNL404",
    title: "Kimchi Premium Tracker",
    description: DESCRIPTION,
    url: "/kimchi-premium",
  },
  twitter: { card: "summary_large_image", title: "Kimchi Premium Tracker", description: DESCRIPTION },
};

export default async function KimchiPage() {
  const initial = await getKimchiData();
  const partners = AFFILIATES.filter((p) => p.category === "Crypto Exchanges").slice(0, 3);

  return (
    <div className="paper">
      <header className="subhead">
        <Link className="crumb" href="/">
          ← PNL404
        </Link>
        <span className="subhead-note">Profit Not Found</span>
      </header>

      <KimchiView initial={initial} />

      <AdSlot slot="0000000004" format="leaderboard" />

      <section className="block prose">
        <div className="kicker">
          <h2 className="kicker-label">What Is the Kimchi Premium?</h2>
        </div>
        <p>
          The <b>kimchi premium</b> is the gap between cryptocurrency prices on South Korean exchanges and prices on
          global markets. When Bitcoin trades at a 3% premium, Korean buyers on Upbit are paying 3% more won-for-won
          than buyers elsewhere are paying in dollars. A negative reading — Koreans call it the{" "}
          <i>reverse premium</i> (역프리미엄) — means coins are cheaper in Korea.
        </p>
        <p>
          The gap exists because arbitrage is hard to execute against the Korean won. Korea's capital controls limit
          how much money can move across the border, exchanges require verified local bank accounts held by Korean
          residents, and transfer rules add friction to moving coins between venues. So when Korean retail demand
          surges, local prices can run ahead of the world's — and stay there. Historically the premium has swung from
          above 50% at the peak of the 2017–2018 frenzy to negative territory in bear markets, which makes it a
          widely-watched gauge of Korean retail sentiment.
        </p>
        <div className="kicker" style={{ paddingTop: 18 }}>
          <h2 className="kicker-label">How We Calculate It</h2>
        </div>
        <p>
          For each coin: <code>premium = Upbit price (KRW) ÷ (global price (USD) × USD/KRW) − 1</code>. Upbit prices
          come from Upbit's public API, global dollar prices from Coinbase trade data (CoinGecko's global average as
          fallback), and the USD/KRW rate from live FX data. Figures refresh automatically every 30 seconds. This is
          information, not investment advice — executing this arbitrage in practice involves regulatory, banking and
          transfer constraints.
        </p>
      </section>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">Trade Crypto</h2>
          <span className="kicker-note">Partner offers</span>
        </div>
        {partners.map((p) => (
          <a className="p-row" key={p.name} href={p.url} target="_blank" rel="noopener noreferrer sponsored">
            <span className="p-main">
              <span className="p-name">{p.name}</span>
              <span className="p-desc">{p.desc}</span>
            </span>
            <span className="p-arrow" aria-hidden="true">
              →
            </span>
          </a>
        ))}
        <p className="fineprint">{AFFILIATE_DISCLOSURE}</p>
      </section>

      <footer className="colophon">
        <p className="fine">
          Market data may be delayed and is provided for information only, not investment advice. © {new Date().getFullYear()} PNL404
        </p>
      </footer>
    </div>
  );
}
