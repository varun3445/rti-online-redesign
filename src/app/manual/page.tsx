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

      <section className="page-header">
        <span className="landing__eyebrow">USER MANUAL</span>
        <h1 className="page-header__title">
          The full walkthrough, <em>step by step.</em>
        </h1>
        <p className="page-header__lede">
          A literal instruction sheet, not a pitch &mdash; for anyone who&rsquo;d
          rather read the steps than click through them cold.
        </p>
      </section>

      <section className="section">
        <ol className="numbered-list">
          {steps.map((step, i) => (
            <li key={step.title} className="numbered-list__item">
              <span className="numbered-list__index">{i + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="section section--cta">
        <h2>Ready to try it?</h2>
        <p>Start with step one &mdash; describe your problem in your own words.</p>
        <Link href="/" className="button-link">
          Start a request &rarr;
        </Link>
      </section>

      <Footer />
    </main>
  );
}
