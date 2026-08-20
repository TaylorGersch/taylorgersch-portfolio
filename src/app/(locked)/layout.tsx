import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Taylor Gersch — Secure",
};

// A separate root layout (its own <html>/<body>) so the site's real
// Header/Footer never render on the lock screen — this route group is
// intentionally outside the (site) layout tree, not just visually hidden.
export default function LockedRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-black">{children}</body>
    </html>
  );
}
