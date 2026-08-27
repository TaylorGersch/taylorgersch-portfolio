@AGENTS.md

# taylorgersch.com portfolio — project context

Hand-rebuilt copy of Taylor's password-protected Squarespace portfolio: Next.js 16 (App Router, TypeScript) + Tailwind v4, content in MDX. Deploys via GitHub → Vercel (auto-deploy on push to `main`).

**Taylor is non-technical.** She reviews changes via screenshots, not by reading code or diffs. After any visual change: `npm run build && npm run lint`, then start the server and screenshot the actual page with Playwright before saying something is done — a successful build is not proof a page looks right (see the MDX gotcha below for a case where it very much wasn't).

## Verifying changes (always do this before calling something done)

```bash
npm run build
npm run lint
npm run start &   # or: npx next start
```

Then screenshot with Playwright using the lock-screen cookie (the site is gated behind a password page):
- Cookie: `tg_site_access=tg-portfolio-2026-granted`
- Scroll through the page in ~800px increments before capturing full-page — `next/image` lazy-loads, and a single full-page screenshot silently misses below-the-fold images. Use `document.documentElement.scrollHeight`, not `document.body.scrollHeight` (the two can diverge).
- If a previous `next start` is still running in the background, a fresh one can fail with `EADDRINUSE` while the OLD build keeps serving on :3000 — an unstyled/near-zero-height screenshot is the tell. `pkill -f "next start"` (or `fuser -k 3000/tcp`) before restarting.

## The MDX numeric-prop bug — read this before touching any MediaSplit-style prop

`next-mdx-remote@6` on this project's Next/React versions **silently drops any `{...}` JSX expression-container attribute value** — not just multi-line array/object literals, but plain numeric literals too. `imageWidth={1500}` compiles with zero errors and arrives at the component as `undefined`, and the section quietly falls back to a placeholder box. No warning, no build failure — it just looks done and isn't. This bit every `<MediaSplit>` image site-wide at one point, BetterUp included, before it was caught.

**Fix already applied**: `MediaSplit`'s `imageWidth`/`imageHeight` props accept `number | string` and coerce internally via `Number()`. Every current MDX file passes them as quoted strings: `imageWidth="1500" imageHeight="1553"`. **Keep doing this for any new usage — never `{1500}`.** If you add a new component with a numeric/object/array JSX prop passed through MDX, it needs the same string-and-coerce treatment; don't trust TypeScript here, verify with an actual screenshot that a real image renders and not a grey box.

Related: `CarouselSlide` tags must stay single-line (multi-line JSX attributes hit the same underlying MDX-expression-container problem) and must always have a real, non-empty `src` — an empty string throws at build time since case studies are SSG'd via `generateStaticParams`. Never leave a placeholder `src=""`; wrap the whole block in an MDX comment (`{/* ... */}`) instead until a real path exists.

## Case study system

- `src/app/(site)/[slug]/page.tsx` — the route, reads MDX from `src/content/case-studies/*.mdx` via `compileMDX`.
- `src/content/case-studies/*.mdx` — one file per case study (currently: `betterup`, `airbnb`, `rutter`, `trustage`, `hinge-health`, `flyr-labs`). Frontmatter: `title`, `category`, `dates`, `intro`, `heroType`, `heroImage`, `heroLabel`.
- `src/components/case-study/CaseStudyBlocks.tsx` — `Meta`, `TwoCol`, `Pair`, `MediaSplit`, `SubSection`, `Detail`, `Quote`/`QuoteItem`/`QuotePair`, `ImageBlock`, `Stub`.
- `src/components/case-study/ImageCarousel.tsx` — `ImageCarousel`/`CarouselSlide`.
- **`docs/case-study-template.mdx`** — the canonical, heavily-commented copy-paste skeleton (BetterUp's finalized structure with ALL-CAPS placeholders). Lives outside `src/content/case-studies/` on purpose so it's never picked up as a real route. **Always start a new case study section from this file, not from scratch** — it encodes every gotcha below inline.

### The margin system
Every text element (page `<h1>`, `<Meta>` row, each section's eyebrow/headline via `MediaSplit`, `QuotePair`) gets `sm:pl-[60px]` as its outer margin (60px, not the standard 40) — desktop/tablet only, mobile stays `px-6` both sides. Images always keep the standard `sm:pl-10`/`sm:pr-10`. `MediaSplit`'s `side` prop flips which edge gets which automatically.

### `MediaSplit` API
```
MediaSplit({ eyebrow?, title?, titleGapClassName="mb-8", image?, imageAlt, imageWidth?, imageHeight?, placeholderRatio="aspect-[4/3]", side="right", children })
```
- Eyebrow/title live inside `MediaSplit` (not `SubSection`) so they share the image's grid row.
- `image`/`imageWidth`/`imageHeight` are optional together — omit them (keep `imageAlt`) to render a placeholder box while a section's copy/structure is drafted ahead of real exports. Used for Rutter/TruStage/Hinge Health/FLYR Labs below.
- `imageWidth`/`imageHeight` as quoted strings — see the MDX bug above.
- `titleGapClassName` is an escape hatch for heading-to-body spacing mismatches between sections — only use it after a screenshot comparison shows a real mismatch.
- "Outcome" content sits **inside** `MediaSplit`, right after `<Pair>`, wrapped in `<div className="border-t border-neutral-200 pt-8">` — not as a separate block after `</MediaSplit>`.

### Image gotchas
- PNG→WebP with real transparency: do NOT `.convert('RGB')` in PIL before saving — silently drops alpha and transparent pixels render solid BLACK. Keep RGBA, save straight to WEBP. Only flatten to RGB for confirmed-opaque images (check `im.getchannel('A').getextrema()`).
- `.next/cache/images` can serve a stale optimized image after a same-filename source changes — `rm -rf .next/cache/images` before rebuilding if a swapped image doesn't seem to update.
- Get real pixel dimensions via PIL (`Image.open(f).size`) before wiring up `imageWidth`/`imageHeight` — `MediaSplit` renders uncropped at whatever ratio you give it, so wrong numbers visibly stretch/squash.
- If Taylor's source material is a presentation-deck export rather than a clean product screenshot, crop just the relevant UI panel(s) (check pixel color transitions with PIL — deck bg and panel bg can be very close, e.g. `255,254,253` vs `247,247,247`). If a single crop is too narrow/tall for MediaSplit's ~50%-width column (compare against BetterUp's ~0.94–0.97 aspect-ratio composites), composite 2–3 related crops onto a plain white canvas with a subtle drop shadow (PIL `ImageFilter.GaussianBlur` on a blurred dark rectangle) to build a roughly square "spec sheet" instead — this is how Airbnb's Organizing Cases image was built.

### Known lint fixes
- `ImageCarousel.tsx`'s `CarouselSlide(_props: SlideProps)` unused-param warning needs `// eslint-disable-next-line @typescript-eslint/no-unused-vars` above it (no `argsIgnorePattern` configured).
- `react-hooks/static-components`: any small helper component (icons, etc.) referenced inside another component's JSX must be defined at module scope, not inline in the render body.

## Current state of each case study

- **BetterUp** — fully built and QA'd: hero, two MediaSplit sections, 5-slide carousel, QuotePair. Done.
- **Airbnb** — hero photo, 5-slide carousel, QuotePair (2 real quotes), and one MediaSplit section built: **"Organizing Cases"**. Taylor described this as 1 of **3 separate initiatives** she walks through in interviews (from a slide-deck source: a general "Project Atrium" intro/timeline plus 3 initiative deep-dives) — the other 2 are not yet built, waiting on Taylor to share the equivalent deck screens for each. The template only fits 2 `MediaSplit` sections by default — decide with Taylor whether initiative #2 becomes Airbnb's second section, or a 3rd section gets added to the page.
- **Rutter, TruStage, Hinge Health, FLYR Labs** — scaffolded into the finalized `SubSection`/`MediaSplit`/`TwoCol`/`Detail` structure using `MediaSplit`'s placeholder-image mode, no real images/copy yet. Eyebrow/title values are real known section topics from the Squarespace review (not invented); body copy is `TODO`. Optional `ImageCarousel`/`QuotePair` blocks are written but wrapped in MDX comments where there's no real image path yet (avoids the empty-`src` build break) — uncomment once real paths exist. Hinge Health's two real client quotes ARE live (no image dependency). `trustage.mdx`/`hinge-health.mdx`/`flyr-labs.mdx`'s `heroImage` values are still generic unrelated stock photos left over from an early pass — flagged TODO in `heroLabel`.
  - **Rutter is next per Taylor's plan** — its two sections are "Transaction & Bank Account Mapping" and "Accounting Sync" (the second's exact wording was cut off on the live site originally — unconfirmed, double-check with Taylor before treating as final).
- **"ManualShift"** — Taylor mentioned possibly adding this as a new case study. No info exists yet (not even category/dates/intro) — don't scaffold a file until she gives basics.

Homepage `ProjectsCarousel`'s `PROJECTS` array (`src/components/ProjectsCarousel.tsx`) currently only lists betterup, airbnb, rutter — trustage/hinge-health/flyr-labs are intentionally not linked from the homepage yet (still full of TODOs) even though their routes exist. Add cards once real content lands.

Squarespace reference screenshots (`taylorgersch.squarespace.com/<slug>`) are ground truth for layout/copy when starting a new case study. Taylor also has a separate "interview walkthrough deck" (presentation-style screenshots with deck chrome) used as a second valid source for some sections (e.g. Airbnb's Organizing Cases) — treat the same way: extract real copy/stats and crop real UI panels rather than inventing content.

## Outstanding / pending work

1. Rutter: waiting on Taylor's real copy + image exports for its two scaffolded MediaSplit sections.
2. Then TruStage, Hinge Health, FLYR Labs the same way.
3. Airbnb: 2 more initiatives (of 3 total) still need building — waiting on Taylor to share the deck screens.
4. ManualShift: waiting on Taylor for basic info before creating a file.
5. Once a case study has real content, add it to the homepage `ProjectsCarousel` `PROJECTS` array.
6. Not started: accessibility pass (contrast, focus states, alt text), broken-link sweep.
7. Domain cutover (real taylorgersch.com DNS → Vercel) explicitly deferred until Taylor is happy with the whole site — see README for the DNS steps when that time comes.

## Working with Taylor

- She's non-technical — describe changes in plain terms, lead with a screenshot, not a diff.
- She has strong, specific design preferences (documented in her requests): TailwindCSS with a clean design system, full-height/centered layouts, smooth hover effects, WCAG AA accessibility, explicit handling of loading/empty/error states, 2-space indent for TS/TSX, 4-space for MD.
- Prefers changes broken into reviewable chunks rather than one giant pass — check in with a screenshot before moving to the next section.
