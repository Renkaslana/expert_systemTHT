import { motion } from 'framer-motion'

interface EarCanalCloseupProps {
  /** Render a serumen plug for the Serumen Obsturans card. */
  withPlug?: boolean
  className?: string
}

/**
 * Otoscope-style close-up of the ear canal looking toward the eardrum.
 * Concentric canal walls plus optional serumen plug (amber).
 */
export function EarCanalCloseup({ withPlug = false, className }: EarCanalCloseupProps) {
  return (
    <svg
      viewBox="0 0 360 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <radialGradient id="canal-depth" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0B1220" stopOpacity="1" />
          <stop offset="60%" stopColor="#1E293B" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="plug-grad" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FBBF24" stopOpacity="1" />
          <stop offset="100%" stopColor="#92400E" stopOpacity="0.8" />
        </radialGradient>
        <linearGradient id="canal-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Outer rim */}
      <circle cx="180" cy="180" r="150" stroke="url(#canal-wall)" strokeWidth="1.4" fill="rgba(14,165,233,0.04)" />

      {/* Concentric canal walls — perspective */}
      {[140, 120, 100, 80, 62, 46].map((r, i) => (
        <motion.circle
          key={r}
          cx="180"
          cy="180"
          r={r}
          stroke="url(#canal-wall)"
          strokeWidth="1"
          strokeOpacity={0.55 - i * 0.06}
          fill="none"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
        />
      ))}

      {/* Depth */}
      <circle cx="180" cy="180" r="50" fill="url(#canal-depth)" />

      {/* Serumen plug */}
      {withPlug && (
        <motion.g
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <ellipse cx="180" cy="180" rx="44" ry="34" fill="url(#plug-grad)" />
          <ellipse cx="180" cy="180" rx="44" ry="34" stroke="#92400E" strokeOpacity="0.6" strokeWidth="1.2" fill="none" />
          {/* texture */}
          {[
            [170, 172, 4],
            [188, 178, 3],
            [176, 188, 5],
            [196, 168, 2],
            [166, 184, 2],
          ].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="#78350F" opacity="0.55" />
          ))}
        </motion.g>
      )}

      {/* Light reflection at top */}
      <ellipse cx="180" cy="120" rx="60" ry="6" fill="#ffffff" opacity="0.08" />

      {/* Otoscope ring frame */}
      <circle cx="180" cy="180" r="156" stroke="rgba(148,163,184,0.25)" strokeWidth="0.8" strokeDasharray="3 6" />
    </svg>
  )
}
