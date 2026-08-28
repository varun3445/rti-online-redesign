"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AccessibilityBar } from "@/components/ui/AccessibilityBar";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/your-rights", label: "Your rights" },
  { href: "/view-status", label: "View Status" },
  { href: "/my-rti", label: "My RTI" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <AccessibilityBar />

      <nav
        className={cn(
          "sticky top-0 z-40 transition-all duration-200",
          scrolled ? "bg-white/85 shadow-[0_1px_0_var(--color-neutral-200)] backdrop-blur-md" : "bg-white"
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/"
            onClick={(e) => {
              // Home's step state (chat/verify/pay/done) lives in client
              // state, not the URL — a same-route Link navigation doesn't
              // remount the page or reset it. Force a real navigation so
              // the logo reliably gets back to the actual start screen.
              if (pathname === "/") {
                e.preventDefault();
                window.location.href = "/";
              }
            }}
            className="flex items-center gap-2.5"
          >
            <img
              src="https://cdn.ux4g.gov.in/UX4G@3.0.18/assets/images/national_emblem.svg"
              alt="National Emblem"
              className="h-10 w-10"
            />
            <span className="h-6 w-px bg-neutral-300" aria-hidden="true" />
            <span className="font-medium text-neutral-900">Adhikarana</span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <ul className="flex items-center gap-5">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-neutral-700 hover:text-accent-600">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Button href="/" size="sm">
              Start a request &rarr;
            </Button>
          </div>

          <div className="relative md:hidden">
            <button
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-accent-600 text-accent-600"
            >
              <Icon name="menu" />
            </button>
            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-11 w-56 rounded-2xl bg-white p-2 shadow-[0_4px_16px_rgb(0_0_0_/_0.12)]"
              >
                <ul>
                  {LINKS.map((link) => (
                    <li key={link.href} role="menuitem">
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-xl px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="p-1.5">
                  <Button href="/" size="sm" className="w-full" onClick={() => setMenuOpen(false)}>
                    Start a request &rarr;
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
