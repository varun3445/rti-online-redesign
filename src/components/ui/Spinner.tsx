/** Small loading spinner — chat's ThreadTyping indicator. */
export function Spinner({ size = 16 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block animate-spin rounded-full border-2 border-neutral-300 border-t-accent-600"
      style={{ width: size, height: size }}
    />
  );
}
