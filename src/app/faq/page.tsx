import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { Accordion } from "@/components/ui/Accordion";
import { faqItems } from "@/lib/faq-content";

export default function FaqPage() {
  return (
    <main className="flex flex-1 flex-col">
      <Nav />

      <Reveal>
        <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
          <span className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wide text-accent-600">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-600" aria-hidden="true" />
            Frequently Asked
          </span>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold text-neutral-900">
            Before you <em>ask us.</em>
          </h1>
          <p className="mt-3 text-neutral-600">
            Straight answers, including about the parts of this prototype that are mocked on purpose.
          </p>
        </section>
      </Reveal>

      <Reveal>
        <section className="mx-auto w-full max-w-3xl px-4 pb-16 sm:px-6">
          <Accordion items={faqItems} />
        </section>
      </Reveal>

      <Footer />
    </main>
  );
}
