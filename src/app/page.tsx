import Hero from "@/components/Hero";
import LogoCarousel from "@/components/LogoCarousel";
import ProjectsCarousel from "@/components/ProjectsCarousel";
import ExploreSection from "@/components/ExploreSection";
import AboutSection from "@/components/AboutSection";

export default function Home() {
  return (
    <>
      <Hero />
      <LogoCarousel />
      <ProjectsCarousel />
      <ExploreSection />
      <AboutSection />
    </>
  );
}
