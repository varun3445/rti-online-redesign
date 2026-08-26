import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/ui/Icon";
import { IconBadge } from "@/components/ui/IconBadge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { whatIsRti, whatYouCanGet, howItWorksSteps } from "@/lib/rti-content";

const EXAMPLE_ICONS = ["schedule", "description", "chat", "payments"];
const STEP_ICONS = ["chat", "account_balance", "payments", "task_alt"];

export default function HowItWorksPage() {
  return (
    <main className="flex flex-1 flex-col">
      <Nav />

      <Reveal>
        <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
          <span className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wide text-accent-600">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-600" aria-hidden="true" />
            {whatIsRti.eyebrow}
          </span>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold text-neutral-900">
            {whatIsRti.title}
          </h1>
          <p className="mt-3 text-neutral-600">{whatIsRti.body}</p>
        </section>
      </Reveal>

      <Reveal>
        <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
          <h2 className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wide text-accent-600">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-600" aria-hidden="true" />
            What You Can Actually Get
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {whatYouCanGet.map((item, i) => {
              const iconName = EXAMPLE_ICONS[i % EXAMPLE_ICONS.length];
              return (
                <Card key={item.title} lift>
                  <IconBadge icon={iconName} className="mb-3" />
                  <h3 className="text-base font-semibold text-neutral-900">{item.title}</h3>
                  <p className="mt-2 text-sm font-medium text-neutral-800">{item.example}</p>
                  <p className="mt-1 text-sm text-neutral-500">{item.note}</p>
                </Card>
              );
            })}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wide text-accent-600">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-600" aria-hidden="true" />
            How a Request Moves Through This Tool
          </h2>
          <ol className="mt-6 flex flex-col divide-y divide-neutral-200" style={{ listStyle: "none", padding: 0 }}>
            {howItWorksSteps.map((s, i) => {
              const iconName = STEP_ICONS[i % STEP_ICONS.length];
              return (
                <li key={s.step} className="flex gap-4 py-4">
                  <Icon name={iconName} size={24} className="mt-0.5 shrink-0 text-accent-600" />
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900">{s.title}</h3>
                    <p className="mt-1 text-sm text-neutral-500">{s.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      </Reveal>

      <Reveal>
        <section className="bg-gradient-to-br from-accent-50 to-accent-100 py-16">
          <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-neutral-900">
              Have something specific you need?
            </h2>
            <p className="mt-2 mb-4 text-neutral-600">Describe it in your own words and we&rsquo;ll take it from there.</p>
            <Button href="/">Start a request &rarr;</Button>
          </div>
        </section>
      </Reveal>

      <Footer />
    </main>
  );
}
