"use client";

import { useEffect, useRef, useState } from "react";

/** Marketing-page scroll reveal — see .rti-reveal in globals.css for the
 * reduced-motion guard. Not used on the composer/verify/pay/done flow or
 * the case dashboard, per the lighter-touch scope for utility screens. */
export function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`rti-reveal${visible ? " rti-reveal--visible" : ""}${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
}
