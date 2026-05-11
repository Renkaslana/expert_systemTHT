import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface MiniConfidenceRingProps {
  value: number // 0..1
  size?: number
  stroke?: number
  className?: string
  color?: string
  trackOpacity?: number
  showLabel?: boolean
  label?: string
}

export function MiniConfidenceRing({
  value,
  size = 96,
  stroke = 8,
  className,
  color = '#10B981',
  trackOpacity = 0.18,
  showLabel = true,
  label,
}: MiniConfidenceRingProps) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const target = Math.max(0, Math.min(1, value))

  const progress = useMotionValue(0)
  const [display, setDisplay] = useState('0')
  const dash = useTransform(progress, (p) => `${p * c} ${c}`)

  useEffect(() => {
    const ctrl = animate(progress, target, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(`${(v * 100).toFixed(0)}`),
    })
    return ctrl.stop
  }, [progress, target])

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeOpacity={trackOpacity}
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={dash as unknown as string}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-base font-bold leading-none">{display}%</span>
          {label && (
            <span className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
