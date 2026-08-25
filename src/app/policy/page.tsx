import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export default function PolicyPage() {
  return (
    <main>
      <Nav />

      <section className="page-header">
        <span className="landing__eyebrow">POLICY</span>
        <h1 className="page-header__title">
          What actually happens <em>to your input.</em>
        </h1>
        <p className="page-header__lede">
          Not a real privacy policy for a real service &mdash; just a direct
          account of what this hackathon build does with what you type.
        </p>
      </section>

      <section className="section">
        <ul className="right-cards">
          <li className="right-cards__item">
            <h3>Your case is saved. Nothing else is.</h3>
            <p>
              Filing a request stores that case &mdash; subject, authority, the
              email you filed under &mdash; so it&rsquo;s there when you check
              My RTI or View History later. There&rsquo;s no login and no
              persistent session; the email is the only thing tying it back
              to you.
            </p>
          </li>
          <li className="right-cards__item">
            <h3>What leaves your browser</h3>
            <p>
              The text you type into the request composer, sent to
              OpenAI&rsquo;s API (when a key is configured) to draft your
              request. Without one, matching happens locally and nothing is
              sent anywhere.
            </p>
          </li>
          <li className="right-cards__item">
            <h3>Identity and payment stay simulated</h3>
            <p>
              The identity check and payment step never touch a real system
              &mdash; nothing resembling an actual OTP, Aadhaar, PAN, or card
              number should be entered here, since nothing you enter is
              validated against anything real.
            </p>
          </li>
          <li className="right-cards__item">
            <h3>Not affiliated with the Government of India</h3>
            <p>
              This is an independent redesign concept, not an official
              product of DoPT, NIC, or any government body.
            </p>
          </li>
        </ul>
      </section>

      <Footer />
    </main>
  );
}
