import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CF_WEIGHT_OPTIONS, SEVERITY_HEX, cn } from '@/lib/utils'
import type { Symptom, SymptomCategory } from '@/types'

// ─────────────────────────────────────────────────────────────────────────────
// Types & helpers
// ─────────────────────────────────────────────────────────────────────────────

export interface SelectedItem {
  symptom: Symptom
  weight: number
}

type Stage = 'idle' | 'gathering' | 'ready'

const READY_THRESHOLD = 3 // 3+ symptoms = "siap dianalisis"

function deriveStage(count: number): Stage {
  if (count === 0) return 'idle'
  if (count < READY_THRESHOLD) return 'gathering'
  return 'ready'
}

const STAGE_COPY: Record<Stage, { eyebrow: string; title: string; sub: string; dot: string }> = {
  idle: {
    eyebrow: 'Diagnova',
    title: 'Siap mendengarkan',
    sub: 'Pilih area keluhan untuk memulai konsultasi.',
    dot: '#94A3B8',
  },
  gathering: {
    eyebrow: 'Diagnova',
    title: 'Mengumpulkan data…',
    sub: 'Tambahkan beberapa gejala lagi untuk akurasi optimal.',
    dot: '#F59E0B',
  },
  ready: {
    eyebrow: 'Diagnova',
    title: 'Sistem siap menganalisis',
    sub: 'Kami sudah punya cukup gejala untuk menyimpulkan.',
    dot: '#10B981',
  },
}

const REGION_LABEL: Record<SymptomCategory, string> = {
  telinga: 'Telinga',
  hidung: 'Hidung',
  tenggorokan: 'Tenggorokan',
  umum: 'Umum',
}

/**
 * Map an internal CF weight back to its journal-label (Setyaputri et al. 2018).
 * Backend rejects any value not in [0.2, 0.4, 0.6, 0.8, 1.0] (PRD §6).
 */
function weightLabel(weight: number): string {
  return (
    CF_WEIGHT_OPTIONS.find((o) => o.value === weight)?.label ?? 'Sangat Mungkin'
  )
}

function dominantRegion(items: SelectedItem[]) {
  if (items.length === 0) return null
  const counts: Record<SymptomCategory, number> = {
    telinga: 0,
    hidung: 0,
    tenggorokan: 0,
    umum: 0,
  }
  for (const it of items) counts[it.symptom.category] += 1
  const top = (Object.entries(counts) as [SymptomCategory, number][])
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])[0]
  return top ? { key: top[0], label: REGION_LABEL[top[0]], count: top[1] } : null
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

interface AIAssistantPanelProps {
  items: SelectedItem[]
  onRemove: (code: string) => void
  onClear: () => void
  onAnalyze: () => void
}

export function AIAssistantPanel({
  items,
  onRemove,
  onClear,
  onAnalyze,
}: AIAssistantPanelProps) {
  const count = items.length
  const stage = deriveStage(count)
  const copy = STAGE_COPY[stage]
  const dominant = dominantRegion(items)
  const remaining = Math.max(0, READY_THRESHOLD - count)

  // Readiness 0..1 — how close to ready threshold
  const readiness = Math.min(1, count / READY_THRESHOLD)

  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/70 backdrop-blur-2xl shadow-[0_24px_60px_-30px_rgba(15,23,42,0.30)] dark:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.55)]">

      {/* ── Status header ──────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-border/60 p-5">
        <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-gradient-to-br from-sky-400/15 via-indigo-400/10 to-cyan-400/15 blur-3xl" />

        <div className="relative flex items-center gap-2">
          {/* Pulsing status dot */}
          <span className="relative flex h-2.5 w-2.5">
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ background: copy.dot }}
              animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.4, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span
              className="relative h-2.5 w-2.5 rounded-full"
              style={{ background: copy.dot }}
            />
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {copy.eyebrow} · AI Assistant
          </span>
        </div>

        <div className="relative mt-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-display text-lg font-semibold tracking-tight">
                {copy.title}
              </h3>
              <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
                {copy.sub}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Readiness bar */}
        <div className="relative mt-4">
          <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            <span>Kesiapan analisis</span>
            <span className="font-mono">
              {count} / {READY_THRESHOLD}+
            </span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted/60">
            <motion.div
              initial={false}
              animate={{ width: `${readiness * 100}%` }}
              transition={{ type: 'spring', stiffness: 180, damping: 24 }}
              className={cn(
                'h-full rounded-full',
                stage === 'ready'
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                  : 'bg-gradient-to-r from-sky-400 via-indigo-500 to-cyan-400',
              )}
            />
          </div>
        </div>
      </div>

      {/* ── Insight: dominant region ──────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {dominant && (
          <motion.div
            key="insight"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-b border-border/60"
          >
            <div className="flex items-center gap-3 p-5">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/10 via-indigo-500/10 to-cyan-500/10 text-sky-600 dark:text-sky-300">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Pola terdeteksi
                </p>
                <p className="mt-0.5 text-sm leading-snug">
                  Region dominan{' '}
                  <span className="font-semibold">{dominant.label}</span> ·{' '}
                  <span className="text-muted-foreground">
                    {dominant.count} dari {count} gejala
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Selected list ─────────────────────────────────────────────── */}
      <div className="p-5">
        <div className="mb-2.5 flex items-center justify-between">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Gejala dipilih
          </p>
          {count > 0 && (
            <button
              onClick={onClear}
              className="text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Hapus semua
            </button>
          )}
        </div>

        {count === 0 ? (
          <div className="rounded-xl border border-dashed border-border/60 px-4 py-6 text-center">
            <p className="text-sm font-medium">Belum ada</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Tandai gejala yang Anda rasakan, sistem akan memandu prosesnya.
            </p>
          </div>
        ) : (
          <ul className="scrollbar-clean -mr-2 max-h-[280px] space-y-1.5 overflow-y-auto pr-2">
            <AnimatePresence initial={false}>
              {items.map(({ symptom, weight }) => (
                <motion.li
                  key={symptom.code}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10, height: 0 }}
                  transition={{ duration: 0.22 }}
                  className="group flex items-start gap-2.5 rounded-xl border border-border/60 bg-background/60 px-3 py-2 transition-colors hover:border-primary/40"
                >
                  <span
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                    style={{ background: SEVERITY_HEX[symptom.severity] }}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium leading-tight">
                      {symptom.name}
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {weightLabel(weight)} ·{' '}
                      <span className="capitalize">{symptom.category}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => onRemove(symptom.code)}
                    className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-foreground group-hover:opacity-100 focus-visible:opacity-100"
                    aria-label={`Hapus ${symptom.name}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-t border-border/60 bg-gradient-to-br from-sky-500/[0.04] via-indigo-500/[0.03] to-cyan-500/[0.04] p-5">
        {/* Soft breath glow when ready */}
        {stage === 'ready' && (
          <motion.div
            className="pointer-events-none absolute inset-0"
            animate={{ opacity: [0.4, 0.85, 0.4] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background:
                'radial-gradient(80% 60% at 50% 100%, rgba(14,165,233,0.18), transparent 70%)',
            }}
          />
        )}

        <Button
          size="lg"
          disabled={count === 0}
          onClick={onAnalyze}
          className={cn(
            'relative w-full',
            stage === 'ready' &&
              'bg-gradient-to-r from-sky-500 via-indigo-500 to-cyan-500 shadow-[0_12px_36px_-10px_rgba(14,165,233,0.65)]',
          )}
        >
          <Sparkles className="h-4 w-4" />
          {stage === 'ready' ? 'Mulai Diagnosis' : 'Mulai Diagnosis'}
          <ArrowRight className="h-4 w-4" />
        </Button>
        <p className="relative mt-2 text-center text-[11px] text-muted-foreground">
          {stage === 'idle' && 'Pilih minimal 1 gejala untuk mulai'}
          {stage === 'gathering' &&
            `Tambahkan ${remaining} gejala lagi untuk hasil optimal`}
          {stage === 'ready' &&
            'Analisis akan menampilkan reasoning yang transparan'}
        </p>
      </div>
    </div>
  )
}
