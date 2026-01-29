import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FeaturedBusinessesLive } from "@/components/sections/FeaturedBusinessesLive";
import { WhyInvestly } from "@/components/sections/WhyInvestly";
import { Security } from "@/components/sections/Security";
import { CTA } from "@/components/sections/CTA";

const Index = () => {
  const location = useLocation();

  // Handle hash navigation when coming from another page
  useEffect(() => {
    if (location.hash) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location.hash]);
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Noise overlay for texture */}
      <div className="noise-overlay" />
      
      <Navbar />
      
      <main>
        <Hero />
        <HowItWorks />
        <FeaturedBusinessesLive />
        <WhyInvestly />
        <Security />
        <CTA />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;