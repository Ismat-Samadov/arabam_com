'use client';

import { motion } from 'framer-motion';
import { Player } from '@/lib/types';

interface DiscProps {
  color: Player;
  /** True for the disc that was just placed (scale-in animation) */
  isNew?: boolean;
  /** Index in the flip sequence for staggered animation */
  flipDelay?: number;
}

/** Renders a single Othello disc with appropriate colour and animation */
export default function Disc({ color, isNew = false, flipDelay = 0 }: DiscProps) {
  const isBlack = color === 'black';

  return (
    <motion.div
      // Changing the key when the color changes triggers the flip animation
      key={color}
      className="absolute inset-1 rounded-full will-change-transform"
      style={{
        background: isBlack
          ? 'radial-gradient(circle at 35% 30%, #4a4a4a, #0a0a0a)'
          : 'radial-gradient(circle at 35% 30%, #ffffff, #cccccc)',
        boxShadow: isBlack
          ? '0 2px 8px rgba(0,0,0,0.8), inset 0 1px 2px rgba(255,255,255,0.15)'
          : '0 2px 8px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.9), 0 0 12px rgba(255,255,255,0.3)',
      }}
      // New disc: pop in with a spring
      // Flipped disc: coin-flip (scaleX 0 → 1)
      initial={isNew ? { scale: 0 } : { scaleX: 0 }}
      animate={isNew ? { scale: 1 } : { scaleX: 1 }}
      transition={
        isNew
          ? { type: 'spring', stiffness: 500, damping: 22 }
          : { duration: 0.18, delay: flipDelay, ease: 'easeOut' }
      }
    >
      {/* Shine highlight */}
      <div
        className="absolute rounded-full"
        style={{
          top: '15%',
          left: '20%',
          width: '30%',
          height: '20%',
          background: isBlack
            ? 'rgba(255,255,255,0.12)'
            : 'rgba(255,255,255,0.7)',
          filter: 'blur(1px)',
        }}
      />
    </motion.div>
  );
}
