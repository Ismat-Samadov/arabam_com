'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Board, Player, Difficulty, GameStatus, Scores } from '@/lib/types';
import {
  createInitialBoard,
  getValidMoves,
  makeMove,
  getScore,
  isGameOver,
  getWinner,
} from '@/lib/othello';
import { getAIMove } from '@/lib/ai';

export interface OthelloState {
  board: Board;
  currentPlayer: Player;
  scores: Scores;
  validMoves: [number, number][];
  status: GameStatus;
  winner: Player | 'draw' | null;
  difficulty: Difficulty;
  lastMove: [number, number] | null;
  flippedCells: [number, number][];
  isAIThinking: boolean;
  /** Human player's colour */
  playerColor: Player;
  /** Message shown when a player must pass */
  passMessage: string | null;
}

interface OthelloCallbacks {
  onPlace?: () => void;
  onFlip?: () => void;
  onPass?: () => void;
  onWin?: () => void;
  onLose?: () => void;
  onDraw?: () => void;
}

function buildInitialState(difficulty: Difficulty = 'medium', playerColor: Player = 'black'): OthelloState {
  const board = createInitialBoard();
  return {
    board,
    currentPlayer: 'black',
    scores: { black: 2, white: 2 },
    validMoves: getValidMoves(board, 'black'),
    status: 'menu',
    winner: null,
    difficulty,
    lastMove: null,
    flippedCells: [],
    isAIThinking: false,
    playerColor,
    passMessage: null,
  };
}

export function useOthello(callbacks: OthelloCallbacks = {}) {
  const [state, setState] = useState<OthelloState>(() => buildInitialState());

  // Keep callbacks in a ref so the AI effect never becomes stale
  const cbRef = useRef(callbacks);
  cbRef.current = callbacks;

  // Guard to prevent multiple simultaneous AI calls
  const aiActiveRef = useRef(false);

  // ─── Start / Restart ──────────────────────────────────────────────────────
  const startGame = useCallback((difficulty: Difficulty, playerColor: Player) => {
    aiActiveRef.current = false;
    const board = createInitialBoard();
    setState({
      board,
      currentPlayer: 'black',
      scores: { black: 2, white: 2 },
      validMoves: getValidMoves(board, 'black'),
      status: 'playing',
      winner: null,
      difficulty,
      lastMove: null,
      flippedCells: [],
      isAIThinking: false,
      playerColor,
      passMessage: null,
    });
  }, []);

  // ─── Human move ───────────────────────────────────────────────────────────
  const handleMove = useCallback((row: number, col: number) => {
    setState(prev => {
      if (prev.status !== 'playing') return prev;
      if (prev.currentPlayer !== prev.playerColor) return prev; // not your turn
      if (prev.isAIThinking) return prev;

      const { board: newBoard, flipped } = makeMove(prev.board, row, col, prev.currentPlayer);
      if (flipped.length === 0) return prev; // invalid

      cbRef.current.onPlace?.();
      if (flipped.length > 0) setTimeout(() => cbRef.current.onFlip?.(), 200);

      return applyMove(prev, newBoard, flipped, row, col, cbRef.current);
    });
  }, []);

  // ─── AI effect ────────────────────────────────────────────────────────────
  useEffect(() => {
    const { status, currentPlayer, playerColor, difficulty, board } = state;

    // Only fire when it's the AI's turn and the game is live
    if (status !== 'playing') return;
    if (currentPlayer === playerColor) return;
    if (aiActiveRef.current) return;

    aiActiveRef.current = true;
    setState(prev => ({ ...prev, isAIThinking: true }));

    const aiColor: Player = playerColor === 'black' ? 'white' : 'black';
    const delay = difficulty === 'easy' ? 500 : difficulty === 'medium' ? 900 : 1400;

    const timer = setTimeout(() => {
      aiActiveRef.current = false;

      const move = getAIMove(board, aiColor, difficulty);

      if (!move) {
        // AI must pass
        setState(prev => {
          const next: Player = prev.currentPlayer === 'black' ? 'white' : 'black';
          const nextMoves = getValidMoves(prev.board, next);
          if (nextMoves.length === 0) {
            const winner = getWinner(prev.board);
            signalEnd(winner, prev.playerColor, cbRef.current);
            return { ...prev, status: 'gameover', winner, validMoves: [], isAIThinking: false };
          }
          cbRef.current.onPass?.();
          return {
            ...prev,
            currentPlayer: next,
            validMoves: nextMoves,
            isAIThinking: false,
            passMessage: `${prev.currentPlayer === 'black' ? 'Black' : 'White'} (AI) has no moves — skipping turn`,
          };
        });
        return;
      }

      const [r, c] = move;
      const { board: newBoard, flipped } = makeMove(board, r, c, aiColor);

      setState(prev => {
        const next = applyMove(prev, newBoard, flipped, r, c, cbRef.current);
        return { ...next, isAIThinking: false };
      });
    }, delay);

    return () => {
      clearTimeout(timer);
      aiActiveRef.current = false;
    };
    // Re-run only when the active player changes or game restarts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status, state.currentPlayer, state.playerColor, state.difficulty]);

  // ─── Controls ─────────────────────────────────────────────────────────────
  const pauseGame = useCallback(() => {
    setState(prev => (prev.status === 'playing' ? { ...prev, status: 'paused' } : prev));
  }, []);

  const resumeGame = useCallback(() => {
    setState(prev => (prev.status === 'paused' ? { ...prev, status: 'playing' } : prev));
  }, []);

  const goToMenu = useCallback(() => {
    aiActiveRef.current = false;
    setState(buildInitialState());
  }, []);

  const dismissPass = useCallback(() => {
    setState(prev => ({ ...prev, passMessage: null }));
  }, []);

  return { state, startGame, handleMove, pauseGame, resumeGame, goToMenu, dismissPass };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Produce the next state after a move has been applied to the board */
function applyMove(
  prev: OthelloState,
  newBoard: Board,
  flipped: [number, number][],
  row: number,
  col: number,
  cbs: OthelloCallbacks,
): OthelloState {
  const scores = getScore(newBoard);
  const blackMoves = getValidMoves(newBoard, 'black');
  const whiteMoves = getValidMoves(newBoard, 'white');

  // Game over?
  if (blackMoves.length === 0 && whiteMoves.length === 0) {
    const winner = getWinner(newBoard);
    signalEnd(winner, prev.playerColor, cbs);
    return {
      ...prev,
      board: newBoard,
      scores,
      flippedCells: flipped,
      lastMove: [row, col],
      status: 'gameover',
      winner,
      validMoves: [],
    };
  }

  const nextPlayer: Player = prev.currentPlayer === 'black' ? 'white' : 'black';
  const nextMoves = nextPlayer === 'black' ? blackMoves : whiteMoves;

  // Next player must pass?
  if (nextMoves.length === 0) {
    const currentMoves = prev.currentPlayer === 'black' ? blackMoves : whiteMoves;
    cbs.onPass?.();
    return {
      ...prev,
      board: newBoard,
      scores,
      flippedCells: flipped,
      lastMove: [row, col],
      validMoves: currentMoves,
      passMessage: `${nextPlayer === 'black' ? 'Black' : 'White'} has no valid moves — skipping turn`,
    };
  }

  return {
    ...prev,
    board: newBoard,
    currentPlayer: nextPlayer,
    scores,
    flippedCells: flipped,
    lastMove: [row, col],
    validMoves: nextMoves,
    passMessage: null,
  };
}

function signalEnd(
  winner: Player | 'draw' | null,
  playerColor: Player,
  cbs: OthelloCallbacks,
) {
  setTimeout(() => {
    if (winner === playerColor) cbs.onWin?.();
    else if (winner === 'draw') cbs.onDraw?.();
    else cbs.onLose?.();
  }, 600);
}
