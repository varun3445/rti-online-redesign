import Link from "next/link";

const LINKS = [
  { href: "/view-status", label: "View Status" },
  { href: "/my-rti", label: "My RTI" },
  { href: "/faq", label: "FAQ" },
  { href: "/manual", label: "User Manual" },
  { href: "/contact", label: "Contact Us" },
  { href: "/policy", label: "Policy" },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-neutral-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <ul className="grid grid-cols-2 gap-6 text-center sm:grid-cols-3 lg:grid-cols-6" style={{ listStyle: "none", padding: 0 }}>
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-sm text-neutral-600 hover:text-accent-600">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-accent-950 px-4 py-3 text-center sm:px-6">
        <p className="text-xs text-white/80">
          Prototype only. No real government service, identity verification, or payment is used.
        </p>
      </div>
    </footer>
  );
}
