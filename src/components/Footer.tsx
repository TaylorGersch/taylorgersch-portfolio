export default function Footer() {
  return (
    <footer id="contact" className="flex flex-col bg-black text-white">
      <div className="flex flex-col gap-10 px-6 pt-14 sm:max-w-2xl sm:flex-row sm:justify-between sm:px-10">
        <div className="text-base leading-6 text-white">
          <p>Product Design &amp;</p>
          <p>Business Strategy</p>
        </div>
        <div className="text-base leading-6 text-white">
          <a
            href="mailto:tgersch30@gmail.com"
            className="hover:text-neutral-300 transition-colors"
          >
            tgersch30@gmail.com
          </a>
          <p>Let&rsquo;s talk.</p>
        </div>
      </div>
      <div
        aria-hidden
        className="mt-12 select-none overflow-hidden px-6 sm:mt-20 sm:px-10"
      >
        {/*
          The "Made" wordmark is deliberately sized so the whole footer's
          height comes from its own content instead of a forced viewport
          height — that's what keeps the gap above it fixed instead of
          stretching to fill leftover space on tall screens.

          leading-[0.78] + ml-[-0.063em] are optical corrections, not
          arbitrary: at this display size, line-height:1 (leading-none)
          reserves the font's full descender space below the baseline even
          though "Made" has no descenders, leaving a visible gap before the
          section's bottom edge; 0.78 crops that reserve so the letters'
          ink sits flush against the bottom. The negative left margin
          compensates for the "M" glyph's own left side-bearing so its
          stroke lines up with the text/image edges above it instead of
          sitting ~6% of the font size to the right of them.
        */}
        <p className="ml-[-0.063em] text-[31vw] leading-[0.78] font-light tracking-[-0.07em] text-white/90 sm:text-[22.5vw]">
          Made
        </p>
      </div>
    </footer>
  );
}
