import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CaseList } from "@/components/CaseList";
import { fetchCasesForEmail } from "@/lib/rti-cases-db";

export const dynamic = "force-dynamic";

export default async function MyRtiPage() {
  const cases = await fetchCasesForEmail();

  return (
    <main>
      <Nav />

      <section className="ux4g-container ux4g-py-2xl">
        <span className="rti-mono-label ux4g-label-m-strong ux4g-text-primary">Your Cases, One View</span>
        <h1 className="ux4g-heading-xl-strong ux4g-my-m">
          Every case. <em>One place.</em>
        </h1>
        <p className="ux4g-body-m-default ux4g-text-neutral-secondary">
          The example set every visitor sees. Even when a request splits
          across multiple departments internally, it shows up here as one
          case with one plain-language status &mdash; not a pile of
          registration numbers to track separately. Filed something under
          your own email?{" "}
          <Link href="/view-history" className="ux4g-text-link-md">
            Find it in View History
          </Link>
          .
        </p>
      </section>

      <section className="ux4g-container ux4g-py-2xl">
        <CaseList cases={cases} />
      </section>

      <section className="rti-band-soft ux4g-py-2xl">
        <div className="ux4g-container">
          <h2 className="ux4g-heading-l-strong">Filing something new?</h2>
          <p className="ux4g-body-m-default ux4g-text-neutral-secondary ux4g-mb-m">
            It&rsquo;ll show up here the same way, collapsed into one view.
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
