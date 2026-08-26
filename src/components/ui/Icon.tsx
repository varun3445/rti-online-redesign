import {
  ALargeSmall,
  AlertCircle,
  ArrowRight,
  ArrowUp,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  ExternalLink,
  FileText,
  Globe,
  Keyboard,
  Landmark,
  Link2,
  Mail,
  Menu,
  MessageCircle,
  Mic,
  Minus,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Wallet,
  X,
  Info as InfoIcon,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";

/** Same 20 semantic names UX4G's Material Icons ligatures used (kept as
 * the API surface so every call site stayed unchanged) mapped to inline
 * SVG components. Switched from a real Material Icons Outlined font
 * (visually identical, and the actual font UX4G's own icon set is a
 * renamed embed of) after the Figma capture checkpoint showed ligature
 * substitution doesn't work in Figma's text engine — every icon rendered
 * as literal text ("menu", "auto_awesome") instead of a glyph. SVG icons
 * become real vector paths on capture, guaranteed 1:1 with the live app;
 * every other UX4G token (colors, Noto Sans, the primary purple) is
 * unaffected by this change. */
const ICONS: Record<string, LucideIcon> = {
  add: Plus,
  arrow_forward: ArrowRight,
  arrow_upward: ArrowUp,
  auto_awesome: Sparkles,
  account_balance: Landmark,
  chat: MessageCircle,
  check: Check,
  description: FileText,
  error: AlertCircle,
  close: X,
  eye: Eye,
  font_download: ALargeSmall,
  info: InfoIcon,
  keyboard: Keyboard,
  language: Globe,
  link: Link2,
  mail: Mail,
  menu: Menu,
  mic: Mic,
  open_in_new: ExternalLink,
  payments: Wallet,
  remove: Minus,
  schedule: Clock,
  search: Search,
  send: Send,
  shield: ShieldCheck,
  task_alt: CheckCircle2,
};

export function Icon({
  name,
  size = 20,
  className,
  ...props
}: {
  name: string;
  /** Kept for call-site compatibility with the old ligature-font API;
   * SVG icons don't have separate filled/outlined variants. */
  variant?: "outlined" | "filled";
  size?: number;
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>) {
  const LucideComponent = ICONS[name];
  if (!LucideComponent) {
    console.warn(`Icon: no mapping for "${name}"`);
    return null;
  }
  return (
    <span aria-hidden="true" className={cn("inline-flex", className)} {...props}>
      <LucideComponent size={size} strokeWidth={2} />
    </span>
  );
}
