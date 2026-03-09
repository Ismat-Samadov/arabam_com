// Core Othello game logic

import { Board, CellValue, Player } from './types';

// All 8 directions to check for flanking
const DIRECTIONS: [number, number][] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

/** Create the standard starting board with 4 center discs */
export function createInitialBoard(): Board {
  const board: Board = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null) as CellValue[]);
  board[3][3] = 'white';
  board[3][4] = 'black';
  board[4][3] = 'black';
  board[4][4] = 'white';
  return board;
}

/** Return all cells that would be flipped if player places at (row, col) */
export function getFlipsForMove(
  board: Board,
  row: number,
  col: number,
  player: Player,
): [number, number][] {
  if (board[row][col] !== null) return [];

  const opponent: Player = player === 'black' ? 'white' : 'black';
  const flips: [number, number][] = [];

  for (const [dr, dc] of DIRECTIONS) {
    const line: [number, number][] = [];
    let r = row + dr;
    let c = col + dc;

    // Walk in this direction while we see opponent discs
    while (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] === opponent) {
      line.push([r, c]);
      r += dr;
      c += dc;
    }

    // If we ended on the player's own disc, this line of opponents gets flipped
    if (
      line.length > 0 &&
      r >= 0 && r < 8 &&
      c >= 0 && c < 8 &&
      board[r][c] === player
    ) {
      flips.push(...line);
    }
  }

  return flips;
}

/** Returns true if placing at (row, col) is a valid move */
export function isValidMove(
  board: Board,
  row: number,
  col: number,
  player: Player,
): boolean {
  return board[row][col] === null && getFlipsForMove(board, row, col, player).length > 0;
}

/** Get all valid moves for the given player */
export function getValidMoves(board: Board, player: Player): [number, number][] {
  const moves: [number, number][] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (isValidMove(board, r, c, player)) {
        moves.push([r, c]);
      }
    }
  }
  return moves;
}

/** Apply a move and return the new board + list of flipped cells */
export function makeMove(
  board: Board,
  row: number,
  col: number,
  player: Player,
): { board: Board; flipped: [number, number][] } {
  const flips = getFlipsForMove(board, row, col, player);
  if (flips.length === 0) return { board, flipped: [] };

  const newBoard: Board = board.map(r => [...r]);
  newBoard[row][col] = player;
  for (const [r, c] of flips) {
    newBoard[r][c] = player;
  }

  return { board: newBoard, flipped: flips };
}

/** Count discs for each player */
export function getScore(board: Board): { black: number; white: number } {
  let black = 0;
  let white = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell === 'black') black++;
      else if (cell === 'white') white++;
    }
  }
  return { black, white };
}

/** True when neither player can move */
export function isGameOver(board: Board): boolean {
  return (
    getValidMoves(board, 'black').length === 0 &&
    getValidMoves(board, 'white').length === 0
  );
}

/** Return the winner once the game is over */
export function getWinner(board: Board): Player | 'draw' | null {
  if (!isGameOver(board)) return null;
  const { black, white } = getScore(board);
  if (black > white) return 'black';
  if (white > black) return 'white';
  return 'draw';
}
