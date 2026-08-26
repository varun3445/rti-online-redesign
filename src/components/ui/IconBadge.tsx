import { Icon } from "./Icon";
import { cn } from "@/lib/cn";

/** Circular soft-accent-bg icon container — echoes the Timeline node shape
 * (see Timeline.tsx) so cards read as waypoints in the same visual family
 * as the real case journey, not an unrelated icon treatment. */
export function IconBadge({ icon, className }: { icon: string; className?: string }) {
  return (
    <div className={cn("flex h-10 w-10 items-center justify-center rounded-full bg-accent-50", className)}>
      <Icon name={icon} size={20} className="text-accent-600" />
    </div>
  );
}
