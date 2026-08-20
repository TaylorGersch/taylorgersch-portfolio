import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // This site has two independent root layouts via route groups —
    // (site) and (locked) — so there's no single shared layout to
    // compose a normal app/not-found.tsx from. globalNotFound bypasses
    // layout composition entirely and renders its own full <html>/<body>
    // document for any unmatched URL, which is what we want here.
    globalNotFound: true,
  },
};

export default nextConfig;
