import Image from "next/image";
import Link from "next/link";
import PlaceholderImage from "./PlaceholderImage";

const EXPLORE = [
  {
    slug: "trustage",
    title: "TruStage",
    description:
      "Complete website redesign and component system for insurance provider, informed by user research and cross-functional collaboration.",
    image: "/images/trustage.webp",
  },
  {
    slug: "hinge-health",
    title: "Hinge Health",
    description:
      "Led research, strategy, and north star vision for Medicare product expansion, identifying older adults' unique needs to inform three strategic focus areas for aging safely at home.",
    image: "/images/hinge-health.webp",
  },
  {
    slug: "flyr-labs",
    title: "FLYR Labs",
    description:
      "Partnered with AI-powered airline revenue platform to design website and design system, establishing content strategy and visual direction that contributed to a 45% increase in enterprise client meetings within two months of launch.",
    image: "/images/flyr-labs.webp",
  },
];

export default function ExploreSection() {
  return (
    <section className="px-6 py-20 sm:px-10">
      <h2 className="mb-10 text-4xl font-normal tracking-tight sm:text-6xl">
        Explore
      </h2>

      <div className="divide-y divide-neutral-200 border-t border-neutral-200">
        {EXPLORE.map((item) => (
          <div
            key={item.title}
            className="grid grid-cols-1 items-start gap-6 pt-10 pb-10 sm:grid-cols-[1fr_1fr_1fr]"
          >
            <Link href={`/${item.slug}`} className="w-fit">
              <h3 className="text-[26px] leading-tight tracking-tight hover:text-neutral-600 transition-colors">
                {item.title}
              </h3>
            </Link>

            <div>
              <p className="text-sm text-neutral-600">{item.description}</p>
              <Link
                href={`/${item.slug}`}
                className="mt-6 inline-block rounded-[4px] border border-neutral-300 px-4 py-2 text-sm hover:border-neutral-900 transition-colors"
              >
                Read more
              </Link>
            </div>

            <Link href={`/${item.slug}`} className="block">
              {item.image ? (
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={`${item.title}`}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-[1.03]"
                  />
                </div>
              ) : (
                <PlaceholderImage
                  label={`${item.title} image`}
                  className="aspect-[16/10] w-full"
                />
              )}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
