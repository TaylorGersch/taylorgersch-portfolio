"use client";

import { Children, isValidElement, useRef } from "react";
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
 * Horizontally scrolling row of images — matches the homepage
 * ProjectsCarousel's look: the first card sits flush against the left
 * margin, at least two cards are fully visible with a third peeking in
 * from the right edge, and a single right-pointing arrow advances the
 * row by one card (there's no left arrow — same as the reference).
 */
export default function ImageCarousel({
  children,
}: {
  children: React.ReactNode;
}) {
  const slides = Children.toArray(children)
    .filter(isValidElement)
    .map((el) => el.props as SlideProps);

  const scrollerRef = useRef<HTMLDivElement>(null);

  if (slides.length === 0) return null;

  const scrollNext = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-carousel-card]");
    const step = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: step, behavior: "smooth" });
  };

  return (
    <div className="relative py-20">
      <div
        ref={scrollerRef}
        className="snap-row flex gap-6 overflow-x-auto px-6 sm:px-10"
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            data-carousel-card
            className="flex w-[85vw] shrink-0 flex-col gap-6 sm:w-[46vw]"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover"
              />
            </div>
            <p className="text-sm text-neutral-600">{slide.caption}</p>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={scrollNext}
        aria-label="Next image"
        className="absolute top-1/2 right-4 hidden -translate-y-1/2 rounded-full border border-neutral-300 bg-white p-2 text-neutral-500 shadow-sm transition-colors hover:border-neutral-900 hover:text-neutral-900 sm:right-6 sm:flex"
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
  );
}
