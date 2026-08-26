import { cn } from "@/lib/cn";

/** Rounded-2xl, hairline-border card (PRM reference). `lift` adds the
 * hover-lift treatment — reserved for genuinely interactive cards
 * (marketing links), never static info cards, so hover state never
 * implies false clickability. */
export function Card({
  lift,
  className,
  children,
  ...props
}: {
  lift?: boolean;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white p-5 shadow-[0_0_0_1px_var(--color-neutral-200)] transition-shadow",
        lift && "hover:shadow-[0_4px_16px_rgb(0_0_0_/_0.08)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
