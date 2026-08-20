import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Taylor Gersch | Product Design & Business Strategy",
  description:
    "Strategy-led design for products that matter. Combining research, UX/UI, and inclusive design principles to solve complex problems.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      {/*
        Header/Footer intentionally live in each real page (via
        SiteChrome), not here. This layout has to also wrap
        (site)/not-found.tsx — the boundary notFound() thrown by
        [slug]/page.tsx for an unknown case-study slug resolves here —
        and that page is a full-bleed custom design with no site nav.
        A layout can't tell whether its child is the not-found boundary,
        so the only way to keep the 404 chrome-free is to not force
        Header/Footer at this level at all.
      */}
      <body className="min-h-full flex flex-col bg-white text-neutral-900">
        {children}
      </body>
    </html>
  );
}
