import { cn } from '@/lib/utils'

interface ScanLineProps {
  /** "horizontal" sweeps left-to-right, "vertical" sweeps top-to-bottom */
  orientation?: 'horizontal' | 'vertical'
  /** Tailwind color name from sky/cyan/violet/amber pre-baked stops. */
  color?: 'sky' | 'amber' | 'violet' | 'cyan'
  className?: string
}

const COLORS: Record<NonNullable<ScanLineProps['color']>, string> = {
  sky: 'rgba(56, 189, 248, 0.55)',
  cyan: 'rgba(6, 182, 212, 0.55)',
  violet: 'rgba(139, 92, 246, 0.45)',
  amber: 'rgba(245, 158, 11, 0.45)',
}

/**
 * Cinematic scan-line sweep — used as ambient detail in Hero / CTA / dashboard
 * mocks. Pure CSS animation; respects prefers-reduced-motion via the global
 * guard in index.css.
 */
export function ScanLine({
  orientation = 'vertical',
  color = 'sky',
  className,
}: ScanLineProps) {
  const stop = COLORS[color]
  if (orientation === 'vertical') {
    return (
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-x-0 h-32 hero-scanline',
          className,
        )}
        style={{
          background: `linear-gradient(to bottom, transparent, ${stop}, transparent)`,
          filter: 'blur(0.5px)',
        }}
      />
    )
  }
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-y-0 w-32 animate-shimmer',
        className,
      )}
      style={{
        background: `linear-gradient(to right, transparent, ${stop}, transparent)`,
        filter: 'blur(0.5px)',
      }}
    />
  )
}
