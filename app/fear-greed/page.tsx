import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import FearGreedView from "@/components/FearGreedView";
import { AFFILIATES, AFFILIATE_DISCLOSURE } from "@/config/affiliates";
import { getFearGreed } from "@/lib/feargreed";

export const dynamic = "force-dynamic";

const DESCRIPTION =
  "Live Crypto Fear & Greed Index — today's market sentiment score from 0 (extreme fear) to 100 (extreme greed), with yesterday, last week, last month and a 90-day history.";

export const metadata: Metadata = {
  title: "Crypto Fear & Greed Index",
  description: DESCRIPTION,
  alternates: { canonical: "/fear-greed" },
  openGraph: {
    type: "website",
    siteName: "PNL404",
    title: "Crypto Fear & Greed Index",
    description: DESCRIPTION,
    url: "/fear-greed",
  },
  twitter: { card: "summary_large_image", title: "Crypto Fear & Greed Index", description: DESCRIPTION },
};

export default async function FearGreedPage() {
  const initial = await getFearGreed();
  const partners = AFFILIATES.filter((p) => p.category === "Crypto Exchanges").slice(0, 3);

  return (
    <div className="paper">
      <header className="subhead">
        <Link className="crumb" href="/">
          ← PNL404
        </Link>
        <span className="subhead-note">Profit Not Found</span>
      </header>

      <FearGreedView initial={initial} />

      <AdSlot slot="0000000006" format="leaderboard" />

      <section className="block prose">
        <div className="kicker">
          <h2 className="kicker-label">How to Read It</h2>
        </div>
        <p>
          The Crypto Fear &amp; Greed Index compresses market sentiment into a single number between 0 and 100. Low
          readings mean investors are fearful — selling pressure, falling prices, nervous headlines. High readings mean
          greed: buying frenzies, parabolic charts, and the feeling that everyone is getting rich but you.
        </p>
        <p>
          The score blends several inputs: price volatility, market momentum and volume, social media activity,
          Bitcoin&rsquo;s share of total market capitalization, and Google search trends. It is published once a day, so
          the number moves in daily steps rather than tick by tick.
        </p>
        <p>
          The index is a contrarian tool by design. As the saying goes, be fearful when others are greedy and greedy
          when others are fearful — extreme fear has historically marked points where assets were oversold, and extreme
          greed points where a correction was due. It is a sentiment gauge, not a signal: it says how the crowd feels
          today, not what prices will do tomorrow.
        </p>
        <p>
          Related: see the <Link className="statline-link" href="/kimchi-premium">kimchi premium</Link> for how Korean
          retail demand compares with global prices, or the{" "}
          <Link className="statline-link" href="/markets/crypto">crypto market page</Link> for live prices.
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
          Sentiment data from alternative.me. Provided for information only, not investment advice. ©{" "}
          {new Date().getFullYear()} PNL404
        </p>
      </footer>
    </div>
  );
}
