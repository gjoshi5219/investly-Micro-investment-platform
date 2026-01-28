import { motion } from "framer-motion";
import { SectionWrapper, SectionHeader } from "@/components/ui/section-wrapper";
import { Shield, Users, Eye, Zap, HeartHandshake, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "256-bit encryption, two-factor auth, and segregated accounts keep your money safe.",
  },
  {
    icon: Eye,
    title: "Full Transparency",
    description: "See exactly where your money goes. Monthly reports, real-time tracking, no hidden fees.",
  },
  {
    icon: Users,
    title: "Community First",
    description: "Every investment strengthens local businesses and creates jobs in your neighborhood.",
  },
  {
    icon: Zap,
    title: "Instant Access",
    description: "Start investing in seconds. Withdraw your returns anytime without penalties.",
  },
  {
    icon: HeartHandshake,
    title: "Vetted Businesses",
    description: "Our team personally reviews every business. Only 8% of applicants make it through.",
  },
  {
    icon: BarChart3,
    title: "Real Returns",
    description: "Average 12% annual returns across our portfolio. Better than savings, lower risk than stocks.",
  },
];

export function WhyInvestly() {
  return (
    <SectionWrapper id="why-investly">
      <div className="container px-4">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Content */}
          <div>
            <SectionHeader
              badge="Why Choose Us"
              title="Built different. Built better."
              description="We're not another faceless investment app. We're a community of people who believe local businesses deserve access to capital—and investors deserve real returns."
              align="left"
            />

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Main card */}
            <div className="glass-card p-8 md:p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">I</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-display">Investly</h3>
                  <p className="text-muted-foreground">Member since 2024</p>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="p-4 rounded-xl bg-card-elevated">
                  <p className="text-3xl font-bold font-display gradient-text">$12,450</p>
                  <p className="text-sm text-muted-foreground mt-1">Total Invested</p>
                </div>
                <div className="p-4 rounded-xl bg-card-elevated">
                  <p className="text-3xl font-bold font-display text-accent">$1,867</p>
                  <p className="text-sm text-muted-foreground mt-1">Total Earned</p>
                </div>
                <div className="p-4 rounded-xl bg-card-elevated">
                  <p className="text-3xl font-bold font-display">7</p>
                  <p className="text-sm text-muted-foreground mt-1">Active Investments</p>
                </div>
                <div className="p-4 rounded-xl bg-card-elevated">
                  <p className="text-3xl font-bold font-display text-primary">15%</p>
                  <p className="text-sm text-muted-foreground mt-1">Avg. Return</p>
                </div>
              </div>

              {/* Mini chart visualization */}
              <div className="h-24 flex items-end gap-1">
                {[40, 55, 45, 70, 65, 80, 75, 90, 85, 100, 95, 110].map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${height}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    viewport={{ once: true }}
                    className="flex-1 rounded-t-sm bg-gradient-to-t from-primary/30 to-primary"
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">Portfolio growth over 12 months</p>
            </div>

            {/* Floating notification cards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="absolute -top-4 -right-4 md:-right-8"
            >
              <div className="glass-card p-4 flex items-center gap-3 glow-accent">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-lg">📈</span>
                </div>
                <div>
                  <p className="text-sm font-medium">+$124.50</p>
                  <p className="text-xs text-muted-foreground">Monthly dividend</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="absolute -bottom-4 -left-4 md:-left-8"
            >
              <div className="glass-card p-4 flex items-center gap-3 glow-primary">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-lg">🎉</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Goal reached!</p>
                  <p className="text-xs text-muted-foreground">Bean & Bloom Coffee</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}