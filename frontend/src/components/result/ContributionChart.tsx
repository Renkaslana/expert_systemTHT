import { motion } from 'framer-motion'
import type { SymptomContribution } from '@/types'

interface ContributionChartProps {
  data: SymptomContribution[]
  delay?: number
}

export function ContributionChart({ data, delay = 0.2 }: ContributionChartProps) {
  const max = Math.max(...data.map((d) => d.contributionPercent), 1)
  return (
    <ul className="space-y-3">
      {data.map((item, idx) => {
        const widthPct = (item.contributionPercent / max) * 100
        return (
          <li key={item.symptomCode}>
            <div className="mb-1 flex items-center justify-between gap-3 text-xs">
              <span className="truncate font-medium text-foreground">
                {item.symptomName}
              </span>
              <span className="font-mono text-muted-foreground">
                {item.contributionPercent.toFixed(1)}%
              </span>
            </div>
            <div className="relative h-2 overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${widthPct}%` }}
                transition={{
                  delay: delay + idx * 0.08,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-sky-500 via-sky-400 to-violet-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]"
              />
            </div>
            <div className="mt-1 flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
              <span>user {item.userWeight.toFixed(1)}</span>
              <span className="opacity-50">×</span>
              <span>pakar {item.expertWeight.toFixed(1)}</span>
              <span className="opacity-50">=</span>
              <span className="text-foreground">cf {item.cfValue.toFixed(2)}</span>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
