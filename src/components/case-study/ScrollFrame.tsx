"use client";

import { useRef } from "react";
import Image from "next/image";

/** Shared prev/next chevron — same icon as <ImageCarousel>, just able to
 * point in all four directions for vertical vs. horizontal controls. */
function ArrowIcon({ dir }: { dir: "left" | "right" | "up" | "down" }) {
  const rotation = { left: 0, up: 90, right: 180, down: 270 }[dir];
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <path
        d="M12.5 5L7.5 10L12.5 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * A single scrollable window onto an oversized artifact — used for both
 * the horizontal journey map and the vertical notification-framework doc
 * (`orientation` picks which). Real resolution stays intact; the frame
 * has a fixed size and scrolls instead of squashing the artifact to fit.
 *
 * Horizontal: drag-to-scroll on desktop (pointer-capture technique
 * matching <ImageCarousel>), native touch scroll on mobile, prev/next
 * buttons page by ~90% of the visible width. Vertical: native
 * wheel/trackpad/touch scrolling needs no drag handler; up/down buttons
 * page by ~90% of the frame's height for parity.
 *
 * A fade on the far edge + "Scroll to explore" hint signal there's more
 * content beyond the crop — without them a fixed-size window with no
 * visible scrollbar can read as the whole image rather than a view onto
 * a much bigger one.
 */
export function ScrollVisual({
  orientation,
  image,
  imageAlt,
  imageWidth,
  imageHeight,
  label,
  frameHeight,
}: {
  orientation: "horizontal" | "vertical";
  image: string;
  imageAlt: string;
  /** Pass as a quoted string — see the MDX numeric-prop gotcha documented
   * on <MediaSplit> in CaseStudyBlocks.tsx. */
  imageWidth: number | string;
  imageHeight: number | string;
  /** Small caption above the frame — useful when two of these are
   * stacked together and need to be told apart without each getting its
   * own eyebrow/title. */
  label?: string;
  frameHeight?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ dragging: false, startX: 0, startScrollLeft: 0 });
  const widthNum = Number(imageWidth);
  const heightNum = Number(imageHeight);
  const isHorizontal = orientation === "horizontal";
  const resolvedFrameHeight =
    frameHeight ??
    (isHorizontal ? "clamp(220px, 24vw, 340px)" : "clamp(360px, 42vw, 480px)");

  const page = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    if (isHorizontal) {
      el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
    } else {
      el.scrollBy({ top: dir * el.clientHeight * 0.9, behavior: "smooth" });
    }
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isHorizontal || e.pointerType !== "mouse") return;
    const el = scrollerRef.current;
    if (!el) return;
    dragRef.current = {
      dragging: true,
      startX: e.clientX,
      startScrollLeft: el.scrollLeft,
    };
    el.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.dragging) return;
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollLeft = dragRef.current.startScrollLeft - (e.clientX - dragRef.current.startX);
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.dragging) return;
    dragRef.current.dragging = false;
    const el = scrollerRef.current;
    if (el?.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
  };

  return (
    <div>
      {label && (
        <p className="mb-2 text-sm font-medium text-neutral-600">{label}</p>
      )}
      <div
        className={`relative overflow-hidden rounded-md bg-neutral-100 ${isHorizontal ? "" : "border border-neutral-200"}`}
        style={{ height: resolvedFrameHeight }}
      >
        <div
          ref={scrollerRef}
          onPointerDown={isHorizontal ? onPointerDown : undefined}
          onPointerMove={isHorizontal ? onPointerMove : undefined}
          onPointerUp={isHorizontal ? endDrag : undefined}
          onPointerCancel={isHorizontal ? endDrag : undefined}
          tabIndex={0}
          role="region"
          aria-label={
            label
              ? `${label} — scroll ${orientation}ly`
              : `Scroll ${orientation}ly to explore`
          }
          className={
            isHorizontal
              ? "h-full cursor-grab overflow-x-auto overflow-y-hidden select-none active:cursor-grabbing"
              : "h-full overflow-x-hidden overflow-y-auto"
          }
        >
          <Image
            src={image}
            alt={imageAlt}
            width={widthNum}
            height={heightNum}
            draggable={false}
            className={isHorizontal ? "h-full w-auto max-w-none" : "h-auto w-full"}
            sizes={
              isHorizontal
                ? "(min-width: 640px) 1300px, 100vw"
                : "(min-width: 640px) 50vw, 100vw"
            }
          />
        </div>
        <div
          aria-hidden
          className={
            isHorizontal
              ? "pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-neutral-100 to-transparent"
              : "pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-neutral-100 to-transparent"
          }
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm text-neutral-400">Scroll to explore</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => page(-1)}
            aria-label={isHorizontal ? "Scroll left" : "Scroll up"}
            className="rounded-full border border-neutral-300 p-2 text-neutral-500 transition-colors hover:border-neutral-900 hover:text-neutral-900"
          >
            <ArrowIcon dir={isHorizontal ? "left" : "up"} />
          </button>
          <button
            type="button"
            onClick={() => page(1)}
            aria-label={isHorizontal ? "Scroll right" : "Scroll down"}
            className="rounded-full border border-neutral-300 p-2 text-neutral-500 transition-colors hover:border-neutral-900 hover:text-neutral-900"
          >
            <ArrowIcon dir={isHorizontal ? "right" : "down"} />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * <MediaSplit>'s layout, but with the image side replaced by two stacked
 * <ScrollVisual>s (journey map on top, framework doc below) instead of a
 * single static image — built for the Notification Framework section,
 * where both source artifacts are too large to show at once and neither
 * one is "the" image for the section the way every other MediaSplit-based
 * section has exactly one.
 *
 * Unlike <MediaSplit> (eyebrow/title pinned to the top, body content
 * centered in the space below), the whole left column here — eyebrow,
 * title, and the Overview + Role / process / solution / outcome content
 * dropped in via `children` — is vertically centered as one block against
 * the taller right column via `self-center` on the grid item, same
 * technique as <ProductWalkthrough>'s text column.
 */
export function NotificationFrameworkSplit({
  eyebrow,
  title,
  titleGapClassName = "mb-8",
  journeyImage,
  journeyImageAlt,
  journeyImageWidth,
  journeyImageHeight,
  frameworkImage,
  frameworkImageAlt,
  frameworkImageWidth,
  frameworkImageHeight,
  side = "right",
  children,
}: {
  eyebrow?: string;
  title?: string;
  titleGapClassName?: string;
  journeyImage: string;
  journeyImageAlt: string;
  journeyImageWidth: number | string;
  journeyImageHeight: number | string;
  frameworkImage: string;
  frameworkImageAlt: string;
  frameworkImageWidth: number | string;
  frameworkImageHeight: number | string;
  side?: "left" | "right";
  children: React.ReactNode;
}) {
  const outerPadding =
    side === "left" ? "sm:pl-10 sm:pr-[60px]" : "sm:pl-[60px] sm:pr-10";

  return (
    <div
      className={`grid grid-cols-1 gap-10 px-6 py-10 sm:grid-cols-2 sm:gap-12 sm:py-14 ${outerPadding}`}
    >
      <div
        className={`self-center ${side === "left" ? "sm:order-2" : "sm:order-1"}`}
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
        className={`flex flex-col gap-8 ${side === "left" ? "sm:order-1" : "sm:order-2"}`}
      >
        <ScrollVisual
          orientation="horizontal"
          image={journeyImage}
          imageAlt={journeyImageAlt}
          imageWidth={journeyImageWidth}
          imageHeight={journeyImageHeight}
          label="Ambassador journey"
        />
        <ScrollVisual
          orientation="vertical"
          image={frameworkImage}
          imageAlt={frameworkImageAlt}
          imageWidth={frameworkImageWidth}
          imageHeight={frameworkImageHeight}
          label="Notification framework"
        />
      </div>
    </div>
  );
}
