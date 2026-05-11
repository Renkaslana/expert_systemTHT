import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type Tone = 'dark' | 'light'

interface ContributionBarProps {
  code?: string
  label: string
  /** 0–1 contribution share */
  value: number
  tone?: Tone
  delay?: number
  highlighted?: boolean
  className?: string
}

/**
 * Horizontal "this symptom contributed N% of the diagnosis" bar.
 * Animates width on whileInView. Used in How It Works step 3 and the
 * Explainable-AI inspector.
 */
export function ContributionBar({
  code,
  label,
  value,
  tone = 'dark',
  delay = 0,
  highlighted = false,
  className,
}: ContributionBarProps) {
  const trackBg = tone === 'dark' ? 'bg-white/[0.05]' : 'bg-slate-100'
  const text = tone === 'dark' ? 'text-slate-200' : 'text-slate-800'
  const muted = tone === 'dark' ? 'text-slate-500' : 'text-slate-400'

  const barColor = highlighted
    ? 'linear-gradient(90deg, #38BDF8 0%, #06B6D4 50%, #34D399 100%)'
    : tone === 'dark'
      ? 'linear-gradient(90deg, rgba(56,189,248,0.65), rgba(139,92,246,0.55))'
      : 'linear-gradient(90deg, #38BDF8, #8B5CF6)'

  const pct = Math.max(0, Math.min(1, value))

  return (
    <div className={cn('grid grid-cols-[auto,1fr,auto] items-center gap-3', className)}>
      <div className="flex min-w-[140px] items-center gap-2">
        {code && (
          <span className={cn('num font-mono text-[10px]', muted)}>{code}</span>
        )}
        <span className={cn('truncate text-xs', text)}>{label}</span>
      </div>
      <div className={cn('relative h-1.5 overflow-hidden rounded-full', trackBg)}>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct * 100}%` }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: barColor }}
        />
        {highlighted && (
          <motion.div
            initial={{ x: '-30%', opacity: 0 }}
            animate={{ x: '120%', opacity: [0, 1, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
            className="absolute top-0 h-full w-1/3"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)',
              filter: 'blur(2px)',
            }}
          />
        )}
      </div>
      <span className={cn('num w-10 text-right font-mono text-[11px]', text)}>
        {Math.round(pct * 100)}%
      </span>
    </div>
  )
}
