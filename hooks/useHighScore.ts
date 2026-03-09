'use client';

import { useState, useCallback } from 'react';
import { Difficulty } from '@/lib/types';

type HighScores = Record<Difficulty, number>;

const STORAGE_KEY = 'othello_highscores';

function loadScores(): HighScores {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HighScores) : { easy: 0, medium: 0, hard: 0 };
  } catch {
    return { easy: 0, medium: 0, hard: 0 };
  }
}

export function useHighScore() {
  // Lazily initialize from localStorage (client-only)
  const [highScores, setHighScores] = useState<HighScores>(() => {
    if (typeof window === 'undefined') return { easy: 0, medium: 0, hard: 0 };
    return loadScores();
  });

  const updateHighScore = useCallback((score: number, difficulty: Difficulty) => {
    setHighScores(prev => {
      if (score <= (prev[difficulty] ?? 0)) return prev;
      const updated = { ...prev, [difficulty]: score };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }
      return updated;
    });
  }, []);

  return { highScores, updateHighScore };
}
