import Image from "next/image";
import Link from "next/link";
import PlaceholderImage from "./PlaceholderImage";

const PROJECTS = [
  {
    slug: "betterup",
    title: "BetterUp",
    description: "Strategic product design across consumer and enterprise platforms",
    dates: "2024—2025",
    cta: "Read More",
    image: "/images/betterup-thumb.png",
  },
  {
    slug: "airbnb",
    title: "Airbnb",
    description: "Internal tooling redesign and design system development",
    dates: "2020–2022",
    cta: "Read more",
    image: "/images/airbnb-thumb.jpg",
  },
  {
    slug: "rutter",
    title: "Rutter",
    description: "Product, marketing, and brand design for financial integration platform",
    dates: "2023–Present",
    cta: "Read more",
    image: "/images/rutter-thumb.png",
  },
];

export default function ProjectsCarousel() {
  return (
    <section className="px-6 py-20 sm:px-10">
      <h2 className="mb-10 text-4xl font-normal tracking-tight sm:text-6xl">
        Projects
      </h2>

      <div className="snap-row -mr-6 flex gap-6 overflow-x-auto pr-6 sm:-mr-10 sm:gap-8 sm:pr-10">
        {PROJECTS.map((project) => (
          <article
            key={project.slug}
            className="w-[85vw] shrink-0 sm:w-[46vw]"
          >
            <Link
              href={`/${project.slug}`}
              className="block"
              aria-label={`View ${project.title} case study`}
            >
              {project.image ? (
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={project.image}
                    alt={`${project.title} thumbnail`}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-[1.03]"
                  />
                </div>
              ) : (
                <PlaceholderImage
                  label={`${project.title} thumbnail`}
                  className="aspect-[4/3] w-full"
                />
              )}
            </Link>
            <h3 className="mt-8 text-xl">{project.title}</h3>
            <p className="mt-3 text-sm text-neutral-600">
              {project.description}
            </p>
            <p className="mt-1 text-sm text-neutral-500">{project.dates}</p>
            <Link
              href={`/${project.slug}`}
              className="mt-6 inline-block rounded-[4px] border border-neutral-300 px-4 py-2 text-sm hover:border-neutral-900 transition-colors"
            >
              {project.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
