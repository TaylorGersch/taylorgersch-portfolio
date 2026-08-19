import Image from "next/image";

export default function Hero() {
  return (
    <section className="px-6 pt-6 sm:px-10">
      <div className="relative h-[45vh] w-full overflow-hidden rounded-sm sm:h-[55vh]">
        <Image
          src="/images/hero.webp"
          alt="Taylor Gersch"
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="mt-10 pb-16 sm:pb-20">
        <h1 className="text-4xl leading-[1.15] font-normal tracking-tight text-neutral-900 sm:text-6xl">
          Strategy-led design for products that matter. Combining research,
          UX/UI, and inclusive design principles to solve complex problems.
        </h1>

        <div className="mt-8 flex sm:justify-end">
          <p className="max-w-xl text-neutral-600">
            Every project begins with understanding the people behind the
            problem. By partnering with cross-functional teams, I help build
            products that balance user needs with business goals and create
            lasting value for everyone.
          </p>
        </div>
      </div>
    </section>
  );
}
