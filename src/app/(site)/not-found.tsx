import type { Metadata } from "next";
import NotFoundContent from "@/components/NotFoundContent";

// This catches notFound() thrown inside (site)/[slug]/page.tsx for an
// unknown case-study slug (e.g. /some-old-link) — a route-segment-level
// 404, distinct from src/app/global-not-found.tsx which only handles
// routes that don't match any segment at all. Renders inside
// (site)/layout.tsx, which no longer forces Header/Footer, so this page
// stays the full-bleed custom design.
export const metadata: Metadata = {
  title: "Taylor Gersch | Page Not Found",
};

export default function NotFound() {
  return <NotFoundContent />;
}
