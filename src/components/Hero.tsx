import PlaceholderImage from "./PlaceholderImage";

export default function Hero() {
  return (
    <section className="px-6 pt-6 sm:px-10">
      <PlaceholderImage
        label="Hero image — replace with public/images/hero.jpg"
        className="h-[45vh] w-full rounded-sm sm:h-[55vh]"
      />

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <h1 className="text-4xl leading-[1.1] font-medium tracking-tight text-neutral-900 sm:text-5xl">
          Strategy-led design for products that matter.
          <br />
          Combining research, UX/UI, and inclusive design principles to solve
          complex problems.
        </h1>

        <p className="max-w-md text-neutral-600 sm:justify-self-end sm:self-end">
          Every project begins with understanding the people behind the
          problem. By partnering with cross-functional teams, I help build
          products that balance user needs with business goals and create
          lasting value for everyone.
        </p>
      </div>
    </section>
  );
}
