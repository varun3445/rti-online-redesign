# RTI Online Redesign — Build What Moves India Hackathon

## What this is
A mock-data web prototype that redesigns one citizen journey from RTI Online
(rtionline.gov.in), the Government of India's Right to Information filing
portal, for the "Build What Moves India" hackathon. Submission deadline:
Aug 28, 2026, 8:00 PM IST.

## Hard constraints (do not violate)
- No real payment processing. No real government API calls. No real
  Aadhaar/PAN/OTP/payment data. This app never talks to rtionline.gov.in.
- Every mocked element (payment, identity/OTP, backend routing) must be
  visibly labeled as mock in the UI — do not let it look like a real
  transaction.
- Citizen-facing only. No admin/CPIO-side interface.
- Desktop-first design and layout priority (primary breakpoint ~1440px).
  Keep it functional at mobile widths, but design decisions optimize for
  desktop first, not mobile.
- Simplified information density — favor a small number of clear screens
  over dense multi-field forms. Plain language throughout (target users
  include low-digital-literacy citizens).
- Ship ONE complete, working, end-to-end journey rather than many partial
  features. Do not expand scope beyond what's asked in a given prompt —
  flag ideas instead of building them.

## The problem we're solving
Real RTI Online forces citizens to re-prove their identity (OTP + captcha)
on every single action — filing, appealing, checking status, viewing
history — with no persistent session. Worse, if a government office
forwards one RTI request to multiple departments, the single request
silently fragments into multiple registration numbers (e.g.
DOP&T/R/E/20/07619, .../07619/1, .../07619/2) that the citizen has to
track and appeal separately, with no unified view.

## The journey this prototype must nail
1. Homepage — minimal, WITH a slim nav bar (a handful of pill-shaped
   items, Origin-style — not a content-heavy menu). The hero below the nav
   is still just a short, confident statement of what this is plus ONE
   contextual chat input as the primary entry point. No separate
   "what's your problem" screen and no separate "search for an authority"
   screen — the chat conversation IS the intake.
2. Conversational intake + AI-assisted routing + request drafting — one
   continuous chat thread. The citizen describes their problem in their
   own words; a REAL OpenAI model API call (not a keyword-matching stub)
   asks clarifying questions if needed, identifies the likely authority
   (from a small mock dataset, not a real 2,916-entry directory), and
   drafts formatted RTI request text grounded in the real RTI Act 2005
   process (see "Real facts" section below — the AI's output and all
   surrounding UI copy must use real terminology/figures, not invented
   placeholders). The drafted request is shown as an editable artifact the
   citizen can review and adjust before continuing — not just buried in
   chat log text. This AI integration is core to the hackathon requirement
   that an OpenAI model be a meaningful, functioning part of the product —
   build it as a real API call from the start, not a stub to swap later.
3. ONE-TIME identity verification (mock mobile/email code) that persists a
   session for the rest of the visit — no re-verifying on later steps
4. Mock payment step — clearly labeled as mock, with both success and
   failure paths modeled (BPL fee-waiver path also supported)
5. Confirmation — ONE citizen-facing case ID, even if the mock backend
   internally "forwards" the case to multiple departments
6. "My RTI" tracker — a unified, plain-language case timeline. If the mock
   backend fragments a case into sub-IDs, the tracker still shows ONE item
   with a combined status. This is the flagship differentiator — don't
   let it regress.
7. One-click "File Appeal" from a stalled/rejected case, prefilled from
   the original case

## Explicitly out of scope — do not build these
- Real payment gateway integration
- Real government backend / real CPIO or Nodal Officer routing
- Full 2,916-authority dataset (use ~30-50 realistic mock entries across
  3-5 recognizable ministries, e.g. Railways, Income Tax/CBDT, EPFO)
- Citizen Login / persistent account system (the one-time session model
  replaces this entirely — do not build a separate login+register flow)
- Full Hindi/multi-language i18n (a single demo toggle is fine as a
  stretch, not required)
- Second appeal / CIC complaint escalation
- State-government public authorities
- Any admin or CPIO-facing view

## Data model note
The case lifecycle needs these states, modeled explicitly: submitted,
forwarded (can split into linked sub-records under one parent case ID),
responded, additional-payment-required, returned-to-applicant,
transferred-to-other-authority. The tracker UI must always collapse a
fragmented case back into one parent view — this is the core fix we're
demonstrating.

## Research reference (consult before building UI)
Full site map, flow audit, and findings from the real RTI Online portal
are documented on this FigJam board — Figma access has been granted, so
pull actual context from it (page layouts, flow sequencing, the pain
points sections) rather than guessing at what the real site does:
https://www.figma.com/board/Dbgpf8OAUUVDPYzEGfN4fd/Build-India-26?node-id=0-1
Sections: A (Home/nav), B (Submit Request flow), C (Submit Appeal flow),
D (View Status + edge-case states), E (View History flow), F (standalone
pages), G (key findings/pain points — this is the "why" behind every
decision in this AGENTS.md).

## Real facts to ground all text in (source: rtionline.gov.in research)
All copy, AI-drafted output, and mock data must use real RTI Act
terminology and figures pulled from the actual site — not invented
placeholders. Known facts from research (cross-check the Figma board for
more if a specific detail is needed):
- Legal basis: Right to Information Act, 2005
- Request fee: ₹10 for non-BPL applicants. Fully waived for BPL (Below
  Poverty Line) applicants who attach a valid BPL certificate. No fee for
  filing a First Appeal.
- Real terminology to use correctly: CPIO (Central Public Information
  Officer) receives/answers the request; Nodal Officer routes it
  internally; First Appellate Authority handles appeals; "Public
  Authority" = the ministry/department/body being asked.
- Real registration number format: `<AuthorityCode>/<R or A>/<E/P/T/X/L>/<YY>/<serial>`
  (R=Request, A=Appeal; E=Online, P=Physical, T=Transferred,
  X=Part-transfer, L=Legacy) — a forwarded/split case appends `/1`, `/2`,
  etc. to the parent number. Use this real pattern for mock case IDs.
- Real ministries/authorities to include in the mock dataset (pick from
  these rather than inventing fictional ones): Ministry of Railways,
  Employees' Provident Fund Organisation (EPFO), Central Board of Direct
  Taxes (Income Tax), Department of Personnel & Training (DoPT), Ministry
  of Home Affairs, Ministry of External Affairs (passports).
- What the REAL site currently does badly (the "before" we're fixing —
  useful for before/after copy in the demo, don't replicate these):
  3000-character request-text limit with a narrow allowed-character
  whitelist; OTP + captcha re-verification on every single action; a
  2,916-entry flat authority list; payment handoff to a third-party SBI
  gateway with a "do not press back" warning and a 24-48hr failure
  recovery wait.
- Full detail on all of the above, plus the 26-item FAQ and every screen
  of the real flow, is on the Figma board linked above — read it, don't
  just rely on this summary if a specific fact is needed.

## Design system
Synthesized from three references — Origin (useorigin.com), Sana (sana.ai),
Craft (craft.do) — read for MECHANICS, not literal copying, and explicitly
regrounded for a white-background civic tool, not a marketing site:
- From Origin: single contextual chat input as the homepage's primary
  entry point; serif display headline with an italic accent word, used
  ONCE per page as a rare, special moment — not scattered everywhere;
  sticky floating rounded nav capsule.
- From Sana: bold black sans-serif headlines as the DEFAULT (serif is the
  exception, reserved for the one hero statement); editorial/bento-style
  asymmetric content grid instead of everything centered; tighter,
  smaller corner radii on functional UI (8–14px) — pill shape stays
  reserved for nav/buttons/badges only, not every container.
- From Craft: solid, flatly-colored content cards (using our real status
  color tokens) instead of translucent panels; simple line-icon rows for
  category/example lists; the same sticky rounded nav capsule pattern,
  independently confirming it's a real pattern worth keeping.

**Explicitly reversed from an earlier pass:** no gradient-blob backgrounds,
no glassmorphism/backdrop-blur anywhere. That combination reads as generic
AI-template SaaS — flat, solid, confident color instead. If you're about
to reach for `backdrop-filter` or a soft radial-gradient background blob,
don't — use a solid tinted background instead.

**Type** — two families only:
- Source Serif 4 for the ONE hero display statement per page ONLY
  (56–68px, weight 400–500, italic accent word allowed). Never for UI
  chrome, dense content, or repeated across multiple headings on the same
  page — if every heading is serif, none of them read as special.
- Inter for everything else, including most H1/H2 headings on non-hero
  pages: H1 32/40 (600) · H2 24/32 (600) · H3 18/26 (600) · Body 16/26
  (400, one size — 16px is the floor) · Meta/small 14/20 (400,
  timestamps/helper text only) · Label/eyebrow 12/16 (600, uppercase,
  +0.08em tracking — nav items, "STEP 1," badges) · Button label 15/20
  (600).

**Spacing** — 8px base unit, scale 4·8·12·16·24·32·48·64·96px.
At the 1440px breakpoint: max content width 1120px centered; prose measure
(chat bubbles, drafted-request text) capped ~700px even inside the wider
container; page margin 64px desktop / 24px tablet / 16px mobile; section
rhythm 96px between major sections, 48px between subsections, 24px
heading→content, 16px paragraph→paragraph, 8px label→input; card padding
24px desktop / 16px mobile; buttons 12px/24px padding, pill radius
(999px); text inputs 14px/16px padding, 12px radius (not full pill).

**Color** — white-grounded, one accent, six status colors:
- Neutrals: bg-canvas `#FFFFFF` · bg-subtle `#F8F9FA` (alt sections,
  citizen chat bubbles) · border-default `#E5E7EB` · text-primary
  `#111827` · text-secondary `#4B5563` · text-tertiary `#9CA3AF`
  (placeholders)
- Brand accent: accent-primary `#1D4ED8` (buttons, links, focus rings —
  ALSO doubles as the "forwarded" status color, deliberately: both mean
  "actively moving forward," so one hue serves both rather than adding a
  7th color) · hover `#1E40AF` · subtle-bg `#EFF6FF`
- Status badges (always paired with plain-language text, never color
  alone): submitted `#475569` on `#F1F5F9` · forwarded `#1D4ED8` on
  `#DBEAFE` · transferred-to-other-authority `#0F766E` on `#CCFBF1` ·
  responded `#15803D` on `#DCFCE7` · additional-payment-required
  `#B45309` on `#FEF3C7` · returned-to-applicant `#B91C1C` on `#FEE2E2`

**Components:**
- Buttons: primary = accent-primary bg + white text, pill radius.
  Secondary = white bg + 1px border-strong + text-primary. Visible focus
  ring on both (2px accent-subtle-bg outline, 2px offset) — required, not
  optional.
- Inputs: white bg, 1px border-default, 12px radius. Focus: border→
  accent-primary + soft outer glow. Error: border→red status color + text
  message below (never color alone).
- Cards: FLAT, SOLID tinted background (pick from the status/neutral
  palette — e.g. a card about a payment step can sit on the amber
  additional-payment tint), 14px radius, no border needed when the tint
  itself provides definition, no backdrop-blur, no drop-shadow beyond a
  minimal 1px ambient one if needed for stacking clarity.
- Status badges: pill (999px radius), 4px/12px padding, uppercase label
  style, colors per the table above.
- Icon rows: for category/example lists (e.g. "what you can request"),
  a simple line-icon + label per item, laid out in a row or asymmetric
  grid — not another card grid for everything.
- Chat interface: 16px-radius bubbles, citizen messages right-aligned on
  bg-subtle, assistant messages left-aligned white+bordered, pill-shaped
  input bar fixed at the bottom, 16px internal padding.

**Accessibility floor:** 16px body text minimum · every status signal is
color + text together, never color alone · visible focus state on every
interactive element (nav links and card-as-link included, not just
buttons/inputs) · prose measure capped ~700px for reading comfort.

**Risk to actively guard against:** flat white minimalism can drift into
"looks like a boring form site" if the serif-headline/whitespace
hierarchy gets eroded under time pressure. That hierarchy is what makes
this feel considered instead of looking like the government site it's
replacing — don't let it get simplified away for expedience.

## Stack
Next.js/React, desktop-first responsive (primary breakpoint ~1440px,
remains usable down to mobile widths), deployable on Vercel (or
equivalent) so the final submission is a live public link that opens with
zero access requests.

## Working style
- Before writing code for a new chunk, briefly state your plan.
- Work in the chunk order given in prompts — don't jump ahead.
- After each chunk, test the flow manually end-to-end and confirm it
  meets that chunk's definition of done before moving to the next.
- Every mocked/sensitive UI moment needs a visible "mock" label — this is
  a judging criterion (honesty about what's real vs. simulated), not
  optional polish.
