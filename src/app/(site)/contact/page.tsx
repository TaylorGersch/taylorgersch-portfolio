import type { Metadata } from "next";
import ContactHero from "@/components/ContactHero";
import ClientsSection from "@/components/ClientsSection";
import SiteChrome from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Taylor Gersch | Contact",
};

export default function ContactPage() {
  return (
    <SiteChrome>
      <ContactHero />
      <ClientsSection />
    </SiteChrome>
  );
}
