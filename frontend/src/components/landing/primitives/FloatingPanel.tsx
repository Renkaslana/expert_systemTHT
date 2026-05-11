import { forwardRef, type ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

type Tone = 'dark' | 'light'

interface FloatingPanelProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  tone?: Tone
  /** Optional accent color for the top-edge highlight (hex). */
  accent?: string
  children?: ReactNode
}

/**
 * Glass panel with hairline border + premium drop shadow. Tone "dark" is for
 * cinematic dark sections, "light" is for editorial light sections.
 *
 * Use as a wrapper for floating UI mocks, dashboard panels, evidence cards.
 */
export const FloatingPanel = forwardRef<HTMLDivElement, FloatingPanelProps>(
  function FloatingPanel(
    { className, children, tone = 'dark', accent, style, ...rest },
    ref,
  ) {
    const base =
      tone === 'dark'
        ? 'bg-[rgba(10,15,28,0.78)] border-white/[0.07] text-slate-100 shadow-panel-lift'
        : 'bg-white/[0.92] border-slate-200/80 text-slate-900 shadow-panel-lift-light'

    return (
      <motion.div
        ref={ref}
        className={cn(
          'relative isolate rounded-2xl border backdrop-blur-2xl',
          base,
          className,
        )}
        style={style}
        {...rest}
      >
        {accent && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-3 top-0 h-px rounded-full"
            style={{
              background: `linear-gradient(to right, transparent, ${accent}, transparent)`,
              opacity: 0.85,
            }}
          />
        )}
        {children}
      </motion.div>
    )
  },
)
