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
      <h2 className="mb-10 text-3xl font-medium tracking-tight sm:text-4xl">
        Projects
      </h2>

      <div className="snap-row -mx-6 flex gap-6 overflow-x-auto px-6 sm:-mx-10 sm:px-10">
        {PROJECTS.map((project) => (
          <article
            key={project.slug}
            className="w-[85vw] shrink-0 sm:w-[32vw] sm:min-w-[320px]"
          >
            {project.image ? (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm">
                <Image
                  src={project.image}
                  alt={`${project.title} thumbnail`}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <PlaceholderImage
                label={`${project.title} thumbnail`}
                className="aspect-[4/3] w-full rounded-sm"
              />
            )}
            <h3 className="mt-6 text-xl">{project.title}</h3>
            <p className="mt-2 text-sm text-neutral-600">
              {project.description}
            </p>
            <p className="text-sm text-neutral-500">{project.dates}</p>
            <Link
              href={`/${project.slug}`}
              className="mt-4 inline-block rounded-full border border-neutral-300 px-4 py-2 text-sm hover:border-neutral-900 transition-colors"
            >
              {project.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
