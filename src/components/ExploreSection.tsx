import Image from "next/image";
import Link from "next/link";
import PlaceholderImage from "./PlaceholderImage";

type ExploreItem = {
  slug: string;
  title: string;
  description: string;
  // Optional on purpose: PlaceholderImage renders in the meantime for any
  // case study whose card thumbnail hasn't been exported yet.
  image?: string;
  // Looping video thumbnail, used instead of `image` when present (the
  // Stripe gradient loop). webm first (much smaller), mp4 fallback.
  videoWebm?: string;
  videoMp4?: string;
  videoPoster?: string;
};

const EXPLORE: ExploreItem[] = [
  {
    slug: "hinge-health",
    title: "Hinge Health",
    description:
      "Led research, strategy, and north star vision for Medicare product expansion, identifying older adults' unique needs to inform three strategic focus areas for aging safely at home.",
    image: "/images/hinge-health.webp",
  },
  {
    slug: "stripe",
    title: "Stripe",
    description:
      "Partnered with Stripe to design a brand-new internal feature, interviewing primary users to uncover workflow needs and extending their design system into a flexible, customization-ready tool.",
    videoWebm: "/videos/stripe-gradient.webm",
    videoMp4: "/videos/stripe-gradient.mp4",
    videoPoster: "/images/stripe-gradient-poster.webp",
  },
  {
    slug: "trustage",
    title: "TruStage",
    description:
      "Complete website redesign and component system for insurance provider, informed by user research and cross-functional collaboration.",
    image: "/images/trustage.webp",
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
              {item.videoWebm || item.videoMp4 ? (
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster={item.videoPoster}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                  >
                    {item.videoWebm && (
                      <source src={item.videoWebm} type="video/webm" />
                    )}
                    {item.videoMp4 && (
                      <source src={item.videoMp4} type="video/mp4" />
                    )}
                  </video>
                </div>
              ) : item.image ? (
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
