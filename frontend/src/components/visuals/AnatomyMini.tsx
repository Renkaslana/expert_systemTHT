import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type Region = 'ear' | 'nose' | 'sinus' | 'throat' | 'general'

interface AnatomyMiniProps {
  region: Region
  size?: number
  className?: string
}

/**
 * Compact side-profile glyph (~80px) that highlights one ENT region with a
 * concentric soundwave halo. Reuses the visual language of AnatomyCenterpiece
 * but in a single SVG node — no layout side-effects.
 */
export function AnatomyMini({ region, size = 80, className }: AnatomyMiniProps) {
  // Region anchor coordinates inside the 100×100 viewBox.
  const anchor: Record<Region, { x: number; y: number; color: string }> = {
    ear: { x: 64, y: 50, color: '#0EA5E9' },
    nose: { x: 46, y: 44, color: '#8B5CF6' },
    sinus: { x: 46, y: 38, color: '#8B5CF6' },
    throat: { x: 50, y: 80, color: '#06B6D4' },
    general: { x: 50, y: 50, color: '#0EA5E9' },
  }
  const a = anchor[region]

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size} fill="none">
        <defs>
          <linearGradient id="mini-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="mini-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.04" />
          </linearGradient>
          <radialGradient id="mini-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={a.color} stopOpacity="0.95" />
            <stop offset="100%" stopColor={a.color} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft enclosure */}
        <circle cx="50" cy="50" r="46" fill="url(#mini-fill)" />
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke="url(#mini-stroke)"
          strokeOpacity="0.35"
          strokeWidth="0.6"
        />

        {/* Stylized side-profile silhouette */}
        <path
          d="M 72 18
             C 58 16, 44 22, 38 32
             C 33 41, 33 47, 34 52
             C 35 57, 33 60, 31 62
             C 29 64, 28 66, 29 68
             C 30 70, 33 70, 36 70
             C 37 74, 38 76, 38 79
             C 38 83, 35 86, 35 88
             C 35 91, 39 92, 46 92
             L 56 93
             L 56 97"
          stroke="url(#mini-stroke)"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Region marker */}
        <circle cx={a.x} cy={a.y} r="6" fill="url(#mini-glow)" />
        <circle cx={a.x} cy={a.y} r="2" fill={a.color} />

        {/* Animated halos around active region */}
        {[5, 9, 14].map((r, i) => (
          <motion.circle
            key={r}
            cx={a.x}
            cy={a.y}
            r={r}
            stroke={a.color}
            strokeOpacity={0.55}
            strokeWidth="0.6"
            fill="none"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 0.7, 0], scale: [0.6, 1.2, 1.5] }}
            transition={{
              duration: 2.6,
              delay: i * 0.45,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            style={{ transformOrigin: `${a.x}px ${a.y}px` }}
          />
        ))}
      </svg>
    </div>
  )
}
