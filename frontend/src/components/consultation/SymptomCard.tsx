import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { CF_WEIGHT_OPTIONS, DEFAULT_CF_WEIGHT, cn } from '@/lib/utils'
import type { Symptom } from '@/types'

interface SymptomCardProps {
  symptom: Symptom
  value: number | undefined
  onChange: (weight: number) => void
}

const SEVERITY_LABEL: Record<Symptom['severity'], { label: string; cls: string }> = {
  low:    { label: 'Ringan', cls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  medium: { label: 'Sedang', cls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  high:   { label: 'Berat',  cls: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
}

export function SymptomCard({ symptom, value, onChange }: SymptomCardProps) {
  const selected = value !== undefined && value > 0
  const sev = SEVERITY_LABEL[symptom.severity]

  // Whole card body toggles selection. Inner buttons stopPropagation.
  const handleCardClick = () => {
    onChange(selected ? 0 : DEFAULT_CF_WEIGHT)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleCardClick()
    }
  }

  return (
    <motion.div
      layout
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={handleCardClick}
      onKeyDown={handleKey}
      whileTap={{ scale: 0.985 }}
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-2xl border bg-card/70 p-5 outline-none backdrop-blur-xl transition-all duration-300',
        'focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        selected
          ? 'border-primary/50 bg-gradient-to-br from-sky-500/[0.07] via-indigo-500/[0.04] to-cyan-500/[0.06] shadow-[0_18px_40px_-22px_rgba(14,165,233,0.45)]'
          : 'border-border/70 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_10px_28px_-18px_rgba(15,23,42,0.18)]',
      )}
    >
      {/* Top accent line when selected */}
      {selected && (
        <motion.span
          layoutId={`accent-${symptom.code}`}
          className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-sky-400 via-indigo-500 to-cyan-400"
        />
      )}

      {/* Top-right badge: severity (unselected) → check (selected) */}
      <div className="absolute right-4 top-4">
        <AnimatePresence mode="wait" initial={false}>
          {selected ? (
            <motion.div
              key="check"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 24 }}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow-[0_4px_14px_-2px_rgba(14,165,233,0.55)]"
              aria-hidden
            >
              <Check className="h-4 w-4" strokeWidth={3} />
            </motion.div>
          ) : (
            <motion.span
              key="severity"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                sev.cls,
              )}
            >
              {sev.label}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Body */}
      <div className="pr-10">
        <h3 className="font-semibold leading-tight">{symptom.name}</h3>
        <p className="mt-1 text-[11px] text-muted-foreground">
          <span className="font-mono">{symptom.code}</span>
          <span className="mx-1.5 opacity-50">·</span>
          <span className="capitalize">{symptom.category}</span>
        </p>
      </div>

      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        {symptom.description}
      </p>

      {/* Hint when not selected */}
      {!selected && (
        <p className="mt-3 text-[11px] font-medium text-muted-foreground/70 transition-colors group-hover:text-primary/80">
          Sentuh untuk menandai →
        </p>
      )}

      {/* 5-level confidence selector — labels per Setyaputri et al. 2018 */}
      <AnimatePresence initial={false}>
        {selected && (
          <motion.div
            key="confidence"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-baseline justify-between">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Tingkat Keyakinan
              </p>
              <p className="text-[11px] font-medium text-foreground">
                {CF_WEIGHT_OPTIONS.find((o) => o.value === value)?.label ??
                  'Sangat Mungkin'}
              </p>
            </div>
            <div
              role="radiogroup"
              aria-label="Tingkat keyakinan"
              className="relative grid grid-cols-5 gap-1 rounded-xl border border-border/70 bg-muted/30 p-1"
            >
              {CF_WEIGHT_OPTIONS.map((opt) => {
                const active = value === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    aria-label={opt.label}
                    title={opt.label}
                    onClick={(e) => {
                      e.stopPropagation()
                      onChange(opt.value)
                    }}
                    className={cn(
                      'relative rounded-lg px-1.5 py-2 text-center text-[11px] font-medium leading-tight transition-colors',
                      active
                        ? 'text-white'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId={`confidence-${symptom.code}`}
                        className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-500 shadow-[0_6px_16px_-6px_rgba(14,165,233,0.6)]"
                        transition={{
                          type: 'spring',
                          stiffness: 360,
                          damping: 28,
                        }}
                      />
                    )}
                    <span className="block truncate">{opt.label}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
