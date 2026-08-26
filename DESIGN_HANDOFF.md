## Handoff Spec: RTI Online Redesign (full site)

### Overview

A citizen-facing redesign of RTI Online (rtionline.gov.in) for the Build What Moves India
hackathon. Built entirely on **UX4G** (MeitY's real, published design system —
`ux4g-web-components@1.1.0`), extended rather than replaced: one display typeface for
marketing headlines, a depth/motion layer, and a repeated visual motif — all built from
UX4G's own tokens, with two explicitly-disclosed exceptions (see Design Tokens Used).

Core product idea: a conversational AI composer replaces the traditional multi-field RTI
form, and a unified case tracker collapses multi-department request fragmentation (a real
failure mode of the live rtionline.gov.in — one request can silently split into N
sub-registration numbers) into one plain-language view.

Ten pages: Home (`/`, multi-step: home → chat → verify → pay → done), How it Works,
Your Rights, FAQ, My RTI (dashboard), View Status, View History, Contact, Policy, Manual.

### Layout

- **Container**: UX4G's `.ux4g-container` (centered, responsive max-width) on every page.
- **Grid**: `ux4g-grid` + `ux4g-grid-auto-fit-300` for card rows (auto-fits columns ≥300px);
  `ux4g-grid-cols-2` / `ux4g-md-grid-cols-3` / `ux4g-lg-grid-cols-6` for the footer link grid
  specifically.
- **Breakpoints** (verified against the shipped CSS, not assumed from docs): `sm` ≥576px,
  `md` ≥768px, `lg` ≥992px. Bento/card grids and the footer link grid stay single/2-column
  through `md` and only expand at `lg` — confirmed against how comparable reference sites
  (useorigin.com, sana.ai) handle the same pattern, not just copied from habit.

### Design Tokens Used

| Token | Value | Usage |
|-------|-------|-------|
| `--ux4g-color-primary-600` | `#4a2bc2` | Primary brand purple — hero band, primary buttons, links, motif dots |
| `--ux4g-color-neutral-0` | `#ffffff` | Composer surface, card backgrounds |
| `--ux4g-color-neutral-900` | `#171717` (approx) | Primary body/heading text |
| `--ux4g-text-brand-primary-default` | (indirection → primary-600) | Icon/link color via `ux4g-text-primary` utility |
| `--ux4g-radius-md` | `8px` | Cards, result list — UX4G's own intended value, restored (see Edge Cases) |
| `--ux4g-radius-full` | `999px` | Composer pill, nav CTA pill, journey-timeline node |
| `--ux4g-shadow-l1..l4` | escalating, elevation-color-backed | l1/l2 = static cards, l3 = composer, l4 = reserved for max elevation |
| `--ux4g-blur-1..4` | `2 / 4 / 8 / 16px` | Nav glass-on-scroll uses `--ux4g-blur-medium` (8px) via `backdrop-filter` |
| `--ux4g-opacity-60/-80` | `.6 / .8` | Secondary/tertiary text hierarchy on inverse (hero) backgrounds |
| `--ux4g-fs-8..60` | full type scale | All text sizing — no raw px font-sizes anywhere in the app |
| `--ux4g-space-1..16` | `0.125rem – 22.5rem` | All spacing/padding/gap |
| `--font-display` (custom) | Bricolage Grotesque, weights 500/700 | **Documented exception** — hero/section headings on marketing pages only. Everything else (forms, buttons, body, all UX4G components) stays UX4G's own Noto Sans. Self-hosted via `next/font/google`, 2 weights only, `display: swap` |
| Composer glass tint (custom) | `rgba(255,255,255,0.15)` *(superseded — see note)* | Originally hand-picked, contrast-verified at 6.14:1 against the hero's primary-600 background. **Superseded**: composer was later rebuilt to match UX4G's own real "AI Search Input" Figma component (white surface + soft shadow, not glass) — see Components table |

Both custom values above are the only non-token-derived numbers in the codebase, and both are
called out with a comment in `globals.css` explaining why no UX4G token covers them.

### Components

| Component | Variant | Props/Classes | Notes |
|-----------|---------|-------|-------|
| Accessibility Bar | Default | `.ux4g-topbar` | Skip-link, font-size control (A-/A/A+, persists via `localStorage` + `data-font-scale` on `<html>`), language toggle (visual-only — no real i18n, out of scope) |
| Navbar | Default, sticky | `.ux4g-navbar` + `.rti-nav--elevated` (custom, scroll-triggered) | National emblem + wordmark, 3 nav links, primary CTA pill. Glass state (`backdrop-filter: blur(8px)` + `rgba(255,255,255,.85)`) engages once `scrollY > 8px`, toggled by a passive scroll listener in `Nav.tsx` |
| Composer / AI Search Input | UX4G's real "AI Search Input" pattern (Figma node `2006:4941`) | `.ux4g-search.ux4g-search-lg.rti-composer` | White surface, `auto_awesome` sparkle leading icon (purple), dark input text, circular purple submit button with white up-arrow. Scaled to 64px height (beyond the default 48px `-lg` size) — this is the hero's one "star" element |
| Card | Outline, Vertical | `.ux4g-card.ux4g-card-outline.ux4g-card-vertical` (+ `.rti-card-lift` on marketing pages) | Hover-lift (l2→l3 shadow + 2px translateY) only on genuinely interactive marketing cards — deliberately NOT applied to static info cards (composer's authority-match card, confirmation card) to avoid implying false clickability |
| Result List | v1 | `.ux4g-result-list.ux4g-result-list-v1` | Used on My RTI / View Status for case cards. Radius fix applied (see Edge Cases) |
| Journey Timeline | Vertical | `.ux4g-journey-timeline.ux4g-journey-timeline--vertical` | Per-case event history; node-dot shape reused sitewide as the visual motif |
| SLA Linear | Rounded | `.ux4g-sla-linear.ux4g-sla-linear-rounded` | Real countdown against `RTI_ACT_REFERENCE.responseWindowDays` (30, the actual Section 7(1) statutory window) — not decorative |
| Tag | Tonal, per state | `.ux4g-tag-tonal-{info\|warning\|success\|error}` | Mapped 1:1 from `CaseLifecycleState` via `STATE_TAG_VARIANT` |
| Accordion | Arrow-right | `.ux4g-accordion.ux4g-accordion-arrow-right` | FAQ page — wired via `data-ux-toggle="collapse"` (bare `ux4g-toggle` attrs silently no-op; confirmed via the shipped runtime source) |
| Footer | Custom link grid | `.ux4g-grid` responsive cols + `.ux4g-text-center` | 2/3/6-column responsive, centered links, `ux4g-bg-neutral-soft` background |

### States and Interactions

| Element | State | Behavior |
|---------|-------|----------|
| Composer input | Focus | Native UX4G focus ring (`.ux4g-search:focus-within`) |
| Composer submit | Loading | Chat step shows `ThreadTyping` — animated spinner + cycling stage text ("Searching official sources… → Checking processing timelines… → Drafting your request…"), real two-pass pipeline (web-search then draft), not padding for effect |
| Nav | Scroll >8px | `.rti-nav--elevated` class added — background/blur/shadow transition over 0.2s |
| Marketing card | Hover | `.rti-card-lift`: shadow l2→l3, `translateY(-2px)`, 0.2s ease |
| FAQ accordion item | Click | Expands/collapses via UX4G runtime; `aria-expanded` toggles |
| Sample-ID chips (View Status) | Click | Fills the lookup input, triggers `runLookup` immediately |
| Font-size buttons | Click | Cycles `sm / md / lg` root font-size, persisted, scales UX4G's own rem-based components too (not just app copy) |
| Text-size / theme | N/A | No dark mode implemented — `data-theme="light"` fixed |

### Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| Desktop (≥992px / `lg`) | Footer: 6 links in one row. Card grids: full multi-column via `ux4g-grid-auto-fit-300`. Composer: full 40rem max-width, centered |
| Tablet (768–991px / `md`) | Footer: 3-column grid. Result List cards switch to UX4G's own 2-column internal grid via `display:contents` (their mobile-collapse breakpoint, not a custom one) |
| Mobile (<768px) | Footer: 2-column grid. Hero headline wraps to 2 lines but stays visually dominant (not shrunk to "regular" text weight — deliberate, based on reference-site research showing headline scale should reduce proportionally, not collapse). Result List content spans full width via a documented cascade-layer override (see Edge Cases) |

### Edge Cases

- **Empty state**: View Status shows a `ux4g-context-alert ux4g-alert-info` ("No case found for
  "X". Try one of the sample numbers above.") rather than a blank result.
- **Multi-department split**: a single RTI request that a Nodal Officer forwards to N CPIOs
  renders as one case card with a "Split across N offices — X payment needed, Y in progress,
  Z responded" summary line, plus a nested sub-record list — not N separate cards. This is
  the product's core differentiation from the real rtionline.gov.in.
- **SLA past due**: countdown bar switches to `ux4g-sla-status-error`, headline text changes to
  "Past the 30-day statutory window" instead of "N days left."
- **Card border-radius bug**: UX4G's own shipped CSS defines `border-radius: var(--ux4g-radius-md)`
  for `.ux4g-result-list`, but a later, unrelated cascade-layer rule (border-bottom-only) was
  silently winning, leaving cards with sharp corners. Fixed with an unlayered override in
  `globals.css` restoring UX4G's own intended value — not a new radius.
- **Mobile Result List overflow**: UX4G's `display:contents` mobile-collapse on
  `.ux4g-result-list-meta` only special-cases its own SLA/meta elements for full width at
  that breakpoint; injected content (summary text, sub-records, timeline) fell into a 2-column
  grid and got clipped to half-width. Fixed by spanning `.ux4g-result-list-content`'s direct
  children across both grid columns below 768px.
- **Long department names / case titles**: no explicit truncation — text wraps naturally
  within the card's fixed padding; not stress-tested against extreme-length real ministry names.

### Animation / Motion

| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| Marketing-page sections | Scroll into view (15% threshold) | `opacity 0→1`, `translateY(12px→0)` | 500ms | `ease` |
| Nav | `scrollY > 8px` | Background/blur/shadow fade-in | 200ms | `ease` |
| Marketing card | Hover | Shadow escalation + lift | 200ms | `ease` |

All motion is implemented via a plain `IntersectionObserver` (`Reveal.tsx`) — no animation
library. **Every motion rule is gated behind `@media (prefers-reduced-motion: no-preference)`**
— a user with the OS-level reduced-motion setting sees the final state immediately, no
transition. Motion is deliberately restricted to marketing pages only (Home, How it Works,
Your Rights, FAQ) — the composer/verify/pay/done flow and the case dashboard get zero motion,
per an explicit scope decision to keep transactional screens fast and calm rather than
"impressive."

### Accessibility Notes

- **Heading hierarchy**: every eyebrow-label `<span>` that had no adjacent real heading was
  converted to a genuine `<h1>`/`<h2>`/`<h3>` (e.g. "WHAT YOU CAN ACTUALLY GET", "DESCRIBE
  YOUR QUESTION," per-card "TIMELINE" labels) — screen-reader heading navigation previously
  skipped these sections entirely.
- **Skip link**: `.ux4g-topbar__skip` ships permanently visible in UX4G's shipped CSS (no
  `:focus` variant) — overridden to visually-hidden-until-focus per WCAG 2.4.1.
- **Composer contrast**: not a guess — computed against the actual hero background color
  before shipping (documented in Design Tokens Used). The composer's final white-surface
  version trivially exceeds AA (dark text on white).
- **Icon color inheritance**: `.ux4g-icon-outlined` sets `color` directly on the icon element
  itself, so a parent wrapper's color utility class has no effect (same-specificity sibling
  rule, not inheritance) — color utilities must be applied directly to the `<i>` element, a
  bug pattern that recurred multiple times before being systematically fixed sitewide.
- **Reduced motion**: see Animation section — fully respected, not just acknowledged.
- **Font-size control**: scales the actual root `font-size`, which cascades into UX4G's own
  rem-based component sizing, not just this app's copy (per UX4G's own accessibility design).
