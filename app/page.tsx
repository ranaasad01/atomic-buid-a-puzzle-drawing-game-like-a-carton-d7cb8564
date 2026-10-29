"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Image as ImageIcon, Square, Check, Sparkles, Clock, Settings, Heart, Star, Lock } from 'lucide-react';
import { useTranslations } from "next-intl";
import Reveal from "@/components/Reveal";
import { staggerContainer, scaleIn } from "@/lib/motion";

type Step = { icon: string; title: string; description: string };
type Pack = { name: string; description: string; difficulty: string; pieces: string; image: string };
type Feature = { icon: string; title: string; description: string };
type Stat = { value: string; label: string };

const STEP_ICONS: Record<string, typeof ImageIcon> = {
  image: ImageIcon,
  square: Square,
  check: Check,
  sparkles: Sparkles,
};

const FEATURE_ICONS: Record<string, typeof ImageIcon> = {
  clock: Clock,
  sparkles: Sparkles,
  settings: Settings,
  heart: Heart,
  star: Star,
  lock: Lock,
};

const PACK_IMAGES = [
  "/images/cartoon-jungle-safari-animals-illustration.jpg",
  "/images/cartoon-under-the-sea-illustration.jpg",
  "/images/cartoon-space-explorer-kids-illustration.jpg",
  "/images/cartoon-enchanted-forest-illustration.jpg",
  "/images/cartoon-dinosaur-world-illustration.jpg",
  "/images/cartoon-farmyard-animals-illustration.jpg",
];

const DIFFICULTY_STYLE: Record<string, string> = {
  Easy: "bg-primary/10 text-primary",
  Medium: "bg-accent/10 text-accent",
  Hard: "bg-foreground/10 text-foreground",
};

const floatPiece: Variants = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: 1,
    y: [0, -10, 0],
    transition: { opacity: { duration: 0.5 }, y: { duration: 3, repeat: Infinity, ease: "easeInOut" } },
  },
};

export default function HomePage() {
  const t = useTranslations();

  const steps = (Array.isArray(t.raw("howItWorks.steps")) ? t.raw("howItWorks.steps") : []) as Step[];
  const packs = (Array.isArray(t.raw("packs.items")) ? t.raw("packs.items") : []) as Pack[];
  const features = (Array.isArray(t.raw("features.items")) ? t.raw("features.items") : []) as Feature[];
  const stats = (Array.isArray(t.raw("stats.items")) ? t.raw("stats.items") : []) as Stat[];

  return (
    <main className="overflow-x-hidden">
      {/* HERO */}
      <Reveal>
        <section id="hero" className="relative bg-mesh">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 md:py-28 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">A playful puzzle game for the endlessly curious</span>
              <h1 className="mt-6 text-balance text-4xl font-display font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
                {t("hero.titleStart")} <span className="text-gradient">{t("hero.titleHighlight")}</span>{" "}
                {t("hero.titleEnd")}
              </h1>
              <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
                {t("hero.subtitle")}
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href="/game" className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-glow transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none">
                  {t("hero.primaryCta")}
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
                <Link href="/home-level-select" className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-3.5 text-base font-semibold text-card-foreground transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none">
                  {t("hero.secondaryCta")}
                </Link>
              </div>
            </div>

            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="relative mx-auto w-full max-w-md">
              <div className="glass-strong relative overflow-hidden rounded-2xl p-3 shadow-glow">
                <img src="https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/58d93151bd054e31a119f6b9ef2116db.jpg" alt="A colorful cartoon jungle scene being assembled from puzzle pieces" className="h-80 w-full rounded-xl object-cover" />
                <div className="pointer-events-none absolute inset-3 rounded-xl border-2 border-dashed border-background/40" />
              </div>
              <motion.div variants={floatPiece} className="glass absolute -left-6 top-6 flex h-16 w-16 rotate-[-8deg] items-center justify-center rounded-xl shadow-glow">
                <Square className="h-7 w-7 text-primary" aria-hidden="true" />
              </motion.div>
              <motion.div variants={floatPiece} className="glass absolute -right-5 top-28 flex h-14 w-14 rotate-[10deg] items-center justify-center rounded-xl shadow-glow">
                <Check className="h-6 w-6 text-accent" aria-hidden="true" />
              </motion.div>
              <motion.div variants={floatPiece} className="glass absolute -bottom-6 left-12 flex h-16 w-16 rotate-[6deg] items-center justify-center rounded-xl shadow-glow">
                <Sparkles className="h-7 w-7 text-primary" aria-hidden="true" />
              </motion.div>
            </motion.div>
          </div>
        </section>
      </Reveal>
      {/* HOW IT WORKS */}
      <Reveal>
        <section id="how-it-works" className="bg-background">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                {t("howItWorks.eyebrow")}
              </span>
              <h2 className="mt-3 text-balance text-3xl font-display font-bold tracking-tight text-foreground sm:text-4xl">
                {t("howItWorks.title")}
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{t("howItWorks.subtitle")}</p>
            </div>
            <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, i) => {
                const Icon = STEP_ICONS[step.icon] ?? Sparkles;
                return (
                  <Reveal key={step.title} delay={i * 0.08}>
                    <div className="relative flex flex-col items-start gap-4 border-t-2 border-border pt-6">
                      <span className="absolute -top-4 left-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {i + 1}
                      </span>
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                      </div>
                      <h3 className="text-lg font-display font-semibold text-foreground">{step.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      </Reveal>
      {/* FEATURED PACKS */}
      <Reveal>
        <section id="packs" className="bg-muted/40">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
            <div className="flex flex-col items-end justify-between gap-6 sm:flex-row">
              <div className="max-w-xl">
                <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                  {t("packs.eyebrow")}
                </span>
                <h2 className="mt-3 text-balance text-3xl font-display font-bold tracking-tight text-foreground sm:text-4xl">
                  {t("packs.title")}
                </h2>
                <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{t("packs.subtitle")}</p>
              </div>
              <Link href="/home-level-select" className="hidden shrink-0 items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-card-foreground transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg sm:inline-flex">
                {t("packs.cta")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {packs.map((pack, i) => (
                <motion.div key={pack.name} variants={scaleIn} className="surface-elevated group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none">
                  <div className="relative h-48 w-full overflow-hidden">
                    <img src={PACK_IMAGES[i % PACK_IMAGES.length]} alt={pack.name} className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" />
                    <span
                      className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
                        DIFFICULTY_STYLE[pack.difficulty] ?? "bg-primary/10 text-primary"
                      }`}>
                      {pack.difficulty}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-display font-semibold text-card-foreground">{pack.name}</h3>
                      <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                        {pack.pieces}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pack.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-10 flex justify-center sm:hidden">
              <Link href="/home-level-select" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-card-foreground">
                {t("packs.cta")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
      {/* WHY FAMILIES LOVE IT */}
      <Reveal>
        <section id="features" className="relative bg-mesh">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                {t("features.eyebrow")}
              </span>
              <h2 className="mt-3 text-balance text-3xl font-display font-bold tracking-tight text-foreground sm:text-4xl">
                {t("features.title")}
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{t("features.subtitle")}</p>
            </div>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = FEATURE_ICONS[feature.icon] ?? Sparkles;
                return (
                  <motion.div key={feature.title} variants={scaleIn} className="glass rounded-2xl p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-glow motion-reduce:transition-none">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 text-base font-display font-semibold text-foreground">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      </Reveal>
      {/* STATS BAND */}
      <Reveal>
        <section id="stats" className="bg-gradient-brand">
          <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
            <h2 className="text-center text-balance text-2xl font-display font-bold tracking-tight text-primary-foreground sm:text-3xl">
              {t("stats.title")}
            </h2>
            <div className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4">
              {stats.map((stat) => (<div key={stat.label} className="text-center">
                <p className="text-3xl font-display font-bold text-primary-foreground sm:text-4xl">{stat.value}</p>
                <p className="mt-2 text-sm font-medium text-primary-foreground/80">{stat.label}</p>
              </div>))}
            </div>
          </div>
        </section>
      </Reveal>
      {/* FINAL CTA */}
      <Reveal>
        <section id="cta" className="bg-background">
          <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
            <div className="glass-strong relative overflow-hidden rounded-2xl px-8 py-14 text-center shadow-glow sm:px-16">
              <h2 className="text-balance text-3xl font-display font-bold tracking-tight text-foreground sm:text-4xl">
                {t("cta.title")}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
                {t("cta.subtitle")}
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/game" className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-glow transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none">
                  {t("cta.primaryCta")}
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
                <Link href="/results" className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-3.5 text-base font-semibold text-card-foreground transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none">
                  {t("cta.secondaryCta")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}