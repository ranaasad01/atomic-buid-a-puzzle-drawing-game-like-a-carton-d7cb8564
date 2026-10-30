"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { Star, Sparkles, Clock, ArrowUpDown, Activity, Check, Home, ArrowRight } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { staggerContainer } from "@/lib/motion";

// Sample run data (no backend yet) -- stands in for a real completed session.
const STATS = {
  timeSeconds: 184,
  moves: 47,
  difficultyLabel: "Medium",
  piecesTotal: 24,
};

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function computeScore(moves: number, timeSeconds: number): number {
  const base = 1000;
  const movePenalty = moves * 5;
  const timePenalty = Math.floor(timeSeconds / 2);
  return Math.max(0, base - movePenalty - timePenalty);
}

const CONFETTI_COUNT = 22;
const CONFETTI_PIECES = Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
  id: i,
  left: (i * 13 + 5) % 100,
  delay: (i % 8) * 0.08,
  duration: 1.9 + (i % 5) * 0.22,
  rotate: (i * 47) % 360,
  colorClass: i % 3 === 0 ? "bg-primary" : i % 3 === 1 ? "bg-accent" : "bg-secondary",
  shape: i % 4 === 0 ? "rounded-full" : "rounded-sm",
}));

const bounceIn: Variants = {
  hidden: { opacity: 0, scale: 0.5, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 18 },
  },
};

export default function ResultsPage() {
  const t = useTranslations();
  const score = computeScore(STATS.moves, STATS.timeSeconds);
  const timeLabel = formatTime(STATS.timeSeconds);

  return (
    <main className="flex flex-col">
      {/* Celebration hero */}
      <Reveal>
        <section className="relative overflow-hidden bg-mesh">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            {CONFETTI_PIECES.map((piece) => (
              <motion.span
                key={piece.id}
                className={`absolute top-0 h-3 w-3 ${piece.colorClass} ${piece.shape}`}
                style={{ left: `${piece.left}%` }}
                initial={{ opacity: 0, y: -40, rotate: 0 }}
                animate={{ opacity: [0, 1, 1, 0], y: 440, rotate: piece.rotate }}
                transition={{
                  duration: piece.duration,
                  delay: piece.delay,
                  ease: "easeIn",
                }}
              />
            ))}
          </div>

          <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 py-24 text-center md:py-32">
            <motion.div
              variants={bounceIn}
              initial="hidden"
              animate="visible"
              className="glass-strong mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-foreground"
            >
              <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
              {t("results.badge")}
            </motion.div>

            <motion.h1
              variants={bounceIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.08 }}
              className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl"
            >
              {t("results.headingPrefix")}{" "}
              <span className="text-gradient">{t("results.headingHighlight")}</span>
            </motion.h1>

            <motion.p
              variants={bounceIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.16 }}
              className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
            >
              {t("results.subtitle", { pieces: STATS.piecesTotal })}
            </motion.p>

            <motion.div
              variants={bounceIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.24 }}
              className="mt-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-brand shadow-glow"
            >
              <Star className="h-9 w-9 text-primary-foreground" aria-hidden="true" />
            </motion.div>
          </div>
        </section>
      </Reveal>

      {/* Stats summary */}
      <Reveal delay={0.05}>
        <section className="mx-auto w-full max-w-5xl px-6 py-16 md:py-20">
          <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("results.summaryTitle")}
          </h2>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-4"
          >
            <motion.div
              variants={bounceIn}
              className="glass surface-elevated rounded-2xl border border-border p-6 text-center"
            >
              <Clock className="mx-auto mb-3 h-6 w-6 text-primary" aria-hidden="true" />
              <div className="text-2xl font-bold text-foreground sm:text-3xl">{timeLabel}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {t("results.stats.time.label")}
              </div>
            </motion.div>

            <motion.div
              variants={bounceIn}
              className="glass surface-elevated rounded-2xl border border-border p-6 text-center"
            >
              <ArrowUpDown className="mx-auto mb-3 h-6 w-6 text-primary" aria-hidden="true" />
              <div className="text-2xl font-bold text-foreground sm:text-3xl">{STATS.moves}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {t("results.stats.moves.label")}
              </div>
            </motion.div>

            <motion.div
              variants={bounceIn}
              className="glass surface-elevated rounded-2xl border border-border p-6 text-center"
            >
              <Activity className="mx-auto mb-3 h-6 w-6 text-primary" aria-hidden="true" />
              <div className="text-2xl font-bold text-foreground sm:text-3xl">
                {STATS.difficultyLabel}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {t("results.stats.difficulty.label")}
              </div>
            </motion.div>

            <motion.div
              variants={bounceIn}
              className="glass surface-elevated rounded-2xl border border-border p-6 text-center shadow-glow"
            >
              <Star className="mx-auto mb-3 h-6 w-6 text-primary" aria-hidden="true" />
              <div className="text-2xl font-bold text-gradient sm:text-3xl">{score}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {t("results.stats.score.label")}
              </div>
            </motion.div>
          </motion.div>
        </section>
      </Reveal>

      {/* Next actions */}
      <Reveal delay={0.1}>
        <section className="mx-auto w-full max-w-4xl px-6 pb-24 md:pb-32">
          <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-glow sm:p-12">
            <h2 className="text-2xl font-bold tracking-tight text-card-foreground sm:text-3xl">
              {t("results.nextTitle")}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-pretty leading-relaxed text-muted-foreground">
              {t("results.nextSubtitle")}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/game"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
              >
                <Check className="h-4 w-4" aria-hidden="true" />
                {t("results.actions.playAgain")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-secondary px-6 py-3 text-sm font-semibold text-foreground transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
              >
                <Home className="h-4 w-4" aria-hidden="true" />
                {t("results.actions.goHome")}
              </Link>

              <button
                type="button"
                disabled
                className="relative inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-border bg-muted px-6 py-3 text-sm font-semibold text-muted-foreground opacity-70"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {t("results.actions.leaderboard")}
                <span className="ml-1 rounded-full bg-accent/20 px-2 py-0.5 text-xs font-medium text-accent-foreground">
                  {t("results.actions.leaderboardBadge")}
                </span>
              </button>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}