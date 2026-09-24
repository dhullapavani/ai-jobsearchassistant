"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  format?: "integer" | "percentage" | "decimal";
  duration?: number;
}

export function AnimatedNumber({ value, format = "integer", duration = 1500 }: AnimatedNumberProps) {
  const [hasInView, setHasInView] = useState(false);
  const spring = useSpring(0, {
    duration,
    bounce: 0,
  });

  const display = useTransform(spring, (current) => {
    if (format === "percentage") return `${Math.round(current)}%`;
    if (format === "decimal") return current.toFixed(1);
    return Math.round(current).toLocaleString();
  });

  useEffect(() => {
    if (hasInView) {
      spring.set(value);
    }
  }, [spring, value, hasInView]);

  return (
    <motion.span
      onViewportEnter={() => setHasInView(true)}
      viewport={{ once: true }}
    >
      {display}
    </motion.span>
  );
}
