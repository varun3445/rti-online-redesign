import Link from "next/link";
import { Nav } from "@/components/Nav";
import { whatIsRti, whatYouCanGet, howItWorksSteps } from "@/lib/rti-content";
import { ClockIcon, DocumentIcon, ChatIcon, CoinsIcon, BuildingIcon, MapPinCheckIcon } from "@/components/icons";

const EXAMPLE_ICONS = [ClockIcon, DocumentIcon, ChatIcon, CoinsIcon];
const STEP_ICONS = [ChatIcon, BuildingIcon, CoinsIcon, MapPinCheckIcon];

export default function HowItWorksPage() {
  return (
    <main>
      <Nav />

      <section className="page-header">
        <span className="landing__eyebrow">{whatIsRti.eyebrow}</span>
        <h1 className="page-header__title">{whatIsRti.title}</h1>
        <p className="page-header__lede">{whatIsRti.body}</p>
      </section>

      <section className="section">
        <span className="section__eyebrow">WHAT YOU CAN ACTUALLY GET</span>
        <div className="info-grid">
          {whatYouCanGet.map((item, i) => {
            const Icon = EXAMPLE_ICONS[i % EXAMPLE_ICONS.length];
            return (
              <article key={item.title} className="info-card">
                <div className="info-card__icon">
                  <Icon />
                </div>
                <h3>{item.title}</h3>
                <p className="info-card__quote">{item.example}</p>
                <p className="info-card__note">{item.note}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section">
        <span className="section__eyebrow">HOW A REQUEST MOVES THROUGH THIS TOOL</span>
        <ol className="numbered-list">
          {howItWorksSteps.map((s, i) => {
            const Icon = STEP_ICONS[i % STEP_ICONS.length];
            return (
              <li key={s.step} className="numbered-list__item">
                <span className="numbered-list__index">
                  <Icon />
                </span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="section section--cta">
        <h2>Have something specific you need?</h2>
        <p>Describe it in your own words and we&rsquo;ll take it from there.</p>
        <Link href="/" className="button-link">
          Start a request &rarr;
        </Link>
      </section>

      <footer>
        Prototype only. No real government service, identity verification, or
        payment is used.
      </footer>
    </main>
  );
}
