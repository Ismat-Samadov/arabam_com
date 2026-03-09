// AI opponent logic — Easy (random), Medium (greedy), Hard (minimax + α-β)

import { Board, Player, Difficulty } from './types';
import { getValidMoves, makeMove, getScore, isGameOver } from './othello';

/**
 * Positional weight matrix.
 * Corners are extremely valuable; cells adjacent to corners are dangerous.
 */
const POSITION_WEIGHTS: readonly (readonly number[])[] = [
  [100, -20,  10,   5,   5,  10, -20, 100],
  [-20, -50,  -2,  -2,  -2,  -2, -50, -20],
  [ 10,  -2,  -1,  -1,  -1,  -1,  -2,  10],
  [  5,  -2,  -1,  -1,  -1,  -1,  -2,   5],
  [  5,  -2,  -1,  -1,  -1,  -1,  -2,   5],
  [ 10,  -2,  -1,  -1,  -1,  -1,  -2,  10],
  [-20, -50,  -2,  -2,  -2,  -2, -50, -20],
  [100, -20,  10,   5,   5,  10, -20, 100],
];

/** Heuristic score from `player`'s perspective */
function evaluateBoard(board: Board, player: Player): number {
  const opponent: Player = player === 'black' ? 'white' : 'black';
  let score = 0;

  // Weighted positional score
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === player)   score += POSITION_WEIGHTS[r][c];
      else if (board[r][c] === opponent) score -= POSITION_WEIGHTS[r][c];
    }
  }

  // Mobility bonus: having more moves is better
  const myMoves  = getValidMoves(board, player).length;
  const oppMoves = getValidMoves(board, opponent).length;
  score += 10 * (myMoves - oppMoves);

  // Raw disc count (small weight — positional matters more)
  const { black, white } = getScore(board);
  const myDiscs  = player === 'black' ? black : white;
  const oppDiscs = player === 'black' ? white : black;
  score += myDiscs - oppDiscs;

  return score;
}

/** Minimax with alpha-beta pruning */
function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  humanPlayer: Player,
): number {
  if (depth === 0 || isGameOver(board)) {
    return evaluateBoard(board, aiPlayer);
  }

  const currentPlayer = isMaximizing ? aiPlayer : humanPlayer;
  const moves = getValidMoves(board, currentPlayer);

  // No moves → forced pass, flip maximizing flag
  if (moves.length === 0) {
    return minimax(board, depth - 1, alpha, beta, !isMaximizing, aiPlayer, humanPlayer);
  }

  if (isMaximizing) {
    let maxScore = -Infinity;
    for (const [r, c] of moves) {
      const { board: nb } = makeMove(board, r, c, currentPlayer);
      const score = minimax(nb, depth - 1, alpha, beta, false, aiPlayer, humanPlayer);
      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break; // prune
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (const [r, c] of moves) {
      const { board: nb } = makeMove(board, r, c, currentPlayer);
      const score = minimax(nb, depth - 1, alpha, beta, true, aiPlayer, humanPlayer);
      minScore = Math.min(minScore, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break; // prune
    }
    return minScore;
  }
}

/** Return the best move for the AI, or null if no moves available */
export function getAIMove(
  board: Board,
  aiPlayer: Player,
  difficulty: Difficulty,
): [number, number] | null {
  const moves = getValidMoves(board, aiPlayer);
  if (moves.length === 0) return null;

  // Easy: purely random
  if (difficulty === 'easy') {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  // Medium: one-ply greedy using the heuristic
  if (difficulty === 'medium') {
    let bestScore = -Infinity;
    let bestMove = moves[0];
    for (const [r, c] of moves) {
      const { board: nb } = makeMove(board, r, c, aiPlayer);
      const score = evaluateBoard(nb, aiPlayer);
      if (score > bestScore) {
        bestScore = score;
        bestMove = [r, c];
      }
    }
    return bestMove;
  }

  // Hard: minimax depth-6 with α-β pruning
  const humanPlayer: Player = aiPlayer === 'black' ? 'white' : 'black';
  let bestScore = -Infinity;
  let bestMove = moves[0];

  for (const [r, c] of moves) {
    const { board: nb } = makeMove(board, r, c, aiPlayer);
    const score = minimax(nb, 5, -Infinity, Infinity, false, aiPlayer, humanPlayer);
    if (score > bestScore) {
      bestScore = score;
      bestMove = [r, c];
    }
  }

  return bestMove;
}
