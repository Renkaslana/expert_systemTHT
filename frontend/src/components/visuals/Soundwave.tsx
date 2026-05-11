import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SoundwaveProps {
  bars?: number
  className?: string
  variant?: 'gradient' | 'mono'
}

const SEED = [
  0.3, 0.55, 0.42, 0.78, 0.62, 0.92, 0.74, 0.5, 0.66, 0.84, 0.58, 0.42, 0.7, 0.58, 0.46,
  0.3, 0.62, 0.5, 0.78, 0.36, 0.84, 0.66, 0.5, 0.42, 0.7, 0.58, 0.92, 0.66, 0.46, 0.34,
  0.55, 0.78,
]

export function Soundwave({ bars = 32, className, variant = 'gradient' }: SoundwaveProps) {
  const heights = SEED.slice(0, bars)
  return (
    <div className={cn('flex items-end gap-[3px]', className)}>
      {heights.map((h, i) => (
        <motion.span
          key={i}
          className={cn(
            'w-[3px] rounded-full',
            variant === 'gradient'
              ? 'bg-gradient-to-t from-sky-500 via-violet-500 to-cyan-400'
              : 'bg-foreground/70',
          )}
          initial={{ scaleY: 0.2 }}
          animate={{
            scaleY: [h * 0.4, h, h * 0.6, h * 1.05, h * 0.5, h],
          }}
          transition={{
            duration: 1.6 + (i % 5) * 0.15,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.04,
          }}
          style={{
            height: '100%',
            transformOrigin: 'bottom',
          }}
        />
      ))}
    </div>
  )
}
