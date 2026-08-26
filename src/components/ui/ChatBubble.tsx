import { cn } from "@/lib/cn";

/** Chat message bubble — user right-aligned/solid accent, assistant
 * left-aligned/near-white with a hairline border (Corra reference: quiet
 * assistant bubble, no heavy fill). */
export function ChatBubble({
  role,
  children,
}: {
  role: "user" | "assistant";
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex", role === "user" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-xl rounded-2xl px-5 py-3 text-[0.9375rem] leading-relaxed",
          role === "user"
            ? "bg-accent-600 text-white"
            : "bg-white text-neutral-900 shadow-[0_0_0_1px_var(--color-neutral-200)]"
        )}
      >
        {children}
      </div>
    </div>
  );
}
