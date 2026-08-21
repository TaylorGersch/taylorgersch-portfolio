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

/** Shared prev/next chevron — module-level so it isn't recreated as a
 * component on every render of <ImageCarousel>. */
function ArrowIcon({ flipped }: { flipped?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d={flipped ? "M12.5 5L7.5 10L12.5 15" : "M7.5 5L12.5 10L7.5 15"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Horizontally scrolling row of images — matches the homepage
 * ProjectsCarousel's look: the first card sits flush with the page's
 * pulled-in content margin, at least two cards are fully visible with a
 * third peeking in from the right edge.
 *
 * The left margin lives on a non-scrolling OUTER wrapper, not as padding
 * on the scrollable element itself — same technique ProjectsCarousel
 * uses. That matters because this row has `scroll-snap-type: x
 * mandatory` (via the shared `.snap-row` class): a mandatory snap
 * container "corrects" its scroll position to satisfy snap alignment as
 * soon as it lays out, and padding-left on the scrollable element itself
 * isn't part of that alignment reference — only `scroll-padding` is — so
 * the browser silently scrolls the padding away on load, and the left
 * margin visually disappears. Keeping the margin outside the scroller
 * avoids the conflict entirely. The scroller then bleeds to the
 * container's right edge via a negative margin + matching padding, the
 * same peek-past-the-edge trick ProjectsCarousel uses on the right.
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

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-carousel-card]");
    const step = card
      ? card.getBoundingClientRect().width + 24
      : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
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
    <div className="px-6 py-20 sm:pr-10 sm:pl-[60px]">
      <div
        ref={scrollerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="snap-row -mr-6 flex cursor-grab gap-6 overflow-x-auto pr-6 select-none active:cursor-grabbing sm:-mr-10 sm:pr-10"
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            data-carousel-card
            className="flex w-[85vw] shrink-0 flex-col gap-6 sm:w-[46vw]"
          >
            {/* aspect-[3/2] matches these screenshots' real ~1.5 aspect
                ratio almost exactly, so object-contain shows the full
                image with little to no letterboxing instead of the
                object-cover crop that was cutting off the sides. */}
            <div className="relative aspect-[3/2] w-full overflow-hidden bg-neutral-100">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                draggable={false}
                className="object-contain"
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

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          aria-label="Previous image"
          className="rounded-full border border-neutral-300 p-2 text-neutral-500 transition-colors hover:border-neutral-900 hover:text-neutral-900"
        >
          <ArrowIcon flipped />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label="Next image"
          className="rounded-full border border-neutral-300 p-2 text-neutral-500 transition-colors hover:border-neutral-900 hover:text-neutral-900"
        >
          <ArrowIcon />
        </button>
      </div>
    </div>
  );
}
