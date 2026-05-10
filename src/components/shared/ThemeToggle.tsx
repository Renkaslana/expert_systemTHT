import { Moon, Sun } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeStore } from '@/stores/themeStore'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggle } = useThemeStore()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/60 backdrop-blur-md transition-colors hover:bg-muted',
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {isDark ? (
            <Moon className="h-4 w-4 text-sky-300" />
          ) : (
            <Sun className="h-4 w-4 text-amber-500" />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
