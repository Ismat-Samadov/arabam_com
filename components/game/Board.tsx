'use client';

import { useMemo } from 'react';
import { OthelloState } from '@/hooks/useOthello';
import Cell from './Cell';

interface BoardProps {
  state: OthelloState;
  onMove: (row: number, col: number) => void;
  onHover: () => void;
}

export default function Board({ state, onMove, onHover }: BoardProps) {
  const {
    board,
    validMoves,
    lastMove,
    flippedCells,
    currentPlayer,
    playerColor,
    isAIThinking,
    status,
  } = state;

  // Build quick look-up sets for O(1) checks
  const validSet = useMemo(
    () => new Set(validMoves.map(([r, c]) => `${r}-${c}`)),
    [validMoves],
  );
  const flippedSet = useMemo(
    () => new Set(flippedCells.map(([r, c]) => `${r}-${c}`)),
    [flippedCells],
  );
  // Map flipped cells to their stagger index
  const flipIndexMap = useMemo(() => {
    const m = new Map<string, number>();
    flippedCells.forEach(([r, c], i) => m.set(`${r}-${c}`, i));
    return m;
  }, [flippedCells]);

  const lastKey = lastMove ? `${lastMove[0]}-${lastMove[1]}` : null;
  const isPlayerTurn = currentPlayer === playerColor && status === 'playing' && !isAIThinking;

  return (
    <div
      className="relative w-full aspect-square rounded-xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8)]"
      style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
        border: '3px solid rgba(52,211,153,0.25)',
        boxShadow: '0 0 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(52,211,153,0.1), inset 0 0 60px rgba(0,0,0,0.3)',
      }}
    >
      {/* AI thinking overlay */}
      {isAIThinking && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
            <span className="text-emerald-400 text-sm font-semibold animate-pulse">
              AI is thinking…
            </span>
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 8×8 grid */}
      <div
        className="grid h-full w-full"
        style={{ gridTemplateColumns: 'repeat(8, 1fr)', gridTemplateRows: 'repeat(8, 1fr)' }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => {
            const key = `${r}-${c}`;
            const isFlipped = flippedSet.has(key);
            const isNew = lastKey === key && cell !== null;
            const flipDelay = isFlipped ? (flipIndexMap.get(key) ?? 0) * 0.04 : 0;

            return (
              <Cell
                key={key}
                value={cell}
                row={r}
                col={c}
                isValidMove={validSet.has(key)}
                isLastMove={lastKey === key}
                isFlipped={isFlipped}
                flipDelay={flipDelay}
                isNew={isNew}
                onClick={() => onMove(r, c)}
                onHover={onHover}
                isPlayerTurn={isPlayerTurn}
              />
            );
          }),
        )}
      </div>

      {/* Grid-line accent overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.15) 1px, transparent 1px)',
          backgroundSize: '12.5% 12.5%',
        }}
      />
    </div>
  );
}
