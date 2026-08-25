import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { yourRights } from "@/lib/rti-content";

export default function YourRightsPage() {
  return (
    <main>
      <Nav />

      <section className="page-header">
        <span className="landing__eyebrow">UNDER THE RTI ACT, 2005</span>
        <h1 className="page-header__title">
          The law is on your <em>side.</em>
        </h1>
        <p className="page-header__lede">
          Filing a request isn&rsquo;t asking for a favor — it&rsquo;s exercising a
          legal right, with real obligations on the other end.
        </p>
      </section>

      <section className="section">
        <ul className="right-cards">
          {yourRights.map((r) => (
            <li key={r.title} className="right-cards__item">
              <h3>{r.title}</h3>
              <p>{r.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="section section--cta">
        <h2>Ready to use it?</h2>
        <p>Describe your problem in plain language and we&rsquo;ll draft the request.</p>
        <Link href="/" className="button-link">
          Start a request &rarr;
        </Link>
      </section>

      <Footer />
    </main>
  );
}
