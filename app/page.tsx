'use client';

import { useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { useOthello } from '@/hooks/useOthello';
import { useSound } from '@/hooks/useSound';
import { useHighScore } from '@/hooks/useHighScore';
import { useTimer } from '@/hooks/useTimer';
import { Difficulty, Player } from '@/lib/types';

import Board from '@/components/game/Board';
import GameHUD from '@/components/game/GameHUD';
import EndScreen from '@/components/game/EndScreen';
import PauseMenu from '@/components/game/PauseMenu';
import Menu from '@/components/game/Menu';

export default function OthelloPage() {
  const { soundEnabled, toggleSound, play } = useSound();
  const { highScores, updateHighScore } = useHighScore();

  // Sound callbacks wired into game logic
  const { state, startGame, handleMove, pauseGame, resumeGame, goToMenu, dismissPass } =
    useOthello({
      onPlace: () => play('place'),
      onFlip:  () => play('flip'),
      onPass:  () => play('pass'),
      onWin:   () => play('win'),
      onLose:  () => play('lose'),
      onDraw:  () => play('draw'),
    });

  const isPlaying = state.status === 'playing';
  const { formatted: timerFormatted, reset: resetTimer } = useTimer(isPlaying);

  // Save high score when game ends
  useEffect(() => {
    if (state.status !== 'gameover') return;
    const playerScore =
      state.playerColor === 'black' ? state.scores.black : state.scores.white;
    updateHighScore(playerScore, state.difficulty);
  }, [state.status, state.playerColor, state.scores, state.difficulty, updateHighScore]);

  // Keyboard shortcuts: Space = pause/resume, Escape = menu
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        if (state.status === 'playing') pauseGame();
        else if (state.status === 'paused') resumeGame();
      }
      if (e.key === 'Escape' && state.status === 'paused') resumeGame();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state.status, pauseGame, resumeGame]);

  // Dismiss pass message automatically after 3 s
  useEffect(() => {
    if (!state.passMessage) return;
    const t = setTimeout(dismissPass, 3000);
    return () => clearTimeout(t);
  }, [state.passMessage, dismissPass]);

  const handleStart = useCallback(
    (difficulty: Difficulty, playerColor: Player) => {
      resetTimer();
      startGame(difficulty, playerColor);
    },
    [startGame, resetTimer],
  );

  const handleRestart = useCallback(() => {
    resetTimer();
    startGame(state.difficulty, state.playerColor);
  }, [startGame, state.difficulty, state.playerColor, resetTimer]);

  const playerScore =
    state.playerColor === 'black' ? state.scores.black : state.scores.white;
  const currentHighScore = highScores[state.difficulty] ?? 0;

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-6 select-none"
      style={{
        background:
          'radial-gradient(ellipse at top, #0d2137 0%, #020817 50%, #000d1a 100%)',
        minHeight: '100dvh',
      }}
    >
      {/* Ambient background glows */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, #10b981, transparent)',
            filter: 'blur(80px)',
            transform: 'translate(-50%, -40%)',
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-8"
          style={{
            background: 'radial-gradient(circle, #6366f1, transparent)',
            filter: 'blur(80px)',
            transform: 'translate(50%, 40%)',
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md flex flex-col gap-4">
        <AnimatePresence mode="wait">
          {state.status === 'menu' ? (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Menu onStart={handleStart} highScores={highScores} />
            </motion.div>
          ) : (
            <motion.div
              key="game"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-3"
            >
              {/* HUD — scores, timer, controls */}
              <GameHUD
                state={state}
                timerFormatted={timerFormatted}
                soundEnabled={soundEnabled}
                onPause={pauseGame}
                onToggleSound={toggleSound}
                onMenu={goToMenu}
                highScore={currentHighScore}
              />

              {/* Board — relative container so overlays can be positioned inside */}
              <div className="relative">
                <Board
                  state={state}
                  onMove={handleMove}
                  onHover={() => play('hover')}
                />

                {/* Pause overlay */}
                <AnimatePresence>
                  {state.status === 'paused' && (
                    <PauseMenu
                      onResume={resumeGame}
                      onRestart={handleRestart}
                      onMenu={goToMenu}
                    />
                  )}
                </AnimatePresence>

                {/* Game-over overlay */}
                <AnimatePresence>
                  {state.status === 'gameover' && (
                    <EndScreen
                      winner={state.winner}
                      playerColor={state.playerColor}
                      scores={state.scores}
                      timerFormatted={timerFormatted}
                      difficulty={state.difficulty}
                      highScore={currentHighScore}
                      onRestart={handleRestart}
                      onMenu={goToMenu}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Keyboard hint */}
              <p className="text-center text-xs text-slate-600">
                Space to pause · Click to place
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
