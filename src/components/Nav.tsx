import Link from "next/link";

export function Nav() {
  return (
    <div className="site-nav-shell">
      <nav className="site-nav">
        <Link href="/" className="site-nav__brand">
          RTI Online
        </Link>
        <span className="site-nav__links">
          <Link href="/how-it-works">How it works</Link>
          <Link href="/your-rights">Your rights</Link>
          <Link href="/my-rti">My RTI</Link>
        </span>
        <Link href="/" className="site-nav__cta">
          Start a request &rarr;
        </Link>
      </nav>
    </div>
  );
}
