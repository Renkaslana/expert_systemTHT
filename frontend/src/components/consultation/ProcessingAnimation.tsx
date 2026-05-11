import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BrainCircuit } from 'lucide-react'

interface ProcessingAnimationProps {
  count: number
}

/**
 * Multi-stage processing UI shown while the CF engine runs.
 *
 * UX rationale (medical expert system context):
 *   • A blank/spinning screen for <100ms feels glitchy and undermines
 *     the perceived intelligence of a clinical reasoning tool.
 *   • Real engine latency is ~50–80ms locally, so the parent component
 *     enforces a MIN_PROCESSING_MS wait. This animation fills that wait
 *     with educational content — telling the user what the system is
 *     actually doing (forward-chaining over a rule base, computing CF,
 *     etc.) rather than vague "loading…".
 *   • Stages are paced so the last one ("Menyusun penjelasan") is still
 *     visible when the API resolves, creating a feeling of "the work
 *     just completed" rather than "we wasted your time".
 *
 * Design inspiration: Notion AI's "thinking…" steps, Stripe's payment
 * processing screen, Linear's optimistic-but-honest progress.
 */

interface Stage {
  /** Indonesian-natural label shown as the headline */
  label: string
  /** Detail line shown beneath the label */
  detail: string
  /** ms-from-start when this stage activates */
  startAt: number
}

const STAGES: Stage[] = [
  {
    label: 'Memvalidasi input',
    detail: 'Memastikan setiap gejala memiliki bobot keyakinan yang valid.',
    startAt: 0,
  },
  {
    label: 'Memuat basis pengetahuan',
    detail: '24 gejala, 5 kondisi THT, 34 aturan tervalidasi pakar.',
    startAt: 360,
  },
  {
    label: 'Forward-chaining inferensi',
    detail: 'Mencocokkan gejala dengan setiap kondisi dalam knowledge base.',
    startAt: 800,
  },
  {
    label: 'Menghitung Certainty Factor',
    detail: 'cf₁ + cf₂ × (1 − cf₁) — kombinasi iteratif rumus MYCIN.',
    startAt: 1280,
  },
  {
    label: 'Menyusun penjelasan',
    detail: 'Merangkai kontribusi gejala menjadi reasoning yang dapat dibaca.',
    startAt: 1760,
  },
]

const TOTAL_DURATION_MS = STAGES[STAGES.length - 1]!.startAt + 480

export function ProcessingAnimation({ count }: ProcessingAnimationProps) {
  const [activeStageIdx, setActiveStageIdx] = useState(0)
  const [progress, setProgress] = useState(0)

  // ── Drive the stage timeline ────────────────────────────────────────
  useEffect(() => {
    const timers = STAGES.map((stage, idx) =>
      window.setTimeout(() => setActiveStageIdx(idx), stage.startAt),
    )
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [])

  // ── Smooth continuous progress bar (0 → ~95%) ───────────────────────
  // Stops at 95% so the final 5% only completes when the animation
  // actually exits — communicating "almost done" without overpromising.
  useEffect(() => {
    const start = Date.now()
    let raf = 0
    const tick = () => {
      const elapsed = Date.now() - start
      const pct = Math.min(0.95, elapsed / TOTAL_DURATION_MS)
      setProgress(pct)
      if (pct < 0.95) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const stage = STAGES[activeStageIdx] ?? STAGES[0]!

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-2xl"
      role="status"
      aria-live="polite"
      aria-label={`Menganalisis: ${stage.label}`}
    >
      <motion.div
        initial={{ scale: 0.96, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.98, y: -8 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex w-full max-w-md flex-col items-center text-center"
      >
        {/* ── Visual orb (brain + orbits + particles) ─────────────── */}
        <div className="relative h-44 w-44">
          {/* Outer rotating ring (slow, blurred) */}
          <motion.div
            className="absolute inset-0 rounded-full ring-gradient blur-md opacity-70"
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          />
          {/* Inner counter-rotating ring (sharp) */}
          <motion.div
            className="absolute inset-2 rounded-full ring-gradient"
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />
          {/* Disc covering rings to leave only the rim visible */}
          <div className="absolute inset-4 rounded-full bg-background" />

          {/* Center brain orb (pulses with stage transitions) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              key={activeStageIdx}
              initial={{ scale: 0.92 }}
              animate={{ scale: [0.92, 1.05, 1] }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 via-violet-500 to-cyan-500 shadow-[0_24px_60px_-20px_rgba(139,92,246,0.55)]"
            >
              <BrainCircuit className="h-9 w-9 text-white" />
            </motion.div>
          </div>

          {/* Orbiting particles — staggered fade for "data flowing in" feel */}
          {[...Array(8)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-sky-400/70"
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{
                x: Math.cos((i / 8) * Math.PI * 2) * 90,
                y: Math.sin((i / 8) * Math.PI * 2) * 90,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.18,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>

        {/* ── Stage label (cross-fades on stage change) ─────────────── */}
        <div className="mt-10 h-[68px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStageIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center"
            >
              <h2 className="font-display text-[22px] font-semibold tracking-tight">
                {stage.label}
                <motion.span
                  aria-hidden
                  className="inline-flex"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                >
                  …
                </motion.span>
              </h2>
              <p className="mt-1.5 max-w-sm text-[12.5px] leading-relaxed text-muted-foreground">
                {stage.detail}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Stage dots ───────────────────────────────────────────── */}
        <div className="mt-3 flex items-center gap-1.5">
          {STAGES.map((_, i) => {
            const isActive = i === activeStageIdx
            const isDone = i < activeStageIdx
            return (
              <motion.span
                key={i}
                animate={{
                  scale: isActive ? 1 : 0.85,
                  opacity: isActive ? 1 : isDone ? 0.7 : 0.3,
                }}
                transition={{ duration: 0.3 }}
                className={`h-1.5 rounded-full transition-colors ${
                  isActive
                    ? 'w-6 bg-gradient-to-r from-sky-500 to-violet-500'
                    : isDone
                      ? 'w-1.5 bg-emerald-400'
                      : 'w-1.5 bg-muted-foreground/30'
                }`}
              />
            )
          })}
        </div>

        {/* ── Progress bar (continuous 0 → 95%) ────────────────────── */}
        <div className="mt-6 h-[3px] w-full max-w-[280px] overflow-hidden rounded-full bg-muted/60">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 via-violet-400 to-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.45)]"
            style={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* ── Quiet stats footer — establishes scientific credibility ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
        >
          <span>{count} gejala</span>
          <span aria-hidden className="text-muted-foreground/40">·</span>
          <span>34 aturan dievaluasi</span>
          <span aria-hidden className="text-muted-foreground/40">·</span>
          <span>5 hipotesis dipertimbangkan</span>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
