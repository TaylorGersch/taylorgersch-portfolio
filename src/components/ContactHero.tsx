import Image from "next/image";

export default function ContactHero() {
  return (
    <section className="flex flex-col sm:min-h-[85vh] sm:flex-row">
      <div className="flex flex-1 flex-col justify-center gap-12 px-6 py-16 sm:px-10 sm:py-0">
        <div>
          <h1 className="text-5xl leading-[1.1] font-normal tracking-tight text-neutral-900 sm:text-7xl">
            Contact us
          </h1>
          <p className="mt-6 max-w-md text-neutral-600">
            Let&rsquo;s work together. Whether you&rsquo;re looking to build
            something new, refine an existing product, or explore a design
            challenge, I&rsquo;m here to help. Reach out to discuss your
            project.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-neutral-900">
            Reach out
          </h3>
          <p>
            <a
              href="mailto:tgersch30@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-700 transition-colors hover:text-neutral-900"
            >
              tgersch30@gmail.com
            </a>
          </p>
          <p>
            <a
              href="https://www.linkedin.com/in/taylor-gersch/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-700 underline transition-colors hover:text-neutral-900"
            >
              LinkedIn
            </a>
          </p>
        </div>
      </div>

      <div className="relative h-[50vh] w-full sm:h-auto sm:w-1/2">
        <Image
          src="/images/contact-portland.webp"
          alt="A sunlit living room with a sculptural brass floor lamp and a shelf of ceramic and glass objects"
          fill
          priority
          className="object-cover"
        />
      </div>
    </section>
  );
}
