"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FontSizeControl } from "@/components/FontSizeControl";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

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
      <header className="ux4g-topbar" role="banner">
        <div className="ux4g-container">
          <div className="ux4g-topbar__wrap ux4g-d-flex ux4g-jc-between ux4g-ai-center ux4g-flex-wrap ux4g-gap-xs">
            <div>
              <a
                aria-label="Government of India (opens in new tab)"
                className="ux4g-d-flex ux4g-ai-center"
                href="https://www.india.gov.in/"
                target="_blank"
                rel="noopener"
              >
                <span className="ux4g-label-m-default">Government of India</span>
                <sup className="ux4g-icon-outlined">open_in_new</sup>
              </a>
            </div>
            <nav aria-label="Top utilities" className="ux4g-d-flex ux4g-ai-center ux4g-flex-wrap">
              <a className="ux4g-label-m-default ux4g-topbar__skip" href="#main-content">
                Skip to Main Content
              </a>
              <span className="ux4g-bl acc-top-divider"></span>
              <FontSizeControl />
              <span className="ux4g-bl acc-top-divider"></span>
              <div className="ux4g-topbar__select">
                <span className="ux4g-topbar__selectbtn ux4g-d-inline-flex ux4g-ai-center">
                  <span className="ux4g-icon-outlined ux4g-top-bar-icon">language</span>
                  <span className="ux4g-label-m-default">English</span>
                </span>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <nav className={`ux4g-navbar${scrolled ? " rti-nav--elevated" : ""}`}>
        <div className="ux4g-container">
          <div className="ux4g-navbar-wrap">
            <Link href="/" className="ux4g-d-flex ux4g-ai-center ux4g-gap-4xs">
              <img
                src="https://cdn.ux4g.gov.in/UX4G@3.0.18/assets/images/national_emblem.svg"
                alt="National Emblem"
                className="ux4g-navbar-logo"
              />
              <span className="ux4g-divider-vertical"></span>
              <span className="ux4g-label-m-strong">RTI Online</span>
            </Link>

            <div className="ux4g-navbar-desktop">
              <div className="ux4g-d-flex ux4g-ai-center ux4g-gap-xs">
                <ul className="ux4g-navbar-links">
                  <li>
                    <Link href="/how-it-works" className="ux4g-text-link-sm">
                      How it works
                    </Link>
                  </li>
                  <li>
                    <Link href="/your-rights" className="ux4g-text-link-sm">
                      Your rights
                    </Link>
                  </li>
                  <li>
                    <Link href="/my-rti" className="ux4g-text-link-sm">
                      My RTI
                    </Link>
                  </li>
                </ul>
                <Link href="/" className="ux4g-btn-primary ux4g-btn-md">
                  Start a request &rarr;
                </Link>
              </div>
            </div>

            <div className="ux4g-navbar-mobile">
              <div className="ux4g-relative ux4g-d-flex ux4g-flex-col ux4g-gap-2xs">
                <div className="ux4g-dropdown ux4g-dropdown-default ux4g-dropdown-overflow">
                  <button
                    aria-label="Open navigation menu"
                    className="ux4g-dropdown-control ux4g-btn-outline-primary"
                    type="button"
                    data-ux-toggle="dropdown"
                  >
                    <span className="ux4g-icon-outlined">menu</span>
                  </button>
                  <div className="ux4g-dropdown-menu ux4g-shadow-l3" role="menu">
                    <ul className="ux4g-list ux4g-list-default ux4g-list-m">
                      <li className="ux4g-list-item" role="menuitem">
                        <Link href="/how-it-works" className="ux4g-list-item-row">
                          <span className="ux4g-list-item-start">
                            <span>How it works</span>
                          </span>
                        </Link>
                      </li>
                      <li className="ux4g-list-item" role="menuitem">
                        <Link href="/your-rights" className="ux4g-list-item-row">
                          <span className="ux4g-list-item-start">
                            <span>Your rights</span>
                          </span>
                        </Link>
                      </li>
                      <li className="ux4g-list-item" role="menuitem">
                        <Link href="/my-rti" className="ux4g-list-item-row">
                          <span className="ux4g-list-item-start">
                            <span>My RTI</span>
                          </span>
                        </Link>
                      </li>
                    </ul>
                    <div className="ux4g-p-m">
                      <Link href="/" className="ux4g-btn-primary ux4g-btn-md ux4g-w-100">
                        Start a request &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
