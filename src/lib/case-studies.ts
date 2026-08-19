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
  heroLabel?: string; // placeholder label used by photo hero
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
