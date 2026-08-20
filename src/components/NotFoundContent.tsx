import Image from "next/image";
import Link from "next/link";

// Shared visual for both 404 paths this site needs:
//  - src/app/global-not-found.tsx: genuinely unmatched routes (no route
//    segment matches at all) — required because this app has two
//    independent root layouts ((site) and (locked)) and Next.js can't
//    compose a single normal not-found.tsx across both.
//  - src/app/(site)/not-found.tsx: the notFound() call thrown inside
//    (site)/[slug]/page.tsx for an unknown case-study slug — this is a
//    route-segment-level 404, resolved within the (site) layout tree,
//    which is a different code path from the one above.
// Kept as one component so both entry points stay visually identical.
export default function NotFoundContent() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black px-6">
      <Image
        src="/images/lock-bg.webp"
        alt=""
        fill
        priority
        className="object-cover"
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <Image
          src="/images/404-graphic.webp"
          alt="404 error — sorry, page not found"
          width={824}
          height={1079}
          priority
          className="w-[calc(100vw-120px)] sm:w-[300px]"
        />

        <Link
          href="/"
          className="mt-10 text-xs tracking-[0.2em] text-white uppercase underline underline-offset-4 transition-colors hover:text-white/70 sm:mt-14 sm:text-sm"
        >
          Homepage
        </Link>
      </div>
    </main>
  );
}
