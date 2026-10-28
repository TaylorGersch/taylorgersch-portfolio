import Link from "next/link";

/**
 * Order of the "Next case study" bar at the bottom of each case study.
 * The last entry loops back to the first. Leave TruStage and FLYR Labs out
 * until they're built; a slug not in this list renders no bar.
 */
export const CASE_STUDY_ORDER = [
  { slug: "betterup", title: "BetterUp" },
  { slug: "airbnb", title: "Airbnb" },
  { slug: "rutter", title: "Rutter" },
  { slug: "stripe", title: "Stripe" },
  { slug: "hinge-health", title: "Hinge Health" },
];

export default function NextCaseStudy({ slug }: { slug: string }) {
  const i = CASE_STUDY_ORDER.findIndex((c) => c.slug === slug);
  if (i === -1) return null;
  const next = CASE_STUDY_ORDER[(i + 1) % CASE_STUDY_ORDER.length];

  return (
    <nav aria-label="Next case study" className="next-case-study mt-14">
      <Link
        href={`/${next.slug}`}
        className="group flex min-h-[60px] items-center justify-between gap-4 bg-neutral-100 px-6 transition-colors duration-200 hover:bg-neutral-200 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-neutral-900 sm:pr-10 sm:pl-[60px]"
      >
        <span className="text-sm text-neutral-600">Next case study</span>
        <span className="flex items-center gap-2 text-base text-neutral-900">
          {next.title}
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </Link>
    </nav>
  );
}
