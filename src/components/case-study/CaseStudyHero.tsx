import Image from "next/image";
import PlaceholderImage from "../PlaceholderImage";
import type { CaseStudyFrontmatter } from "@/lib/case-studies";

export default function CaseStudyHero({
  frontmatter,
}: {
  frontmatter: CaseStudyFrontmatter;
}) {
  if (frontmatter.heroType === "gradient-typewriter") {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-500/70 to-orange-200 px-6 sm:px-10">
        <div className="rounded-3xl bg-white/10 px-8 py-10 backdrop-blur-md sm:px-16 sm:py-14">
          <p className="typewriter-caret text-2xl font-medium text-white sm:text-5xl">
            {frontmatter.heroText}
          </p>
        </div>
      </section>
    );
  }

  const hasVideo = frontmatter.heroVideoWebm || frontmatter.heroVideoMp4;

  return (
    <section className="px-6 pt-6 sm:px-10">
      {hasVideo ? (
        <div className="relative h-[45vh] w-full overflow-hidden sm:h-[55vh]">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={frontmatter.heroVideoPoster}
            className="absolute inset-0 h-full w-full object-cover"
          >
            {frontmatter.heroVideoWebm && (
              <source src={frontmatter.heroVideoWebm} type="video/webm" />
            )}
            {frontmatter.heroVideoMp4 && (
              <source src={frontmatter.heroVideoMp4} type="video/mp4" />
            )}
          </video>
        </div>
      ) : frontmatter.heroImage ? (
        <div className="relative h-[45vh] w-full overflow-hidden sm:h-[55vh]">
          <Image
            src={frontmatter.heroImage}
            alt={`${frontmatter.title} hero image`}
            fill
            priority
            className="object-cover"
            style={{ objectPosition: "center 30%" }}
          />
        </div>
      ) : (
        <PlaceholderImage
          label={frontmatter.heroLabel ?? `${frontmatter.title} hero image`}
          className="h-[45vh] w-full sm:h-[55vh]"
        />
      )}
    </section>
  );
}
