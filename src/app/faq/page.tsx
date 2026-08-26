import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { faqItems } from "@/lib/faq-content";

export default function FaqPage() {
  return (
    <main>
      <Nav />

      <section className="ux4g-container ux4g-py-2xl">
        <span className="ux4g-label-m-strong ux4g-text-primary">FREQUENTLY ASKED</span>
        <h1 className="ux4g-heading-xl-strong ux4g-my-m">
          Before you <em>ask us.</em>
        </h1>
        <p className="ux4g-body-m-default ux4g-text-neutral-secondary">
          Straight answers, including about the parts of this prototype
          that are mocked on purpose.
        </p>
      </section>

      <section className="ux4g-container ux4g-py-2xl">
        <div className="ux4g-accordion ux4g-accordion-arrow-right" id="faqAccordion">
          {faqItems.map((item, i) => (
            <div key={item.q} className="ux4g-accordion__item">
              <h3 className="ux4g-accordion__header">
                <button
                  aria-controls={`faqItem${i}`}
                  aria-expanded="false"
                  className="ux4g-accordion__button collapsed"
                  type="button"
                  data-ux-target={`#faqItem${i}`}
                  data-ux-toggle="collapse"
                >
                  <span className="ux4g-accordion__button-content">
                    <span className="ux4g-accordion__title">{item.q}</span>
                  </span>
                </button>
              </h3>
              <div
                className="ux4g-accordion__collapse collapse"
                id={`faqItem${i}`}
                data-ux-parent="#faqAccordion"
              >
                <div className="ux4g-accordion__body">
                  <p className="ux4g-body-s-default ux4g-text-neutral-secondary">{item.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
