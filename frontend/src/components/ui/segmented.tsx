import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SegmentedOption<T extends string | number> {
  value: T
  label: string
  hint?: string
}

interface SegmentedProps<T extends string | number> {
  value: T | null
  onChange: (value: T) => void
  options: SegmentedOption<T>[]
  className?: string
  itemClassName?: string
  layoutId: string
}

export function Segmented<T extends string | number>({
  value,
  onChange,
  options,
  className,
  itemClassName,
  layoutId,
}: SegmentedProps<T>) {
  return (
    <div
      className={cn(
        'inline-flex w-full gap-1 rounded-2xl border border-border bg-muted/40 p-1 backdrop-blur-md',
        className,
      )}
    >
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'relative flex-1 rounded-xl px-3 py-2 text-xs font-semibold transition-colors duration-200',
              active ? 'text-white' : 'text-muted-foreground hover:text-foreground',
              itemClassName,
            )}
            aria-pressed={active}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-sky-500 via-sky-600 to-violet-600 shadow-[0_6px_18px_-8px_rgba(14,165,233,0.6)]"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex flex-col items-center gap-0.5">
              <span>{opt.label}</span>
              {opt.hint && (
                <span
                  className={cn(
                    'text-[10px] font-normal',
                    active ? 'text-white/80' : 'text-muted-foreground/70',
                  )}
                >
                  {opt.hint}
                </span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}
