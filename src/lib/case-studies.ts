import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "src/content/case-studies");

export type CaseStudyFrontmatter = {
  title: string;
  category: string;
  dates: string;
  intro: string;
  heroType: "gradient-typewriter" | "photo";
  heroText?: string; // used by gradient-typewriter hero
  heroLabel?: string; // placeholder label used by photo hero (when no real image is available)
  heroImage?: string; // real photo path (e.g. "/images/trustage.webp"); falls back to a placeholder when omitted
  // CSS object-position value for the photo hero's <Image> (e.g. "center 36%").
  // Overrides CaseStudyHero's default ("center 30%") per case study, so
  // recropping one hero doesn't shift every other photo hero on the site.
  heroObjectPosition?: string;
  // Looping background video for the photo hero, used instead of heroImage
  // when present (e.g. the Stripe gradient loop). Provide both formats —
  // webm first (much smaller), mp4 as the compatibility fallback — plus a
  // poster frame for the moment before the video can play.
  heroVideoWebm?: string;
  heroVideoMp4?: string;
  heroVideoPoster?: string;
};

export function getAllCaseStudySlugs(): string[] {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getCaseStudySource(slug: string): {
  frontmatter: CaseStudyFrontmatter;
  content: string;
} {
  const fullPath = path.join(CONTENT_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  return { frontmatter: data as CaseStudyFrontmatter, content };
}
