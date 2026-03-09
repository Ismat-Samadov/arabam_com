'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

interface PauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
  onMenu: () => void;
}

export default function PauseMenu({ onResume, onRestart, onMenu }: PauseMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 flex items-center justify-center backdrop-blur-sm bg-black/60 rounded-xl"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="w-[80%] max-w-xs bg-slate-900/95 border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-5"
        style={{ boxShadow: '0 0 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)' }}
      >
        {/* Icon + Title */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <svg className="w-7 h-7 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Paused</h2>
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col gap-2">
          <Button fullWidth onClick={onResume} size="lg">
            Resume
          </Button>
          <Button fullWidth variant="secondary" onClick={onRestart}>
            Restart
          </Button>
          <Button fullWidth variant="ghost" onClick={onMenu}>
            Main Menu
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
