import Image from "next/image";
import PlaceholderImage from "../PlaceholderImage";

export function Meta({
  category,
  dates,
  intro,
}: {
  category: string;
  dates: string;
  intro: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 border-t border-neutral-200 px-6 py-10 sm:grid-cols-[1fr_1fr_2fr] sm:pr-10 sm:pl-[60px]">
      <p className="text-sm text-neutral-500">{category}</p>
      <p className="text-sm text-neutral-500">{dates}</p>
      <p className="text-neutral-700">{intro}</p>
    </div>
  );
}

export function TwoCol({
  overviewTitle = "Overview + Role",
  overview,
  problemTitle = "The problem",
  problem,
}: {
  overviewTitle?: string;
  overview: string;
  problemTitle?: string;
  problem: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
      <div>
        <h4 className="mb-3 text-lg font-light text-neutral-900">
          {overviewTitle}
        </h4>
        <p className="text-base leading-6 text-black">{overview}</p>
      </div>
      <div>
        <h4 className="mb-3 text-lg font-light text-neutral-900">
          {problemTitle}
        </h4>
        <p className="text-base leading-6 text-black">{problem}</p>
      </div>
    </div>
  );
}

/**
 * Pairs two <Detail> blocks side by side (e.g. "The process" + "The
 * solution"), matching the same two-column rhythm as <TwoCol>. Used inside
 * <MediaSplit> alongside the overview/problem pair.
 */
export function Pair({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10">
      {children}
    </div>
  );
}

/**
 * Lays a case-study image out beside its narrative content instead of
 * stacking it below — matching the live site, where the mockup image
 * spans the full height of the overview/problem (+ process/solution)
 * block next to it. `side` flips which edge the image sits on, so
 * sections can alternate left/right for visual rhythm.
 *
 * The eyebrow/title live here (not in <SubSection>) specifically so they
 * share the same grid row as the image — the image's top edge lines up
 * with the eyebrow, and the body content (passed as `children`) top-aligns
 * directly below the heading (fixed `titleGapClassName` gap, no more). Any
 * leftover height — e.g. when the image is taller than the copy — shows up
 * as blank space at the BOTTOM of the text column instead.
 *
 * This used to be `justify-center` on the content wrapper (vertically
 * centering the copy in whatever space was left below the heading), which
 * matched a live Squarespace layout but had a hidden dependency: the
 * visible title-to-content gap grew or shrank with how much slack existed
 * between the copy's rendered height and the image's, and that slack is
 * font-dependent. Every section here was verified in this sandbox using
 * Inter (the self-hosted fallback), where `--font-sans` normally resolves
 * to "Helvetica Neue" on macOS (see globals.css) — a narrower font that
 * wraps the same copy to fewer lines. On a section with enough copy to
 * fill the image's height either way (e.g. Organizing Cases, which has a
 * third "outcome" paragraph the shorter sections don't), the centering
 * was a no-op and this was invisible. On a shorter section (e.g. Stripe's
 * Contract Customizations, no outcome block yet), Helvetica Neue's
 * tighter wrap left real slack, and centering pushed the copy down by
 * however much was left — a large, font-only gap that no amount of
 * testing in a Linux sandbox without Helvetica Neue installed would catch.
 * Top-aligning removes the font dependency entirely: the gap is always
 * exactly `titleGapClassName`, everywhere, regardless of copy length,
 * image height, or which font actually renders.
 *
 * The image renders at its native aspect ratio (no crop) via explicit
 * width/height instead of `fill`, so `imageWidth`/`imageHeight` must match
 * the source file's real pixel dimensions.
 *
 * `image`/`imageWidth`/`imageHeight` are all optional together — when a
 * section's copy is ready before its real exports are, omit them and the
 * image column renders a `<PlaceholderImage>` (labeled with `imageAlt`,
 * sized by `placeholderRatio`) instead. This lets the whole section —
 * eyebrow, title, overview/problem, process/solution — get built and
 * reviewed before any screenshots exist; swap in the three image props
 * later with no layout changes needed.
 *
 * IMPORTANT — pass imageWidth/imageHeight as QUOTED STRINGS, not numeric
 * JSX expressions: `imageWidth="1500"`, never `imageWidth={1500}`. The
 * MDX pipeline in this project (next-mdx-remote@6 on the current
 * Next/React versions) silently drops ANY `{...}` JSX expression-container
 * attribute value — not just multi-line array/object literals as
 * previously documented, but plain numeric literals too — so
 * `imageWidth={1500}` arrives here as `undefined` with no build error,
 * and the section silently falls back to the placeholder box. This broke
 * every existing MediaSplit image site-wide (BetterUp included) until
 * caught here. String attributes are unaffected, so MediaSplit accepts
 * strings (or numbers) and coerces them itself.
 *
 * Padding is asymmetric on purpose: the content column's outer margin is
 * pulled in an extra 20px from the standard 40px edge margin (desktop and
 * up only — mobile keeps the standard margin on both sides), while the
 * image keeps the standard 40px edge margin regardless of which side it's
 * on.
 */
export function MediaSplit({
  eyebrow,
  title,
  titleGapClassName = "mb-8",
  image,
  imageAlt,
  imageWidth,
  imageHeight,
  placeholderRatio = "aspect-[4/3]",
  side = "right",
  children,
}: {
  eyebrow?: string;
  title?: string;
  /** Override the gap between the title and the body content below it —
   * used to bring one section's heading-to-body spacing in line with
   * another's when they'd otherwise render slightly differently. */
  titleGapClassName?: string;
  /** Real image path — omit (along with imageWidth/imageHeight) to render
   * a placeholder instead while the section's copy/structure is drafted
   * ahead of real exports. */
  image?: string;
  imageAlt: string;
  /** Pass as a quoted string, e.g. `imageWidth="1500"` — see the
   * IMPORTANT note above about why `{1500}` silently fails in this MDX
   * pipeline. */
  imageWidth?: number | string;
  imageHeight?: number | string;
  /** Aspect-ratio class for the placeholder shown when `image` is
   * omitted — ignored once a real image is provided. */
  placeholderRatio?: string;
  side?: "left" | "right";
  children: React.ReactNode;
}) {
  const outerPadding =
    side === "left" ? "sm:pl-10 sm:pr-[60px]" : "sm:pl-[60px] sm:pr-10";
  const widthNum = imageWidth ? Number(imageWidth) : undefined;
  const heightNum = imageHeight ? Number(imageHeight) : undefined;

  return (
    <div
      className={`grid grid-cols-1 gap-10 px-6 py-10 sm:grid-cols-2 sm:gap-12 sm:py-14 ${outerPadding}`}
    >
      <div
        className={`flex flex-col ${side === "left" ? "sm:order-2" : "sm:order-1"}`}
      >
        {eyebrow && <p className="text-sm text-neutral-500">{eyebrow}</p>}
        {title && (
          <h3
            className={`mt-2 text-3xl tracking-tight text-neutral-800 sm:text-4xl ${titleGapClassName}`}
          >
            {title}
          </h3>
        )}
        <div className="flex flex-col gap-10">{children}</div>
      </div>
      <div
        className={`relative w-full ${side === "left" ? "sm:order-1" : "sm:order-2"}`}
      >
        {image && widthNum && heightNum ? (
          <Image
            src={image}
            alt={imageAlt}
            width={widthNum}
            height={heightNum}
            sizes="(min-width: 640px) 50vw, 100vw"
            className="h-auto w-full"
          />
        ) : (
          <PlaceholderImage
            label={imageAlt}
            className={`w-full ${placeholderRatio}`}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Border-top + vertical-spacing wrapper only — no horizontal padding and
 * no eyebrow/title of its own. When a section uses <MediaSplit>, the
 * eyebrow/title are passed to <MediaSplit> instead (so they share its
 * grid row with the image); <SubSection> just wraps it.
 */
export function SubSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="border-t border-neutral-200 py-14">
      {eyebrow && (
        <p className="px-6 text-sm text-neutral-500 sm:px-10">{eyebrow}</p>
      )}
      {title && (
        <h3 className="mt-2 mb-8 px-6 text-3xl tracking-tight text-neutral-800 sm:px-10 sm:text-4xl">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

export function Quote({
  text,
  attribution,
}: {
  text: string;
  attribution: string;
}) {
  return (
    <div className="border-t border-neutral-200 px-6 py-14 sm:px-10">
      <p className="max-w-3xl text-2xl leading-snug text-neutral-800 sm:text-3xl">
        &ldquo;{text}&rdquo;
      </p>
      <p className="mt-4 text-sm text-neutral-500">— {attribution}</p>
    </div>
  );
}

/** A single quote, unpadded — for use inside <QuotePair>. No width cap, so
 * lines run the full column width like the rest of the body copy. */
export function QuoteItem({
  text,
  attribution,
}: {
  text: string;
  attribution: string;
}) {
  return (
    <div>
      <p className="text-xl leading-snug text-neutral-800 sm:text-2xl">
        &ldquo;{text}&rdquo;
      </p>
      <p className="mt-4 text-sm text-neutral-500">— {attribution}</p>
    </div>
  );
}

/**
 * Two client quotes side by side on a light-grey band. Left edge matches
 * the same pulled-in content margin used in <MediaSplit> (desktop/tablet
 * only); vertical padding is generous — +100px top and bottom on top of
 * the previous round's spacing.
 */
export function QuotePair({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-10 bg-neutral-100 px-6 py-[164px] sm:grid-cols-2 sm:gap-16 sm:py-[180px] sm:pl-[60px] sm:pr-10">
      {children}
    </div>
  );
}

export function ImageBlock({
  label,
  ratio = "aspect-[16/10]",
  src,
}: {
  label: string;
  ratio?: string;
  src?: string;
}) {
  if (src) {
    return (
      <div className={`relative w-full overflow-hidden ${ratio}`}>
        <Image src={src} alt={label} fill className="object-cover" />
      </div>
    );
  }
  return <PlaceholderImage label={label} className={`w-full ${ratio}`} />;
}

/**
 * A single labeled block of body copy — used for narrative sections like
 * "The process", "The solution", or "The outcome". Unpadded by design: it
 * nests inside <MediaSplit>/<Pair> (which own the surrounding grid/gap) or,
 * for a full-width block like the outcome, inside a plain padded <div> in
 * the MDX itself — the same pattern <ImageBlock> already uses.
 */
export function Detail({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="mb-3 text-lg font-light text-neutral-900">{title}</h4>
      <div className="space-y-3 text-base leading-6 text-black">
        {children}
      </div>
    </div>
  );
}

/**
 * Marks a section that exists on the live Squarespace site but was left
 * empty there (no supporting copy/screenshots were ever added) — flagged
 * during the portfolio review. Fill this in with real content, or delete
 * the <Stub> block entirely if the step isn't needed.
 */
export function Stub({
  step,
  label,
}: {
  step: string;
  label: string;
}) {
  return (
    <div className="border-t border-dashed border-amber-400 bg-amber-50 px-6 py-10 sm:px-10">
      <p className="text-sm text-neutral-500">{step}</p>
      <p className="mt-1 text-neutral-700">{label}</p>
      <p className="mt-3 text-xs font-medium tracking-wide text-amber-700 uppercase">
        TODO — this section was empty on the live site. Add copy + screenshots here.
      </p>
    </div>
  );
}
