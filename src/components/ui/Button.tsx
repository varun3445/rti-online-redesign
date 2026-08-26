import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-accent-600 text-white hover:bg-accent-700",
  outline: "border border-accent-600 text-accent-600 hover:bg-accent-50",
  ghost: "text-neutral-700 hover:bg-neutral-100",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "text-sm px-3.5 py-1.5 gap-1.5",
  md: "text-[0.9375rem] px-5 py-2.5 gap-2",
  lg: "text-base px-6 py-3.5 gap-2",
};

type ButtonOwnProps = {
  variant?: Variant;
  size?: Size;
  href?: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  children: React.ReactNode;
};

/** Pill-shaped button (Corra reference) in 3 variants. Renders a next/link
 * when `href` is given, a native <button> otherwise — same call-site shape
 * as the UX4G button/link pattern it replaces. Defaults to type="submit"
 * (native <button> default) so a plain Button inside a <form> — the
 * verify-step "Send mock code"/"Verify" buttons — still triggers the
 * form's onSubmit without every call site needing to say so explicitly. */
export function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  onClick,
  type = "submit",
  children,
  ...props
}: ButtonOwnProps & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "onClick" | "type">) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-full font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} {...props}>
      {children}
    </button>
  );
}
