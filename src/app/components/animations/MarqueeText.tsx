'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MarqueeTextProps {
  children: ReactNode;
  duration?: number;
}

export default function MarqueeText({
  children,
  duration = 20,
}: MarqueeTextProps) {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        className="flex w-max"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <div className="flex shrink-0 items-center">
          {children}
        </div>

        <div className="flex shrink-0 items-center">
          {children}
        </div>

        <div className="flex shrink-0 items-center">
          {children}
        </div>

        <div className="flex shrink-0 items-center">
          {children}
        </div>
      </motion.div>
    </div>
  );
}