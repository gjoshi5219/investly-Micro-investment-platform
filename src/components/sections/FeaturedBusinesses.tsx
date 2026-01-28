import { motion } from "framer-motion";
import { SectionWrapper, SectionHeader } from "@/components/ui/section-wrapper";
import { FloatingCard } from "@/components/ui/floating-card";
import { TrendingUp, Clock, Shield, Users, ArrowUpRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";

const businesses = [
  {
    name: "Bean & Bloom Coffee",
    category: "Food & Beverage",
    description: "Specialty coffee roastery expanding to second location downtown.",
    roi: "14.2%",
    risk: "Low",
    duration: "12 months",
    raised: 45000,
    goal: 60000,
    investors: 128,
    image: "☕",
  },
  {
    name: "GreenCycle Tech",
    category: "Sustainability",
    description: "E-waste recycling startup with patented material recovery process.",
    roi: "18.5%",
    risk: "Medium",
    duration: "18 months",
    raised: 82000,
    goal: 100000,
    investors: 234,
    image: "♻️",
  },
  {
    name: "Luna Fitness Studio",
    category: "Health & Wellness",
    description: "Women-focused fitness space opening three new studio locations.",
    roi: "12.8%",
    risk: "Low",
    duration: "9 months",
    raised: 38000,
    goal: 45000,
    investors: 89,
    image: "🧘",
  },
];

const riskColors = {
  Low: "text-accent bg-accent/10 border-accent/30",
  Medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  High: "text-destructive bg-destructive/10 border-destructive/30",
};

export function FeaturedBusinesses() {
  return (
    <SectionWrapper id="businesses" className="bg-gradient-to-b from-background via-card/30 to-background">
      <div className="container px-4">
        <SectionHeader
          badge="Featured Opportunities"
          title="Businesses ready for your investment"
          description="Each business is vetted by our team. We only feature ventures with solid fundamentals and clear growth potential."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {businesses.map((business, index) => (
            <FloatingCard
              key={index}
              delay={index}
              intensity={0.5}
              className="group overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-3xl">
                    {business.image}
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full border ${
                      riskColors[business.risk as keyof typeof riskColors]
                    }`}
                  >
                    {business.risk} Risk
                  </span>
                </div>

                <p className="text-xs text-primary font-medium mb-1">{business.category}</p>
                <h3 className="text-xl font-semibold font-display mb-2">{business.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{business.description}</p>
              </div>

              {/* Stats */}
              <div className="px-6 py-4 border-t border-border/50 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-accent mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-lg font-bold">{business.roi}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Est. ROI</p>
                </div>
                <div className="text-center border-x border-border/50">
                  <div className="flex items-center justify-center gap-1 text-foreground mb-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-lg font-bold">{business.duration}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-foreground mb-1">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-lg font-bold">{business.investors}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Investors</p>
                </div>
              </div>

              {/* Progress */}
              <div className="px-6 py-4 border-t border-border/50">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">
                    ${business.raised.toLocaleString()} raised
                  </span>
                  <span className="font-medium">
                    {Math.round((business.raised / business.goal) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(business.raised / business.goal) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.2, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Goal: ${business.goal.toLocaleString()}
                </p>
              </div>

              {/* CTA */}
              <div className="p-6 pt-4">
                <button className="w-full py-3 rounded-xl bg-card-elevated border border-border text-foreground font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary group-hover:translate-y-0">
                  View Details
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </FloatingCard>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <MagneticButton variant="outline" size="lg">
            Browse All Opportunities
            <ArrowUpRight className="w-5 h-5" />
          </MagneticButton>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}