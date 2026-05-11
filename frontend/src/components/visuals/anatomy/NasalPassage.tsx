import { motion } from 'framer-motion'

interface NasalPassageProps {
  /** Animate airflow lines through the passage. */
  airflow?: boolean
  className?: string
}

/**
 * Side-cut of the nasal passage with the three turbinates and a soft palate
 * boundary. Airflow ribbons travel through when `airflow` is true (used for
 * Rhinitis card).
 */
export function NasalPassage({ airflow = true, className }: NasalPassageProps) {
  return (
    <svg
      viewBox="0 0 360 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="nasal-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="airflow-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0" />
          <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Face profile (right-facing partial) */}
      <motion.path
        d="M 280 40
           C 220 40, 160 80, 130 130
           C 110 165, 110 195, 130 220
           C 150 245, 170 250, 190 248
           L 230 248
           L 230 280"
        stroke="url(#nasal-stroke)"
        strokeWidth="1.8"
        fill="rgba(14,165,233,0.04)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6 }}
      />

      {/* Lip line */}
      <path d="M 198 244 Q 215 252 232 248" stroke="url(#nasal-stroke)" strokeWidth="1" opacity="0.5" />

      {/* Nostril opening */}
      <ellipse cx="138" cy="170" rx="6" ry="3" fill="#0EA5E9" opacity="0.5" />

      {/* Turbinates — superior, middle, inferior */}
      {[
        { d: 'M 145 130 C 175 130, 205 140, 215 145', delay: 0.5 },
        { d: 'M 142 156 C 175 156, 205 165, 215 168', delay: 0.6 },
        { d: 'M 145 184 C 175 184, 205 188, 215 188', delay: 0.7 },
      ].map((t, i) => (
        <motion.path
          key={i}
          d={t.d}
          stroke="url(#nasal-stroke)"
          strokeWidth="1.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: t.delay }}
        />
      ))}

      {/* Soft palate */}
      <motion.path
        d="M 200 220 C 220 218, 232 224, 232 232"
        stroke="url(#nasal-stroke)"
        strokeWidth="1.2"
        opacity="0.7"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
      />

      {/* Airflow ribbons */}
      {airflow &&
        [144, 170, 196].map((y, i) => (
          <motion.path
            key={i}
            d={`M 132 ${y} Q 175 ${y - 6} 220 ${y - 4}`}
            stroke="url(#airflow-grad)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 0], opacity: [0, 0.9, 0] }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              delay: i * 0.4,
              ease: 'easeInOut',
            }}
          />
        ))}
    </svg>
  )
}
