import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BrainCircuit, ChevronDown, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { DiagnosisResult } from '@/types'
import { cn } from '@/lib/utils'

interface ExplainabilityPanelProps {
  result: DiagnosisResult
}

export function ExplainabilityPanel({ result }: ExplainabilityPanelProps) {
  const [open, setOpen] = useState(true)

  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 p-5 text-left hover:bg-muted/40"
      >
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-base font-semibold">
              Mengapa sistem menyimpulkan ini?
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Lihat langkah inferensi dan bobot pakar yang dipakai
            </p>
          </div>
        </div>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-muted-foreground transition-transform duration-300',
            open && 'rotate-180',
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <CardContent className="space-y-5 p-5 pt-0">
              <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  Penjelasan ringkas
                </div>
                <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                  {result.explanation}
                </p>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Iterasi Combine CF
                  </h4>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    cf₁ + cf₂·(1 − cf₁)
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="rounded-xl border border-border/60 bg-background p-3">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Step 0 · CF awal</span>
                      <span className="font-mono">{result.contributingSymptoms[0]?.symptomName}</span>
                    </div>
                    <p className="mt-1 font-mono text-sm">
                      cf₀ = {result.contributingSymptoms[0]?.cfValue.toFixed(3)}
                    </p>
                  </div>
                  {result.iterationSteps.map((step, idx) => (
                    <motion.div
                      key={`${step.iteration}-${step.symptomCode}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className={cn(
                        'rounded-xl border p-3',
                        idx === result.iterationSteps.length - 1
                          ? 'border-emerald-500/40 bg-emerald-500/5'
                          : 'border-border/60 bg-background',
                      )}
                    >
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>Step {step.iteration} · tambahkan {step.symptomName}</span>
                        <span className="font-mono">cf = {step.cfAfter.toFixed(3)}</span>
                      </div>
                      <p className="mt-1 font-mono text-sm break-all">{step.formula}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/30 p-3 text-[11px] text-muted-foreground">
                Bobot pakar bersumber dari{' '}
                <span className="font-semibold text-foreground">
                  dr. M. Agus Sugicharto, Sp.THT-KL
                </span>{' '}
                (Jurnal Teknik Elektro Vol. 10 No. 1, 2018).
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
