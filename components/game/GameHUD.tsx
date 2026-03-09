'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { OthelloState } from '@/hooks/useOthello';
import { Player } from '@/lib/types';

interface GameHUDProps {
  state: OthelloState;
  timerFormatted: string;
  soundEnabled: boolean;
  onPause: () => void;
  onToggleSound: () => void;
  onMenu: () => void;
  highScore: number;
}

function DiscIcon({ color, size = 20 }: { color: Player; size?: number }) {
  return (
    <div
      className="rounded-full flex-shrink-0"
      style={{
        width: size,
        height: size,
        background:
          color === 'black'
            ? 'radial-gradient(circle at 35% 30%, #4a4a4a, #0a0a0a)'
            : 'radial-gradient(circle at 35% 30%, #ffffff, #cccccc)',
        boxShadow:
          color === 'black'
            ? '0 1px 4px rgba(0,0,0,0.9)'
            : '0 1px 4px rgba(0,0,0,0.3), 0 0 6px rgba(255,255,255,0.3)',
      }}
    />
  );
}

function ScorePanel({
  label,
  score,
  isActive,
  color,
  highScore,
}: {
  label: string;
  score: number;
  isActive: boolean;
  color: Player;
  highScore?: number;
}) {
  return (
    <motion.div
      animate={isActive ? { scale: 1.04 } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={[
        'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200',
        isActive
          ? 'bg-emerald-500/20 border border-emerald-400/40 shadow-[0_0_16px_rgba(52,211,153,0.2)]'
          : 'bg-white/5 border border-white/10',
      ].join(' ')}
    >
      <div className="flex items-center gap-1.5">
        <DiscIcon color={color} size={14} />
        <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">
          {label}
        </span>
      </div>
      <motion.span
        key={score}
        initial={{ scale: 1.4, color: '#34d399' }}
        animate={{ scale: 1, color: '#f1f5f9' }}
        transition={{ duration: 0.3 }}
        className="text-2xl font-bold tabular-nums leading-none"
      >
        {score}
      </motion.span>
      {highScore !== undefined && highScore > 0 && (
        <span className="text-[10px] text-slate-500">Best {highScore}</span>
      )}
    </motion.div>
  );
}

export default function GameHUD({
  state,
  timerFormatted,
  soundEnabled,
  onPause,
  onToggleSound,
  onMenu,
  highScore,
}: GameHUDProps) {
  const { scores, currentPlayer, playerColor, isAIThinking, passMessage, status, difficulty } =
    state;

  const isYourTurn = currentPlayer === playerColor && status === 'playing';

  const turnLabel = isAIThinking
    ? 'AI is thinking…'
    : isYourTurn
      ? 'Your turn'
      : 'Opponent\'s turn';

  const diffBadge = {
    easy: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    hard: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  }[difficulty];

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-2">
        {/* Left: difficulty badge */}
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full border uppercase tracking-wider ${diffBadge}`}
        >
          {difficulty}
        </span>

        {/* Center: timer */}
        <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-3 py-1">
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path strokeLinecap="round" strokeWidth="2" d="M12 6v6l4 2" />
          </svg>
          <span className="text-sm font-mono text-slate-300">{timerFormatted}</span>
        </div>

        {/* Right: control buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleSound}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            title={soundEnabled ? 'Mute' : 'Unmute'}
          >
            {soundEnabled ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072M12 6.5l-5 4H3v3h4l5 4V6.5z" />
                <path strokeLinecap="round" strokeWidth="2" d="M18.364 5.636a9 9 0 010 12.728" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeWidth="2" d="M12 6.5l-5 4H3v3h4l5 4V6.5z" />
                <line x1="23" y1="9" x2="17" y2="15" strokeWidth="2" strokeLinecap="round" />
                <line x1="17" y1="9" x2="23" y2="15" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
          <button
            onClick={onPause}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            title="Pause"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          </button>
          <button
            onClick={onMenu}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            title="Main menu"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Score row */}
      <div className="flex items-center justify-between gap-2">
        <ScorePanel
          label={playerColor === 'black' ? 'You' : 'AI'}
          score={scores.black}
          isActive={currentPlayer === 'black' && status === 'playing'}
          color="black"
          highScore={playerColor === 'black' ? highScore : undefined}
        />

        {/* Turn indicator */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={turnLabel}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <DiscIcon color={currentPlayer} size={12} />
              <span
                className={`text-xs font-medium ${isYourTurn ? 'text-emerald-400' : 'text-slate-400'}`}
              >
                {turnLabel}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        <ScorePanel
          label={playerColor === 'white' ? 'You' : 'AI'}
          score={scores.white}
          isActive={currentPlayer === 'white' && status === 'playing'}
          color="white"
          highScore={playerColor === 'white' ? highScore : undefined}
        />
      </div>

      {/* Pass message */}
      <AnimatePresence>
        {passMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-center text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2"
          >
            {passMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
