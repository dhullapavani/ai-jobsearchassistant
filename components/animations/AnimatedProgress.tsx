"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedProgressProps {
  value: number;
  className?: string;
  indicatorClassName?: string;
}

export function AnimatedProgress({ value, className, indicatorClassName }: AnimatedProgressProps) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-gray-200/50", className)}>
      <motion.div
        className={cn("h-full bg-primary", indicatorClassName)}
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  );
}
