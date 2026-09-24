"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function SlideUp({ children, delay = 0, duration = 0.4, y = 20 }: { children: ReactNode; delay?: number; duration?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
