import { Icon } from "./Icon";

/** The editable-draft textarea (chat step) — label, char counter, helper
 * row with a leading info icon. */
export function Textarea({
  label,
  id,
  value,
  onChange,
  helperText = "No character whitelist",
}: {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-neutral-700">
        {label}
      </label>
      <div className="rounded-xl border border-neutral-300 bg-white focus-within:border-accent-600 focus-within:ring-2 focus-within:ring-accent-100">
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={10}
          className="w-full resize-y bg-transparent px-4 py-3 text-[0.9375rem] text-neutral-900 outline-none"
        />
        <div className="border-t border-neutral-200 px-4 py-2 text-right text-xs text-neutral-500">
          {value.length} characters
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-neutral-500">
        <Icon name="info" size={16} />
        {helperText}
      </div>
    </div>
  );
}
