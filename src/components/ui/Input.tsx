import { cn } from "@/lib/cn";

/** Labeled text input — verify-step email/OTP fields. */
export function Input({
  label,
  id,
  className,
  ...props
}: {
  label: string;
  id: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-neutral-700">
        {label}
      </label>
      <input
        id={id}
        className={cn(
          "w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-[0.9375rem] text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-accent-600 focus:ring-2 focus:ring-accent-100",
          className
        )}
        {...props}
      />
    </div>
  );
}
