import PlaceholderImage from "./PlaceholderImage";

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
    title: "Expertise",
    items: [
      "Consumer & Enterprise Products",
      "Internal Tooling",
      "Research-Led Design",
      "Inclusive Design Practices",
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
        <div>
          <h2 className="mb-8 text-3xl font-medium tracking-tight sm:text-4xl">
            About
          </h2>
          <PlaceholderImage
            label="About / studio photo"
            className="aspect-[3/4] w-full max-w-sm rounded-sm bg-neutral-800 text-neutral-400"
          />
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-xl text-neutral-200">{col.title}</h3>
              <ul className="space-y-1 text-sm text-neutral-400">
                {col.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
