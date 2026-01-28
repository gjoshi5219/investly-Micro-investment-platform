import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  intensity?: number;
}

export function FloatingCard({ children, className, delay = 0, intensity = 1 }: FloatingCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-100, 100], [10 * intensity, -10 * intensity]);
  const rotateY = useTransform(mouseXSpring, [-100, 100], [-10 * intensity, 10 * intensity]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true, margin: "-50px" }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("glass-card cursor-pointer", className)}
    >
      {children}
    </motion.div>
  );
}

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  floatIntensity?: "low" | "medium" | "high";
  delay?: number;
}

export function FloatingElement({ 
  children, 
  className, 
  floatIntensity = "medium",
  delay = 0 
}: FloatingElementProps) {
  const intensityMap = {
    low: "animate-float-slow",
    medium: "animate-float",
    high: "animate-float-delayed",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: delay * 0.2, ease: "easeOut" }}
      className={cn(intensityMap[floatIntensity], className)}
      style={{ animationDelay: `${delay * 0.3}s` }}
    >
      {children}
    </motion.div>
  );
}