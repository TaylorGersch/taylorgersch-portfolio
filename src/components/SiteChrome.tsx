import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Header/Footer used to live in (site)/layout.tsx, wrapping every child
// unconditionally — including (site)/not-found.tsx, which needs to be a
// full-bleed chrome-free page. Each real page now opts in to the site
// nav explicitly via this wrapper instead.
export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
