"use client";

import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { RefreshCw, ArrowLeft, Lightbulb, Clock, Check, Trophy } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import SiteLink from "@/components/SiteLink";
import { cn } from "@/lib/utils";

type Difficulty = "Easy" | "Medium" | "Hard";

type Level = {
  title: string;
  difficulty: Difficulty;
  pieces: number;
  image: string;
};

type Piece = {
  id: number;
  row: number;
  col: number;
};

const LEVELS: Level[] = [
  { title: "Jungle Safari", difficulty: "Easy", pieces: 12, image: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/d214be3a2eec48669b0d6116cd7b05af.jpg" },
  { title: "Under the Sea", difficulty: "Easy", pieces: 16, image: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/4dbe80f4053a453882a6a9489474c731.jpg" },
  { title: "Space Explorer", difficulty: "Medium", pieces: 20, image: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/3f1e065c99384c86bae5cca4aa5a6c3a.jpg" },
  { title: "Enchanted Forest", difficulty: "Medium", pieces: 24, image: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/27bba9a12d77446aae51417101033824.jpg" },
  { title: "Dino World", difficulty: "Hard", pieces: 30, image: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/ae0143ac0156490592d1459b52d50f86.jpg" },
  { title: "Candy Kingdom", difficulty: "Hard", pieces: 36, image: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/12dcffbecc134fd48be35257b9d37154.jpg" },
];

const MAX_COLS = 6;

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  Easy: "bg-accent/15 text-accent",
  Medium: "bg-primary/15 text-primary",
  Hard: "bg-secondary text-secondary-foreground",
};

function gridForPieces(pieces: number): { rows: number; cols: number } {
  const sqrt = Math.sqrt(pieces);
  let cols = Math.min(MAX_COLS, Math.ceil(sqrt));
  if (cols < 1) cols = 1;
  let rows = Math.ceil(pieces / cols);
  // Try to keep it tidy for the known counts.
  const known: Record<number, { rows: number; cols: number }> = {
    12: { rows: 3, cols: 4 },
    16: { rows: 4, cols: 4 },
    20: { rows: 4, cols: 5 },
    24: { rows: 4, cols: 6 },
    30: { rows: 5, cols: 6 },
    36: { rows: 6, cols: 6 },
  };
  if (known[pieces]) {
    rows = known[pieces].rows;
    cols = known[pieces].cols;
  }
  return { rows, cols };
}

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function GamePageInner() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();

  const levelParam = searchParams.get("level");
  const levelIndex = useMemo(() => {
    const parsed = Number(levelParam);
    if (Number.isInteger(parsed) && parsed >= 0 && parsed < LEVELS.length) return parsed;
    return 0;
  }, [levelParam]);

  const level = LEVELS[levelIndex] ?? LEVELS[0];
  const { rows, cols } = useMemo(() => gridForPieces(level.pieces), [level.pieces]);
  const totalSlots = rows * cols;

  const pieces: Piece[] = useMemo(() => {
    const list: Piece[] = [];
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        list.push({ id: row * cols + col, row, col });
      }
    }
    return list;
  }, [rows, cols]);

  const [mounted, setMounted] = useState(false);
  const [tray, setTray] = useState<number[]>([]);
  const [board, setBoard] = useState<(number | null)[]>([]);
  const [selectedPieceId, setSelectedPieceId] = useState<number | null>(null);
  const [shakeSlot, setShakeSlot] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [hintOn, setHintOn] = useState(false);
  const dragPieceRef = useRef<number | null>(null);

  const resetGame = () => {
    setTray(shuffleArray(pieces.map((p) => p.id)));
    setBoard(new Array(totalSlots).fill(null));
    setSelectedPieceId(null);
    setShakeSlot(null);
    setMoves(0);
    setSeconds(0);
    setCompleted(false);
    setHintOn(false);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setTray(shuffleArray(pieces.map((p) => p.id)));
    setBoard(new Array(totalSlots).fill(null));
    setSelectedPieceId(null);
    setShakeSlot(null);
    setMoves(0);
    setSeconds(0);
    setCompleted(false);
    setHintOn(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, levelIndex]);

  useEffect(() => {
    if (!mounted || completed) return;
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [mounted, completed]);

  const placedCount = board.filter((slot) => slot !== null).length;

  useEffect(() => {
    if (mounted && totalSlots > 0 && placedCount === totalSlots && !completed) {
      setCompleted(true);
    }
  }, [placedCount, totalSlots, mounted, completed]);

  const bgSize = `${cols * 100}% ${rows * 100}%`;
  const bgPosition = (piece: Piece): string => {
    const x = cols > 1 ? (piece.col / (cols - 1)) * 100 : 0;
    const y = rows > 1 ? (piece.row / (rows - 1)) * 100 : 0;
    return `${x}% ${y}%`;
  };

  const attemptPlace = (pieceId: number, slotIndex: number) => {
    if (completed) return;
    if (board[slotIndex] !== null) return;
    const piece = pieces.find((p) => p.id === pieceId);
    if (!piece) return;

    if (pieceId === slotIndex) {
      setBoard((prev) => {
        const next = [...prev];
        next[slotIndex] = pieceId;
        return next;
      });
      setTray((prev) => prev.filter((id) => id !== pieceId));
      setMoves((m) => m + 1);
      setSelectedPieceId(null);
    } else {
      setMoves((m) => m + 1);
      setShakeSlot(slotIndex);
      setSelectedPieceId(null);
      setTimeout(() => setShakeSlot(null), 300);
    }
  };

  const handleDragStart = (pieceId: number) => {
    dragPieceRef.current = pieceId;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, slotIndex: number) => {
    e.preventDefault();
    const dataId = e.dataTransfer.getData("text/plain");
    const pieceId = dataId ? Number(dataId) : dragPieceRef.current;
    dragPieceRef.current = null;
    if (pieceId === null || Number.isNaN(pieceId)) return;
    attemptPlace(pieceId, slotIndex);
  };

  const handleSlotClick = (slotIndex: number) => {
    if (board[slotIndex] !== null) return;
    if (selectedPieceId === null) return;
    attemptPlace(selectedPieceId, slotIndex);
  };

  const handleTrayClick = (pieceId: number) => {
    setSelectedPieceId((prev) => (prev === pieceId ? null : pieceId));
  };

  if (!mounted) {
    return (
      <main className="bg-background text-foreground">
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="h-10 w-48 animate-pulse rounded-lg bg-muted" />
          <div className="mt-8 aspect-video w-full max-w-2xl animate-pulse rounded-2xl bg-muted" />
        </section>
      </main>
    );
  }

  return (
    <main className="bg-background text-foreground">
      <Reveal>
        <section className="relative overflow-hidden bg-mesh">
          <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
            <SiteLink
              href="/home-level-select"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {t("nav.levels")}
            </SiteLink>

            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{level.title}</h1>
                <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", DIFFICULTY_STYLES[level.difficulty])}>
                  {level.difficulty}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-muted-foreground">
                <span className="glass inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5">
                  <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
                  {formatTime(seconds)}
                </span>
                <span className="glass inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5">
                  {moves} Moves
                </span>
                <span className="glass inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5">
                  {totalSlots - placedCount} / {totalSlots} left
                </span>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_1fr]">
          {/* Board */}
          <div className="relative">
            <div className="relative mx-auto aspect-video w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-glow">
              {hintOn && (
                <img
                  src={level.image}
                  alt={level.title}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-15"
                />
              )}
              <div
                className="grid h-full w-full"
                style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
              >
                {Array.from({ length: totalSlots }, (_, slotIndex) => {
                  const piece = pieces.find((p) => p.id === slotIndex);
                  const filledId = board[slotIndex];
                  const isFilled = filledId !== null && filledId !== undefined;
                  if (!piece) return null;
                  return (
                    <div
                      key={slotIndex}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, slotIndex)}
                      onClick={() => handleSlotClick(slotIndex)}
                      className={cn(
                        "relative border border-dashed border-border transition-transform duration-200",
                        !isFilled && "cursor-pointer",
                        shakeSlot === slotIndex && "animate-[shake_0.3s_ease-in-out]",
                      )}
                    >
                      {!isFilled && (
                        <div
                          className="absolute inset-0 opacity-20"
                          style={{
                            backgroundImage: `url(${level.image})`,
                            backgroundSize: bgSize,
                            backgroundPosition: bgPosition(piece),
                          }}
                        />
                      )}
                      {isFilled && (
                        <div
                          className="absolute inset-0 scale-100 ring-2 ring-primary transition-transform duration-300"
                          style={{
                            backgroundImage: `url(${level.image})`,
                            backgroundSize: bgSize,
                            backgroundPosition: bgPosition(piece),
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {completed && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-foreground/20 p-4">
                <div className="glass-strong flex max-w-sm flex-col items-center gap-4 rounded-2xl p-8 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Trophy className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <h2 className="font-display text-2xl font-bold tracking-tight">Puzzle complete!</h2>
                  <p className="text-sm text-muted-foreground">
                    {moves} moves · {formatTime(seconds)}
                  </p>
                  <div className="flex w-full flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={resetGame}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-card-foreground transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <RefreshCw className="h-4 w-4" aria-hidden="true" />
                      Play again
                    </button>
                    <SiteLink
                      href={`/results?level=${levelIndex}&time=${seconds}&moves=${moves}`}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <Check className="h-4 w-4" aria-hidden="true" />
                      View results
                    </SiteLink>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: controls + tray */}
          <div className="glass flex flex-col gap-6 rounded-2xl p-6">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={resetGame}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-card-foreground transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Restart
              </button>
              <button
                type="button"
                onClick={() => setHintOn((v) => !v)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg",
                  hintOn ? "bg-accent text-accent-foreground" : "border border-border bg-card text-card-foreground",
                )}
              >
                <Lightbulb className="h-4 w-4" aria-hidden="true" />
                Hint
              </button>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
                Pieces ({tray.length} left)
              </h3>
              <div className="flex flex-wrap gap-2">
                {tray.map((pieceId) => {
                  const piece = pieces.find((p) => p.id === pieceId);
                  if (!piece) return null;
                  return (
                    <div
                      key={pieceId}
                      draggable
                      onDragStart={(e) => {
                        handleDragStart(pieceId);
                        e.dataTransfer.setData("text/plain", String(pieceId));
                      }}
                      onClick={() => handleTrayClick(pieceId)}
                      className={cn(
                        "h-16 w-16 cursor-grab rounded-lg border border-border bg-card transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg active:cursor-grabbing",
                        selectedPieceId === pieceId && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                      )}
                      style={{
                        backgroundImage: `url(${level.image})`,
                        backgroundSize: bgSize,
                        backgroundPosition: bgPosition(piece),
                      }}
                    />
                  );
                })}
                {tray.length === 0 && !completed && (
                  <p className="text-sm text-muted-foreground">All pieces placed!</p>
                )}
              </div>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Drag a piece onto the board, or tap a piece then tap an empty slot to place it.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={null}>
      <GamePageInner />
    </Suspense>
  );
}
