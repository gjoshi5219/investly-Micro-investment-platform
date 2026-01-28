import { motion } from "framer-motion";
import { SectionWrapper, SectionHeader } from "@/components/ui/section-wrapper";
import { FloatingCard } from "@/components/ui/floating-card";
import { Wallet, Search, TrendingUp, Banknote } from "lucide-react";

const steps = [
  {
    icon: Wallet,
    title: "Create Your Account",
    description: "Sign up in 2 minutes. Verify your identity and link your payment method securely.",
    color: "primary",
  },
  {
    icon: Search,
    title: "Discover Businesses",
    description: "Browse local ventures seeking investment. See their story, financials, and growth plans.",
    color: "secondary",
  },
  {
    icon: TrendingUp,
    title: "Invest & Track",
    description: "Invest from $10 to $10,000. Watch your portfolio grow with real-time updates.",
    color: "accent",
  },
  {
    icon: Banknote,
    title: "Earn Returns",
    description: "Receive monthly profit shares directly to your account. Reinvest or withdraw anytime.",
    color: "primary",
  },
];

const colorMap = {
  primary: {
    bg: "bg-primary/10",
    border: "border-primary/30",
    icon: "text-primary",
    glow: "group-hover:shadow-[0_0_40px_hsl(217_91%_60%/0.3)]",
  },
  secondary: {
    bg: "bg-secondary/10",
    border: "border-secondary/30",
    icon: "text-secondary",
    glow: "group-hover:shadow-[0_0_40px_hsl(263_70%_58%/0.3)]",
  },
  accent: {
    bg: "bg-accent/10",
    border: "border-accent/30",
    icon: "text-accent",
    glow: "group-hover:shadow-[0_0_40px_hsl(160_84%_39%/0.3)]",
  },
};

export function HowItWorks() {
  return (
    <SectionWrapper id="how-it-works">
      <div className="container px-4">
        <SectionHeader
          badge="Simple Process"
          title="Start investing in 4 easy steps"
          description="We've stripped away the complexity. No jargon, no confusion—just a straightforward path to building wealth in your community."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {steps.map((step, index) => {
            const colors = colorMap[step.color as keyof typeof colorMap];
            return (
              <FloatingCard
                key={index}
                delay={index}
                className={`group p-6 md:p-8 transition-all duration-500 ${colors.glow}`}
              >
                {/* Step number */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl font-bold font-display text-muted-foreground/20">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl ${colors.bg} ${colors.border} border flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110`}
                >
                  <step.icon className={`w-7 h-7 ${colors.icon}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold font-display mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>

                {/* Connector line for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-[2px] bg-gradient-to-r from-muted to-transparent" />
                )}
              </FloatingCard>
            );
          })}
        </div>

        {/* Animated flow visualization */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 md:mt-20 glass-card p-8 md:p-12 max-w-3xl mx-auto text-center"
        >
          <div className="flex items-center justify-center gap-4 md:gap-8 mb-6">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                <span className="text-2xl">👤</span>
              </div>
              <span className="text-sm text-muted-foreground">You</span>
            </div>
            
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-1"
            >
              <div className="w-8 h-[2px] bg-gradient-to-r from-primary to-transparent" />
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              <div className="w-3 h-3 rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: "0.2s" }} />
              <div className="w-3 h-3 rounded-full bg-primary/30 animate-pulse" style={{ animationDelay: "0.4s" }} />
            </motion.div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-2">
                <span className="text-2xl">🏪</span>
              </div>
              <span className="text-sm text-muted-foreground">Business</span>
            </div>
            
            <motion.div
              animate={{ x: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              className="flex items-center gap-1"
            >
              <div className="w-3 h-3 rounded-full bg-accent/30 animate-pulse" />
              <div className="w-3 h-3 rounded-full bg-accent/60 animate-pulse" style={{ animationDelay: "0.2s" }} />
              <div className="w-3 h-3 rounded-full bg-accent animate-pulse" style={{ animationDelay: "0.4s" }} />
              <div className="w-8 h-[2px] bg-gradient-to-l from-accent to-transparent" />
            </motion.div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mb-2">
                <span className="text-2xl">💰</span>
              </div>
              <span className="text-sm text-muted-foreground">Returns</span>
            </div>
          </div>
          
          <p className="text-muted-foreground">
            Your investment powers local growth. Their success becomes your profit.
          </p>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}