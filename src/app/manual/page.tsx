import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";

const steps = [
  {
    title: "Describe your problem",
    body: "On the homepage, type what's going on in plain language — no legal phrasing needed. Example: \"why is my PF withdrawal claim taking so long?\"",
  },
  {
    title: "Review the assistant's match and draft",
    body: "The assistant identifies the likely Public Authority and drafts a formatted RTI request. Read both, and edit the draft directly if anything's off before continuing.",
  },
  {
    title: "Keep the conversation going if needed",
    body: "Not quite right? Send a follow-up in the same thread — \"also mention my PAN\" or \"this is actually about my father's claim, not mine\" — and the draft updates.",
  },
  {
    title: "Complete the one-time identity check",
    body: "Enter the email you're filing under, then the code 123456 — a simulated check, so nothing's actually sent. That email is what ties the case to you afterward.",
  },
  {
    title: "Pay the fee, or use the BPL waiver",
    body: "₹10 for most applicants (simulated — no real transaction), or use the BPL waiver if you're below the poverty line with a valid certificate.",
  },
  {
    title: "Save your registration number",
    body: "You get one case ID in the real registration-number format, even if a Nodal Officer later splits the request across departments internally.",
  },
  {
    title: "Track it from My RTI or View History",
    body: "My RTI shows the shared example set; View History looks up whatever you've actually filed, by the same email. Either way, a split case still shows as one card with one plain-language status.",
  },
];

export default function ManualPage() {
  return (
    <main className="flex flex-1 flex-col">
      <Nav />

      <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        <span className="font-mono text-xs font-semibold uppercase tracking-wide text-accent-600">User Manual</span>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold text-neutral-900">
          The full walkthrough, <em>step by step.</em>
        </h1>
        <p className="mt-3 text-neutral-600">
          A literal instruction sheet, not a pitch &mdash; for anyone who&rsquo;d rather read the steps than click
          through them cold.
        </p>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 pb-16 sm:px-6">
        <ol style={{ listStyle: "none", padding: 0 }} className="flex flex-col divide-y divide-neutral-200">
          {steps.map((step, i) => (
            <li key={step.title} className="flex gap-4 py-4">
              <span
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-600 text-sm font-semibold text-white"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">{step.title}</h3>
                <p className="mt-1 text-sm text-neutral-500">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-gradient-to-br from-accent-50 to-accent-100 py-16">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-neutral-900">
            Ready to try it?
          </h2>
          <p className="mt-2 mb-4 text-neutral-600">Start with step one &mdash; describe your problem in your own words.</p>
          <Button href="/">Start a request &rarr;</Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
