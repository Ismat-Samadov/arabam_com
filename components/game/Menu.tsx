'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Difficulty, Player } from '@/lib/types';
import Button from '@/components/ui/Button';

interface MenuProps {
  onStart: (difficulty: Difficulty, playerColor: Player) => void;
  highScores: Record<Difficulty, number>;
}

const difficultyConfig: { key: Difficulty; label: string; desc: string; color: string }[] = [
  {
    key: 'easy',
    label: 'Easy',
    desc: 'Random AI moves',
    color: 'border-sky-500/40 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300',
  },
  {
    key: 'medium',
    label: 'Medium',
    desc: 'Greedy positional strategy',
    color: 'border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300',
  },
  {
    key: 'hard',
    label: 'Hard',
    desc: 'Minimax + alpha-beta pruning',
    color: 'border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
} as const;
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
} as const;

export default function Menu({ onStart, highScores }: MenuProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [playerColor, setPlayerColor] = useState<Player>('black');

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto py-4"
    >
      {/* Logo / Title */}
      <motion.div variants={item} className="flex flex-col items-center gap-2">
        {/* Animated logo discs */}
        <div className="flex gap-2 mb-1">
          {['white', 'black', 'white', 'black'].map((c, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18, delay: i * 0.08 }}
              className="w-8 h-8 rounded-full"
              style={{
                background:
                  c === 'black'
                    ? 'radial-gradient(circle at 35% 30%, #4a4a4a, #0a0a0a)'
                    : 'radial-gradient(circle at 35% 30%, #ffffff, #cccccc)',
                boxShadow:
                  c === 'black'
                    ? '0 2px 8px rgba(0,0,0,0.8)'
                    : '0 2px 8px rgba(0,0,0,0.3), 0 0 12px rgba(255,255,255,0.3)',
              }}
            />
          ))}
        </div>
        <h1 className="text-5xl font-black tracking-tight text-white">
          OTH
          <span className="text-emerald-400" style={{ textShadow: '0 0 20px rgba(52,211,153,0.6)' }}>
            ELLO
          </span>
        </h1>
        <p className="text-slate-400 text-sm">Classic strategy board game</p>
      </motion.div>

      {/* Difficulty */}
      <motion.div variants={item} className="w-full flex flex-col gap-2">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest text-center">
          Difficulty
        </h3>
        <div className="flex gap-2">
          {difficultyConfig.map(({ key, label, desc, color }) => (
            <button
              key={key}
              onClick={() => setDifficulty(key)}
              className={[
                'flex-1 flex flex-col items-center gap-0.5 py-3 px-2 rounded-xl border transition-all duration-150 cursor-pointer',
                color,
                difficulty === key ? 'ring-2 ring-offset-2 ring-offset-slate-950 ring-current' : '',
              ].join(' ')}
            >
              <span className="font-bold text-sm">{label}</span>
              <span className="text-[10px] text-slate-400 text-center leading-tight">{desc}</span>
              {highScores[key] > 0 && (
                <span className="text-[10px] text-slate-500 mt-0.5">Best: {highScores[key]}</span>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Colour picker */}
      <motion.div variants={item} className="w-full flex flex-col gap-2">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest text-center">
          Play as
        </h3>
        <div className="flex gap-3 justify-center">
          {(['black', 'white'] as Player[]).map(color => (
            <button
              key={color}
              onClick={() => setPlayerColor(color)}
              className={[
                'flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-150 cursor-pointer',
                playerColor === color
                  ? 'bg-white/10 border-white/30 ring-2 ring-white/20'
                  : 'bg-white/5 border-white/10 hover:bg-white/8',
              ].join(' ')}
            >
              <div
                className="w-6 h-6 rounded-full flex-shrink-0"
                style={{
                  background:
                    color === 'black'
                      ? 'radial-gradient(circle at 35% 30%, #4a4a4a, #0a0a0a)'
                      : 'radial-gradient(circle at 35% 30%, #ffffff, #cccccc)',
                  boxShadow:
                    color === 'black'
                      ? '0 2px 6px rgba(0,0,0,0.8)'
                      : '0 2px 6px rgba(0,0,0,0.3), 0 0 8px rgba(255,255,255,0.3)',
                }}
              />
              <span className="text-sm font-semibold capitalize text-slate-200">{color}</span>
              {color === 'black' && (
                <span className="text-[10px] text-slate-500">(1st)</span>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Play button */}
      <motion.div variants={item} className="w-full">
        <Button fullWidth size="lg" onClick={() => onStart(difficulty, playerColor)}>
          Play Game
        </Button>
      </motion.div>

      {/* Rules summary */}
      <motion.div
        variants={item}
        className="w-full bg-white/3 border border-white/8 rounded-xl p-4 text-xs text-slate-400 leading-relaxed"
      >
        <p className="font-semibold text-slate-300 mb-1">How to play</p>
        <p>
          Place discs to outflank your opponent. All discs sandwiched between your pieces flip to
          your colour. The player with the most discs when the board is full wins.
        </p>
      </motion.div>
    </motion.div>
  );
}
