import { motion } from 'framer-motion'
import { Activity, Ear, HeartPulse, Wind } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AreaFilter } from '@/stores/consultationStore'

interface RegionMeta {
  key: AreaFilter
  label: string
  example: string
  icon: typeof Ear
  accent: string  // tailwind classes for icon tint
  glow: string    // CSS gradient for active aura
}

const REGIONS: RegionMeta[] = [
  {
    key: 'telinga',
    label: 'Telinga',
    example: 'nyeri, dengung, gangguan dengar',
    icon: Ear,
    accent: 'text-sky-600 dark:text-sky-300',
    glow: 'radial-gradient(60% 60% at 50% 0%, rgba(14,165,233,0.18), transparent 70%)',
  },
  {
    key: 'hidung',
    label: 'Hidung',
    example: 'pilek, mampet, penciuman',
    icon: Wind,
    accent: 'text-violet-600 dark:text-violet-300',
    glow: 'radial-gradient(60% 60% at 50% 0%, rgba(139,92,246,0.18), transparent 70%)',
  },
  {
    key: 'tenggorokan',
    label: 'Tenggorokan',
    example: 'nyeri telan, suara serak',
    icon: HeartPulse,
    accent: 'text-cyan-600 dark:text-cyan-300',
    glow: 'radial-gradient(60% 60% at 50% 0%, rgba(6,182,212,0.18), transparent 70%)',
  },
  {
    key: 'umum',
    label: 'Umum',
    example: 'demam, pusing, mual',
    icon: Activity,
    accent: 'text-amber-600 dark:text-amber-300',
    glow: 'radial-gradient(60% 60% at 50% 0%, rgba(245,158,11,0.18), transparent 70%)',
  },
]

interface RegionPickerProps {
  active: AreaFilter
  onChange: (key: AreaFilter) => void
  /** Per-region count of available symptoms */
  available: Record<string, number>
  /** Per-region count of selected symptoms */
  selected: Record<string, number>
}

export function RegionPicker({
  active,
  onChange,
  available,
  selected,
}: RegionPickerProps) {
  return (
    <div
      role="tablist"
      aria-label="Pilih area keluhan"
      className="grid grid-cols-2 gap-3 md:grid-cols-4"
    >
      {REGIONS.map((r, idx) => {
        const isActive = active === r.key
        const availableCount = available[r.key] ?? 0
        const selectedCount = selected[r.key] ?? 0

        return (
          <motion.button
            key={r.key}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onChange(r.key)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: idx * 0.06,
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.985 }}
            className={cn(
              'group relative overflow-hidden rounded-2xl border bg-card/70 p-4 text-left backdrop-blur-xl transition-all duration-300 md:p-5',
              isActive
                ? 'border-primary/50 shadow-[0_24px_50px_-24px_rgba(14,165,233,0.45)]'
                : 'border-border/70 hover:border-primary/30 hover:shadow-[0_18px_40px_-22px_rgba(15,23,42,0.22)]',
            )}
          >
            {/* Soft top-glow when active */}
            {isActive && (
              <motion.span
                layoutId="region-glow"
                className="pointer-events-none absolute inset-0"
                style={{ background: r.glow }}
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              />
            )}

            {/* Gradient indicator bar at the top */}
            {isActive && (
              <motion.span
                layoutId="region-bar"
                className="absolute inset-x-3 top-0 h-0.5 rounded-b-full bg-gradient-to-r from-sky-400 via-violet-500 to-cyan-400"
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              />
            )}

            <div className="relative flex items-start justify-between">
              <div
                className={cn(
                  'inline-flex h-11 w-11 items-center justify-center rounded-xl bg-muted/60 transition-colors',
                  isActive && 'bg-white/70 dark:bg-white/[0.06]',
                  r.accent,
                )}
              >
                <r.icon className="h-5 w-5" strokeWidth={1.7} />
              </div>

              {/* Selected count badge */}
              {selectedCount > 0 && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                  className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-violet-500 px-1.5 text-[11px] font-semibold text-white shadow-[0_4px_12px_-2px_rgba(14,165,233,0.55)]"
                >
                  {selectedCount}
                </motion.span>
              )}
            </div>

            <div className="relative mt-4">
              <p className="font-display text-base font-semibold tracking-tight md:text-[17px]">
                {r.label}
              </p>
              <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground md:text-xs">
                {r.example}
              </p>
            </div>

            <div className="relative mt-4 flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <span className="font-mono">{availableCount} gejala</span>
              {isActive && (
                <motion.span
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-1 font-semibold text-primary"
                >
                  <span className="h-1 w-1 rounded-full bg-primary animate-pulse-soft" />
                  Aktif
                </motion.span>
              )}
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
