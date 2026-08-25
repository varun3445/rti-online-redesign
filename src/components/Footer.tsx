import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__links">
        <Link href="/view-status">View Status</Link>
        <Link href="/view-history">View History</Link>
        <Link href="/faq">FAQ</Link>
        <Link href="/manual">User Manual</Link>
        <Link href="/contact">Contact Us</Link>
        <Link href="/policy">Policy</Link>
      </div>
      <p className="site-footer__disclosure">
        Prototype only. No real government service, identity verification, or
        payment is used.
      </p>
    </footer>
  );
}
