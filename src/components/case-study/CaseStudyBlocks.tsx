import { Children, isValidElement } from "react";
import Image from "next/image";
import PlaceholderImage from "../PlaceholderImage";
import MagnifyImage from "./MagnifyImage";

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
  videoMp4,
  videoWebm,
  videoWidth,
  videoHeight,
  videoPoster,
  placeholderRatio = "aspect-[4/3]",
  side = "right",
  magnify,
  children,
}: {
  /** "true" adds a hover magnifier lens + click/tap to view full size
   * (see <MagnifyImage>). String, not boolean, because of the MDX
   * expression-prop bug described above. */
  magnify?: "true" | "false";
  eyebrow?: string;
  title?: string;
  /** Override the gap between the title and the body content below it —
   * used to bring one section's heading-to-body spacing in line with
   * another's when they'd otherwise render slightly differently. */
  titleGapClassName?: string;
  /** Real image path — omit (along with imageWidth/imageHeight) to render
   * a placeholder instead while the section's copy/structure is drafted
   * ahead of real exports. Ignored when a video is provided (see below). */
  image?: string;
  imageAlt: string;
  /** Pass as a quoted string, e.g. `imageWidth="1500"` — see the
   * IMPORTANT note above about why `{1500}` silently fails in this MDX
   * pipeline. */
  imageWidth?: number | string;
  imageHeight?: number | string;
  /** MP4 source for the video variant of the image slot — used for flow
   * walkthroughs assembled from a sequence of screenshots rather than one
   * static image. Takes priority over `image` when either video source is
   * present. `<video>` has no `alt`, so `imageAlt` doubles as its
   * `aria-label`. Autoplays muted/looped/inline, matching the hero video
   * treatment in <CaseStudyHero>. */
  videoMp4?: string;
  /** WebM source, tried first for its smaller file size — optional,
   * falls back to `videoMp4` in browsers that don't support it. */
  videoWebm?: string;
  /** Native pixel dimensions of the video file, same quoted-string rule as
   * imageWidth/imageHeight — set as the <video> element's own width/height
   * attributes so the layout doesn't shift once it loads. */
  videoWidth?: number | string;
  videoHeight?: number | string;
  /** Optional poster frame shown before the video starts playing. */
  videoPoster?: string;
  /** Aspect-ratio class for the placeholder shown when neither `image` nor
   * a video is provided — ignored once real media is provided. */
  placeholderRatio?: string;
  side?: "left" | "right";
  children: React.ReactNode;
}) {
  const outerPadding =
    side === "left" ? "sm:pl-10 sm:pr-[60px]" : "sm:pl-[60px] sm:pr-10";
  const widthNum = imageWidth ? Number(imageWidth) : undefined;
  const heightNum = imageHeight ? Number(imageHeight) : undefined;
  const videoWidthNum = videoWidth ? Number(videoWidth) : undefined;
  const videoHeightNum = videoHeight ? Number(videoHeight) : undefined;
  const hasVideo = Boolean(videoMp4 || videoWebm);

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
        {hasVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            aria-label={imageAlt}
            poster={videoPoster}
            width={videoWidthNum}
            height={videoHeightNum}
            className="h-auto w-full rounded-[8px]"
          >
            {videoWebm && <source src={videoWebm} type="video/webm" />}
            {videoMp4 && <source src={videoMp4} type="video/mp4" />}
          </video>
        ) : image && widthNum && heightNum && magnify === "true" ? (
          <MagnifyImage
            src={image}
            alt={imageAlt}
            width={widthNum}
            height={heightNum}
            sizes="(min-width: 640px) 50vw, 100vw"
          />
        ) : image && widthNum && heightNum ? (
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
    <div data-quote-pair className="grid grid-cols-1 gap-10 bg-neutral-100 px-6 py-[164px] sm:grid-cols-2 sm:gap-16 sm:py-[180px] sm:pl-[60px] sm:pr-10">
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
      <div className="space-y-3 text-base leading-6 text-black [&_li]:mt-2 [&_li]:pl-1 [&_ul]:list-disc [&_ul]:pl-5">
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

/**
 * A row of short "what I did" pillars (e.g. Product / Marketing / Brand)
 * shown right under the page's <Meta> intro. Each <Pillar> takes a small
 * uppercase `label`, a `title`, and its body copy as children.
 */
export function Pillars({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-10 border-t border-neutral-200 px-6 py-12 sm:grid-cols-3 sm:gap-x-12 sm:gap-y-0 sm:pr-10 sm:pl-[60px]">
      {children}
    </div>
  );
}

export function Pillar({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    // On desktop each pillar is a 3-row subgrid of the parent, so every
    // label, headline and body lines up across columns: if one headline
    // wraps to 2 lines, all three headline rows become 2 lines tall and the
    // body copy starts at the same height everywhere.
    <div className="sm:row-span-3 sm:grid sm:grid-rows-subgrid">
      <p className="text-xs font-medium tracking-[0.12em] text-neutral-500 uppercase">
        {label}
      </p>
      <h3 className="mt-3 text-xl leading-snug font-light text-neutral-900">
        {title}
      </h3>
      <div className="mt-3 text-base leading-6 text-neutral-700">
        {children}
      </div>
    </div>
  );
}

/**
 * Same two-column rhythm and margins as <MediaSplit>, but the second
 * column holds content (e.g. a <UserStories> grid) instead of an image.
 * Expects exactly two <SplitColumn> children: copy first, aside second.
 */
export function ContentSplit({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
}) {
  const [main, aside] = Children.toArray(children).filter(isValidElement);
  // Heading sits in its own row above the first column, so the aside's
  // first line starts level with the copy's first subheading (e.g.
  // "Overview + Role") rather than with the eyebrow.
  return (
    <div className="grid grid-cols-1 gap-x-12 px-6 py-10 sm:grid-cols-2 sm:py-14 sm:pr-10 sm:pl-[60px]">
      <div className="mb-8">
        {eyebrow && <p className="text-sm text-neutral-500">{eyebrow}</p>}
        {title && (
          <h3 className="mt-2 text-3xl tracking-tight text-neutral-800 sm:text-4xl">
            {title}
          </h3>
        )}
      </div>
      <div className="flex flex-col sm:col-start-1 sm:row-start-2">{main}</div>
      <div className="mt-10 sm:col-start-2 sm:row-start-2 sm:mt-0">{aside}</div>
    </div>
  );
}

export function SplitColumn({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-10">{children}</div>;
}

function GridIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="h-4 w-4 shrink-0 text-neutral-700"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      {[2.5, 8, 13.5].map((cy) =>
        [2.5, 8, 13.5].map((cx) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.6" />
        )),
      )}
    </svg>
  );
}

/** Intro line + 2-column grid of <UserStory> cards. */
export function UserStories({
  intro,
  children,
}: {
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {intro && <h4 className="mb-4 text-lg font-light text-neutral-900">{intro}</h4>}
      <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4">
        {children}
      </ul>
    </div>
  );
}

export function UserStory({ title, text }: { title: string; text: string }) {
  return (
    <li className="flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white transition-colors duration-200 hover:border-neutral-300">
      <div className="flex items-center gap-2.5 px-4 py-3">
        <GridIcon />
        <h5 className="text-sm font-medium text-neutral-900">{title}</h5>
      </div>
      <p className="flex-1 border-t border-neutral-200 bg-neutral-50 px-4 py-3 text-sm leading-5 text-neutral-700">
        {text}
      </p>
    </li>
  );
}

/**
 * Bullet-free list of key points: each <Point> is a bold title on its own
 * line with regular body copy underneath, laid out side by side in a grid
 * (2 columns by default, so 4 points form a 2×2 block). Pass
 * columns="4" for a single row of four on wide screens. Stacks to one
 * column on mobile. `columns` is a string on purpose (see the MDX
 * numeric-prop note on <MediaSplit>).
 */
export function Points({
  columns = "2",
  spacing,
  children,
}: {
  columns?: "2" | "4";
  /** "loose" adds ~10px above the grid, for when it follows a lead-in
   * paragraph inside a <Detail>. */
  spacing?: "loose";
  children: React.ReactNode;
}) {
  const cols =
    columns === "4"
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : "lg:grid-cols-2";
  return (
    <div
      className={`grid grid-cols-1 gap-x-10 gap-y-8 ${cols} ${spacing === "loose" ? "pt-2.5" : ""}`}
    >
      {children}
    </div>
  );
}

export function Point({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h5 className="text-base leading-6 font-semibold text-black">{title}</h5>
      <div className="mt-1 text-base leading-6 text-black">{children}</div>
    </div>
  );
}

/**
 * Full-width text-only section (no image column) with the same eyebrow /
 * title treatment and 60px content margin as <MediaSplit>.
 */
export function TextSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-6 py-10 sm:py-14 sm:pr-10 sm:pl-[60px]">
      {eyebrow && <p className="text-sm text-neutral-500">{eyebrow}</p>}
      {title && (
        <h3 className="mt-2 mb-8 text-3xl tracking-tight text-neutral-800 sm:text-4xl">
          {title}
        </h3>
      )}
      <div className="flex flex-col gap-10">{children}</div>
    </div>
  );
}
