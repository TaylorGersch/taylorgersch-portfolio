export default function Footer() {
  return (
    <footer id="contact" className="bg-black text-white">
      <div className="flex flex-col gap-10 px-6 py-14 sm:flex-row sm:justify-between sm:px-10">
        <div className="text-sm leading-6 text-neutral-300">
          <p>Product Design &amp;</p>
          <p>Business Strategy</p>
        </div>
        <div className="text-sm leading-6 text-neutral-300">
          <a
            href="mailto:tgersch30@gmail.com"
            className="hover:text-white transition-colors"
          >
            tgersch30@gmail.com
          </a>
          <p>Let&rsquo;s talk.</p>
        </div>
      </div>
      <div
        aria-hidden
        className="select-none overflow-hidden px-6 pb-6 sm:px-10"
      >
        <p className="text-[18vw] leading-none font-medium tracking-tight text-white/90 sm:text-[13vw]">
          Made
        </p>
      </div>
    </footer>
  );
}
