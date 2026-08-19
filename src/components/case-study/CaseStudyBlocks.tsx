import PlaceholderImage from "../PlaceholderImage";

export function Meta({
  category,
  dates,
  intro,
}: {
  category: string;
  dates: string;
  intro: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 border-t border-neutral-200 px-6 py-10 sm:grid-cols-[1fr_1fr_2fr] sm:px-10">
      <p className="text-sm text-neutral-500">{category}</p>
      <p className="text-sm text-neutral-500">{dates}</p>
      <p className="text-neutral-700">{intro}</p>
    </div>
  );
}

export function TwoCol({
  overviewTitle = "Overview + Role",
  overview,
  problemTitle = "The problem",
  problem,
}: {
  overviewTitle?: string;
  overview: string;
  problemTitle?: string;
  problem: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-8 px-6 py-6 sm:grid-cols-2 sm:px-10">
      <div>
        <h4 className="mb-3 text-sm font-medium text-neutral-900">
          {overviewTitle}
        </h4>
        <p className="text-sm text-neutral-600">{overview}</p>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-medium text-neutral-900">
          {problemTitle}
        </h4>
        <p className="text-sm text-neutral-600">{problem}</p>
      </div>
    </div>
  );
}

export function SubSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="border-t border-neutral-200 px-6 py-14 sm:px-10">
      <p className="text-sm text-neutral-500">{eyebrow}</p>
      <h3 className="mt-2 mb-8 text-3xl tracking-tight text-neutral-800 sm:text-4xl">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function Quote({
  text,
  attribution,
}: {
  text: string;
  attribution: string;
}) {
  return (
    <div className="border-t border-neutral-200 px-6 py-14 sm:px-10">
      <p className="max-w-3xl text-2xl leading-snug text-neutral-800 sm:text-3xl">
        &ldquo;{text}&rdquo;
      </p>
      <p className="mt-4 text-sm text-neutral-500">— {attribution}</p>
    </div>
  );
}

export function ImageBlock({
  label,
  ratio = "aspect-[16/10]",
}: {
  label: string;
  ratio?: string;
}) {
  return <PlaceholderImage label={label} className={`w-full rounded-sm ${ratio}`} />;
}

/**
 * Marks a section that exists on the live Squarespace site but was left
 * empty there (no supporting copy/screenshots were ever added) — flagged
 * during the portfolio review. Fill this in with real content, or delete
 * the <Stub> block entirely if the step isn't needed.
 */
export function Stub({
  step,
  label,
}: {
  step: string;
  label: string;
}) {
  return (
    <div className="border-t border-dashed border-amber-400 bg-amber-50 px-6 py-10 sm:px-10">
      <p className="text-sm text-neutral-500">{step}</p>
      <p className="mt-1 text-neutral-700">{label}</p>
      <p className="mt-3 text-xs font-medium tracking-wide text-amber-700 uppercase">
        TODO — this section was empty on the live site. Add copy + screenshots here.
      </p>
    </div>
  );
}
