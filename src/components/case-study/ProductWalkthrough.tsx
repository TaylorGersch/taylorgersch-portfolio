"use client";

import {
  Children,
  isValidElement,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** Subscribes to the OS-level reduced-motion preference via
 * useSyncExternalStore rather than useState+useEffect — this is the
 * pattern React itself recommends for browser APIs like matchMedia,
 * since a plain "setState from an effect body" here trips the
 * react-hooks/set-state-in-effect lint rule AND risks a hydration
 * mismatch (server has no `window` to check against). The server
 * snapshot always reports `false` (no motion assumed reduced during
 * SSR); React reconciles the real client value right after hydration
 * without a mismatch warning. */
function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}
function getReducedMotionServerSnapshot() {
  return false;
}

type RegionProps = {
  label: string;
  /** All four as percentage strings (e.g. "8.73%"), relative to the base
   * image's own box — keeps the highlight aligned regardless of how wide
   * the image actually renders. */
  top: string;
  left: string;
  width: string;
  height: string;
};

/**
 * Marker component — authored in MDX as a child of <ProductWalkthrough>,
 * same pattern as <CarouselSlide> in ImageCarousel.tsx. Renders nothing
 * itself; <ProductWalkthrough> reads each region's props via
 * React.Children instead of taking a `regions` array prop, since a
 * multi-line array/object literal as a JSX attribute value doesn't
 * survive this project's MDX compiler. Keep each tag single-line.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function WalkthroughRegion(_props: RegionProps) {
  return null;
}

/**
 * "Explain the tool before the feature work" section — a 50/50 split
 * matching <MediaSplit>'s grid/margin system: eyebrow/title/subcopy on
 * one side, a single annotated screenshot on the other. Unlike
 * <MediaSplit>, the "image" side here also carries a labeled tab row
 * above the screenshot, since the whole point of this section is
 * teaching the anatomy of the tool rather than pairing copy with a
 * static image.
 *
 * Rather than a real GIF (next/image can't animate one anyway — it
 * flattens GIFs to a static frame during optimization, and a real
 * animated GIF at this resolution would be a multi-MB asset), the
 * highlight itself is a live, coded overlay: the tab row drives which
 * region gets a spotlight treatment on the screenshot below, cross-
 * fading on an auto-advance timer. Cheaper to load, crisp at any zoom
 * level, and trivial to re-word or re-time later without touching image
 * assets.
 *
 * Text column is intentionally NOT vertically centered (contrast with
 * <MediaSplit>'s body content, which centers in the leftover space below
 * its heading) — eyebrow/title/subcopy just stack from the top of the
 * grid row, top-aligned with the image beside them.
 */
export function ProductWalkthrough({
  eyebrow,
  title,
  subcopy,
  image,
  imageAlt,
  imageWidth,
  imageHeight,
  intervalMs = 3200,
  side = "right",
  children,
}: {
  eyebrow?: string;
  title?: string;
  subcopy?: string;
  /** Real image path — omit (along with imageWidth/imageHeight) to render
   * nothing on that side while copy is drafted ahead of a real export. */
  image?: string;
  imageAlt: string;
  /** Pass as a quoted string, e.g. `imageWidth="2900"` — see the MDX
   * numeric-prop gotcha documented on <MediaSplit> in CaseStudyBlocks.tsx. */
  imageWidth?: number | string;
  imageHeight?: number | string;
  /** Milliseconds each region stays highlighted before auto-advancing. */
  intervalMs?: number;
  /** Which side the image/tab column sits on — same convention as
   * <MediaSplit>'s `side` prop, flipping which edge gets the pulled-in
   * 60px text margin vs. the standard 40px image margin. */
  side?: "left" | "right";
  children: React.ReactNode;
}) {
  const regions = Children.toArray(children)
    .filter(isValidElement)
    .map((el) => el.props as RegionProps);

  const [active, setActive] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  useEffect(() => {
    if (!autoPlay || reducedMotion || regions.length < 2) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % regions.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [autoPlay, reducedMotion, regions.length, intervalMs]);

  const widthNum = imageWidth ? Number(imageWidth) : undefined;
  const heightNum = imageHeight ? Number(imageHeight) : undefined;
  const hasImage = Boolean(image && widthNum && heightNum && regions.length > 0);
  const outerPadding =
    side === "left" ? "sm:pl-10 sm:pr-[60px]" : "sm:pl-[60px] sm:pr-10";

  return (
    <div
      className={`grid grid-cols-1 gap-10 px-6 py-10 sm:grid-cols-2 sm:gap-12 sm:py-14 ${outerPadding}`}
    >
      <div className={side === "left" ? "sm:order-2" : "sm:order-1"}>
        {eyebrow && <p className="text-sm text-neutral-500">{eyebrow}</p>}
        {title && (
          <h3 className="mt-2 mb-4 text-3xl tracking-tight text-neutral-800 sm:text-4xl">
            {title}
          </h3>
        )}
        {subcopy && (
          <p className="text-base leading-6 text-black">{subcopy}</p>
        )}
      </div>

      {hasImage && (
        <div className={side === "left" ? "sm:order-1" : "sm:order-2"}>
          <div
            role="tablist"
            aria-label={title ? `${title} — highlighted areas` : "Highlighted areas"}
            className="mb-4 flex flex-wrap gap-x-4 gap-y-2"
          >
            {regions.map((r, i) => (
              <button
                key={r.label}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => {
                  setActive(i);
                  setAutoPlay(false);
                }}
                className={`text-sm transition-colors ${
                  i === active
                    ? "font-medium text-neutral-900"
                    : "text-neutral-400 hover:text-neutral-600"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="relative w-full overflow-hidden">
            <Image
              src={image!}
              alt={imageAlt}
              width={widthNum}
              height={heightNum}
              sizes="(min-width: 640px) 50vw, 100vw"
              className="h-auto w-full"
            />
            {regions.map((r, i) => (
              <div
                key={r.label}
                aria-hidden="true"
                className={
                  reducedMotion
                    ? "pointer-events-none absolute rounded-md"
                    : "pointer-events-none absolute rounded-md transition-opacity duration-700 ease-in-out"
                }
                style={{
                  top: r.top,
                  left: r.left,
                  width: r.width,
                  height: r.height,
                  opacity: i === active ? 1 : 0,
                  boxShadow: "0 0 0 2000px rgba(23, 23, 23, 0.55)",
                  outline: "1.5px solid rgba(255, 255, 255, 0.85)",
                  outlineOffset: "-1px",
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
