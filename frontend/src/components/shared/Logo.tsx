import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  withWordmark?: boolean
}

export function Logo({ className, withWordmark = true }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <NovaMark />
      {withWordmark && (
        <div className="flex items-baseline leading-none">
          <span className="font-display text-lg font-bold tracking-tight">Diag</span>
          <span className="font-display text-lg font-bold tracking-tight text-gradient">
            nova
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * Diagnova brand mark — a stylized ear/signal icon with gradient ring.
 * Represents ENT listening + AI signal processing.
 */
export function NovaMark({ className }: { className?: string }) {
  return (
    <div className={cn('relative h-9 w-9', className)}>
      {/* Gradient ring border */}
      <div className="absolute inset-0 rounded-[11px] bg-gradient-to-br from-sky-400 via-cyan-500 to-violet-600" />
      {/* Inner background */}
      <div className="absolute inset-[1.5px] rounded-[9.5px] bg-background" />
      {/* Icon SVG */}
      <svg
        viewBox="0 0 32 32"
        className="absolute inset-0 h-full w-full p-[5px]"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="nm-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="55%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="nm-grad-2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
        </defs>

        {/* Outer arc — ear canal shape */}
        <path
          d="M 16 4
             C 9.37 4, 4 9.37, 4 16
             C 4 22.63, 9.37 28, 16 28"
          stroke="url(#nm-grad)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />

        {/* Inner arc */}
        <path
          d="M 16 8
             C 11.58 8, 8 11.58, 8 16
             C 8 20.42, 11.58 24, 16 24"
          stroke="url(#nm-grad)"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
          opacity="0.65"
        />

        {/* Right vertical — signal bar */}
        <line
          x1="26"
          y1="8"
          x2="26"
          y2="24"
          stroke="url(#nm-grad-2)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Signal ticks */}
        <line
          x1="22"
          y1="11"
          x2="22"
          y2="21"
          stroke="url(#nm-grad-2)"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Center dot — focal point */}
        <circle
          cx="16"
          cy="16"
          r="2.4"
          fill="url(#nm-grad)"
          opacity="0.95"
        />
      </svg>
    </div>
  )
}
