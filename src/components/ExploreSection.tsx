import PlaceholderImage from "./PlaceholderImage";

const EXPLORE = [
  {
    title: "TruStage",
    description:
      "Complete website redesign and component system for insurance provider, informed by user research and cross-functional collaboration.",
  },
  {
    title: "Hinge Health",
    description:
      "Led research, strategy, and north star vision for Medicare product expansion, identifying older adults' unique needs to inform three strategic focus areas for aging safely at home.",
  },
  {
    title: "FLYR Labs",
    description:
      "Partnered with AI-powered airline revenue platform to design website and design system, establishing content strategy and visual direction that contributed to a 45% increase in enterprise client meetings within two months of launch.",
  },
];

export default function ExploreSection() {
  return (
    <section className="px-6 py-20 sm:px-10">
      <h2 className="mb-10 text-3xl font-medium tracking-tight sm:text-4xl">
        Explore
      </h2>

      <div className="divide-y divide-neutral-200 border-t border-neutral-200">
        {EXPLORE.map((item) => (
          <div
            key={item.title}
            className="grid grid-cols-1 items-center gap-6 py-10 sm:grid-cols-[1fr_1fr_1fr]"
          >
            <h3 className="text-xl">{item.title}</h3>
            <p className="text-sm text-neutral-600">{item.description}</p>
            <PlaceholderImage
              label={`${item.title} image`}
              className="aspect-[16/10] w-full rounded-sm"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
