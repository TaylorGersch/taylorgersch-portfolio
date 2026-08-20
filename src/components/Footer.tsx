export default function Footer() {
  return (
    <footer
      id="contact"
      className="flex min-h-screen flex-col bg-black text-white"
    >
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
        className="flex flex-1 select-none items-end overflow-hidden px-6 pb-6 sm:px-10"
      >
        <p className="text-[27vw] leading-none font-normal tracking-tight text-white/90 sm:text-[19.5vw]">
          Made
        </p>
      </div>
    </footer>
  );
}
