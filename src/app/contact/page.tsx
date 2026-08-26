import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";

export default function ContactPage() {
  return (
    <main className="flex flex-1 flex-col">
      <Nav />

      <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        <span className="font-mono text-xs font-semibold uppercase tracking-wide text-accent-600">Contact</span>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold text-neutral-900">
          Where the help desk <em>would go.</em>
        </h1>
        <p className="mt-3 text-neutral-600">
          This page marks the spot in the finished product &mdash; it doesn&rsquo;t route anywhere yet.
        </p>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card>
            <h3 className="text-base font-semibold text-neutral-900">Have an actual RTI query?</h3>
            <p className="mt-2 text-sm text-neutral-500">
              Go straight to{" "}
              <a
                href="https://rtionline.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent-600"
              >
                rtionline.gov.in
              </a>{" "}
              &mdash; its own Contact Us page has the real helpline for the government&rsquo;s portal.
            </p>
          </Card>
          <Card>
            <h3 className="text-base font-semibold text-neutral-900">Have feedback on this redesign?</h3>
            <p className="mt-2 text-sm text-neutral-500">
              This was built for the Build What Moves India hackathon &mdash; send feedback through the
              hackathon&rsquo;s own channels rather than here.
            </p>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
}
