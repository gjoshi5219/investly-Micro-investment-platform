import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FeaturedBusinessesLive } from "@/components/sections/FeaturedBusinessesLive";
import { WhyInvestly } from "@/components/sections/WhyInvestly";
import { Security } from "@/components/sections/Security";
import { CTA } from "@/components/sections/CTA";

const Index = () => {
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