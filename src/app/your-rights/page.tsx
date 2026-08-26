import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { yourRights } from "@/lib/rti-content";

export default function YourRightsPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col outline-none">
      <Nav />

      <Reveal>
        <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
          <span className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wide text-accent-600">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-600" aria-hidden="true" />
            Under the RTI Act, 2005
          </span>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold text-neutral-900">
            The law is on your <em>side.</em>
          </h1>
          <p className="mt-3 text-neutral-600">
            Filing a request isn&rsquo;t asking for a favor — it&rsquo;s exercising a legal right, with real obligations
            on the other end.
          </p>
        </section>
      </Reveal>

      <Reveal>
        <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ listStyle: "none", padding: 0 }}>
            {yourRights.map((r) => (
              <li key={r.title} className="h-full">
                <Card lift className="h-full">
                  <h3 className="text-base font-semibold text-neutral-900">{r.title}</h3>
                  <p className="mt-2 text-sm text-neutral-500">{r.body}</p>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      <Reveal>
        <section className="bg-gradient-to-br from-accent-50 to-accent-100 py-16">
          <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-neutral-900">
              Ready to use it?
            </h2>
            <p className="mt-2 mb-4 text-neutral-600">
              Describe your problem in plain language and we&rsquo;ll draft the request.
            </p>
            <Button href="/">Start a request &rarr;</Button>
          </div>
        </section>
      </Reveal>

      <Footer />
    </main>
  );
}
