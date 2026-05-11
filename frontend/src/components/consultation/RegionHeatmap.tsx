import { motion } from 'framer-motion'
import { Activity, Ear, HeartPulse, Wind } from 'lucide-react'
import { SYMPTOM_BY_CODE } from '@/data/symptoms'
import type { SymptomCategory } from '@/types'
import { cn } from '@/lib/utils'

const REGIONS: Array<{
  key: SymptomCategory
  label: string
  icon: typeof Ear
  hex: string
  bg: string
  text: string
}> = [
  {
    key: 'telinga',
    label: 'Telinga',
    icon: Ear,
    hex: '#0EA5E9',
    bg: 'bg-sky-500/10',
    text: 'text-sky-600 dark:text-sky-300',
  },
  {
    key: 'hidung',
    label: 'Hidung',
    icon: Wind,
    hex: '#8B5CF6',
    bg: 'bg-violet-500/10',
    text: 'text-violet-600 dark:text-violet-300',
  },
  {
    key: 'tenggorokan',
    label: 'Tenggorokan',
    icon: HeartPulse,
    hex: '#06B6D4',
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-600 dark:text-cyan-300',
  },
  {
    key: 'umum',
    label: 'Umum',
    icon: Activity,
    hex: '#F59E0B',
    bg: 'bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
  },
]

interface RegionHeatmapProps {
  selected: Map<string, number>
  className?: string
}

export function RegionHeatmap({ selected, className }: RegionHeatmapProps) {
  // Tally counts per category from the active selection.
  const counts: Record<SymptomCategory, number> = {
    telinga: 0,
    hidung: 0,
    tenggorokan: 0,
    umum: 0,
  }
  for (const code of selected.keys()) {
    const sym = SYMPTOM_BY_CODE[code]
    if (sym) counts[sym.category] += 1
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        Region focus
      </span>
      {REGIONS.map((r) => {
        const n = counts[r.key]
        const active = n > 0
        return (
          <motion.div
            key={r.key}
            layout
            className={cn(
              'group relative flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors',
              active
                ? `${r.bg} ${r.text} border-transparent`
                : 'border-border/60 bg-background/60 text-muted-foreground',
            )}
          >
            <span
              className={cn(
                'flex h-1.5 w-1.5 rounded-full transition-all',
                active ? 'animate-pulse-soft' : '',
              )}
              style={{
                background: active ? r.hex : '#94A3B8',
                boxShadow: active ? `0 0 10px ${r.hex}` : 'none',
              }}
            />
            <r.icon className="h-3 w-3" />
            {r.label}
            {active && (
              <motion.span
                key={n}
                initial={{ opacity: 0, y: -4, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="ml-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-white/70 px-1 text-[10px] font-mono font-semibold text-foreground dark:bg-slate-900/70"
              >
                {n}
              </motion.span>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
