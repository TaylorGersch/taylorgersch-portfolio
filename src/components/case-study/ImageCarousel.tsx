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
 * ProjectsCarousel's look: the first card sits flush with the page's
 * pulled-in content margin, at least two cards are fully visible with a
 * third peeking in from the right edge. A single right-pointing arrow
 * sits below the row (not overlapping the images) and advances by one
 * card; the row is also mouse-drag-scrollable, not just arrow/touch
 * scrollable.
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
  const dragRef = useRef({ dragging: false, startX: 0, startScrollLeft: 0 });

  if (slides.length === 0) return null;

  const scrollNext = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-carousel-card]");
    const step = card
      ? card.getBoundingClientRect().width + 24
      : el.clientWidth * 0.8;
    el.scrollBy({ left: step, behavior: "smooth" });
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return; // let touch use native scrolling
    const el = scrollerRef.current;
    if (!el) return;
    dragRef.current = {
      dragging: true,
      startX: e.clientX,
      startScrollLeft: el.scrollLeft,
    };
    // Mandatory scroll-snap otherwise fights every scrollLeft assignment
    // below and snaps straight back to the nearest card mid-drag.
    el.style.scrollSnapType = "none";
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.dragging) return;
    const el = scrollerRef.current;
    if (!el) return;
    const dx = e.clientX - dragRef.current.startX;
    el.scrollLeft = dragRef.current.startScrollLeft - dx;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.dragging) return;
    dragRef.current.dragging = false;
    const el = scrollerRef.current;
    if (el) {
      el.style.scrollSnapType = ""; // restore snap-to-card once released
      if (el.hasPointerCapture(e.pointerId)) {
        el.releasePointerCapture(e.pointerId);
      }
    }
  };

  return (
    <div className="py-20">
      <div
        ref={scrollerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="snap-row flex cursor-grab gap-6 overflow-x-auto px-6 select-none active:cursor-grabbing sm:pr-10 sm:pl-[60px]"
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
                draggable={false}
                className="object-cover"
              />
            </div>
            <div className="flex items-baseline gap-3 text-sm">
              <span className="text-neutral-400">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="truncate text-neutral-600">
                {slide.caption}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end px-6 sm:pr-10 sm:pl-[60px]">
        <button
          type="button"
          onClick={scrollNext}
          aria-label="Next image"
          className="rounded-full border border-neutral-300 p-2 text-neutral-500 transition-colors hover:border-neutral-900 hover:text-neutral-900"
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
    </div>
  );
}
