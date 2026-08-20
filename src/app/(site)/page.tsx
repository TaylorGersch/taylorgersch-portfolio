import Hero from "@/components/Hero";
import LogoCarousel from "@/components/LogoCarousel";
import ProjectsCarousel from "@/components/ProjectsCarousel";
import ExploreSection from "@/components/ExploreSection";
import AboutSection from "@/components/AboutSection";
import SiteChrome from "@/components/SiteChrome";

export default function Home() {
  return (
    <SiteChrome>
      <Hero />
      <LogoCarousel />
      <ProjectsCarousel />
      <ExploreSection />
      <AboutSection />
    </SiteChrome>
  );
}
