import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SectionWrapper({ children, className, id }: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: "-100px" }}
      className={cn("relative py-24 md:py-32", className)}
    >
      {children}
    </motion.section>
  );
}

interface SectionHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeader({ badge, title, description, align = "center" }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={cn(
        "mb-16 md:mb-20",
        align === "center" ? "text-center mx-auto max-w-3xl" : "max-w-2xl"
      )}
    >
      {badge && (
        <span className="inline-block mb-4 px-4 py-1.5 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display tracking-tight mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}