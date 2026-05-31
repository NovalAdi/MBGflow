import * as React from "react";
import { cn } from "@/src/lib/utils";
import { motion } from "motion/react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  [key: string]: any; // Allow any other props including key
}

export const Card = ({ children, className, animate = true, ...props }: CardProps) => {
  const Component = animate ? (motion.div as any) : 'div';
  return (
    <Component
      initial={animate ? { opacity: 0, y: 10 } : undefined}
      animate={animate ? { opacity: 1, y: 0 } : undefined}
      className={cn(
        "bg-white rounded-3xl p-6",
        "card-shadow transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
