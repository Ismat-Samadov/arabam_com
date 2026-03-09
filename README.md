# Othello

A full-stack browser implementation of the classic Othello (Reversi) strategy board game, built with Next.js, TypeScript, and Tailwind CSS. Play against an AI opponent across three difficulty levels.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-purple)

---

## Features

### Gameplay
- **Complete Othello rules** — valid move detection, multi-directional disc flipping, forced pass, game-over detection
- **AI opponent** with three difficulty tiers (see [AI Opponent](#ai-opponent) below)
- **Colour selection** — play as Black (moves first) or White
- **Win / lose / draw detection** with high-score tracking per difficulty level
- **Pause / resume** at any time (keyboard: `Space`, or the pause button)

### Visuals & Animations
- Dark neon / glassmorphism theme with emerald accents
- Disc placement: spring pop-in animation
- Disc flips: staggered coin-flip animation (scaleX 0 → 1) per flipped piece
- Score panels pulse on the active player's turn; score numbers animate on change
- Ambient background glows, board inner shadow, last-move highlight
- Smooth page transitions between menu ↔ game using Framer Motion

### Sound
- Generated entirely via the **Web Audio API** — no audio files required
- Sound effects: place, flip, pass, win, lose, draw
- Toggle on / off with the speaker button in the HUD

### UI / UX
- Fully responsive — desktop, tablet, and mobile (touch-friendly)
- Valid move hints (small dot) shown throughout your turn
- AI "thinking" overlay with animated dots
- Pass notifications auto-dismiss after 3 seconds
- High scores persisted to `localStorage` per difficulty level
- Keyboard shortcuts: `Space` = pause / resume, `Esc` = resume from pause

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) — App Router |
| Language | TypeScript 5 (strict mode) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Animations | [Framer Motion 12](https://www.framer.com/motion/) |
| Sound | Web Audio API (no audio files) |
| State | React hooks (`useState`, `useEffect`, `useCallback`, `useRef`) |
| Storage | `localStorage` (high scores) |
| Deploy | [Vercel](https://vercel.com) (zero config) |

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
# → http://localhost:3000

# Type-check
npx tsc --noEmit

# Production build
npm run build
npm start
```

---

## Project Structure

```
othello/
├── app/
│   ├── icon.svg           # SVG favicon (Othello board with 4 discs)
│   ├── globals.css         # Tailwind v4 import + global resets
│   ├── layout.tsx          # Root layout with metadata & viewport
│   └── page.tsx            # Main page — orchestrates all game state
│
├── components/
│   ├── game/
│   │   ├── Board.tsx       # 8×8 CSS grid board with disc rendering
│   │   ├── Cell.tsx        # Individual cell — hints, hover, click
│   │   ├── Disc.tsx        # Animated disc (placement + flip animation)
│   │   ├── GameHUD.tsx     # Scores, timer, turn indicator, controls
│   │   ├── EndScreen.tsx   # Win/lose/draw overlay with stats
│   │   ├── PauseMenu.tsx   # Pause overlay
│   │   └── Menu.tsx        # Main menu — difficulty & colour picker
│   └── ui/
│       └── Button.tsx      # Reusable button with hover/tap animations
│
├── hooks/
│   ├── useOthello.ts       # All game state; AI triggered via useEffect
│   ├── useSound.ts         # Sound on/off + play(name) helper
│   ├── useHighScore.ts     # localStorage read/write per difficulty
│   └── useTimer.ts         # mm:ss game timer
│
└── lib/
    ├── types.ts             # Shared types (Player, Board, Difficulty, …)
    ├── othello.ts           # Pure game logic (no side effects)
    ├── ai.ts                # AI: random / greedy / minimax α-β
    └── sounds.ts            # Web Audio API tone generation
```

---

## How to Play

1. Choose a **difficulty** and whether to play as **Black** (moves first) or **White**
2. Click **Play Game**
3. On your turn, valid moves are shown as small green dots — click any to place your disc
4. All opponent discs sandwiched between your new piece and an existing one **flip** to your colour
5. If you have no valid moves your turn is **skipped automatically**
6. The game ends when neither player can move — **most discs wins**

---

## AI Opponent

| Difficulty | Strategy | Depth |
|---|---|---|
| **Easy** | Random — picks a uniformly random valid move | 0 |
| **Medium** | Greedy — evaluates all moves with a positional weight matrix and picks the highest single-ply score | 1 |
| **Hard** | Minimax with **alpha-beta pruning** using a composite heuristic (positional weights + mobility + disc count) | 5 |

The positional weight matrix heavily values corners (+100) and penalises cells adjacent to corners (−20 to −50), matching standard Othello strategy. The AI introduces a short thinking delay (0.5 s / 0.9 s / 1.4 s) to feel natural.

---

## Deployment

The project is Vercel-ready with zero extra configuration:

```bash
# Deploy via CLI
npx vercel
```

Or connect your GitHub repository to [vercel.com](https://vercel.com) for automatic deploys on every push to `main`.

---

## License

MIT
