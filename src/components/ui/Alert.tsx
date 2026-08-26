import { Icon } from "./Icon";
import { cn } from "@/lib/cn";

const VARIANT = {
  info: { classes: "bg-[#c9f7f2] text-[#006d75]", icon: "info" },
  error: { classes: "bg-[#ffecee] text-[#8a1a16]", icon: "error" },
  success: { classes: "bg-[#ddf8d8] text-[#00522c]", icon: "mail" },
};

/** Inline alert with a leading icon — "no case found," form errors,
 * "check your email" once a case is responded. */
export function Alert({
  variant,
  children,
}: {
  variant: "info" | "error" | "success";
  children: React.ReactNode;
}) {
  const v = VARIANT[variant];
  return (
    <div className={cn("flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm", v.classes)}>
      <Icon name={v.icon} variant="filled" size={18} className="mt-0.5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
