import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { faqItems } from "@/lib/faq-content";

export default function FaqPage() {
  return (
    <main>
      <Nav />

      <section className="page-header">
        <span className="landing__eyebrow">FREQUENTLY ASKED</span>
        <h1 className="page-header__title">
          Before you <em>ask us.</em>
        </h1>
        <p className="page-header__lede">
          Straight answers, including about the parts of this prototype
          that are mocked on purpose.
        </p>
      </section>

      <section className="section">
        <ul className="faq-list">
          {faqItems.map((item) => (
            <li key={item.q} className="faq-item">
              <details>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            </li>
          ))}
        </ul>
      </section>

      <Footer />
    </main>
  );
}
