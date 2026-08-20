import Image from "next/image";

const COLUMNS = [
  {
    title: "Services",
    items: [
      "Product Strategy & Brand Vision",
      "UX Research & Competitive Audits",
      "UX/UI Design",
      "Design Systems",
    ],
  },
  {
    title: "Approach",
    items: [
      "Research-Informed Strategy",
      "Cross-Functional Collaboration",
      "Rapid Iteration & Validation",
      "Inclusive Design Principles",
    ],
  },
  {
    title: "Expertise",
    items: [
      "Consumer & Enterprise Products",
      "Internal Tooling",
      "Research-Led Design",
      "Inclusive Design Practices",
    ],
  },
  {
    title: "Industries",
    items: [
      "Healthcare & Wellness",
      "Financial Services",
      "Consumer Technology",
      "Insurance & B2B Tools",
    ],
  },
];

export default function AboutSection() {
  return (
    <section className="bg-black px-6 py-20 text-white sm:px-10">
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm sm:aspect-auto">
          <Image
            src="/images/about.webp"
            alt="Taylor Gersch"
            fill
            className="object-cover"
          />
        </div>

        <div>
          <h2 className="mb-10 text-3xl font-medium tracking-tight sm:text-4xl">
            About
          </h2>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="mb-4 text-2xl text-white">{col.title}</h3>
                <ul className="space-y-1 text-base text-white">
                  {col.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
