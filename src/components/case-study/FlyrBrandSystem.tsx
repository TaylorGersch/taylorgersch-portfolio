"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * FLYR Labs case study only: the two hero illustrations (rebuilt as
 * inline SVG so they stay crisp and can move) plus the supporting icon
 * set, grouped by where each icon is used on the site.
 *
 * Illustration motion: as the section scrolls through the viewport the
 * shapes spread apart, peak at mid-screen, then draw back together,
 * matching the "expand and contract on scroll" behavior from the live
 * site. `t` runs 0 → 1 → 0 across the pass. Visitors with
 * prefers-reduced-motion get a fixed, half-open state instead.
 *
 * Geometry comes from Taylor's Figma exports (contracted and expanded
 * states of each illustration on the same canvas), so the end states
 * match her artboards exactly.
 */

const STROKE = "#4462F7";

function useScrollPulse() {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(0.5);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const clamp = (n: number) => Math.min(1, Math.max(0, n));
      // Opens as the cards scroll up from 95% to 45% of the viewport,
      // holds fully open while they're comfortably in view, then closes
      // as their bottom edge rises from 55% to 5% of the viewport, so all
      // of the motion happens on screen where it can be seen.
      const open = clamp((vh * 0.95 - r.top) / (vh * 0.5));
      const close = clamp((r.bottom - vh * 0.05) / (vh * 0.5));
      const p = Math.min(open, close);
      setT(p * p * (3 - 2 * p)); // smoothstep easing
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return { ref, t };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Homepage hero: three ellipses fanning away from a circle. */
function EllipsesIllustration({ t }: { t: number }) {
  const ellipses = [
    lerp(362, 362, t),
    lerp(400, 600, t),
    lerp(440, 840, t),
  ];
  const circle = lerp(940, 1440, t);
  // Keep the whole group centered as it widens.
  const shift = (2030 - (circle + 583)) / 2;
  return (
    <svg viewBox="0 0 2030 1167" className="h-auto w-full" aria-hidden>
      <g
        transform={`translate(${shift} 0)`}
        fill="none"
        stroke={STROKE}
        strokeOpacity="0.55"
        strokeWidth="1.25"
        vectorEffect="non-scaling-stroke"
      >
        {ellipses.map((cx, i) => (
          <ellipse
            key={i}
            cx={cx}
            cy="583"
            rx="361"
            ry="582"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <circle cx={circle} cy="583" r="582" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
}

/** Product page hero: three tilted squares sliding apart. */
const SIDE = 855;
const ANGLE = (-13.45 * Math.PI) / 180;
const U = [SIDE * Math.cos(ANGLE), SIDE * Math.sin(ANGLE)];
const V = [-U[1], U[0]];
const squarePoints = (x: number, y: number) =>
  [
    [x, y],
    [x + U[0], y + U[1]],
    [x + U[0] + V[0], y + U[1] + V[1]],
    [x + V[0], y + V[1]],
  ]
    .map((p) => p.map((n) => n.toFixed(1)).join(","))
    .join(" ");

function SquaresIllustration({ t }: { t: number }) {
  const squares = [
    [lerp(300, 150, t), lerp(560, 520, t)],
    [lerp(340, 440, t), lerp(590, 670, t)],
    [lerp(380, 730, t), lerp(620, 820, t)],
  ];
  return (
    <svg viewBox="80 280 1760 1580" className="h-auto w-full" aria-hidden>
      <g fill="none" stroke={STROKE} strokeOpacity="0.55" strokeWidth="1.25">
        {squares.map(([x, y], i) => (
          <polygon
            key={i}
            points={squarePoints(x, y)}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>
    </svg>
  );
}

type Icon = { file: string; name: string };
const ICON_GROUPS: { label: string; icons: Icon[] }[] = [
  {
    label: "Core capabilities",
    icons: [
      { file: "data", name: "Data" },
      { file: "forecasting", name: "Forecasting" },
      { file: "pricing", name: "Pricing" },
      { file: "intelligence", name: "Intelligence" },
    ],
  },
  {
    label: "Our values",
    icons: [
      { file: "ai", name: "AI" },
      { file: "building", name: "Building" },
      { file: "upgrading", name: "Upgrading" },
    ],
  },
  {
    label: "How Cirrus works",
    icons: [
      { file: "cirrus", name: "Cirrus" },
      { file: "ai-color", name: "AI" },
      { file: "context", name: "Context" },
    ],
  },
  {
    label: "Ways of working",
    icons: [
      { file: "point", name: "Point" },
      { file: "ask", name: "Ask" },
      { file: "transparency", name: "Transparency" },
    ],
  },
];

export default function FlyrBrandSystem() {
  const { ref, t } = useScrollPulse();

  return (
    <div className="flex flex-col gap-14">
      <div ref={ref} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <figure className="flex flex-col gap-4">
          <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-neutral-50 px-[12%]">
            <EllipsesIllustration t={t} />
          </div>
          <figcaption className="text-sm text-neutral-600">
            Homepage hero illustration
          </figcaption>
        </figure>
        <figure className="flex flex-col gap-4">
          <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-neutral-50 px-[16%]">
            <SquaresIllustration t={t} />
          </div>
          <figcaption className="text-sm text-neutral-600">
            Product page hero illustration
          </figcaption>
        </figure>
      </div>

      <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-2">
        {ICON_GROUPS.map((group) => (
          <div key={group.label}>
            <h5 className="mb-4 text-xs font-medium tracking-[0.12em] text-neutral-500 uppercase">
              {group.label}
            </h5>
            <ul className="grid grid-cols-4 gap-3">
              {group.icons.map((icon) => (
                <li key={icon.file} className="flex flex-col items-center gap-2">
                  <div className="flex aspect-square w-[70%] items-center justify-center rounded-lg bg-[#1D1729]">
                    <Image
                      src={`/images/flyr-icons/${icon.file}.png`}
                      alt=""
                      width={300}
                      height={300}
                      className="h-auto w-[55%]"
                    />
                  </div>
                  <span className="text-xs text-neutral-600">{icon.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
