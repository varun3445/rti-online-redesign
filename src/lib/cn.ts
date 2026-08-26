/** Joins conditional class names, skipping falsy values. No dependency on
 * clsx/tailwind-merge — the class sets used across this app's components
 * don't collide with each other, so simple concatenation is sufficient. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
