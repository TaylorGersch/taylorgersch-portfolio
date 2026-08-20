import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NotFoundContent from "@/components/NotFoundContent";

// global-not-found.tsx bypasses this app's normal layout tree entirely
// (see next.config.ts — experimental.globalNotFound), so it has to bring
// its own full <html>/<body>, font, and global stylesheet import rather
// than relying on (site)/layout.tsx or (locked)/layout.tsx. It only
// catches truly unmatched routes (no route segment matches at all) —
// see (site)/not-found.tsx for the other 404 path, where [slug]/page.tsx
// calls notFound() for an unknown case-study slug.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Taylor Gersch | Page Not Found",
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-black">
        <NotFoundContent />
      </body>
    </html>
  );
}
