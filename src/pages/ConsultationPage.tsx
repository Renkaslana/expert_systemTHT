import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Compass,
  RotateCcw,
  Search,
  Sparkles,
  Stethoscope,
} from 'lucide-react'
import { PageShell } from '@/components/shared/PageShell'
import { RegionPicker } from '@/components/consultation/RegionPicker'
import { SymptomCard } from '@/components/consultation/SymptomCard'
import { ProcessingAnimation } from '@/components/consultation/ProcessingAnimation'
import {
  AIAssistantPanel,
  type SelectedItem,
} from '@/components/consultation/AIAssistantPanel'
import { Button } from '@/components/ui/button'
import { useConsultationStore, type AreaFilter } from '@/stores/consultationStore'
import { SYMPTOMS, SYMPTOM_BY_CODE } from '@/data/symptoms'
import { mockDiagnose } from '@/data/mockDiagnosis'
import { cn } from '@/lib/utils'
import type { SymptomCategory } from '@/types'

const READY_THRESHOLD = 3

// ─── helpers ────────────────────────────────────────────────────────────────

const REGION_LABEL: Record<SymptomCategory, string> = {
  telinga: 'Telinga',
  hidung: 'Hidung',
  tenggorokan: 'Tenggorokan',
  umum: 'Umum',
}

// ─── page ───────────────────────────────────────────────────────────────────

export function ConsultationPage() {
  const navigate = useNavigate()
  const {
    selectedSymptoms,
    setSymptomWeight,
    removeSymptom,
    activeFilter,
    setFilter,
    reset,
    setResult,
    start,
  } = useConsultationStore()

  const [query, setQuery] = useState('')
  const [processing, setProcessing] = useState(false)
  // Track whether the user has explicitly chosen a region in this session.
  // Default: not yet — show onboarding empty state.
  const [hasPickedRegion, setHasPickedRegion] = useState(false)

  // Counts per region — both available + selected — for region tile badges.
  const availableByRegion = useMemo(() => {
    const m: Record<string, number> = { telinga: 0, hidung: 0, tenggorokan: 0, umum: 0 }
    for (const s of SYMPTOMS) m[s.category] = (m[s.category] ?? 0) + 1
    return m
  }, [])

  const selectedByRegion = useMemo(() => {
    const m: Record<string, number> = { telinga: 0, hidung: 0, tenggorokan: 0, umum: 0 }
    for (const code of selectedSymptoms.keys()) {
      const sym = SYMPTOM_BY_CODE[code]
      if (sym) m[sym.category] = (m[sym.category] ?? 0) + 1
    }
    return m
  }, [selectedSymptoms])

  const filteredSymptoms = useMemo(() => {
    return SYMPTOMS.filter((s) => {
      const matchFilter = activeFilter === 'all' || s.category === activeFilter
      const q = query.trim().toLowerCase()
      const matchQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.nameEn.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q)
      return matchFilter && matchQuery
    })
  }, [activeFilter, query])

  const selectedItems: SelectedItem[] = useMemo(() => {
    return Array.from(selectedSymptoms.entries())
      .map(([code, weight]) => {
        const symptom = SYMPTOM_BY_CODE[code]
        return symptom ? { symptom, weight } : null
      })
      .filter((x): x is SelectedItem => x !== null)
  }, [selectedSymptoms])

  const selectedCount = selectedItems.length

  // The active region is "engaged" once user explicitly tapped a tile OR
  // already has any symptom selected. This drives the empty-state reveal.
  const isEngaged = hasPickedRegion || selectedCount > 0

  const handleRegionChange = (key: AreaFilter) => {
    setFilter(key)
    setHasPickedRegion(true)
  }

  const handleReset = () => {
    reset()
    setHasPickedRegion(false)
    setQuery('')
  }

  const handleAnalyze = () => {
    if (selectedCount === 0) return
    start()
    setProcessing(true)
    window.setTimeout(() => {
      const result = mockDiagnose(selectedSymptoms)
      setResult(result)
      setProcessing(false)
      navigate('/hasil')
    }, 1900)
  }

  // For the "Step 2" heading, prefer explicit region; if user has selected
  // symptoms across regions, show "Semua area".
  const stepTwoHeading = useMemo(() => {
    if (activeFilter !== 'all' && activeFilter !== 'umum') {
      return `Gejala area ${REGION_LABEL[activeFilter as SymptomCategory]}`
    }
    if (activeFilter === 'umum') return 'Gejala umum'
    return 'Semua gejala'
  }, [activeFilter])

  return (
    <PageShell withAurora>
      <div className="container py-10 md:py-14">

        {/* ── Page header ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="editorial-eyebrow !text-[10px]">Konsultasi Mandiri</p>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-[2.5rem] md:leading-[1.1]">
              Mari kita pahami{' '}
              <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent dark:from-sky-300 dark:via-indigo-300 dark:to-cyan-300">
                keluhan Anda
              </span>{' '}
              — pelan-pelan.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Diagnova akan memandu langkah demi langkah. Pilih area yang
              terganggu, tandai gejala yang Anda rasakan, dan sistem akan
              menganalisis dengan reasoning yang transparan.
            </p>
          </div>
          {selectedCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="self-start"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          )}
        </div>

        {/* ── Stage progress (subtle, no big stepper) ─────────────────── */}
        <ol className="mt-6 flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          <StageDot
            label="Pilih area"
            active={!isEngaged}
            done={isEngaged}
          />
          <Connector />
          <StageDot
            label="Tandai gejala"
            active={isEngaged && selectedCount < READY_THRESHOLD}
            done={selectedCount >= READY_THRESHOLD}
          />
          <Connector />
          <StageDot
            label="Analisis"
            active={selectedCount >= READY_THRESHOLD}
            done={false}
          />
        </ol>

        {/* ── Two-column layout ───────────────────────────────────────── */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* LEFT: Region picker + symptoms */}
          <div className="space-y-8">

            {/* STEP 1 — region picker */}
            <section>
              <SectionHeader
                step="01"
                title="Bagian mana yang terganggu?"
                description="Sentuh salah satu area di bawah. Anda bisa mengganti area kapan saja."
              />
              <div className="mt-4">
                <RegionPicker
                  active={activeFilter}
                  onChange={handleRegionChange}
                  available={availableByRegion}
                  selected={selectedByRegion}
                />
              </div>
            </section>

            {/* STEP 2 — symptoms (empty state OR list) */}
            <section>
              <SectionHeader
                step="02"
                title={isEngaged ? stepTwoHeading : 'Tandai gejala yang Anda rasakan'}
                description={
                  isEngaged
                    ? 'Sentuh kartu untuk menandainya. Atur tingkat keyakinan jika perlu.'
                    : 'Pilih area di Langkah 1 untuk melihat daftar gejala yang relevan.'
                }
                rightSlot={
                  isEngaged ? (
                    <div className="relative w-full max-w-[260px]">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Cari gejala…"
                        className="h-9 w-full rounded-xl border border-border/70 bg-background/70 pl-9 pr-3 text-xs shadow-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
                      />
                    </div>
                  ) : null
                }
              />

              <div className="mt-5">
                <AnimatePresence mode="wait" initial={false}>
                  {!isEngaged ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <OnboardingEmptyState />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="list"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {filteredSymptoms.length === 0 ? (
                        <NoMatch onResetSearch={() => setQuery('')} hasQuery={!!query} />
                      ) : (
                        <motion.div
                          layout
                          className="grid gap-3"
                        >
                          <AnimatePresence>
                            {filteredSymptoms.map((s, idx) => (
                              <motion.div
                                key={s.code}
                                layout
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{
                                  duration: 0.32,
                                  delay: idx * 0.025,
                                  ease: [0.16, 1, 0.3, 1],
                                }}
                              >
                                <SymptomCard
                                  symptom={s}
                                  value={selectedSymptoms.get(s.code)}
                                  onChange={(w) =>
                                    setSymptomWeight(s.code, w)
                                  }
                                />
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* mobile spacer for floating bottom bar */}
            <div className="h-28 lg:hidden" />
          </div>

          {/* RIGHT: AI assistant sidebar (sticky on lg+) */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <AIAssistantPanel
              items={selectedItems}
              onRemove={removeSymptom}
              onClear={handleReset}
              onAnalyze={handleAnalyze}
            />
          </aside>
        </div>

        {/* ── Mobile floating action bar ──────────────────────────────── */}
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.45, ease: 'easeOut' }}
          className="fixed inset-x-0 bottom-4 z-30 px-4 lg:hidden"
        >
          <div className="container">
            <div className="glass-strong mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-all',
                    selectedCount >= READY_THRESHOLD
                      ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-[0_8px_20px_-8px_rgba(16,185,129,0.5)]'
                      : selectedCount > 0
                        ? 'bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow-[0_8px_20px_-8px_rgba(14,165,233,0.6)]'
                        : 'bg-muted text-muted-foreground',
                  )}
                >
                  {selectedCount}
                </div>
                <p className="text-xs leading-tight">
                  <span className="block font-semibold">
                    {selectedCount === 0
                      ? 'Belum ada gejala'
                      : selectedCount >= READY_THRESHOLD
                        ? 'Siap dianalisis'
                        : `${selectedCount} gejala`}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {selectedCount === 0
                      ? 'Pilih untuk memulai'
                      : selectedCount >= READY_THRESHOLD
                        ? 'Sistem siap menyimpulkan'
                        : `${READY_THRESHOLD - selectedCount} lagi untuk optimal`}
                  </span>
                </p>
              </div>
              <Button
                size="lg"
                disabled={selectedCount === 0}
                onClick={handleAnalyze}
              >
                <Sparkles className="h-4 w-4" />
                Diagnosa
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {processing && <ProcessingAnimation count={selectedCount} />}
        </AnimatePresence>
      </div>
    </PageShell>
  )
}

// ─── small bits ─────────────────────────────────────────────────────────────

function SectionHeader({
  step,
  title,
  description,
  rightSlot,
}: {
  step: string
  title: string
  description: string
  rightSlot?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Langkah {step}
        </p>
        <h2 className="mt-1.5 font-display text-xl font-semibold tracking-tight md:text-[1.4rem]">
          {title}
        </h2>
        <p className="mt-1 max-w-xl text-[12.5px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      {rightSlot}
    </div>
  )
}

function StageDot({
  label,
  active,
  done,
}: {
  label: string
  active: boolean
  done: boolean
}) {
  return (
    <li
      className={cn(
        'flex items-center gap-2 rounded-full px-2.5 py-1 transition-colors',
        active
          ? 'bg-primary/10 text-primary'
          : done
            ? 'text-foreground'
            : 'text-muted-foreground/70',
      )}
    >
      <span
        className={cn(
          'inline-flex h-1.5 w-1.5 rounded-full transition-colors',
          active
            ? 'bg-primary animate-pulse-soft'
            : done
              ? 'bg-emerald-500'
              : 'bg-muted-foreground/40',
        )}
      />
      {label}
    </li>
  )
}

function Connector() {
  return (
    <li aria-hidden className="h-px w-6 bg-border" />
  )
}

function OnboardingEmptyState() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-dashed border-border/70 bg-card/40 px-6 py-12 text-center backdrop-blur-sm">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br from-sky-400/12 via-indigo-400/8 to-cyan-400/12 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-gradient-to-br from-violet-400/10 via-cyan-400/8 to-sky-400/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/15 via-indigo-500/10 to-cyan-500/15 text-sky-600 dark:text-sky-300"
      >
        <Compass className="h-6 w-6" strokeWidth={1.7} />
      </motion.div>

      <h3 className="relative mt-5 font-display text-lg font-semibold tracking-tight">
        Mulai dari area keluhan Anda
      </h3>
      <p className="relative mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        Pilih salah satu dari empat area di Langkah 1 di atas — Telinga,
        Hidung, Tenggorokan, atau Umum — dan kami akan menampilkan gejala
        yang relevan untuk Anda tandai.
      </p>
    </div>
  )
}

function NoMatch({
  hasQuery,
  onResetSearch,
}: {
  hasQuery: boolean
  onResetSearch: () => void
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/60 px-6 py-10 text-center backdrop-blur-sm">
      <Stethoscope className="mx-auto h-7 w-7 text-muted-foreground" />
      <p className="mt-3 text-sm font-medium">Tidak ada gejala yang cocok</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Coba ubah area atau kata kunci pencarian.
      </p>
      {hasQuery && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetSearch}
          className="mt-4"
        >
          Hapus pencarian
        </Button>
      )}
    </div>
  )
}
