import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  side?: 'top' | 'bottom'
  className?: string
}

export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ opacity: 0, y: side === 'top' ? 4 : -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: side === 'top' ? 4 : -4, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              'absolute left-1/2 z-40 -translate-x-1/2 whitespace-normal',
              side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
            )}
          >
            <span
              className={cn(
                'block max-w-[260px] rounded-lg bg-slate-900/95 px-3 py-2 text-xs font-medium text-slate-100 shadow-xl ring-1 ring-white/10 dark:bg-slate-100/95 dark:text-slate-900 dark:ring-slate-900/10',
                className,
              )}
            >
              {content}
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}
