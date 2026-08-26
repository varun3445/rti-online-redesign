import Link from "next/link";

const LINKS = [
  { href: "/view-status", label: "View Status" },
  { href: "/view-history", label: "View History" },
  { href: "/faq", label: "FAQ" },
  { href: "/manual", label: "User Manual" },
  { href: "/contact", label: "Contact Us" },
  { href: "/policy", label: "Policy" },
];

export function Footer() {
  return (
    <footer className="ux4g-footer ux4g-bg-neutral-soft">
      <div className="ux4g-footer-wrapper">
        <div className="ux4g-f-d-md-flex ux4g-jc-between ux4g-flex-wrap ux4g-my-xl">
          <div className="ux4g-w-100 ux4g-py-2xl">
            <ul
              className="ux4g-grid ux4g-grid-cols-2 ux4g-md-grid-cols-3 ux4g-lg-grid-cols-6 ux4g-gap-m ux4g-text-center"
              style={{ listStyle: "none", padding: 0 }}
            >
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="ux4g-text-link-neutral-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="ux4g-fbs-t1">
        <p className="ux4g-body-xs-default ux4g-text-white">
          Prototype only. No real government service, identity verification,
          or payment is used.
        </p>
      </div>
    </footer>
  );
}
