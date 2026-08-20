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
    <div className="grid grid-cols-1 gap-6 border-t border-neutral-200 px-6 py-10 sm:grid-cols-[1fr_1fr_2fr] sm:px-10">
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
        <h4 className="mb-3 text-sm font-medium text-neutral-900">
          {overviewTitle}
        </h4>
        <p className="text-sm text-neutral-600">{overview}</p>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-medium text-neutral-900">
          {problemTitle}
        </h4>
        <p className="text-sm text-neutral-600">{problem}</p>
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
 */
export function MediaSplit({
  image,
  imageAlt,
  side = "right",
  ratio = "aspect-[4/5]",
  children,
}: {
  image: string;
  imageAlt: string;
  side?: "left" | "right";
  ratio?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-10 px-6 py-10 sm:grid-cols-2 sm:gap-12 sm:px-10 sm:py-14">
      <div
        className={`flex flex-col gap-10 ${side === "left" ? "sm:order-2" : "sm:order-1"}`}
      >
        {children}
      </div>
      <div
        className={`relative w-full overflow-hidden ${ratio} ${side === "left" ? "sm:order-1" : "sm:order-2"}`}
      >
        <Image src={image} alt={imageAlt} fill className="object-cover" />
      </div>
    </div>
  );
}

export function SubSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="border-t border-neutral-200 px-6 py-14 sm:px-10">
      <p className="text-sm text-neutral-500">{eyebrow}</p>
      <h3 className="mt-2 mb-8 text-3xl tracking-tight text-neutral-800 sm:text-4xl">
        {title}
      </h3>
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

/** A single quote, unpadded — for use inside <QuotePair>. */
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

/** Two client quotes side by side on a light-grey band. */
export function QuotePair({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-10 bg-neutral-100 px-6 py-16 sm:grid-cols-2 sm:gap-16 sm:px-10">
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
      <h4 className="mb-3 text-sm font-medium text-neutral-900">{title}</h4>
      <div className="max-w-2xl space-y-3 text-sm text-neutral-600">
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
