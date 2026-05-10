import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step {
  key: string
  label: string
  description: string
}

interface ConsultationStepperProps {
  steps: Step[]
  current: number
}

export function ConsultationStepper({ steps, current }: ConsultationStepperProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-clean pb-1">
      {steps.map((step, idx) => {
        const done = idx < current
        const active = idx === current
        return (
          <div key={step.key} className="flex min-w-0 flex-1 items-center gap-2">
            <div className="flex min-w-0 items-center gap-3">
              <motion.div
                layout
                className={cn(
                  'relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors',
                  done
                    ? 'border-emerald-500/40 bg-emerald-500 text-white'
                    : active
                    ? 'border-primary bg-primary text-primary-foreground step-shadow'
                    : 'border-border bg-background text-muted-foreground',
                )}
              >
                {done ? <Check className="h-4 w-4" /> : idx + 1}
              </motion.div>
              <div className="hidden min-w-0 sm:block">
                <p
                  className={cn(
                    'text-sm font-semibold leading-none',
                    active ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {step.label}
                </p>
                <p className="mt-1 truncate text-[11px] text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
            {idx < steps.length - 1 && (
              <div className="relative h-px flex-1 overflow-hidden bg-border">
                <motion.div
                  initial={false}
                  animate={{ scaleX: done ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="h-full origin-left bg-gradient-to-r from-emerald-400 to-sky-500"
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
