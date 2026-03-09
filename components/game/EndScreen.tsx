'use client';

import { motion } from 'framer-motion';
import { Player } from '@/lib/types';
import Button from '@/components/ui/Button';

interface EndScreenProps {
  winner: Player | 'draw' | null;
  playerColor: Player;
  scores: { black: number; white: number };
  timerFormatted: string;
  difficulty: string;
  highScore: number;
  onRestart: () => void;
  onMenu: () => void;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function EndScreen({
  winner,
  playerColor,
  scores,
  timerFormatted,
  difficulty,
  highScore,
  onRestart,
  onMenu,
}: EndScreenProps) {
  const playerWon = winner === playerColor;
  const isDraw = winner === 'draw';

  const headline = isDraw ? "It's a Draw!" : playerWon ? 'You Win!' : 'You Lose!';
  const playerScore = playerColor === 'black' ? scores.black : scores.white;
  const isNewHighScore = playerScore > highScore && !isDraw && playerWon;

  // Emoji and colour theming
  const icon = isDraw ? '🤝' : playerWon ? '🏆' : '💔';
  const glowColor = isDraw
    ? 'rgba(251,191,36,0.4)'
    : playerWon
      ? 'rgba(52,211,153,0.4)'
      : 'rgba(244,63,94,0.4)';
  const borderColor = isDraw
    ? 'border-amber-400/40'
    : playerWon
      ? 'border-emerald-400/40'
      : 'border-rose-400/40';
  const textColor = isDraw
    ? 'text-amber-300'
    : playerWon
      ? 'text-emerald-300'
      : 'text-rose-300';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-30 flex items-center justify-center backdrop-blur-sm bg-black/60 rounded-xl"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className={`w-[90%] max-w-sm bg-slate-900/95 border ${borderColor} rounded-2xl p-6 flex flex-col items-center gap-5`}
        style={{ boxShadow: `0 0 60px ${glowColor}, 0 0 0 1px rgba(255,255,255,0.05)` }}
      >
        {/* Icon */}
        <motion.div
          variants={item}
          animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-5xl"
        >
          {icon}
        </motion.div>

        {/* Headline */}
        <motion.h2
          variants={item}
          className={`text-3xl font-black tracking-tight ${textColor}`}
        >
          {headline}
        </motion.h2>

        {/* New high score banner */}
        {isNewHighScore && (
          <motion.div
            variants={item}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-emerald-500/20 border border-emerald-400/40 rounded-full px-4 py-1 text-sm font-bold text-emerald-300"
          >
            ✨ New High Score!
          </motion.div>
        )}

        {/* Score display */}
        <motion.div variants={item} className="w-full flex justify-around">
          {(['black', 'white'] as Player[]).map(color => (
            <div key={color} className="flex flex-col items-center gap-1">
              <div
                className="w-7 h-7 rounded-full"
                style={{
                  background:
                    color === 'black'
                      ? 'radial-gradient(circle at 35% 30%, #4a4a4a, #0a0a0a)'
                      : 'radial-gradient(circle at 35% 30%, #ffffff, #cccccc)',
                  boxShadow: color === 'black' ? '0 2px 6px rgba(0,0,0,0.8)' : '0 2px 6px rgba(0,0,0,0.3)',
                }}
              />
              <span className="text-2xl font-bold text-white tabular-nums">
                {color === 'black' ? scores.black : scores.white}
              </span>
              <span className="text-xs text-slate-400">
                {color === playerColor ? 'You' : 'AI'}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={item}
          className="w-full grid grid-cols-3 gap-2 text-center"
        >
          {[
            { label: 'Time', value: timerFormatted },
            { label: 'Level', value: difficulty.charAt(0).toUpperCase() + difficulty.slice(1) },
            { label: 'Best', value: String(Math.max(playerScore, highScore)) },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-white/5 border border-white/10 rounded-xl px-2 py-2"
            >
              <div className="text-xs text-slate-500 uppercase tracking-wider">{label}</div>
              <div className="text-sm font-bold text-slate-200 mt-0.5">{value}</div>
            </div>
          ))}
        </motion.div>

        {/* Buttons */}
        <motion.div variants={item} className="w-full flex flex-col gap-2">
          <Button fullWidth onClick={onRestart}>
            Play Again
          </Button>
          <Button fullWidth variant="secondary" onClick={onMenu}>
            Main Menu
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
