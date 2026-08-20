"use client";

import { Children, isValidElement, useState } from "react";
import Image from "next/image";

type SlideProps = { src: string; alt: string; caption: string };

/**
 * Marker component — authored in MDX as a child of <ImageCarousel>. It
 * renders nothing itself; <ImageCarousel> reads each slide's props via
 * React.Children instead of taking a `slides` array prop, since a
 * multi-line array/object literal as a JSX attribute value doesn't survive
 * the MDX compiler (confirmed while building this page — keep each slide
 * as its own simple, single-line tag).
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CarouselSlide(_props: SlideProps) {
  return null;
}

/**
 * Single-slide image carousel with prev/next arrows and a small numbered
 * caption below — sized to match the section padding used by the
 * homepage's ProjectsCarousel, but showing one large slide at a time
 * instead of a scrolling row of cards.
 */
export default function ImageCarousel({
  children,
}: {
  children: React.ReactNode;
}) {
  const slides = Children.toArray(children)
    .filter(isValidElement)
    .map((el) => el.props as SlideProps);

  const [index, setIndex] = useState(0);
  const total = slides.length;

  if (total === 0) return null;

  const go = (dir: number) => setIndex((i) => (i + dir + total) % total);
  const current = slides[index];

  return (
    <div className="px-6 py-20 sm:px-10">
      <div className="flex items-center gap-3 sm:gap-6">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous image"
          className="shrink-0 rounded-full border border-neutral-300 p-2 text-neutral-500 transition-colors hover:border-neutral-900 hover:text-neutral-900"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path
              d="M12.5 5L7.5 10L12.5 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
          <Image
            src={current.src}
            alt={current.alt}
            fill
            className="object-cover"
          />
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next image"
          className="shrink-0 rounded-full border border-neutral-300 p-2 text-neutral-500 transition-colors hover:border-neutral-900 hover:text-neutral-900"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path
              d="M7.5 5L12.5 10L7.5 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="mt-6 flex items-baseline gap-3 pl-[calc(20px+0.75rem)] text-sm sm:pl-[calc(20px+1.5rem)]">
        <span className="text-neutral-400">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-neutral-600">{current.caption}</span>
      </div>
    </div>
  );
}
