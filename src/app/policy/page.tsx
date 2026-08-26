import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";

export default function PolicyPage() {
  return (
    <main className="flex flex-1 flex-col">
      <Nav />

      <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        <span className="font-mono text-xs font-semibold uppercase tracking-wide text-accent-600">Policy</span>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold text-neutral-900">
          What actually happens <em>to your input.</em>
        </h1>
        <p className="mt-3 text-neutral-600">
          Not a real privacy policy for a real service &mdash; just a direct account of what this hackathon build
          does with what you type.
        </p>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ listStyle: "none", padding: 0 }}>
          <li className="h-full">
            <Card className="h-full">
              <h3 className="text-base font-semibold text-neutral-900">Your case is saved. Nothing else is.</h3>
              <p className="mt-2 text-sm text-neutral-500">
                Filing a request stores that case &mdash; subject, authority, the email you filed under &mdash; so
                it&rsquo;s there when you check My RTI or View History later. There&rsquo;s no login and no
                persistent session; the email is the only thing tying it back to you.
              </p>
            </Card>
          </li>
          <li className="h-full">
            <Card className="h-full">
              <h3 className="text-base font-semibold text-neutral-900">What leaves your browser</h3>
              <p className="mt-2 text-sm text-neutral-500">
                The text you type into the request composer, sent to OpenAI&rsquo;s API (when a key is configured)
                to draft your request. Without one, matching happens locally and nothing is sent anywhere.
              </p>
            </Card>
          </li>
          <li className="h-full">
            <Card className="h-full">
              <h3 className="text-base font-semibold text-neutral-900">Identity and payment stay simulated</h3>
              <p className="mt-2 text-sm text-neutral-500">
                The identity check and payment step never touch a real system &mdash; nothing resembling an actual
                OTP, Aadhaar, PAN, or card number should be entered here, since nothing you enter is validated
                against anything real.
              </p>
            </Card>
          </li>
          <li className="h-full">
            <Card className="h-full">
              <h3 className="text-base font-semibold text-neutral-900">Not affiliated with the Government of India</h3>
              <p className="mt-2 text-sm text-neutral-500">
                This is an independent redesign concept, not an official product of DoPT, NIC, or any government
                body.
              </p>
            </Card>
          </li>
        </ul>
      </section>

      <Footer />
    </main>
  );
}
