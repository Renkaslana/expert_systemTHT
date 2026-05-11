import { motion } from 'framer-motion'

interface ThroatTonsilsProps {
  inflamed?: boolean
  className?: string
}

/**
 * Open-mouth view of the throat: uvula, tonsils, soft palate, posterior wall.
 * When `inflamed`, tonsils tint amber/rose with pulse.
 */
export function ThroatTonsils({ inflamed = false, className }: ThroatTonsilsProps) {
  return (
    <svg
      viewBox="0 0 360 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="throat-stroke" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.85" />
        </linearGradient>
        <radialGradient id="oral-cavity" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(15,23,42,0.55)" stopOpacity="1" />
          <stop offset="100%" stopColor="rgba(15,23,42,0.0)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tonsil-inflamed" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#F43F5E" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer mouth oval */}
      <motion.ellipse
        cx="180"
        cy="180"
        rx="125"
        ry="80"
        stroke="url(#throat-stroke)"
        strokeWidth="2"
        fill="rgba(14,165,233,0.04)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4 }}
      />

      {/* Inner oral cavity */}
      <motion.ellipse
        cx="180"
        cy="180"
        rx="80"
        ry="56"
        fill="url(#oral-cavity)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      />
      <motion.ellipse
        cx="180"
        cy="180"
        rx="80"
        ry="56"
        stroke="url(#throat-stroke)"
        strokeWidth="1.4"
        strokeOpacity="0.6"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      />

      {/* Soft palate — top arch */}
      <motion.path
        d="M 110 150 C 140 130, 220 130, 250 150"
        stroke="url(#throat-stroke)"
        strokeWidth="1.6"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      />

      {/* Uvula */}
      <motion.path
        d="M 178 148 Q 180 168 184 178 Q 178 182 174 178 Q 178 168 178 148 Z"
        stroke="url(#throat-stroke)"
        strokeWidth="1.2"
        fill="rgba(14,165,233,0.10)"
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      />

      {/* Tongue — bottom */}
      <motion.path
        d="M 110 215 C 140 240, 220 240, 250 215 C 240 230, 200 240, 180 240 C 160 240, 120 230, 110 215 Z"
        stroke="url(#throat-stroke)"
        strokeWidth="1.4"
        fill="rgba(244,114,182,0.08)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.0, delay: 0.6 }}
      />

      {/* Tonsils (paired) */}
      {[
        { x: 138, y: 188 },
        { x: 222, y: 188 },
      ].map((t, i) => (
        <motion.g
          key={`tons-${i}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.1 + i * 0.1 }}
        >
          {inflamed && (
            <motion.circle
              cx={t.x}
              cy={t.y}
              r="22"
              fill="url(#tonsil-inflamed)"
              animate={{ opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 2.0, repeat: Infinity, delay: i * 0.4 }}
            />
          )}
          <ellipse
            cx={t.x}
            cy={t.y}
            rx="12"
            ry="16"
            fill={inflamed ? 'rgba(244,63,94,0.35)' : 'rgba(244,114,182,0.18)'}
            stroke={inflamed ? '#F43F5E' : 'url(#throat-stroke)'}
            strokeWidth="1.4"
          />
          {/* tonsil texture dots */}
          {[0, 1, 2].map((d) => (
            <circle
              key={d}
              cx={t.x + (d - 1) * 3}
              cy={t.y + (d % 2 === 0 ? -2 : 4)}
              r="1.2"
              fill={inflamed ? '#F43F5E' : '#0EA5E9'}
              opacity="0.6"
            />
          ))}
        </motion.g>
      ))}

      {/* Posterior pharyngeal wall — back of throat */}
      <motion.path
        d="M 158 178 C 170 188, 190 188, 202 178 C 198 192, 162 192, 158 178 Z"
        stroke="url(#throat-stroke)"
        strokeWidth="1"
        fill={inflamed ? 'rgba(244,63,94,0.18)' : 'rgba(15,23,42,0.4)'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
      />
    </svg>
  )
}
