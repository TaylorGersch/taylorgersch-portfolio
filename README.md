# taylorgersch-portfolio

A hand-rebuilt copy of taylorgersch.com — Next.js 16 (App Router) + Tailwind CSS 4, content in MDX, no Squarespace required. Deploys straight to Vercel from GitHub.

## Run it locally

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:3000.

## What's here

- `src/app/page.tsx` — homepage: Hero, LogoCarousel, ProjectsCarousel, ExploreSection, AboutSection
- `src/app/[slug]/page.tsx` — case study template, reads from `src/content/case-studies/*.mdx`
- `src/content/case-studies/` — one MDX file per project (`betterup.mdx`, `rutter.mdx`, `airbnb.mdx`). Frontmatter controls the title, category, dates, intro paragraph, and hero style; the MDX body is the page content, built from small components (`TwoCol`, `SubSection`, `ImageBlock`, `Stub`) defined in `src/components/case-study/CaseStudyBlocks.tsx`.
- `src/components/` — homepage sections + shared Header/Footer
- `public/logos/` — your client logos, copied over as-is from the Portfolio project folder

Adding a fourth case study is just: drop a new `.mdx` file in `src/content/case-studies/`, add a card to the `PROJECTS` array in `src/components/ProjectsCarousel.tsx`, done — the `[slug]` route and static generation pick it up automatically.

## Replace the placeholder images

I could pull all your copy and the layout structure directly from the live Squarespace site, but I couldn't cleanly bulk-download the original photos (they're loaded off Squarespace's CDN and the extraction tools available to me either got blocked or only caught images the browser hadn't already cached). Rather than substitute stock photography that isn't actually yours, every photo slot is a light gray placeholder with a label describing exactly what goes there — search the codebase for `PlaceholderImage` and `heroLabel` to find every spot.

To swap one in:
1. Save the real image into `public/images/` (e.g. `public/images/hero.jpg`)
2. Replace the `<PlaceholderImage label="..." className="..." />` with:
   ```tsx
   <Image src="/images/hero.jpg" alt="..." fill className="object-cover" />
   ```
   (import `Image` from `next/image`; keep the same wrapping `className` for sizing, and give the wrapper `relative` if you use `fill`.)

The fastest way to get your original photos: open each page on the live site, right-click each image → "Save Image As," or grab them straight from your Squarespace media library (Settings → Assets in the Squarespace dashboard hosts them at full resolution).

## Two content gaps carried over from the live site

The review of taylorgersch.com found two case studies with sections that were empty on the live site — I preserved that as a clearly flagged TODO rather than inventing content:

- **Rutter** (`src/content/case-studies/rutter.mdx`) — steps "01" and "02" after the PayPal→QuickBooks screenshot had no supporting copy or images on the live site (and "02"'s label was literally cut off the right edge of the page with no way to scroll to it).
- **Airbnb** (`src/content/case-studies/airbnb.mdx`) — a carousel section with prev/next arrows over completely blank space.

Look for the amber `<Stub>` blocks on those two pages and replace them with real content (or delete the block if the step isn't needed).

## Deploy: GitHub + Vercel

1. **Create the GitHub repo** (from this folder):
   ```bash
   git add -A
   git commit -m "Initial commit: rebuilt portfolio"
   ```
   Then create an empty repo on github.com (no README/gitignore — you already have one), and:
   ```bash
   git remote add origin https://github.com/<your-username>/taylorgersch-portfolio.git
   git branch -M main
   git push -u origin main
   ```

2. **Connect Vercel**: go to vercel.com → Add New → Project → import the GitHub repo you just pushed. Vercel auto-detects Next.js; accept the defaults and click Deploy. You'll get a `*.vercel.app` URL within a minute or two.

3. **Point your domain at it**: in the Vercel project → Settings → Domains, add `taylorgersch.com` (and `www.taylorgersch.com`). Vercel will show you the DNS records to add. Where you manage DNS depends on where the domain is registered:
   - If it's a **Squarespace Domain** (bought through Squarespace), you'll set this up in the Squarespace domain's DNS settings, not the website editor — Domains → your domain → DNS Settings.
   - If it's registered elsewhere (GoDaddy, Namecheap, Cloudflare, etc.), it's in that registrar's DNS panel.

   Typically that's an `A` record for the root domain pointing at Vercel's IP, and a `CNAME` for `www` pointing at `cname.vercel-dns.com` — Vercel's Domains screen gives you the exact current values to paste in. DNS changes can take anywhere from a few minutes to 24–48 hours to fully propagate.

4. **After the domain is live on Vercel**, you can cancel/downgrade the Squarespace website plan (keep the domain registration if it's registered there — that's separate from the website subscription).

Every future `git push` to `main` auto-deploys; Vercel also gives you a preview URL for every branch/PR if you want to review changes before merging.
