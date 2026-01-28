import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FeaturedBusinesses } from "@/components/sections/FeaturedBusinesses";
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
        <FeaturedBusinesses />
        <WhyInvestly />
        <Security />
        <CTA />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;