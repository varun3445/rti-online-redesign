import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { yourRights } from "@/lib/rti-content";

export default function YourRightsPage() {
  return (
    <main>
      <Nav />

      <section className="ux4g-container ux4g-py-2xl">
        <span className="ux4g-label-m-strong ux4g-text-primary">UNDER THE RTI ACT, 2005</span>
        <h1 className="ux4g-heading-xl-strong ux4g-my-m">
          The law is on your <em>side.</em>
        </h1>
        <p className="ux4g-body-m-default ux4g-text-neutral-secondary">
          Filing a request isn&rsquo;t asking for a favor — it&rsquo;s exercising a
          legal right, with real obligations on the other end.
        </p>
      </section>

      <section className="ux4g-container ux4g-py-2xl">
        <ul className="ux4g-grid ux4g-grid-auto-fit-300 ux4g-gap-m" style={{ listStyle: "none", padding: 0 }}>
          {yourRights.map((r) => (
            <li key={r.title} className="ux4g-card ux4g-card-outline ux4g-card-vertical ux4g-shadow-l2">
              <div className="ux4g-card-body">
                <h3 className="ux4g-card-title">{r.title}</h3>
                <p className="ux4g-body-s-default ux4g-text-neutral-secondary ux4g-mt-s">{r.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="ux4g-bg-primary-soft ux4g-py-2xl">
        <div className="ux4g-container">
          <h2 className="ux4g-heading-l-strong">Ready to use it?</h2>
          <p className="ux4g-body-m-default ux4g-text-neutral-secondary ux4g-mb-m">
            Describe your problem in plain language and we&rsquo;ll draft the request.
          </p>
          <Link href="/" className="ux4g-btn-primary ux4g-btn-md">
            Start a request &rarr;
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
