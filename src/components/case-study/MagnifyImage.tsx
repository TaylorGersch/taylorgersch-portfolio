"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const LENS_SIZE = 220;
const ZOOM = 2.5;

/**
 * Case-study image with an e-commerce-style magnifier:
 * - Mouse: a round lens follows the cursor showing that spot at ZOOM×.
 *   The lens is painted from the ORIGINAL file (not the next/image
 *   resized copy), so it stays sharp; animated GIFs keep playing in it.
 * - Click / tap / Enter: opens the image full screen (pinch to zoom on
 *   touch devices). Escape, the close button or a backdrop click closes
 *   it, and focus returns to the image.
 * Touch never shows the lens (no hover there), so phones just tap.
 */
export default function MagnifyImage({
  src,
  alt,
  width,
  height,
  sizes,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
}) {
  const boxRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [lens, setLens] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [open, setOpen] = useState(false);

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    setLens({ x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height });
  };

  const onPointerEnter = (e: React.PointerEvent<HTMLButtonElement>) => {
    // Warm the full-size file so the lens isn't blank on first hover.
    if (e.pointerType === "mouse") new window.Image().src = src;
  };

  useEffect(() => {
    if (!open) return;
    const trigger = boxRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={boxRef}
        type="button"
        aria-label={`${alt} — open full size`}
        onPointerEnter={onPointerEnter}
        onPointerMove={onPointerMove}
        onPointerLeave={() => setLens(null)}
        onClick={() => {
          setLens(null);
          setOpen(true);
        }}
        className={`relative block w-full rounded-[8px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 ${lens ? "cursor-none" : "cursor-zoom-in"}`}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          className="h-auto w-full"
        />
        {lens && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute rounded-full border-2 border-white bg-white bg-no-repeat shadow-[0_8px_30px_rgba(0,0,0,0.25)] ring-1 ring-black/10"
            style={{
              width: LENS_SIZE,
              height: LENS_SIZE,
              left: lens.x - LENS_SIZE / 2,
              top: lens.y - LENS_SIZE / 2,
              backgroundImage: `url(${src})`,
              backgroundSize: `${lens.w * ZOOM}px ${lens.h * ZOOM}px`,
              backgroundPosition: `${-(lens.x * ZOOM - LENS_SIZE / 2)}px ${-(lens.y * ZOOM - LENS_SIZE / 2)}px`,
            }}
          />
        )}
      </button>

      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-neutral-950/95 p-4 backdrop-blur-sm sm:p-10"
            style={{ touchAction: "pinch-zoom" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- full-size original on purpose */}
            <img
              src={src}
              alt={alt}
              onClick={(e) => e.stopPropagation()}
              className="h-auto max-h-full w-auto max-w-full"
            />
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close full-size image"
              className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl text-neutral-900 shadow-lg transition-colors hover:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span aria-hidden="true">✕</span>
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}
