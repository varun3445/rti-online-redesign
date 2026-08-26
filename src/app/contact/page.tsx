import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export default function ContactPage() {
  return (
    <main>
      <Nav />

      <section className="ux4g-container ux4g-py-2xl">
        <span className="ux4g-label-m-strong ux4g-text-primary">CONTACT</span>
        <h1 className="ux4g-heading-xl-strong ux4g-my-m">
          Where the help desk <em>would go.</em>
        </h1>
        <p className="ux4g-body-m-default ux4g-text-neutral-secondary">
          This page marks the spot in the finished product &mdash; it doesn&rsquo;t
          route anywhere yet.
        </p>
      </section>

      <section className="ux4g-container ux4g-py-2xl">
        <div className="ux4g-grid ux4g-grid-auto-fit-300 ux4g-gap-m">
          <div className="ux4g-card ux4g-card-outline ux4g-card-vertical ux4g-shadow-l2">
            <div className="ux4g-card-body">
              <h3 className="ux4g-card-title">Have an actual RTI query?</h3>
              <p className="ux4g-body-s-default ux4g-text-neutral-secondary ux4g-mt-s">
                Go straight to{" "}
                <a
                  href="https://rtionline.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ux4g-text-link-md"
                >
                  rtionline.gov.in
                </a>{" "}
                &mdash; its own Contact Us page has the real helpline for the
                government&rsquo;s portal.
              </p>
            </div>
          </div>
          <div className="ux4g-card ux4g-card-outline ux4g-card-vertical ux4g-shadow-l2">
            <div className="ux4g-card-body">
              <h3 className="ux4g-card-title">Have feedback on this redesign?</h3>
              <p className="ux4g-body-s-default ux4g-text-neutral-secondary ux4g-mt-s">
                This was built for the Build What Moves India hackathon &mdash;
                send feedback through the hackathon&rsquo;s own channels rather
                than here.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
