import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Shield, Lock, FileCheck, Building2 } from "lucide-react";

const securityFeatures = [
  {
    icon: Shield,
    title: "FDIC Partnership",
    description: "Your uninvested funds are held with our banking partner, protected up to $250,000.",
  },
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "Military-grade 256-bit AES encryption protects all your data and transactions.",
  },
  {
    icon: FileCheck,
    title: "SEC Regulated",
    description: "We're registered with the SEC as a funding portal under Regulation Crowdfunding.",
  },
  {
    icon: Building2,
    title: "Licensed & Insured",
    description: "Fully licensed in all 50 states with comprehensive liability insurance coverage.",
  },
];

export function Security() {
  return (
    <SectionWrapper id="security" className="bg-gradient-to-b from-background to-card/20">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <Shield className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display tracking-tight mb-4">
              Your money is safe with us
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              We take security seriously. Really seriously. Here's how we protect your investments.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 md:p-8 flex gap-5"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 pt-12 border-t border-border/50"
          >
            <p className="text-center text-sm text-muted-foreground mb-6">Trusted and verified by</p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
              {["SEC", "FINRA", "SIPC", "SOC 2"].map((badge, index) => (
                <div key={index} className="text-xl md:text-2xl font-bold font-display text-muted-foreground">
                  {badge}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}