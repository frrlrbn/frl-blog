"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type Choice = "rock" | "paper" | "scissors";

const CHOICES: Choice[] = ["rock", "paper", "scissors"];

function resultOf(a: Choice, b: Choice): "win" | "lose" | "draw" {
  if (a === b) return "draw";
  if (
    (a === "rock" && b === "scissors") ||
    (a === "paper" && b === "rock") ||
    (a === "scissors" && b === "paper")
  )
    return "win";
  return "lose";
}

// 11x11 pixelated-dot silhouettes for rock, paper, and scissors
// Each string row uses '1' for a filled dot and '0' for empty.
const DOT_MAP: Record<Choice, string[]> = {
  // A rounded, irregular "fist/rock" blob
  rock: [
    "00011111000",
    "00111111100",
    "01111111110",
    "11111111111",
    "11111101111",
    "11111000111",
    "11111101111",
    "11111111111",
    "01111111110",
    "00111111100",
    "00011111000",
  ],
  // A flat rectangular "paper" sheet with rounded corners
  paper: [
    "00111111100",
    "01111111110",
    "11111111111",
    "11111111111",
    "11111111111",
    "11111111111",
    "11111111111",
    "11111111111",
    "11111111111",
    "01111111110",
    "00111111100",
  ],
  // Crossed blades with two ring-like handles at the bottom
  scissors: [
    "10000000001",
    "01000000010",
    "00100000100",
    "00010001000",
    "00001010000",
    "00000100000",
    "00001010000",
    "00010001000",
    "01110001110",
    "01010001010",
    "01110001110",
  ],
};

function DotIcon({
  choice,
  active = false,
  size = 84,
  colorClass = "text-black dark:text-white",
}: {
  choice: Choice;
  active?: boolean;
  size?: number;
  colorClass?: string;
}) {
  const dots = DOT_MAP[choice];
  const cols = dots[0].length;
  const rows = dots.length;
  const gap = 2; // px between dots
  const r = 3; // dot radius
  const w = cols * r * 2 + (cols - 1) * gap;
  const h = rows * r * 2 + (rows - 1) * gap;
  const scale = size / Math.max(w, h);
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${w} ${h}`}
      className={`${colorClass} ${active ? "animate-breathe" : ""}`}
      style={{ imageRendering: "pixelated" as any }}
      aria-hidden
    >
      {dots.map((row, y) =>
        row.split("").map((c, x) =>
          c === "1" ? (
            <circle
              key={`${x}-${y}`}
              cx={x * (2 * r + gap) + r}
              cy={y * (2 * r + gap) + r}
              r={r}
              fill="currentColor"
            />
          ) : null
        )
      )}
      <style jsx>{`
        @keyframes breathe {
          0%, 100% { opacity: 1; transform: translateZ(0); }
          50% { opacity: 0.85; }
        }
        .animate-breathe { animation: breathe 1.8s ease-in-out infinite; }
      `}</style>
    </svg>
  );
}

export default function RpsGame() {
  const [player, setPlayer] = useState<Choice | null>(null);
  const [bot, setBot] = useState<Choice | null>(null);
  const [shuffling, setShuffling] = useState(false);
  const [score, setScore] = useState({ you: 0, bot: 0 });
  const [outcome, setOutcome] = useState<null | "win" | "lose" | "draw">(null);
  const shuffleRef = useRef<number | null>(null);

  const startRound = (c: Choice) => {
    if (shuffling) return;
    setPlayer(c);
    setOutcome(null);
    setShuffling(true);
    setBot(null);

    // Shuffle animation: rapidly change bot choice then settle.
    let i = 0;
    shuffleRef.current && cancelAnimationFrame(shuffleRef.current);
    const start = performance.now();

    const tick = (t: number) => {
      const elapsed = t - start;
      // change ~every 120ms
      if (elapsed > i * 120) {
        const rand = CHOICES[Math.floor(Math.random() * CHOICES.length)];
        setBot(rand);
        i++;
      }
      if (elapsed < 900) {
        shuffleRef.current = requestAnimationFrame(tick);
      } else {
        // Final choice
        const final = CHOICES[Math.floor(Math.random() * CHOICES.length)];
        setBot(final);
        const res = resultOf(c, final);
        setOutcome(res);
        setShuffling(false);
        setScore((s) => ({ you: s.you + (res === "win" ? 1 : 0), bot: s.bot + (res === "lose" ? 1 : 0) }));
      }
    };

    shuffleRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => { if (shuffleRef.current) cancelAnimationFrame(shuffleRef.current); }, []);

  const statusText = useMemo(() => {
    if (shuffling) return "Bot is thinking...";
    if (!player || !bot || outcome == null) return "Choose your move";
    return outcome === "win" ? "You win!" : outcome === "lose" ? "You lose" : "Draw";
  }, [shuffling, player, bot, outcome]);

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Pixelated dotted backdrop */}
      <div
        className="relative rounded-xl border border-black/10 dark:border-white/10 p-4 sm:p-5 bg-white/40 dark:bg-black/20 overflow-hidden"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-30 dark:opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(currentColor 1px, transparent 1px), radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "12px 12px, 12px 12px",
            backgroundPosition: "0 0, 6px 6px",
            color: "#000",
            mixBlendMode: "multiply",
          }}
        />

        {/* Scoreboard */}
        <div className="relative z-10 mb-4 flex items-center justify-between text-xs opacity-70">
          <span>You: <strong className="opacity-100">{score.you}</strong></span>
          <span>Bot: <strong className="opacity-100">{score.bot}</strong></span>
        </div>

        {/* Arena */}
        <div className="relative z-10 grid grid-cols-2 items-center gap-3 sm:gap-4">
          <div className="flex flex-col items-center gap-2">
            <DotIcon choice={player ?? "rock"} active={!!player && !shuffling} />
            <span className="text-xs opacity-70">You</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className={`${shuffling ? "animate-shuffle" : ""}`}>
              <DotIcon choice={bot ?? "scissors"} active={shuffling} />
            </div>
            <span className="text-xs opacity-70">Bot</span>
          </div>
        </div>

        {/* Status */}
        <div className="relative z-10 mt-4 text-sm font-medium text-black/80 dark:text-white/80 text-center">
          <span className="inline-block rounded-md border border-black/10 dark:border-white/10 px-3 py-1 bg-black/5 dark:bg-white/10">
            {statusText}
          </span>
        </div>

        {/* Controls */}
        <div className="relative z-10 mt-4 grid grid-cols-3 gap-2">
          {CHOICES.map((c) => (
            <button
              key={c}
              onClick={() => startRound(c)}
              disabled={shuffling}
              className={`group rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 px-2 py-2 sm:px-3 sm:py-3 hover:bg-black/10 dark:hover:bg-white/15 transition ${
                shuffling ? "opacity-60 cursor-not-allowed" : ""
              }`}
              aria-label={`Choose ${c}`}
            >
              <div className="flex flex-col items-center gap-1">
                <DotIcon choice={c} size={64} colorClass="text-black dark:text-white" />
                <span className="text-[10px] sm:text-xs uppercase tracking-wide opacity-70">{c}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Confetti pixels when winning */}
        {outcome === "win" && !shuffling ? (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <PixelConfetti />
          </div>
        ) : null}

        <style jsx>{`
          @keyframes shuffleJitter { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-2px) } }
          .animate-shuffle { animation: shuffleJitter .3s ease-in-out infinite; }
        `}</style>
      </div>
    </div>
  );
}

function PixelConfetti() {
  // Render a few random pixel squares that float up and fade
  const pieces = useMemo(() =>
    Array.from({ length: 24 }).map((_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.4,
      size: 4 + Math.floor(Math.random() * 4),
      hue: Math.floor(Math.random() * 360),
      duration: 1.2 + Math.random() * 0.8,
    })), []);
  return (
    <div className="absolute inset-0">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute block"
          style={{
            left: `${p.left}%`,
            bottom: `-8px`,
            width: p.size,
            height: p.size,
            background: `hsl(${p.hue} 80% 55%)`,
            animation: `rise ${p.duration}s ease-out ${p.delay}s forwards`,
            imageRendering: "pixelated",
          }}
        />
      ))}
      <style jsx>{`
        @keyframes rise {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-140%) scale(1.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
