'use client';

import { motion } from 'framer-motion';
import { Player, CellValue } from '@/lib/types';
import Disc from './Disc';

interface CellProps {
  value: CellValue;
  row: number;
  col: number;
  isValidMove: boolean;
  isLastMove: boolean;
  isFlipped: boolean;
  flipDelay: number;
  isNew: boolean;
  onClick: () => void;
  onHover: () => void;
  isPlayerTurn: boolean;
}

export default function Cell({
  value,
  isValidMove,
  isLastMove,
  isFlipped,
  flipDelay,
  isNew,
  onClick,
  onHover,
  isPlayerTurn,
}: CellProps) {
  const canClick = isValidMove && isPlayerTurn;

  return (
    <motion.div
      className={[
        'relative aspect-square cursor-default select-none',
        'border border-emerald-900/60',
        'transition-colors duration-100',
        canClick ? 'cursor-pointer' : '',
        isLastMove ? 'bg-emerald-700/30' : 'bg-emerald-950/50 hover:bg-emerald-900/40',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={canClick ? onClick : undefined}
      onMouseEnter={canClick ? onHover : undefined}
      whileHover={canClick ? { backgroundColor: 'rgba(16,185,129,0.25)' } : {}}
    >
      {/* Disc */}
      {value && (
        <Disc
          color={value as Player}
          isNew={isNew}
          flipDelay={isFlipped ? flipDelay : 0}
        />
      )}

      {/* Valid move hint — small dot */}
      {isValidMove && isPlayerTurn && !value && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="w-1/3 h-1/3 rounded-full bg-emerald-400/50 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
        </motion.div>
      )}

      {/* Last-move ring */}
      {isLastMove && (
        <div className="absolute inset-0 rounded-sm ring-1 ring-emerald-400/40 pointer-events-none" />
      )}
    </motion.div>
  );
}
