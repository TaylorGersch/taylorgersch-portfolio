"use client";

import { useEffect, useState } from "react";

/**
 * Types `text` in left to right once on mount, like someone typing into a
 * search field. The full string is rendered invisibly underneath so the
 * field is sized to its final width from the first paint (no layout
 * shift), and screen readers get the whole phrase via aria-label instead
 * of hearing it letter by letter. Users with prefers-reduced-motion see
 * the finished text immediately.
 */
export default function TypewriterText({
  text,
  className = "",
  startDelay = 500,
  charDelay = 55,
}: {
  text: string;
  className?: string;
  startDelay?: number;
  charDelay?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      i = reduce ? text.length : i + 1;
      setCount(i);
      if (i < text.length) timer = setTimeout(tick, charDelay);
    };
    timer = setTimeout(tick, reduce ? 0 : startDelay);
    return () => clearTimeout(timer);
  }, [text, startDelay, charDelay]);

  return (
    <p className={`relative ${className}`} aria-label={text}>
      <span aria-hidden="true" className="invisible">
        {text}
        <span className="ml-[0.05em]">|</span>
      </span>
      <span aria-hidden="true" className="typewriter-caret absolute inset-0 text-left">
        {text.slice(0, count)}
      </span>
    </p>
  );
}
