"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

/** Upper-bound pixel heights of the modal's scroll frame — kept as
 * constants (rather than inline in the className/style strings below) so
 * the horizontal `sizes` calculation can reason about the real rendered
 * width a horizontal artifact will hit at its tallest, since its CSS
 * width is height-driven (`h-full w-auto`) rather than width-driven. */
const MODAL_HORIZONTAL_FRAME_HEIGHT_PX = 720;
const MODAL_VERTICAL_FRAME_HEIGHT_PX = 800;

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

/** Corner "expand to full width" affordance on the inline frame. */
function ExpandIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M7.5 2.5H2.5V7.5M12.5 2.5H17.5V7.5M17.5 12.5V17.5H12.5M2.5 12.5V17.5H7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M5 5L15 15M15 5L5 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
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
 *
 * `expandable` (default true) adds a corner button that opens the same
 * scrollable view full-width in a modal — same drag/scroll/paging
 * behavior, just a much larger frame so the source detail actually reads.
 * The modal renders a second <ScrollVisual> with `expandable={false}` so
 * it can't recurse into its own expand button.
 */
export function ScrollVisual({
  orientation,
  image,
  imageAlt,
  imageWidth,
  imageHeight,
  label,
  frameHeight,
  expandable = true,
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
  /** Set false on the instance rendered inside the modal itself, so it
   * doesn't grow its own expand button. */
  expandable?: boolean;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ dragging: false, startX: 0, startScrollLeft: 0 });
  const expandButtonRef = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState(false);
  const widthNum = Number(imageWidth);
  const heightNum = Number(imageHeight);
  const isHorizontal = orientation === "horizontal";
  const resolvedFrameHeight =
    frameHeight ??
    (isHorizontal ? "clamp(220px, 24vw, 340px)" : "clamp(360px, 42vw, 480px)");

  // Escape-to-close + body-scroll-lock while the modal is open; focus
  // returns to the button that opened it on close, so keyboard users
  // don't lose their place.
  useEffect(() => {
    if (!expanded) return;
    const triggerEl = expandButtonRef.current;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      triggerEl?.focus();
    };
  }, [expanded]);

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

  // Widest the image will ever actually render at in each mode, so the
  // `sizes` hint we give next/image never undersells what's on screen.
  // Horizontal frames render the artifact at its full natural aspect
  // ratio scaled to the frame's HEIGHT (`h-full w-auto`), so its CSS
  // width can be much larger than the viewport — a viewport-relative
  // hint like "100vw" badly undersells that on a narrow/tall modal
  // (e.g. a wide journey map at a fixed 720px-tall modal frame renders
  // far wider than a phone's 100vw), which is exactly what was causing
  // the modal image to look soft on mobile. Compute the true worst-case
  // CSS width instead: frame-height cap × the image's own aspect ratio.
  // Vertical frames are width-constrained (`w-full`), so the modal's
  // actual container max-width is already a precise, sufficient hint.
  const modalHorizontalWidthPx = Math.ceil(
    MODAL_HORIZONTAL_FRAME_HEIGHT_PX * (widthNum / heightNum),
  );
  const sizes = isHorizontal
    ? expandable
      ? "(min-width: 640px) 1300px, 100vw"
      : `${modalHorizontalWidthPx}px`
    : expandable
      ? "(min-width: 640px) 50vw, 100vw"
      : "min(94vw, 1500px)";

  const frame = (
    <div>
      {label && <p className="mb-2 text-sm text-neutral-600">{label}</p>}
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
            sizes={sizes}
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
        {expandable && (
          <button
            type="button"
            ref={expandButtonRef}
            onClick={() => setExpanded(true)}
            aria-label={
              label ? `Expand ${label} to full width` : "Expand image to full width"
            }
            className="absolute top-3 right-3 z-10 rounded-full bg-white/90 p-2 text-neutral-600 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-neutral-900"
          >
            <ExpandIcon />
          </button>
        )}
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

  return (
    <>
      {frame}
      {expandable &&
        expanded &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={label ? `${label} — full-width view` : "Full-width view"}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/85 p-4 sm:p-10"
            onClick={(e) => {
              if (e.target === e.currentTarget) setExpanded(false);
            }}
          >
            <div className="relative w-full max-w-[min(94vw,1500px)]">
              <button
                type="button"
                onClick={() => setExpanded(false)}
                aria-label="Close expanded view"
                className="absolute -top-11 right-0 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              >
                <CloseIcon />
              </button>
              <div className="rounded-md bg-white p-2 shadow-2xl sm:p-3">
                <ScrollVisual
                  orientation={orientation}
                  image={image}
                  imageAlt={imageAlt}
                  imageWidth={imageWidth}
                  imageHeight={imageHeight}
                  frameHeight={
                    isHorizontal
                      ? `min(78vh, ${MODAL_HORIZONTAL_FRAME_HEIGHT_PX}px)`
                      : `min(82vh, ${MODAL_VERTICAL_FRAME_HEIGHT_PX}px)`
                  }
                  expandable={false}
                />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
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
 * Left column top-aligns to the right column (default grid behavior, no
 * `self-center`) — this section carries a full Overview + Role / process
 * / solution / outcome writeup, so there's usually more text here than
 * in the right column's two visuals, and top-aligning keeps it reading
 * naturally from the top instead of floating mid-column.
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
        className={side === "left" ? "sm:order-2" : "sm:order-1"}
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

/**
 * <MediaSplit>'s layout, but with the image side replaced by a static
 * image stacked on top of a scrollable <ScrollVisual> — for a section
 * that needs one normal screenshot plus one oversized artifact (e.g. a
 * long comparison table) that would break a normal MediaSplit image
 * slot. Generalized sibling of <NotificationFrameworkSplit>, which
 * hardcodes two scrollable visuals (one horizontal, one vertical) for
 * Airbnb's Notification Framework section specifically — this one keeps
 * the top visual a plain static image, since not every two-visual
 * section needs both halves to scroll.
 */
export function ScrollSplit({
  eyebrow,
  title,
  titleGapClassName = "mb-8",
  image,
  imageAlt,
  imageWidth,
  imageHeight,
  scrollImage,
  scrollImageAlt,
  scrollImageWidth,
  scrollImageHeight,
  scrollOrientation = "vertical",
  scrollLabel,
  side = "right",
  children,
}: {
  eyebrow?: string;
  title?: string;
  titleGapClassName?: string;
  /** Real image path for the static (non-scrollable) top visual. */
  image: string;
  imageAlt: string;
  /** Pass as a quoted string — see the MDX numeric-prop gotcha documented
   * on <MediaSplit> in CaseStudyBlocks.tsx (any `{...}` JSX expression
   * attribute, not just numbers/objects, silently drops in this MDX
   * pipeline — quoted strings are the only safe way to pass these). */
  imageWidth: number | string;
  imageHeight: number | string;
  /** Path to the oversized artifact shown in the scrollable frame below. */
  scrollImage: string;
  scrollImageAlt: string;
  scrollImageWidth: number | string;
  scrollImageHeight: number | string;
  scrollOrientation?: "horizontal" | "vertical";
  scrollLabel?: string;
  side?: "left" | "right";
  children: React.ReactNode;
}) {
  const outerPadding =
    side === "left" ? "sm:pl-10 sm:pr-[60px]" : "sm:pl-[60px] sm:pr-10";
  const widthNum = Number(imageWidth);
  const heightNum = Number(imageHeight);

  return (
    <div
      className={`grid grid-cols-1 gap-10 px-6 py-10 sm:grid-cols-2 sm:gap-12 sm:py-14 ${outerPadding}`}
    >
      <div className={side === "left" ? "sm:order-2" : "sm:order-1"}>
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
        <Image
          src={image}
          alt={imageAlt}
          width={widthNum}
          height={heightNum}
          sizes="(min-width: 640px) 50vw, 100vw"
          className="h-auto w-full"
        />
        <ScrollVisual
          orientation={scrollOrientation}
          image={scrollImage}
          imageAlt={scrollImageAlt}
          imageWidth={scrollImageWidth}
          imageHeight={scrollImageHeight}
          label={scrollLabel}
        />
      </div>
    </div>
  );
}
