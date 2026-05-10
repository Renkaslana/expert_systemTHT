import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  eyebrow?: string
  title: string | React.ReactNode
  subtitle?: string
  align?: 'left' | 'center'
  className?: string
  /** Use on dark backgrounds */
  dark?: boolean
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className,
  dark = false,
}: SectionHeaderProps) {
  const alignCls = align === 'center' ? 'mx-auto text-center items-center' : 'items-start text-left'

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.1 } },
      }}
      className={cn('flex max-w-2xl flex-col gap-4', alignCls, className)}
    >
      {/* Eyebrow */}
      {eyebrow && (
        <motion.span
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
          }}
          className={cn(
            'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5',
            'font-mono text-[10px] uppercase tracking-[0.20em]',
            dark
              ? 'border-white/10 bg-white/[0.04] text-slate-400'
              : 'border-border/70 bg-background/80 text-muted-foreground backdrop-blur-sm',
          )}
        >
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              dark ? 'bg-sky-400' : 'bg-primary',
            )}
          />
          {eyebrow}
        </motion.span>
      )}

      {/* Headline */}
      <motion.h2
        variants={{
          hidden: { opacity: 0, y: 16, filter: 'blur(8px)' },
          show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
        }}
        className={cn(
          'font-display font-medium tracking-tight text-balance',
          'text-[clamp(26px,3.5vw,42px)] leading-[1.06]',
          dark ? 'text-white' : 'text-ink dark:text-white',
        )}
      >
        {title}
      </motion.h2>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
          }}
          className={cn(
            'text-[1rem] leading-relaxed text-balance',
            dark ? 'text-slate-400' : 'text-ink-soft dark:text-slate-400',
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  )
}
