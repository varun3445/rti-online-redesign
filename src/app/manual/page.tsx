import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

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
    <main>
      <Nav />

      <section className="ux4g-container ux4g-py-2xl">
        <span className="ux4g-label-m-strong ux4g-text-primary">USER MANUAL</span>
        <h1 className="ux4g-heading-xl-strong ux4g-my-m">
          The full walkthrough, <em>step by step.</em>
        </h1>
        <p className="ux4g-body-m-default ux4g-text-neutral-secondary">
          A literal instruction sheet, not a pitch &mdash; for anyone who&rsquo;d
          rather read the steps than click through them cold.
        </p>
      </section>

      <section className="ux4g-container ux4g-py-2xl">
        <ol style={{ listStyle: "none", padding: 0 }} className="ux4g-d-flex ux4g-flex-column ux4g-gap-4xs">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="ux4g-d-flex ux4g-gap-6xs ux4g-py-m"
              style={{ borderBottom: i < steps.length - 1 ? "1px solid var(--ux4g-border-color-neutral-subtle)" : undefined }}
            >
              <span className="ux4g-badge-digit-primary ux4g-badge-l" aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <h3 className="ux4g-title-s-strong">{step.title}</h3>
                <p className="ux4g-body-s-default ux4g-text-neutral-secondary ux4g-mt-2xs">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="ux4g-bg-primary-soft ux4g-py-2xl">
        <div className="ux4g-container">
          <h2 className="ux4g-heading-l-strong">Ready to try it?</h2>
          <p className="ux4g-body-m-default ux4g-text-neutral-secondary ux4g-mb-m">
            Start with step one &mdash; describe your problem in your own words.
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
