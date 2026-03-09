// Core game types

export type Player = 'black' | 'white';
export type CellValue = Player | null;
export type Board = CellValue[][];
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameStatus = 'menu' | 'playing' | 'paused' | 'gameover';

export interface Scores {
  black: number;
  white: number;
}
