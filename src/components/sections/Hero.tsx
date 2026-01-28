import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { FloatingElement } from "@/components/ui/floating-card";
import { ArrowRight, TrendingUp, Coins, Building2 } from "lucide-react";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[200px]" />

      {/* Floating 3D elements */}
      <FloatingElement className="absolute top-[15%] left-[10%] md:left-[15%]" floatIntensity="medium" delay={0}>
        <div className="glass-card p-4 md:p-6">
          <TrendingUp className="w-8 h-8 md:w-10 md:h-10 text-accent" />
        </div>
      </FloatingElement>

      <FloatingElement className="absolute top-[20%] right-[8%] md:right-[12%]" floatIntensity="high" delay={1}>
        <div className="glass-card p-4 md:p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-sm font-bold text-white">+12%</span>
            </div>
            <div className="hidden md:block">
              <p className="text-xs text-muted-foreground">Monthly ROI</p>
              <p className="text-sm font-semibold text-foreground">Growing</p>
            </div>
          </div>
        </div>
      </FloatingElement>

      <FloatingElement className="absolute bottom-[25%] left-[5%] md:left-[8%]" floatIntensity="low" delay={2}>
        <div className="glass-card p-4 md:p-5">
          <div className="flex items-center gap-3">
            <Coins className="w-8 h-8 text-primary" />
            <div className="hidden md:block">
              <p className="text-xs text-muted-foreground">Min. Investment</p>
              <p className="text-lg font-bold text-foreground">$10</p>
            </div>
          </div>
        </div>
      </FloatingElement>

      <FloatingElement className="absolute bottom-[30%] right-[5%] md:right-[10%]" floatIntensity="medium" delay={3}>
        <div className="glass-card p-4 md:p-6">
          <Building2 className="w-8 h-8 md:w-10 md:h-10 text-secondary" />
        </div>
      </FloatingElement>

      {/* Main content */}
      <motion.div style={{ y, opacity }} className="container relative z-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 mb-6 px-4 py-2 text-sm font-medium rounded-full bg-accent/10 text-accent border border-accent/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              Now accepting new investors
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display tracking-tight mb-6"
          >
            Invest Small.{" "}
            <span className="gradient-text">Grow Together.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Back the local businesses you believe in. Start with as little as $10, 
            earn real returns, and watch your community thrive alongside your portfolio.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <MagneticButton variant="primary" size="lg">
              Start Investing
              <ArrowRight className="w-5 h-5" />
            </MagneticButton>
            <MagneticButton variant="secondary" size="lg">
              List Your Business
            </MagneticButton>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-16 md:mt-20 grid grid-cols-3 gap-6 md:gap-12 max-w-2xl mx-auto"
          >
            {[
              { value: "$2.4M", label: "Total Invested" },
              { value: "1,200+", label: "Active Investors" },
              { value: "89", label: "Local Businesses" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-2xl md:text-3xl font-bold font-display gradient-text">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
        >
          <motion.div className="w-1.5 h-1.5 rounded-full bg-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
}