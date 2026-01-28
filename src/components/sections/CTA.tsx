import { motion } from "framer-motion";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTA() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[200px]" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[150px]" />

      <div className="container px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Floating sparkles */}
          <motion.div
            animate={{ y: [-5, 5, -5], rotate: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <Sparkles className="w-7 h-7 text-primary" />
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight mb-6">
            Ready to grow your wealth{" "}
            <span className="gradient-text">and your community?</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Join thousands of investors who are building a better future—one local business at a time. 
            Your first investment is just a few clicks away.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <MagneticButton variant="primary" size="lg">
              Start Investing Today
              <ArrowRight className="w-5 h-5" />
            </MagneticButton>
            <MagneticButton variant="ghost" size="lg">
              Schedule a Demo
            </MagneticButton>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex -space-x-3">
              {["🧑", "👩", "👨", "👧", "🧔"].map((emoji, index) => (
                <div
                  key={index}
                  className="w-10 h-10 rounded-full bg-card-elevated border-2 border-background flex items-center justify-center text-lg"
                >
                  {emoji}
                </div>
              ))}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">1,200+ investors</p>
              <p className="text-xs text-muted-foreground">joined this month</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}