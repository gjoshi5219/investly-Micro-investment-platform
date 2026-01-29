import { motion } from "framer-motion";
import { SectionWrapper, SectionHeader } from "@/components/ui/section-wrapper";
import { Shield, Users, Eye, Zap, HeartHandshake, BarChart3 } from "lucide-react";
const features = [{
  icon: Shield,
  title: "Bank-Level Security",
  description: "256-bit encryption, two-factor auth, and segregated accounts keep your money safe."
}, {
  icon: Eye,
  title: "Full Transparency",
  description: "See exactly where your money goes. Monthly reports, real-time tracking, no hidden fees."
}, {
  icon: Users,
  title: "Community First",
  description: "Every investment strengthens local businesses and creates jobs in your neighborhood."
}, {
  icon: Zap,
  title: "Instant Access",
  description: "Start investing in seconds. Withdraw your returns anytime without penalties."
}, {
  icon: HeartHandshake,
  title: "Vetted Businesses",
  description: "Our team personally reviews every business. Only 8% of applicants make it through."
}, {
  icon: BarChart3,
  title: "Real Returns",
  description: "Average 12% annual returns across our portfolio. Better than savings, lower risk than stocks."
}];
export function WhyInvestly() {
  return <SectionWrapper id="why-investly">
      <div className="container px-4">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Content */}
          <div>
            <SectionHeader badge="Why Choose Us" title="Built different. Built better." description="We're not another faceless investment app. We're a community of people who believe local businesses deserve access to capital—and investors deserve real returns." align="left" />

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => <motion.div key={index} initial={{
              opacity: 0,
              x: -20
            }} whileInView={{
              opacity: 1,
              x: 0
            }} transition={{
              duration: 0.5,
              delay: index * 0.1
            }} viewport={{
              once: true
            }} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>)}
            </div>
          </div>

          {/* Right: Visual */}
          <motion.div initial={{
          opacity: 0,
          scale: 0.9
        }} whileInView={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.8
        }} viewport={{
          once: true
        }} className="relative">
            {/* Main card */}
            

            {/* Floating notification cards */}
            <motion.div initial={{
            opacity: 0,
            x: 50
          }} whileInView={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.6,
            delay: 0.4
          }} viewport={{
            once: true
          }} className="absolute -top-4 -right-4 md:-right-8">
              
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            x: -50
          }} whileInView={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.6,
            delay: 0.6
          }} viewport={{
            once: true
          }} className="absolute -bottom-4 -left-4 md:-left-8">
              
            </motion.div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>;
}