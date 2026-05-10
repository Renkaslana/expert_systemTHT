import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Calendar,
  ChevronLeft,
  Printer,
  RotateCcw,
  Share2,
} from 'lucide-react'
import { PageShell } from '@/components/shared/PageShell'
import { MedicalDisclaimer } from '@/components/shared/MedicalDisclaimer'
import { DiagnosisCard } from '@/components/result/DiagnosisCard'
import { ExplainabilityPanel } from '@/components/result/ExplainabilityPanel'
import { RegionHeatmap } from '@/components/consultation/RegionHeatmap'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useConsultationStore } from '@/stores/consultationStore'
import { cn, formatTimestamp } from '@/lib/utils'

export function ResultPage() {
  const navigate = useNavigate()
  const { result, selectedSymptoms, startedAt, reset } = useConsultationStore()

  useEffect(() => {
    if (!result || result.length === 0) {
      navigate('/konsultasi', { replace: true })
    }
  }, [result, navigate])

  if (!result || result.length === 0) return null

  const [primary, ...rest] = result

  const handlePrint = () => window.print()
  const handleRestart = () => {
    reset()
    navigate('/konsultasi')
  }

  return (
    <PageShell withAurora>
      <div className="container py-8 md:py-12">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/konsultasi"
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
          >
            <ChevronLeft className="h-4 w-4" />
            Edit Gejala
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Cetak</span>
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Bagikan</span>
            </Button>
            <Button size="sm" onClick={handleRestart}>
              <RotateCcw className="h-4 w-4" />
              Mulai Ulang
            </Button>
          </div>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-6 flex flex-col gap-3"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success">Hasil Diagnosis</Badge>
            <Badge variant="muted" className="gap-1.5">
              <Calendar className="h-3 w-3" />
              {formatTimestamp(startedAt ?? new Date())}
            </Badge>
            <Badge variant="outline">{selectedSymptoms.size} gejala dianalisis</Badge>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Hasil analisis sistem pakar Anda
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Berikut peringkat kemungkinan kondisi berdasarkan kombinasi gejala yang
            Anda pilih dengan bobot pakar pada knowledge base Diagnova.
          </p>
          <RegionHeatmap selected={selectedSymptoms} className="mt-1" />
        </motion.div>

        {/* Disclaimer */}
        <div className="mt-6">
          <MedicalDisclaimer variant="banner" />
        </div>

        {/* Primary diagnosis */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className="mt-6"
        >
          <DiagnosisCard result={primary} primary />
        </motion.div>

        {/* Layout split: secondaries + explainability */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_minmax(0,420px)]">
          <div className="space-y-3">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Kandidat lain
            </h2>
            {rest.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                Tidak ada kandidat sekunder dengan tingkat keyakinan ≥ 10%.
              </div>
            ) : (
              rest.map((r, idx) => (
                <motion.div
                  key={r.diseaseCode}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                >
                  <DiagnosisCard result={r} />
                </motion.div>
              ))
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.45 }}
          >
            <ExplainabilityPanel result={primary} />
          </motion.div>
        </div>
      </div>
    </PageShell>
  )
}
