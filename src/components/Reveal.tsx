"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/** Marketing-page scroll reveal. motion-safe:/motion-reduce: variants
 * (Tailwind's built-in prefers-reduced-motion handling) replace the old
 * manual @media guard — a reduced-motion user sees the final state
 * immediately, no transition. Not used on the composer/verify/pay/done
 * flow or the case dashboard, per the lighter-touch scope for utility
 * screens. */
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
    <div
      ref={ref}
      className={cn(
        "motion-safe:transition-all motion-safe:duration-500 motion-safe:ease-out",
        visible ? "motion-safe:translate-y-0 motion-safe:opacity-100" : "motion-safe:translate-y-3 motion-safe:opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
}
