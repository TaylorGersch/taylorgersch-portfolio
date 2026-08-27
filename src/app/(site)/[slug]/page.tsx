import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import {
  getAllCaseStudySlugs,
  getCaseStudySource,
  type CaseStudyFrontmatter,
} from "@/lib/case-studies";
import CaseStudyHero from "@/components/case-study/CaseStudyHero";
import SiteChrome from "@/components/SiteChrome";
import {
  Meta,
  TwoCol,
  Pair,
  MediaSplit,
  SubSection,
  ImageBlock,
  Stub,
  Quote,
  QuoteItem,
  QuotePair,
  Detail,
} from "@/components/case-study/CaseStudyBlocks";
import ImageCarousel, {
  CarouselSlide,
} from "@/components/case-study/ImageCarousel";
import {
  ProductWalkthrough,
  WalkthroughRegion,
} from "@/components/case-study/ProductWalkthrough";
import { NotificationFrameworkSplit } from "@/components/case-study/ScrollFrame";

export function generateStaticParams() {
  return getAllCaseStudySlugs().map((slug) => ({ slug }));
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let source: { frontmatter: CaseStudyFrontmatter; content: string };
  try {
    source = getCaseStudySource(slug);
  } catch {
    notFound();
  }

  const { content } = await compileMDX<CaseStudyFrontmatter>({
    source: source!.content,
    components: {
      TwoCol,
      Pair,
      MediaSplit,
      SubSection,
      ImageBlock,
      Stub,
      Quote,
      QuoteItem,
      QuotePair,
      Detail,
      ImageCarousel,
      CarouselSlide,
      ProductWalkthrough,
      WalkthroughRegion,
      NotificationFrameworkSplit,
    },
    options: { parseFrontmatter: false },
  });

  const fm = source!.frontmatter;

  return (
    <SiteChrome>
      <article>
        <CaseStudyHero frontmatter={fm} />

        <div className="px-6 pt-10 sm:pr-10 sm:pl-[60px]">
          <h1 className="text-6xl leading-none font-medium tracking-tight text-black sm:text-8xl">
            {fm.title}
          </h1>
        </div>

        <Meta category={fm.category} dates={fm.dates} intro={fm.intro} />

        {content}
      </article>
    </SiteChrome>
  );
}
