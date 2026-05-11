import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Crown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CFConfidenceMeter } from './CFConfidenceMeter'
import { ContributionChart } from './ContributionChart'
import { buttonVariants } from '@/components/ui/button'
import type { DiagnosisResult } from '@/types'
import { confidenceColor, cn } from '@/lib/utils'

interface DiagnosisCardProps {
  result: DiagnosisResult
  primary?: boolean
}

export function DiagnosisCard({ result, primary = false }: DiagnosisCardProps) {
  const c = confidenceColor(result.confidenceLevel)

  if (!primary) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-sm font-bold">
              #{result.rank}
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {result.diseaseCategory}
              </p>
              <h3 className="font-display text-base font-semibold">
                {result.diseaseName}
              </h3>
              <p className="mt-1 line-clamp-2 max-w-md text-xs text-muted-foreground">
                {result.explanation}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-mono text-2xl font-bold">{result.cfPercentage}</p>
              <span className={cn('text-[11px] font-semibold', c.text)}>
                {c.label}
              </span>
            </div>
            <Link
              to={`/penyakit/${result.diseaseCode}`}
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
            >
              Detail
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-aurora opacity-50 dark:opacity-30" />
      <div
        className="pointer-events-none absolute -top-40 right-0 h-72 w-72 rounded-full blur-3xl"
        style={{ background: c.hex, opacity: 0.18 }}
      />
      <CardContent className="grid gap-8 p-6 md:grid-cols-[260px_1fr] md:p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <Badge className="mb-3 inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Crown className="h-3 w-3" />
            Diagnosis Utama
          </Badge>
          <CFConfidenceMeter value={result.cfValue} level={result.confidenceLevel} />
        </div>

        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {result.diseaseCategory}
              </p>
              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-1 font-display text-3xl font-bold tracking-tight md:text-4xl"
              >
                {result.diseaseName}
              </motion.h2>
            </div>
            <Badge variant="outline" className="font-mono text-[10px]">
              #{result.rank}
            </Badge>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {result.explanation}
          </p>

          <div className="mt-6">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Gejala yang berkontribusi
            </h4>
            <ContributionChart data={result.contributingSymptoms} />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Link
              to={`/penyakit/${result.diseaseCode}`}
              className={cn(buttonVariants({ size: 'sm' }))}
            >
              Pelajari Penyakit
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              to="/konsultasi"
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
            >
              Edit Gejala
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
