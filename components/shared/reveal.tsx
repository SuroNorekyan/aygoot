"use client";

import { motion } from "framer-motion";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type RevealProps = ComponentPropsWithoutRef<typeof motion.div> & {
  children: ReactNode;
  delay?: number;
};

export function Reveal({
  children,
  delay = 0,
  className,
  ...props
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
