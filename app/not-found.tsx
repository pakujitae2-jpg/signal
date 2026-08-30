import Link from "next/link";

export default function NotFound() {
  return (
    <div className="paper">
      <header className="subhead">
        <Link className="crumb" href="/">
          ← PNL404
        </Link>
        <span className="subhead-note">Profit Not Found</span>
      </header>

      <div className="nf">
        <p className="nf-code">HTTP 404 · Working as intended</p>
        <p className="nf-404">
          404<span className="nf-cursor" aria-hidden="true" />
        </p>
        <h1 className="nf-title">Profit Not Found.</h1>
        <p className="nf-text">
          This page doesn&rsquo;t exist. Statistically speaking, neither do most trading profits. The markets, however,
          are very much open:
        </p>
        <nav className="nf-links" aria-label="Sections">
          <Link href="/">Front Page</Link>
          <Link href="/markets/us">U.S.</Link>
          <Link href="/markets/japan">Japan</Link>
          <Link href="/markets/korea">Korea</Link>
          <Link href="/markets/crypto">Crypto</Link>
          <Link href="/kimchi-premium">Kimchi Premium</Link>
        </nav>
      </div>
    </div>
  );
}
