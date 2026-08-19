/**
 * Stand-in for the original site's photography.
 *
 * The real photos live on Squarespace's asset CDN and weren't pulled into
 * this rebuild (see README "Replace the placeholder images"). Drop a real
 * file at `public/images/<slot>` and swap the <PlaceholderImage> for a
 * normal <Image> once you have it locally.
 */
export default function PlaceholderImage({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-neutral-200 to-neutral-300 text-center ${className}`}
    >
      <span className="px-4 text-xs font-medium tracking-wide text-neutral-500 uppercase">
        {label}
      </span>
    </div>
  );
}
