"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Lock, Star, Puzzle, Play, CheckCircle2, ArrowRight, Sparkles, MousePointerClick, Shuffle } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

type LevelItem = {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  pieces: number;
  image: string;
  locked: boolean;
};

type StepItem = {
  title: string;
  description: string;
};

const LEVEL_IMAGES = [
  "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/d214be3a2eec48669b0d6116cd7b05af.jpg",
  "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/4dbe80f4053a453882a6a9489474c731.jpg",
  "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/3f1e065c99384c86bae5cca4aa5a6c3a.jpg",
  "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/27bba9a12d77446aae51417101033824.jpg",
  "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/ae0143ac0156490592d1459b52d50f86.jpg",
  "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/12dcffbecc134fd48be35257b9d37154.jpg",
];

const STEP_ICONS = [MousePointerClick, Shuffle, Puzzle, CheckCircle2];

const DIFFICULTY_STYLES: Record<LevelItem["difficulty"], string> = {
  Easy: "bg-accent/15 text-accent",
  Medium: "bg-primary/15 text-primary",
  Hard: "bg-secondary text-secondary-foreground",
};

function starsForIndex(index: number, locked: boolean): number {
  if (locked) return 0;
  return (index % 3) + 1;
}

export default function HomeLevelSelectPage() {
  const t = useTranslations();
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const rawLevels = t.raw("home.levels.items");
  const levels: LevelItem[] = (Array.isArray(rawLevels) ? rawLevels : []).map((lvl, i) => ({
    title: lvl?.title ?? "",
    difficulty: (lvl?.difficulty as LevelItem["difficulty"]) ?? "Easy",
    pieces: Number(lvl?.pieces) || 12,
    image: LEVEL_IMAGES[i % LEVEL_IMAGES.length],
    locked: Boolean(lvl?.locked),
  }));

  const rawSteps = t.raw("home.steps.items");
  const steps: StepItem[] = (Array.isArray(rawSteps) ? rawSteps : []).map((s) => ({
    title: s?.title ?? "",
    description: s?.description ?? "",
  }));

  const filters = useMemo(
    () => [
      { key: "all", label: t("home.filters.all") },
      { key: "Easy", label: t("home.filters.easy") },
      { key: "Medium", label: t("home.filters.medium") },
      { key: "Hard", label: t("home.filters.hard") },
    ],
    [t]
  );

  const filteredLevels = levels.filter(
    (lvl) => activeFilter === "all" || lvl.difficulty === activeFilter
  );

  const completedCount = levels.filter((lvl, i) => !lvl.locked && starsForIndex(i, lvl.locked) >= 1).length;
  const totalStars = levels.reduce((sum, lvl, i) => sum + starsForIndex(i, lvl.locked), 0);
  const totalLevels = levels.length;
  const progressPct = totalLevels > 0 ? Math.round((completedCount / totalLevels) * 100) : 0;

  return (
    <main className="bg-background text-foreground">
      <Reveal className="relative overflow-hidden bg-mesh">
        <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {t("home.hero.eyebrow")}
              </span>
              <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                {t("home.hero.title")}
              </h1>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                {t("home.hero.subtitle")}
              </p>
            </div>

            <div className="glass-strong flex w-full max-w-sm shrink-0 flex-col gap-4 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t("home.hero.progressLabel")}</span>
                <span className="text-sm font-semibold text-foreground">{progressPct}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-brand transition-all duration-500 ease-out"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Puzzle className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span>
                    {completedCount}/{totalLevels} {t("home.hero.statsLevels")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Star className="h-4 w-4 fill-primary text-primary" aria-hidden="true" />
                  <span>
                    {totalStars} {t("home.hero.statsStars")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
          <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                {t("home.levels.title")}
              </h2>
              <p className="mt-2 text-muted-foreground">{t("home.levels.subtitle")}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setActiveFilter(f.key)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ease-out",
                    activeFilter === f.key
                      ? "border-primary bg-primary text-primary-foreground shadow-glow"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLevels.map((lvl, i) => {
              const stars = starsForIndex(levels.indexOf(lvl), lvl.locked);
              const cardInner = (
                <>
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={lvl.image}
                      alt={lvl.title}
                      className={cn(
                        "h-full w-full object-cover transition-transform duration-500 ease-out",
                        !lvl.locked && "group-hover:scale-105",
                        lvl.locked && "grayscale"
                      )}
                    />
                    {lvl.locked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                        <Lock className="h-8 w-8 text-foreground/70" aria-hidden="true" />
                      </div>
                    )}
                    <span
                      className={cn(
                        "absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold",
                        DIFFICULTY_STYLES[lvl.difficulty]
                      )}
                    >
                      {lvl.difficulty}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <h3 className="text-lg font-semibold tracking-tight text-foreground">{lvl.title}</h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Puzzle className="h-4 w-4" aria-hidden="true" />
                        {lvl.pieces} {t("home.levels.pieceLabel")}
                      </span>
                      <span className="inline-flex items-center gap-1" aria-label={`${stars} stars`}>
                        {[0, 1, 2].map((idx) => (
                          <Star
                            key={idx}
                            className={cn(
                              "h-4 w-4",
                              idx < stars ? "fill-primary text-primary" : "text-muted-foreground/40"
                            )}
                            aria-hidden="true"
                          />
                        ))}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "mt-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-300 ease-out",
                        lvl.locked
                          ? "cursor-not-allowed bg-muted text-muted-foreground"
                          : "bg-primary text-primary-foreground hover:-translate-y-0.5 hover:shadow-lg"
                      )}
                    >
                      {lvl.locked ? (
                        <>
                          <Lock className="h-4 w-4" aria-hidden="true" />
                          {t("home.levels.lockedCta")}
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" aria-hidden="true" />
                          {t("home.levels.playCta")}
                        </>
                      )}
                    </span>
                  </div>
                </>
              );

              return (
                <Reveal key={lvl.title} delay={i * 0.06}>
                  {lvl.locked ? (
                    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)]">
                      {cardInner}
                    </div>
                  ) : (
                    <Link
                      href="/game"
                      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {cardInner}
                    </Link>
                  )}
                </Reveal>
              );
            })}
          </div>
        </section>
      </Reveal>

      <Reveal className="bg-muted/40">
        <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {t("home.steps.title")}
            </h2>
            <p className="mt-2 text-muted-foreground">{t("home.steps.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => {
              const Icon = STEP_ICONS[i % STEP_ICONS.length];
              return (
                <Reveal key={step.title} delay={i * 0.08}>
                  <div className="surface-elevated flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-6">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="font-semibold text-foreground">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-brand px-8 py-14 text-center shadow-glow md:px-16 md:py-16">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl">
              {t("home.cta.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-primary-foreground/85">
              {t("home.cta.subtitle")}
            </p>
            <Link
              href="/game"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-background px-7 py-3.5 text-sm font-semibold text-foreground transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t("home.cta.button")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </Reveal>
    </main>
  );
}