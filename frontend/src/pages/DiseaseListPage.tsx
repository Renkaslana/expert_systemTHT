import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BrainCircuit, Ear, Stethoscope, Wind } from 'lucide-react'
import { PageShell } from '@/components/shared/PageShell'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getDiseases } from '@/lib/diagnova-api'
import { ApiError } from '@/lib/api'
import type { Disease } from '@/types'

const ICONS = {
  ear: Ear,
  nose: Wind,
  throat: Stethoscope,
  sinus: BrainCircuit,
  general: Stethoscope,
} as const

export function DiseaseListPage() {
  const [diseases, setDiseases] = useState<Disease[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    getDiseases({ signal: controller.signal })
      .then((rows) => setDiseases(rows))
      .catch((err) => {
        if (err?.name === 'AbortError') return
        const message =
          err instanceof ApiError
            ? err.code === 'NETWORK_ERROR'
              ? 'Tidak bisa terhubung ke server backend.'
              : err.message
            : 'Terjadi kesalahan saat memuat data penyakit.'
        setError(message)
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [])

  return (
    <PageShell withAurora>
      <div className="container py-12 md:py-16">
        <div className="max-w-2xl">
          <Badge variant="secondary">Knowledge Base</Badge>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Penyakit dalam basis pengetahuan Diagnova
          </h1>
          <p className="mt-2 text-muted-foreground">
            Lima kondisi THT umum yang dirangkum dari pakar dan literatur medis. Klik
            untuk melihat detail klinis, penyebab, dan saran penanganan.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900 dark:border-rose-500/30 dark:bg-rose-950/40 dark:text-rose-100"
          >
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Card key={idx} className="animate-pulse">
                <CardContent className="flex h-[260px] flex-col p-6">
                  <div className="h-11 w-11 rounded-xl bg-muted" />
                  <div className="mt-4 h-5 w-2/3 rounded bg-muted" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
                  <div className="mt-4 space-y-2">
                    <div className="h-3 w-full rounded bg-muted" />
                    <div className="h-3 w-5/6 rounded bg-muted" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {diseases.map((d, idx) => {
              const Icon = ICONS[d.iconKey]
              return (
                <motion.div
                  key={d.code}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                >
                  <Link to={`/penyakit/${d.code}`} className="group block h-full">
                    <Card className="h-full transition-all group-hover:-translate-y-1 group-hover:border-primary/40">
                      <CardContent className="flex h-full flex-col p-6">
                        <div className="flex items-start justify-between gap-3">
                          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/15 to-violet-500/15 text-sky-600 dark:text-sky-300">
                            <Icon className="h-5 w-5" />
                          </div>
                          <Badge variant="outline" className="font-mono text-[10px]">
                            {d.icdCode}
                          </Badge>
                        </div>
                        <h3 className="mt-4 font-display text-lg font-semibold">
                          {d.name}
                        </h3>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">
                          {d.category}
                        </p>
                        <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                          {d.description}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-5">
                          <Badge
                            variant={
                              d.severity === 'severe'
                                ? 'danger'
                                : d.severity === 'moderate'
                                ? 'warning'
                                : 'success'
                            }
                          >
                            {d.severity === 'severe'
                              ? 'Berat'
                              : d.severity === 'moderate'
                              ? 'Sedang'
                              : 'Ringan'}
                          </Badge>
                          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                            Detail
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </PageShell>
  )
}
