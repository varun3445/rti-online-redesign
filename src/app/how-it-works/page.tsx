import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { whatIsRti, whatYouCanGet, howItWorksSteps } from "@/lib/rti-content";

// UX4G Material Icons Outlined ligature names — see foundations/icons.css.
const EXAMPLE_ICONS = ["schedule", "description", "chat", "payments"];
const STEP_ICONS = ["chat", "account_balance", "payments", "task_alt"];

export default function HowItWorksPage() {
  return (
    <main>
      <Nav />

      <Reveal>
        <section className="ux4g-container ux4g-py-2xl">
          <span className="ux4g-label-m-strong ux4g-text-primary">
            <span className="rti-motif-dot" aria-hidden="true"></span>
            {whatIsRti.eyebrow}
          </span>
          <h1 className="rti-display ux4g-heading-xl-strong ux4g-my-m">{whatIsRti.title}</h1>
          <p className="ux4g-body-m-default ux4g-text-neutral-secondary">{whatIsRti.body}</p>
        </section>
      </Reveal>

      <Reveal>
        <section className="ux4g-container ux4g-py-2xl">
          <h2 className="ux4g-label-m-strong ux4g-text-primary">
            <span className="rti-motif-dot" aria-hidden="true"></span>
            WHAT YOU CAN ACTUALLY GET
          </h2>
          <div className="ux4g-grid ux4g-grid-auto-fit-300 ux4g-gap-m ux4g-my-m">
            {whatYouCanGet.map((item, i) => {
              const iconName = EXAMPLE_ICONS[i % EXAMPLE_ICONS.length];
              return (
                <article
                  key={item.title}
                  className="ux4g-card ux4g-card-outline ux4g-card-vertical ux4g-shadow-l2 rti-card-lift"
                >
                  <div className="ux4g-card-body">
                    <div className="ux4g-mb-s">
                      <i className="ux4g-icon-outlined ux4g-fs-24 ux4g-text-primary" aria-hidden="true">
                        {iconName}
                      </i>
                    </div>
                    <h3 className="ux4g-card-title">{item.title}</h3>
                    <p className="ux4g-body-s-strong ux4g-mt-s">{item.example}</p>
                    <p className="ux4g-body-s-default ux4g-text-neutral-secondary">{item.note}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="ux4g-container ux4g-py-2xl">
          <h2 className="ux4g-label-m-strong ux4g-text-primary">
            <span className="rti-motif-dot" aria-hidden="true"></span>
            HOW A REQUEST MOVES THROUGH THIS TOOL
          </h2>
          <ol className="ux4g-my-m" style={{ listStyle: "none", padding: 0 }}>
            {howItWorksSteps.map((s, i) => {
              const iconName = STEP_ICONS[i % STEP_ICONS.length];
              return (
                <li key={s.step} className="ux4g-d-flex ux4g-gap-6xs ux4g-py-m">
                  <span>
                    <i className="ux4g-icon-outlined ux4g-fs-24 ux4g-text-primary" aria-hidden="true">
                      {iconName}
                    </i>
                  </span>
                  <div>
                    <h3 className="ux4g-title-s-strong">{s.title}</h3>
                    <p className="ux4g-body-s-default ux4g-text-neutral-secondary">{s.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      </Reveal>

      <Reveal>
        <section className="ux4g-bg-primary-soft ux4g-py-2xl">
          <div className="ux4g-container">
            <h2 className="rti-display ux4g-heading-l-strong">Have something specific you need?</h2>
            <p className="ux4g-body-m-default ux4g-text-neutral-secondary ux4g-mb-m">
              Describe it in your own words and we&rsquo;ll take it from there.
            </p>
            <Link href="/" className="ux4g-btn-primary ux4g-btn-md">
              Start a request &rarr;
            </Link>
          </div>
        </section>
      </Reveal>

      <Footer />
    </main>
  );
}
