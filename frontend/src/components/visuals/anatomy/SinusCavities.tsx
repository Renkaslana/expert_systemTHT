import { motion } from 'framer-motion'

interface SinusCavitiesProps {
  inflamed?: boolean
  className?: string
}

/**
 * Front-facing sinus map: frontal, ethmoid, maxillary, sphenoid cavities.
 * Inflammation tints the maxillary + frontal areas in amber/rose.
 */
export function SinusCavities({ inflamed = true, className }: SinusCavitiesProps) {
  return (
    <svg
      viewBox="0 0 360 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="sinus-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.85" />
        </linearGradient>
        <radialGradient id="inflame-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Skull silhouette (front) */}
      <motion.path
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.6 }}
        d="M 180 60
           C 130 60, 95 95, 95 150
           C 95 180, 100 200, 110 220
           C 120 245, 130 270, 140 290
           C 148 310, 165 322, 180 322
           C 195 322, 212 310, 220 290
           C 230 270, 240 245, 250 220
           C 260 200, 265 180, 265 150
           C 265 95, 230 60, 180 60 Z"
        stroke="url(#sinus-stroke)"
        strokeWidth="1.8"
        fill="rgba(14,165,233,0.04)"
      />

      {/* Frontal sinus — paired pockets above the brow */}
      {[
        { x: 156, y: 110, w: 22, h: 26 },
        { x: 204, y: 110, w: 22, h: 26 },
      ].map((s, i) => (
        <motion.ellipse
          key={`f-${i}`}
          cx={s.x + s.w / 2 - 11}
          cy={s.y}
          rx={s.w / 2}
          ry={s.h / 2}
          stroke={inflamed ? '#F59E0B' : 'url(#sinus-stroke)'}
          strokeWidth="1.4"
          fill={inflamed ? 'rgba(245,158,11,0.18)' : 'rgba(14,165,233,0.06)'}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
        />
      ))}

      {/* Ethmoid sinus — small honeycomb between eyes */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.55 }}
      >
        {[
          [170, 150],
          [180, 150],
          [190, 150],
          [175, 160],
          [185, 160],
        ].map(([x, y], i) => (
          <circle
            key={`e-${i}`}
            cx={x}
            cy={y}
            r="3.4"
            fill={inflamed ? 'rgba(245,158,11,0.25)' : 'rgba(14,165,233,0.10)'}
            stroke="url(#sinus-stroke)"
            strokeWidth="0.9"
          />
        ))}
      </motion.g>

      {/* Eyes (decorative) */}
      {[140, 220].map((cx, i) => (
        <motion.g key={`eye-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.4 }}>
          <ellipse cx={cx} cy={150} rx="14" ry="8" stroke="url(#sinus-stroke)" strokeWidth="1.2" fill="none" />
          <circle cx={cx} cy={150} r="3" fill="#0EA5E9" opacity="0.55" />
        </motion.g>
      ))}

      {/* Nasal cavity */}
      <motion.path
        d="M 180 162 C 175 180, 175 200, 180 218 C 185 200, 185 180, 180 162 Z"
        stroke="url(#sinus-stroke)"
        strokeWidth="1.4"
        fill="rgba(14,165,233,0.08)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      />

      {/* Maxillary sinus — paired large pockets either side of nose */}
      {[
        { cx: 138, cy: 200 },
        { cx: 222, cy: 200 },
      ].map((s, i) => (
        <motion.path
          key={`m-${i}`}
          d={`M ${s.cx - 22} ${s.cy - 14}
              C ${s.cx - 28} ${s.cy + 6}, ${s.cx - 18} ${s.cy + 26}, ${s.cx} ${s.cy + 28}
              C ${s.cx + 18} ${s.cy + 26}, ${s.cx + 22} ${s.cy + 6}, ${s.cx + 16} ${s.cy - 14}
              C ${s.cx + 6} ${s.cy - 22}, ${s.cx - 14} ${s.cy - 22}, ${s.cx - 22} ${s.cy - 14} Z`}
          stroke={inflamed ? '#F59E0B' : 'url(#sinus-stroke)'}
          strokeWidth="1.5"
          fill={inflamed ? 'rgba(245,158,11,0.22)' : 'rgba(14,165,233,0.06)'}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 + i * 0.1 }}
        />
      ))}

      {inflamed && (
        <>
          <motion.circle
            cx={138}
            cy={200}
            r="46"
            fill="url(#inflame-glow)"
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity }}
          />
          <motion.circle
            cx={222}
            cy={200}
            r="46"
            fill="url(#inflame-glow)"
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: 0.4 }}
          />
        </>
      )}

      {/* Mouth (ghosted) */}
      <path
        d="M 165 252 Q 180 258 195 252"
        stroke="url(#sinus-stroke)"
        strokeWidth="1.2"
        opacity="0.4"
        fill="none"
      />
    </svg>
  )
}
