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
 * "Explain the tool before the feature work" section — a full-width
 * eyebrow/title/subcopy block followed by a single annotated screenshot.
 * Rather than a real GIF (next/image can't animate one anyway — it
 * flattens GIFs to a static frame during optimization, and a real
 * animated GIF at this resolution would be a multi-MB asset), the
 * highlight itself is a live, coded overlay: a labeled tab row above the
 * image drives which region gets a spotlight treatment below, cross-
 * fading on an auto-advance timer. Cheaper to load, crisp at any zoom
 * level, and trivial to re-word or re-time later without touching image
 * assets.
 *
 * Not paired with a side-by-side image (contrast with <MediaSplit>) — the
 * text block spans full width using the same pulled-in text margin
 * (`sm:pl-[60px]`) as everything else, and the screenshot below it uses
 * the standard image margin (`sm:pl-10 sm:pr-10`), same margin system
 * documented on <MediaSplit>.
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
  children,
}: {
  eyebrow?: string;
  title?: string;
  subcopy?: string;
  /** Real image path — omit (along with imageWidth/imageHeight) to render
   * a placeholder instead while copy is drafted ahead of a real export. */
  image?: string;
  imageAlt: string;
  /** Pass as a quoted string, e.g. `imageWidth="2900"` — see the MDX
   * numeric-prop gotcha documented on <MediaSplit> in CaseStudyBlocks.tsx. */
  imageWidth?: number | string;
  imageHeight?: number | string;
  /** Milliseconds each region stays highlighted before auto-advancing. */
  intervalMs?: number;
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

  return (
    <div>
      {(eyebrow || title || subcopy) && (
        <div className="px-6 pb-10 sm:pr-10 sm:pl-[60px]">
          {eyebrow && <p className="text-sm text-neutral-500">{eyebrow}</p>}
          {title && (
            <h3 className="mt-2 mb-4 text-3xl tracking-tight text-neutral-800 sm:text-4xl">
              {title}
            </h3>
          )}
          {subcopy && (
            <p className="max-w-3xl text-base leading-6 text-black">
              {subcopy}
            </p>
          )}
        </div>
      )}

      {hasImage && (
        <div className="px-6 sm:pr-10 sm:pl-10">
          <div
            role="tablist"
            aria-label={title ? `${title} — highlighted areas` : "Highlighted areas"}
            className="mb-4 flex flex-wrap gap-x-6 gap-y-2"
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
              sizes="100vw"
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
