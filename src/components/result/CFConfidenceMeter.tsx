import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { ConfidenceLevel } from '@/types'
import { confidenceColor } from '@/lib/utils'

interface CFConfidenceMeterProps {
  value: number // 0..1
  level: ConfidenceLevel
  size?: number
}

export function CFConfidenceMeter({ value, level, size = 220 }: CFConfidenceMeterProps) {
  const c = confidenceColor(level)
  const stroke = 14
  const r = (size - stroke) / 2
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * r * 0.75 // 270deg arc
  const target = Math.max(0, Math.min(1, value))

  const progress = useMotionValue(0)
  const [display, setDisplay] = useState('0.0')
  const dash = useTransform(progress, (p) => `${p * circumference} ${circumference}`)

  useEffect(() => {
    const controls = animate(progress, target, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay((v * 100).toFixed(1)),
    })
    return controls.stop
  }, [progress, target])

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-[225deg]"
      >
        <defs>
          <linearGradient id="meter-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={c.hex} stopOpacity="0.95" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.95" />
          </linearGradient>
        </defs>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          className="text-muted/60"
        />
        <motion.circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="url(#meter-gradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={dash as unknown as string}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-4xl font-bold tracking-tight text-foreground">
          {display}
          <span className="text-xl text-muted-foreground">%</span>
        </span>
        <span className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
          Tingkat Keyakinan
        </span>
        <span
          className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${c.bg} ${c.text}`}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: c.hex }} />
          {c.label}
        </span>
      </div>
    </div>
  )
}
