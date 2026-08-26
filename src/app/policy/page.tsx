import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export default function PolicyPage() {
  return (
    <main>
      <Nav />

      <section className="ux4g-container ux4g-py-2xl">
        <span className="rti-mono-label ux4g-label-m-strong ux4g-text-primary">Policy</span>
        <h1 className="ux4g-heading-xl-strong ux4g-my-m">
          What actually happens <em>to your input.</em>
        </h1>
        <p className="ux4g-body-m-default ux4g-text-neutral-secondary">
          Not a real privacy policy for a real service &mdash; just a direct
          account of what this hackathon build does with what you type.
        </p>
      </section>

      <section className="ux4g-container ux4g-py-2xl">
        <ul className="ux4g-grid ux4g-grid-auto-fit-300 ux4g-gap-m" style={{ listStyle: "none", padding: 0 }}>
          <li className="ux4g-card ux4g-card-outline ux4g-card-vertical ux4g-shadow-l2">
            <div className="ux4g-card-body">
              <h3 className="ux4g-card-title">Your case is saved. Nothing else is.</h3>
              <p className="ux4g-body-s-default ux4g-text-neutral-secondary ux4g-mt-s">
                Filing a request stores that case &mdash; subject, authority, the
                email you filed under &mdash; so it&rsquo;s there when you check
                My RTI or View History later. There&rsquo;s no login and no
                persistent session; the email is the only thing tying it back
                to you.
              </p>
            </div>
          </li>
          <li className="ux4g-card ux4g-card-outline ux4g-card-vertical ux4g-shadow-l2">
            <div className="ux4g-card-body">
              <h3 className="ux4g-card-title">What leaves your browser</h3>
              <p className="ux4g-body-s-default ux4g-text-neutral-secondary ux4g-mt-s">
                The text you type into the request composer, sent to
                OpenAI&rsquo;s API (when a key is configured) to draft your
                request. Without one, matching happens locally and nothing is
                sent anywhere.
              </p>
            </div>
          </li>
          <li className="ux4g-card ux4g-card-outline ux4g-card-vertical ux4g-shadow-l2">
            <div className="ux4g-card-body">
              <h3 className="ux4g-card-title">Identity and payment stay simulated</h3>
              <p className="ux4g-body-s-default ux4g-text-neutral-secondary ux4g-mt-s">
                The identity check and payment step never touch a real system
                &mdash; nothing resembling an actual OTP, Aadhaar, PAN, or card
                number should be entered here, since nothing you enter is
                validated against anything real.
              </p>
            </div>
          </li>
          <li className="ux4g-card ux4g-card-outline ux4g-card-vertical ux4g-shadow-l2">
            <div className="ux4g-card-body">
              <h3 className="ux4g-card-title">Not affiliated with the Government of India</h3>
              <p className="ux4g-body-s-default ux4g-text-neutral-secondary ux4g-mt-s">
                This is an independent redesign concept, not an official
                product of DoPT, NIC, or any government body.
              </p>
            </div>
          </li>
        </ul>
      </section>

      <Footer />
    </main>
  );
}
