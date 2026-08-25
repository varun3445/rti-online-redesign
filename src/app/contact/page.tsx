import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export default function ContactPage() {
  return (
    <main>
      <Nav />

      <section className="page-header">
        <span className="landing__eyebrow">CONTACT</span>
        <h1 className="page-header__title">
          Where the help desk <em>would go.</em>
        </h1>
        <p className="page-header__lede">
          This page marks the spot in the finished product &mdash; it doesn&rsquo;t
          route anywhere yet.
        </p>
      </section>

      <section className="section">
        <div className="right-cards">
          <div className="right-cards__item">
            <h3>Have an actual RTI query?</h3>
            <p>
              Go straight to{" "}
              <a href="https://rtionline.gov.in" target="_blank" rel="noopener noreferrer">
                rtionline.gov.in
              </a>{" "}
              &mdash; its own Contact Us page has the real helpline for the
              government&rsquo;s portal.
            </p>
          </div>
          <div className="right-cards__item">
            <h3>Have feedback on this redesign?</h3>
            <p>
              This was built for the Build What Moves India hackathon &mdash;
              send feedback through the hackathon&rsquo;s own channels rather
              than here.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
