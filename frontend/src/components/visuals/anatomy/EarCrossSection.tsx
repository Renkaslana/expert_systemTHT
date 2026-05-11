import { motion } from 'framer-motion'

interface EarCrossSectionProps {
  /** Tint the inflamed middle-ear region (used for OMA). */
  inflamed?: boolean
  /** Highlight the outer-canal region (used for Otitis Externa). */
  highlightCanal?: boolean
  className?: string
}

/**
 * Stylized ear cross-section — pinna, canal, eardrum, malleus/incus/stapes,
 * cochlea, eustachian tube. Pure SVG, ~520×520 viewBox so it scales well in
 * featured cards. Annotation pins fade in on mount.
 */
export function EarCrossSection({
  inflamed = false,
  highlightCanal = false,
  className,
}: EarCrossSectionProps) {
  return (
    <svg
      viewBox="0 0 520 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="ear-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="ear-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.04" />
        </linearGradient>
        <radialGradient id="ear-inflamed" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#F43F5E" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ear-canal-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* faint enclosing field */}
      <circle cx="260" cy="210" r="190" fill="url(#ear-fill)" />

      {/* Pinna (outer ear) */}
      <motion.path
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: 'easeInOut' }}
        d="M 110 210
           C 100 150, 130 90, 190 80
           C 245 72, 275 110, 270 160
           C 268 188, 250 200, 240 210
           C 230 220, 230 240, 240 250
           C 252 262, 244 285, 220 290
           C 195 295, 160 280, 138 260
           C 118 244, 110 230, 110 210 Z"
        stroke="url(#ear-stroke)"
        strokeWidth="2"
        fill="url(#ear-fill)"
      />

      {/* Inner pinna fold */}
      <motion.path
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.7 }}
        transition={{ duration: 1.6, delay: 0.2, ease: 'easeInOut' }}
        d="M 165 165 C 195 130, 230 130, 240 175 C 246 200, 222 215, 195 215"
        stroke="url(#ear-stroke)"
        strokeWidth="1.4"
      />

      {/* Tragus dot */}
      <circle cx="245" cy="232" r="4" fill="#0EA5E9" opacity="0.6" />

      {/* Ear canal (highlightable) */}
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 0.4 }}
        d="M 250 215 C 275 220, 300 222, 320 222 L 350 222"
        stroke={highlightCanal ? '#F59E0B' : 'url(#ear-stroke)'}
        strokeWidth={highlightCanal ? 3 : 2.2}
        strokeLinecap="round"
      />
      {highlightCanal && (
        <circle cx="290" cy="222" r="20" fill="url(#ear-canal-glow)" />
      )}

      {/* Eardrum */}
      <motion.line
        x1="350"
        y1="200"
        x2="350"
        y2="244"
        stroke="url(#ear-stroke)"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      />

      {/* Middle ear cavity outline (inflamed?) */}
      <motion.path
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.0, delay: 0.6 }}
        d="M 352 205 C 385 198, 415 200, 425 220 C 432 236, 415 252, 395 250 C 375 248, 358 240, 352 235 Z"
        stroke={inflamed ? '#F43F5E' : 'url(#ear-stroke)'}
        strokeWidth="1.8"
        fill={inflamed ? 'rgba(244, 63, 94, 0.18)' : 'rgba(14,165,233,0.05)'}
      />
      {inflamed && (
        <motion.circle
          cx="390"
          cy="225"
          r="34"
          fill="url(#ear-inflamed)"
          animate={{ opacity: [0.45, 0.85, 0.45] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Ossicles: malleus, incus, stapes — three little linked dots */}
      {[
        { x: 360, y: 218 },
        { x: 376, y: 214 },
        { x: 392, y: 220 },
      ].map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="3"
          fill="#38BDF8"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.9 + i * 0.1 }}
        />
      ))}
      <motion.path
        d="M 360 218 L 376 214 L 392 220"
        stroke="#38BDF8"
        strokeWidth="1.2"
        strokeOpacity="0.6"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      />

      {/* Cochlea (spiral-ish) */}
      <motion.path
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.6, delay: 1.0 }}
        d="M 430 248 C 458 250, 470 270, 460 290 C 452 306, 432 304, 428 290 C 425 280, 432 273, 442 274"
        stroke="url(#ear-stroke)"
        strokeWidth="1.8"
        fill="none"
      />

      {/* Eustachian tube */}
      <motion.path
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.85 }}
        transition={{ duration: 1.2, delay: 1.2 }}
        d="M 358 250 C 358 285, 340 320, 305 340"
        stroke="url(#ear-stroke)"
        strokeWidth="1.6"
        strokeDasharray="3 4"
      />

      {/* Annotation pins */}
      <AnnotationPin x={140} y={130} label="Pinna" delay={1.4} />
      <AnnotationPin x={300} y={195} label="Canalis" delay={1.55} highlight={highlightCanal} />
      <AnnotationPin x={392} y={170} label="Tympanum" delay={1.7} highlight={inflamed} />
      <AnnotationPin x={465} y={272} label="Cochlea" delay={1.85} />
    </svg>
  )
}

interface PinProps {
  x: number
  y: number
  label: string
  delay?: number
  highlight?: boolean
}

function AnnotationPin({ x, y, label, delay = 0, highlight }: PinProps) {
  const labelW = label.length * 6.6 + 14
  return (
    <motion.g
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <line
        x1={x}
        y1={y + 6}
        x2={x}
        y2={y + 22}
        stroke={highlight ? '#F59E0B' : '#94A3B8'}
        strokeWidth="1"
        strokeDasharray="2 2"
        opacity="0.6"
      />
      <circle cx={x} cy={y + 24} r="2.5" fill={highlight ? '#F59E0B' : '#94A3B8'} />
      <rect
        x={x - labelW / 2}
        y={y - 14}
        width={labelW}
        height="18"
        rx="9"
        fill={highlight ? 'rgba(245,158,11,0.12)' : 'rgba(15,23,42,0.06)'}
        stroke={highlight ? 'rgba(245,158,11,0.45)' : 'rgba(148,163,184,0.4)'}
        strokeWidth="0.8"
      />
      <text
        x={x}
        y={y - 1}
        textAnchor="middle"
        fontSize="10"
        fontFamily="JetBrains Mono, ui-monospace, monospace"
        fill={highlight ? '#B45309' : '#475569'}
      >
        {label}
      </text>
    </motion.g>
  )
}
