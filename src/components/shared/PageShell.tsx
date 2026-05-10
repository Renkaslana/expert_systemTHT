import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PageShellProps {
  children: React.ReactNode
  className?: string
  withAurora?: boolean
}

export function PageShell({ children, className, withAurora = false }: PageShellProps) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn('relative flex-1', className)}
    >
      {withAurora && (
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div
            className="absolute inset-0 bg-aurora opacity-90 dark:opacity-60"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-grid-pattern bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]"
            aria-hidden
          />
        </div>
      )}
      {children}
    </motion.main>
  )
}
