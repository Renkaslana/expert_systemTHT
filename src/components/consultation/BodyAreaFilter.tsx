import { motion } from 'framer-motion'
import { Activity, Ear, HeartPulse, Wind } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AreaFilter } from '@/stores/consultationStore'

const FILTERS: Array<{
  key: AreaFilter
  label: string
  icon: typeof Ear
}> = [
  { key: 'all',         label: 'Semua',       icon: Activity },
  { key: 'telinga',     label: 'Telinga',     icon: Ear },
  { key: 'hidung',      label: 'Hidung',      icon: Wind },
  { key: 'tenggorokan', label: 'Tenggorokan', icon: HeartPulse },
]

interface BodyAreaFilterProps {
  value: AreaFilter
  onChange: (v: AreaFilter) => void
}

export function BodyAreaFilter({ value, onChange }: BodyAreaFilterProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter area gejala"
      className="inline-flex flex-wrap items-center gap-1 rounded-2xl border border-border bg-card p-1 shadow-sm"
    >
      {FILTERS.map((f) => {
        const active = value === f.key
        return (
          <button
            key={f.key}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(f.key)}
            className={cn(
              'relative inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors',
              active
                ? 'text-white'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {active && (
              <motion.span
                layoutId="bodyfilter-pill"
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-sky-500 to-violet-500 shadow-[0_8px_22px_-10px_rgba(14,165,233,0.6)]"
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <f.icon className="h-3.5 w-3.5" />
              {f.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
