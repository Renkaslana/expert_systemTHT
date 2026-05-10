import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  ChevronLeft,
  Ear,
  HeartPulse,
  Leaf,
  Pill,
  ShieldAlert,
  Stethoscope,
  Wind,
} from 'lucide-react'
import { PageShell } from '@/components/shared/PageShell'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { MedicalDisclaimer } from '@/components/shared/MedicalDisclaimer'
import { AnatomyMini } from '@/components/visuals/AnatomyMini'
import { DISEASES, DISEASE_BY_CODE } from '@/data/diseases'
import { cn } from '@/lib/utils'

const ICONS = {
  ear: Ear,
  nose: Wind,
  throat: Stethoscope,
  sinus: BrainCircuit,
  general: Stethoscope,
} as const

const TABS = [
  { key: 'overview', label: 'Deskripsi', icon: BookOpen },
  { key: 'symptoms', label: 'Gejala', icon: HeartPulse },
  { key: 'causes', label: 'Penyebab', icon: Leaf },
  { key: 'treatment', label: 'Penanganan', icon: Pill },
] as const

type TabKey = (typeof TABS)[number]['key']

const SEVERITY_BADGE = {
  mild: { variant: 'success' as const, label: 'Ringan' },
  moderate: { variant: 'warning' as const, label: 'Sedang' },
  severe: { variant: 'danger' as const, label: 'Berat' },
}

export function DiseaseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [tab, setTab] = useState<TabKey>('overview')

  if (!id) return <Navigate to="/penyakit" replace />
  const disease = DISEASE_BY_CODE[id]
  if (!disease) return <Navigate to="/penyakit" replace />

  const Icon = ICONS[disease.iconKey]
  const sev = SEVERITY_BADGE[disease.severity]
  const related = disease.relatedDiseases
    .map((c) => DISEASE_BY_CODE[c])
    .filter(Boolean)

  return (
    <PageShell withAurora>
      <div className="container py-8 md:py-12">
        <Link
          to="/penyakit"
          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
        >
          <ChevronLeft className="h-4 w-4" />
          Daftar Penyakit
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-6 grid gap-6 md:grid-cols-[1fr_auto] md:items-end"
        >
          <div>
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <AnatomyMini region={disease.iconKey} size={80} />
                <div className="absolute -bottom-1 -right-1 inline-flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-background text-sky-600 shadow-sm dark:text-sky-300">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {disease.category}
                </p>
                <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                  {disease.name}
                </h1>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline" className="font-mono">
                ICD-10: {disease.icdCode}
              </Badge>
              <Badge variant="outline">{disease.nameShort}</Badge>
              <Badge variant={sev.variant}>{sev.label}</Badge>
              <Badge variant="muted">{disease.expertSource}</Badge>
            </div>
          </div>

          <Link
            to="/konsultasi"
            className={cn(buttonVariants({ size: 'lg' }), 'self-start md:self-end')}
          >
            Mulai Konsultasi
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main content */}
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex flex-wrap gap-1 rounded-2xl border border-border bg-muted/40 p-1">
              {TABS.map((t) => {
                const active = tab === t.key
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setTab(t.key)}
                    className={cn(
                      'relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'text-white'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="disease-tab"
                        className="absolute inset-0 rounded-xl bg-gradient-to-br from-sky-500 to-violet-500 shadow-[0_8px_22px_-10px_rgba(14,165,233,0.55)]"
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <t.icon className="h-3.5 w-3.5" />
                      {t.label}
                    </span>
                  </button>
                )
              })}
            </div>

            <Card>
              <CardContent className="p-6">
                {tab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="font-display text-lg font-semibold">Tentang penyakit</h2>
                    <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                      {disease.description}
                    </p>
                  </motion.div>
                )}

                {tab === 'symptoms' && (
                  <motion.div
                    key="symptoms"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="font-display text-lg font-semibold">Gejala umum</h2>
                    <ul className="mt-4 space-y-2.5">
                      {disease.generalSymptoms.map((s) => (
                        <li
                          key={s}
                          className="flex items-start gap-3 rounded-xl border border-border/60 bg-background p-3 text-sm"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {tab === 'causes' && (
                  <motion.div
                    key="causes"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="font-display text-lg font-semibold">Penyebab umum</h2>
                    <ul className="mt-4 space-y-2.5">
                      {disease.causes.map((c) => (
                        <li
                          key={c}
                          className="flex items-start gap-3 rounded-xl border border-border/60 bg-background p-3 text-sm"
                        >
                          <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {tab === 'treatment' && (
                  <motion.div
                    key="treatment"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="font-display text-lg font-semibold">Saran penanganan</h2>
                    <ul className="mt-4 space-y-2.5">
                      {disease.treatmentAdvice.map((t) => (
                        <li
                          key={t}
                          className="flex items-start gap-3 rounded-xl border border-border/60 bg-background p-3 text-sm"
                        >
                          <Pill className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Related */}
            {related.length > 0 && (
              <div>
                <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Penyakit terkait
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {related.map((rel) => {
                    const RelIcon = ICONS[rel.iconKey]
                    return (
                      <Link
                        key={rel.code}
                        to={`/penyakit/${rel.code}`}
                        className="group"
                      >
                        <Card className="transition-all group-hover:-translate-y-0.5 group-hover:border-primary/40">
                          <CardContent className="flex items-center gap-3 p-4">
                            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-sky-600 dark:text-sky-300">
                              <RelIcon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold">
                                {rel.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {rel.category}
                              </p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="h-4 w-4" />
                  <p className="text-sm font-semibold">Kapan harus ke dokter?</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                  {disease.whenToSeeDoctor}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ShieldAlert className="h-4 w-4" />
                  <p className="text-xs font-semibold uppercase tracking-wider">
                    Klasifikasi
                  </p>
                </div>
                <DetailRow label="Kode" value={disease.code} mono />
                <DetailRow label="ICD-10" value={disease.icdCode} mono />
                <DetailRow label="Kategori" value={disease.category} />
                <DetailRow label="Severity" value={sev.label} />
                <DetailRow label="Sumber" value={disease.expertSource} />
              </CardContent>
            </Card>

            <MedicalDisclaimer />
          </div>
        </div>

        {/* Footer all diseases */}
        <div className="mt-12 rounded-2xl border border-border bg-muted/30 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Penyakit lain dalam knowledge base
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {DISEASES.filter((d) => d.code !== disease.code).map((d) => (
              <Link
                key={d.code}
                to={`/penyakit/${d.code}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium hover:border-primary/40 hover:text-primary"
              >
                <span className="font-mono text-[10px] text-muted-foreground">
                  {d.code}
                </span>
                {d.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  )
}

function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn('text-right font-medium', mono && 'font-mono')}>{value}</span>
    </div>
  )
}
