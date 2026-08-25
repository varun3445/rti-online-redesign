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

      <section className="page-header">
        <span className="landing__eyebrow">YOUR CASES, ONE VIEW</span>
        <h1 className="page-header__title">
          Every case. <em>One place.</em>
        </h1>
        <p className="page-header__lede">
          The example set every visitor sees. Even when a request splits
          across multiple departments internally, it shows up here as one
          case with one plain-language status &mdash; not a pile of
          registration numbers to track separately. Filed something under
          your own email?{" "}
          <Link href="/view-history" className="text-link">
            Find it in View History
          </Link>
          .
        </p>
      </section>

      <section className="section">
        <CaseList cases={cases} />
      </section>

      <section className="section section--cta">
        <h2>Filing something new?</h2>
        <p>It&rsquo;ll show up here the same way, collapsed into one view.</p>
        <Link href="/" className="button-link">
          Start a request &rarr;
        </Link>
      </section>

      <Footer />
    </main>
  );
}
